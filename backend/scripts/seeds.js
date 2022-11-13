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

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const USER_ID = "63705ca6bc14d30b1a0739ef"
const ITEM_ID = "63705cb9bc14d30b1a0739f0"

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
        title: slug("this is for testing") + "-" + ((Math.random() * Math.pow(36, 6)) | 0).toString(36),
        description: "akobasiFIDEL",
        image: "https://i.etsystatic.com/14920883/r/il/a46901/3857029448/il_794xN.3857029448_6v42.jpg",
    }
}

const generateUserInfo = () => {
    const name = generateString(8);
    
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


const myPromise = new Promise((resolve, reject) => {
    for(let i = 0; i < 100; i++) {
        User.findById(USER_ID)
        .then(function(user) {
            if (!user) {
                return;
            }
            const item = new Item(generateItem());
            item.seller = user;
            item.save().then(function() {
                console.log("Item data added")
            });
        })
        
        const user = new User(generateUserInfo());
        user.setPassword(generatePassword());
        user.save().then(function() {
            console.log("User data added")
        });
    }
    
    resolve("")
});

function delay() {
  return new Promise(resolve => setTimeout(resolve, 400));
}

async function delayedLog() {
  // notice that we can await a function
  // that returns a promise
    await delay();
    User.findById(USER_ID)
    .then(async function(user) {
        if (!user) {
            return;
        }

        const comment = new Comment(generateComment());
        const savedItem = await Item.findById(ITEM_ID);
        comment.item = savedItem
        comment.seller = user;

        await comment.save();
        console.log("Comment saved");
        
        savedItem.comments = savedItem.comments.concat([comment])
        savedItem.save().then(function() {
            console.log("User data added")
        });
    })
    await delay();
}

const hi = async() => {
    await myPromise
    
    for (let i = 0; i < 100; i++) {
        await delayedLog()
    }
}

try {    
    hi()
} catch (error) {
    console.log(error.stack);
}