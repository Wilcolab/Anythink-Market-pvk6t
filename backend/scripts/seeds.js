//TODO: seeds script should come here, so we'll be able to put some data in our local env
require("dotenv").config();
require("../models/User");
require("../models/Item");
require("../models/Comment");
const  slug = require("slug");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Item = mongoose.model("Item");
const Comment = mongoose.model("Comment");

// const db = mongoose.connect("mongodb://mongodb-node:27017/anythink-market", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

const USER_ID = "637166784c6bdc0686f5b4dc"
const ITEM_ID = "637166934c6bdc0686f5b4dd"

// declare all characters
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const generateString = (length) => {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

const generateItem =  () => {
    return {
        title: slug("this is for testing") + "-" + generateString(10),
        description: "akobasiFIDEL",
        image: "https://i.etsystatic.com/14920883/r/il/a46901/3857029448/il_794xN.3857029448_6v42.jpg",
        tagList: []
    }
}

const generateUserInfo = () => {
    const name = generateString(20);
    
    return {
        username: name,
        email: name + "@gmail.com"
    }
}

const generatePassword = () => {
    return ((Math.random() * Math.pow(36, 7)) | 0).toString(36)
}

const generateComment = () => {
    return {
        body: ((Math.random() * Math.pow(36, 7)) | 0).toString(36)
    }
}

const itemPromise = new Promise(async (resolve, reject) => {
    let itemCount = 0;
    for(let i = 0; i < 100; i++) {
        const user = await User.findById(USER_ID)   
        if (!user) 
            return;
        const item = new Item(generateItem());
        item.seller = user;
        await item.save()
        itemCount++;
    }
    console.log(`Item: ${itemCount}`)
    resolve("")
});

const userPromise = new Promise(async (resolve, reject) => {
    let userCount = 0;
    for(let i = 0; i < 100; i++) { 
        const user = new User(generateUserInfo());
        user.setPassword(generatePassword());
        await user.save()
        userCount++;
    }
    console.log(`User: ${userCount}`)
    resolve("")
});

function delay() {
  return new Promise(resolve => setTimeout(resolve, 400));
}

async function delayedLog() {
    const user = await User.findById(USER_ID)   
    if (!user)
        return;

    const comment = new Comment(generateComment());
    const savedItem = await Item.findById(ITEM_ID);
    comment.item = savedItem
    comment.seller = user;

    comment.save().then(function(item) {
        console.log("Comment: ", item.title)
        return comment;
    }); 
}

const commentPromise = new Promise(async (resolve) => {
    let commentArr = [];
    for (let i = 0; i < 10; i++) {
        const data = await delayedLog()
        commentArr.push(data)
    }
    console.log(`Comments length: ${commentArr.length}`)
    const savedItem = await Item.findOneAndUpdate({_id: ITEM_ID}, {
        comments: commentArr
    }, {new: true});
    console.log("Done concatinating comments to item")
    
    resolve("")
})

const populateDb = async() => {   
    await Promise.all([userPromise, commentPromise])
    // process.exit()
    mongoose.disconnect()
}

populateDb()
