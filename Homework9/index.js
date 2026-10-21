import express from "express";
import dotenv from "dotenv";
import Customer from "./models/Customer.js";
import bcrypt from "bcrypt";

dotenv.config();
const port = process.env.PORT || 3333;
const host = process.env.HOST;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).send("email and password are required");
    }

    const customer = await Customer.findOne({ where: { email } });

    if (!customer) {
      return res.status(401).send("email or password is invalid");
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);

    if (!isPasswordValid) {
      return res.status(401).send("email or password is invalid");
    }

    if (customer.mustChangePassword) {
      return res.status(403).json({
        message: "Password change required",
        redirect: "/change-password",
      });
    }

    res.status(200).send("Успешно зашел в профиль");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.post("/change-password", async (req, res) => {
  try {
    const { newPassword } = req.body ?? {};
    if (!newPassword) {
      return res.status(400).send("чтобы сменить пароль надо его ввести");
    }

    const { id } = req.query;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).send("Customer not found");
    }

    customer.password = await bcrypt.hash(newPassword, 10);

    customer.mustChangePassword = false;

    await customer.save();

    res.status(200).send("Password changed successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).send("Username and password are required");
    }
    const customer = await Customer.findOne({ where: { email } });
    if (customer) {
      return res.status(409).send("Customer уже зареган");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = await Customer.create({
      email,
      password: hashedPassword,
    });
    res.status(201).send("User зареган");
  } catch (error) {
    res.status(500).send("User не зареган");
  }
});

app.post("/delete-account", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    const customer = await Customer.findOne({ where: { email } });

    if (!customer) {
      return res.status(401).send("Email or password is invalid");
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);

    if (!isPasswordValid) {
      return res.status(401).send("Email or password is invalid");
    }

    await customer.destroy();

    res.status(200).send("Account deleted successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://${host}:${port}`);
});
