const express = require('express');
const bodyParser= require('body-parser');
const ca = require('chalk-animation');
const app = express();

const db= require('./db');
const log = console.log;

var petition = require('express-handlebars');
app.engine('handlebars', petition());
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname + "/public"));

app.get('/petition', function(req, res){
    res.render('petition', {
        layout:"main",
    });
});

app.post('/petition', function(req, res){
    log(req.body.first);
    log(req.body.last);
    db.addUser(req.body.first, req.body.last, req.body.sign).then(function() {
        res.redirect('/thanks');
    }).catch(function (err) {
        res.render('petition', {
            layout:"main",
            error: true
        });
        log('error');
    });
});

app.get('/signers', function(req, res){
    // db.getSigners().then(function(signers){
        log(signers.rows);
        log(req.body);
        res.render('Signers', {
            layout:"main"
        });
    // });
});
app.get('/thanks', function(req, res){
    log(req.body);
    res.render('thanks', {
        layout:"main"
    });
});

app.listen(8080, ()=> ca.rainbow("I am listening port 8080!!"));
