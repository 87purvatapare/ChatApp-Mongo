const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

main()
    .then(() => console.log("Database connection successful"))
    .catch(err => console.log("Database connection failed:", err));

let allchats = [
    { From: "neha", To: "priya", message: "send me your exam sheet", Created_at: new Date() },
    { From: "ram", To: "sham", message: "I love you my bro", Created_at: new Date() },
    { From: "krishna", To: "radah", message: "All the best", Created_at: new Date() },
    { From: "soni", To: "Shivansh", message: "mau loves forever", Created_at: new Date() },
    { From: "yash", To: "shweta", message: "all the best for your exam", Created_at: new Date() }
];

async function insertChats(chats) {
    for (const chat of chats) {
        const exists = await Chat.findOne({ From: chat.From, To: chat.To, message: chat.message });
        if (!exists) {
            await Chat.create(chat);
            console.log('Chat inserted:', chat);
        } else {
            console.log('Duplicate chat skipped:', chat);
        }
    }
}

insertChats(allchats)
    .then(() => console.log('Chat insertion process completed'))
    .catch(err => console.error('Error inserting chats:', err));
