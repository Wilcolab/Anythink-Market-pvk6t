//TODO: seeds script should come here, so we'll be able to put some data in our local env
require("dotenv").config();
require("../models/User");
require("../models/Item");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Item = mongoose.model("Item");

if (!process.env.MONGODB_URI) {
  console.warn("Missing MONGODB_URI in env, please add it to your .env file");
}
else {
    console.log("MONGODB is present")
    
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const data =  
    {
        title: "test",
        description: "akobasiFIDEL",
        image: "https://i.etsystatic.com/14920883/r/il/a46901/3857029448/il_794xN.3857029448_6v42.jpg",
    }

try {    
    User.findById('63612087160e8b0054a04fb5')
    .then(function(user) {
      if (!user) {
        return;
      }
      console.log("it worked")
      var item = new Item(data);

      item.seller = user;

      item.save().then(function() {
        console.log("finished")
      });
    })
} catch (error) {
    console.log(error.stack);
}