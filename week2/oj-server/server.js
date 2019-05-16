const express = require('express');
const app = express();
const port = 3000;
var restRouter = require('./routes/rest');
var indexRouter = require('./routes/index');
var mongoose = require("mongoose");
var path = require("path");

mongoose.connect("mongodb+srv://user:user@coj-1ellf.mongodb.net/test?retryWrites=true");

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/v1', restRouter);
app.use('/*', indexRouter);


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
