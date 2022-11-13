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
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const USER_ID = "63714d5ac4cf36005e914db2"
const ITEM_ID = "63714d71c4cf36005e914db3"

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

    await comment.save();
    return comment;
}

const commentPromise = new Promise(async (resolve) => {
    let commentArr = [];
    for (let i = 0; i < 100; i++) {
        const data = await delayedLog()
        commentArr.push(data)
    }
    console.log(`Comments length: ${commentArr.length}`)
    const savedItem = await Item.findById(ITEM_ID);
    savedItem.comments = savedItem.comments.concat(commentArr)
    await savedItem.save()
    console.log("Done concatinating comments to item")
    
    resolve(commentCount)
})

const populateDb = async() => {   
    await Promise.all([itemPromise, userPromise, commentPromise])
}

console.log("testing")
populateDb()
process.exit()