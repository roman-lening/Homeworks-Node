const EventEmitter = require("events");
emitter = new EventEmitter();

emitter.on("message", (id, User, msg) => {
  console.log(`${id}. ${User}: ${msg}`);
});

function sendMessage(id, name, msg, emitter) {
  emitter.emit("message", id, name, msg);
}

sendMessage(1, "Alex", "Hi!", emitter);
sendMessage(2, "Roman", "Hi!", emitter);
sendMessage(3, "Oleg", "Hi!", emitter);
sendMessage(4, "Bob", "Hi!", emitter);
sendMessage(5, "Anton", "Hi!", emitter);
sendMessage(6, "Anna", "Hi!", emitter);
sendMessage(7, "Astemir", "Hi!", emitter);
sendMessage(8, "Maria", "Hi!", emitter);
sendMessage(9, "Pawel", "Hi!", emitter);
