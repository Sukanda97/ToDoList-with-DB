const express=require("express");
const bodyParser=require("body-parser");
const ejs= require("ejs");//require ejs for templating
const _ =require("lodash");
const date=require(__dirname + "/date.js")

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

const itemSchema = new mongoose.Schema({
      name:String
    })

const Item=mongoose.model("Item",itemSchema);

const item1=new Item({
    name:"Welcome to To-Do list"
  });
const item2=new Item({
    name:"Hit + to add a item"
  });
const item3=new Item({
    name:"<-- Hit this to delete item"
  });

const defaultList = [item1,item2,item3];

const listSchema={
  name:String,
  list:[itemSchema]
}
const List=mongoose.model("List",listSchema);

async function getItems(){

  const Items = await Item.find({});
  return Items;

}

async function putItems(newItem){

  const Items = await Item.create(newItem);
  return Items;

}

async function deleteItem(id){

  const Items=await Item.findByIdAndRemove(id);
  return Items;

}

let workItems= [];
const app=express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/",function(req,res){

  getItems().then(function(FoundItems){
    console.log(FoundItems);
    if(FoundItems.length===0){
      Item.insertMany(defaultList);
    }
    res.render("list",{listTitle:"today",newItems:FoundItems});
  });

});

app.get("/:customListName",function(req,res){

const customListName=_.capitalize(req.params.customListName);

List.findOne({name:customListName}).then(function(item){
  const value= item.name;
  res.render("list",{listTitle:item.name,newItems:item.list});
}).catch(function(err){console.log("ErrorIgot" + err);
const list=new List({
  name:customListName,
  list:defaultList
});
list.save();
res.redirect("/"+customListName);
});
});

app.listen(3000,function(){
  console.log("Server up and running");
})

app.post("/", function(req,res){
  const newItemName=req.body.newListItem;
  const listTitle=req.body.list;
  const newItem=new Item({
      name:newItemName
    });

if (listTitle==="today"){

  putItems(newItem).then(function(FoundItems){
  console.log(FoundItems);
  res.redirect("/");
  });
}else{
  List.findOne({name:listTitle}).then(function(foundList){
    console.log("Found--------" + foundList);
    console.log(newItem);
    foundList.list.push(newItem);
    foundList.save();
    res.redirect("/"+listTitle);
  })
}

// if(req.body.list==="Worklist"){
//   workItems.push(item);
//   res.redirect("/work");
// }
//   else{

  // items.push(item);
}
);

app.get("/work",function(req,res){

res.render("list",{listTitle:"Worklist",newItems:workItems});
}
)

app.get("/about",function(req,res){

res.render("about");
}
)

app.post("/delete", function(req,res){
    const checkedID=req.body.checkbox;
    const listName=req.body.listName;

    if (listName==="today"){
    deleteItem(checkedID).then(function(FoundItems){
    res.redirect("/");
  });}
  else{
    List.findOneAndUpdate({name:listName},{$pull:{list:{_id:checkedID}}}).then(function(foundList){
      console.log(foundList);
      res.redirect("/"+listName);
    })
  }
});
