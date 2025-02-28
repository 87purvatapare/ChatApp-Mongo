const express = require("express");  
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");


// set ejs with template enine 
app.set("views", path.join(__dirname, "views"));  
app.set("view engine", "ejs");  
app.use(express.static(path.join(__dirname, "public"))); 
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


// mongodb connection 
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

main()
    .then(() => console.log("Database connection successful"))
    .catch(
        err => console.log("Database connection failed:", err));


    // Index route - Fetch all unique chats
app.get("/chats", async (req, res) => {
    let chats = await Chat.find();
    console.log("Fetched chats:", chats);
    res.render("index.ejs", { chats });
});

// Route to render the new chat form    
app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
});

    // Check if the chat already exists
app.post("/chats", async (req, res) => {
    let { from, to, message } = req.body;
    let existingChat = await Chat.findOne({ From: from, To: to, message: message });
    
    if (!existingChat) {
        let newChat = new Chat({
            From: from,
            To: to,
            message: message,
            Created_at: new Date()
        });

        await newChat.save();
        console.log("New chat saved:", newChat);
    } else {
        console.log("Duplicate chat detected, not saving.");
    }

    res.redirect("/chats");
});



// edit route 
app.get("/chats/:id/edit", async (req, res) => {  
    try {
        let { id } = req.params;
        let chat = await Chat.findById(id);
        if (!chat) {
            return res.status(404).send("Chat not found");
        }

                //console.log(chat); // Debugging output
        res.render("edit.ejs", { chat });
    } catch (error) {
        res.status(500).send("Error fetching chat");
    }
});


// Upadted Route 
app.put("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let { newMsg } = req.body;
    
    let updatedChat = await Chat.findByIdAndUpdate(id, { message: newMsg }, { runValidators: true, new: true });
    console.log("Updated Chat:", updatedChat);
    
    res.redirect("/chats");
});


// delete root 
app.delete("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log("Deleted Chat:", deletedChat);
    res.redirect("/chats");
});



// conformation for deleting 

app.get("/chats/:id/delete", async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("delete.ejs", { chat });
});



app.get('/delete', (req, res) => {
    res.render('delete');  // Make sure 'delete' matches the filename
  });
  

// Start the server
const PORT = 5666;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
