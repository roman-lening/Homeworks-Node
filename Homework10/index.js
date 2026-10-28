import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();

app.use(express.json());

const host = process.env.APP_HOST;
const port = process.env.APP_PORT;

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access token required" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

async function authorizeRole(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Недостаточно прав",
      });
    }
    req.user.role = user.role;
    next();
  } catch (error) {
    console.error("Ошибка проверки роли:", error);

    return res.status(500).json({
      message: "Ошибка сервера",
    });
  }
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/registration", async (req, res) => {
  try {
    const { username, email, password } = req.body ?? {};
    if (!username || !email || !password) {
      return res.status(400).send("Username, email or password не переданы");
    }
    if (typeof username !== "string" || username.length < 2) {
      return res.status(400).send("Невалидное имя");
    }
    if (
      typeof email !== "string" ||
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      return res.status(400).send("Невалидный email");
    }
    if (
      typeof password !== "string" ||
      password.length < 8 ||
      !/\d/.test(password)
    ) {
      return res.status(400).send("Невалидный пароль");
    }
    const user = await User.findOne({
      where: { email },
    });
    if (user) {
      return res.status(409).send("User с таким имейлом уже зареган");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email: email,
      password: hashedPassword,
      username: username,
    });
    return res.status(201).json({
      message: "User зареган",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).send("Ошибка связи с сервером");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, username, password } = req.body ?? {};
    if (!password || (!email && !username)) {
      return res
        .status(400)
        .send("Имя пользователя/email или пароль отсутствует");
    }
    if (username !== undefined && username !== null) {
      if (typeof username !== "string" || username.trim().length < 2) {
        return res.status(400).send("Невалидное имя пользователя");
      }
    }
    if (email !== undefined && email !== null) {
      if (
        typeof email !== "string" ||
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
      ) {
        return res.status(400).send("Невалидный email");
      }
    }
    if (typeof password !== "string" || password.length === 0) {
      return res.status(400).send("Невалидный пароль");
    }
    const user = await User.findOne({
      where: email ? { email } : { username },
    });
    if (!user) {
      return res.status(401).send("Неверные данные для входа");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Неверные данные для входа");
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      message: "Авторизация успешна",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Внутренняя ошибка сервера");
  }
});

app.post("/update-email", authenticateJWT, async (req, res) => {
  try {
    const { email } = req.body ?? {};
    if (
      typeof email !== "string" ||
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      return res.status(400).send("Невалидный email");
    }
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).send("Пользователь не найден");
    }
    const existingUser = await User.findOne({
      where: { email },
    });
    if (existingUser) {
      return res.status(409).send("Этот email уже используется");
    }
    user.email = email;
    await user.save();
    return res.status(200).json({
      message: "Email успешно обновлён",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error updating email:", error);
    return res.status(500).send("Ошибка при обновлении email");
  }
});

app.delete("/delete-account", authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).send("Пользователь не найден");
    }
    await user.destroy();
    return res.status(200).send("User удален");
  } catch (error) {
    console.error("Error удаления user:", error);
    return res.status(500).send("Ошибка при удалении user");
  }
});

app.patch("/update-role", authenticateJWT, authorizeRole, async (req, res) => {
  try {
    const { id, role } = req.body ?? {};
    if (!id || !["user", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Некорректный ID или роль",
      });
    }
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }
    user.role = role;
    await user.save();
    return res.status(200).json({
      message: "Роль успешно обновлена",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Ошибка изменения роли:", error);
    return res.status(500).json({
      message: "Ошибка при изменении роли пользователя",
    });
  }
});

app.post("/refresh-token", authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      message: "Token успешно обновлён",
      token,
    });
  } catch (error) {
    console.error("Ошибка обновления токена:", error);
    return res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});

async function startServer() {
  try {
    await sequelize.authenticate();

    console.log("AWS MySQL connected successfully!");

    app.listen(port, host, () => {
      console.log(`Server is running on http://${host}:${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to AWS MySQL:", error.message);
    process.exitCode = 1;
  }
}

startServer();
