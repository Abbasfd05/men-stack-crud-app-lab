require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require("path");
const methodOverride = require('method-override');

// Models
const Plant = require('./models/Plant');

const app = express();

// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, "public")));
// MONGO DB CONNECTION
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.get('/',async (req, res) => {
    try {
  res.render('Homepage.ejs');
    } catch(err) {
        console.log("The error is ", err);
    }
});
app.get('/plants',async (req, res) => {
    try {
        const plants=await Plant.find();
  res.render("plants/index.ejs" , {plants});
    } catch(err) {
        console.log("The error is ", err);
    }
});
app.get('/plants/new',async (req, res) => {
    try {
  res.render("plants/new.ejs");
    } catch(err) {
        console.log("The error is ", err);
    }
});
app.post('/plants',async (req, res) => {
    try {
        const plant= await Plant.create(req.body);
  res.redirect("/plants");
    } catch(err) {
        console.log("The error is ", err);
    }
});

app.get('/plants/:id',async (req, res) => {
    try {
      const plant=await Plant.findById(req.params.id);
      res.render('plants/show.ejs' , { plant });
    } catch(err) {
        console.log("The error is ", err);
    }
});
app.get('/plants/:id/edit',async (req, res) => {
    try {
   const plant = await Plant.findById(req.params.id);
    res.render('plants/edit.ejs', { plant });
    } catch(err) {
        console.log("The error is ", err);
    }
});
app.put('/plants/:id',async (req, res) => {
    try {
       await Plant.findByIdAndUpdate(req.params.id, req.body);
        res.redirect(`/plants/${req.params.id}`);
    } catch(err) {
        console.log("The error is ", err);
    }
});
app.delete('/plants/:id',async (req, res) => {
    try {
    await Plant.findByIdAndDelete(req.params.id);
    res.redirect('/plants');
  } catch (err) {
    console.log(err);
    res.send('cannot delete plant');
  }
});






app.listen(3000, ()=> {
    console.log("Server is running on port 3000");
});