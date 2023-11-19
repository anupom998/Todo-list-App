require("dotenv").config();
const express = require("express");
const bodyParser = require ("body-parser");
const app = express();
const mongoose = require("mongoose");
const getDay = require(__dirname + "/date.js");
const _ =require("lodash");


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))

mongoose.connect(process.env.CLUSTER);

const itemSchema = new mongoose.Schema({
    name: String
});

const Item = new mongoose.model("Item",itemSchema);

const item1 = new Item({
    name: "Start listing your task"
})

const item2 = new Item({
    name: "Hit + button to add item"
})

const item3 = new Item({
    name: "Hit the item to delete item"
})

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
})

const List = new mongoose.model("List",listSchema);




app.get('/', (req, res) => {
    // const presentDay = getDay.getDate();

    Item.find({})
        .then(foundItems => {
            if (foundItems.length === 0) {
                Item.insertMany(defaultItems)
                    .then(() => {
                        console.log("Successfully inserted items.");
                        res.redirect("/");
                    })
            } else {
                res.render("list", { title: "Today", newListItems: foundItems });
            }
        })
        .catch(err => {
            console.log(err);
            
        });
});


        
app.get("/:customListName",(req,res)=>{
    const customListName = _.capitalize(req.params.customListName);
    

    List.findOne({name: customListName})
    
        .then(customListItem => {
            
    
            if( !customListItem){
                const newList = new List({
                    name: customListName,
                    items: defaultItems
                })
                newList.save();
                res.redirect("/"+customListName)
            }else{
              
                res.render("list", { title: customListName, newListItems:  customListItem.items });
            }
    
    
    
    }).catch(err => {
        console.log(err)
    })
    
})

app.post("/", (req, res) => {
    const listItem = req.body.newItem;
    if(listItem === "" || listItem === " "){
        res.send({message: "Please enter a to-do task!!"})
    }
    const listTitle = req.body.list;
    // const presentDay = getDay.getDate();
  
    const newItem = new Item({
      name: listItem,
    });
  
    if (listTitle === "Today") {
      // Save the new item to the default list and redirect to the home page
      newItem.save()
        .then(() => {
          res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // Find the custom list and add the new item to it
      List.findOne({ name: listTitle })
        .then((foundItems) => {
          foundItems.items.push(newItem);
          // Save the updated list and redirect to the custom list page
          return foundItems.save();
        })
        .then(() => {
          res.redirect("/" + listTitle);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
  
  




app.post("/delete", (req, res) => {
    const itemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(itemId)
            .then(() => {
                console.log("Successfully removed item.")
                res.redirect("/")
        })
    }else{
        List.findOneAndUpdate(
            {name: listName},
            {$pull: {items: {_id: itemId}}}
        ).then(() => {
            res.redirect("/"+listName)
        }).catch(err => {
            console.log(err)
        })
    }
});
    
    


app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})


