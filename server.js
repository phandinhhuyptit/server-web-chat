const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const db = require('./config/key').mongoURI;
const port = process.env.PORT || 5000;
const items = require('./routes/api/items');
const auth = require('./routes/api/auth');    


app.use((req,res,next)=>{

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type','Authorization');
    next();
    
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/items', items);
app.use('/api/user',auth);
mongoose.connect(db,{ useNewUrlParser: true })
.then(result =>{

    console.log('MongoDB connected.....');
    app.listen(port);

})
.catch(err =>{

    // res.status(500).json(err)
    console.log(err);

})