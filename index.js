const express = require('express');
const bodyParser= require('body-parser');
const ca = require('chalk-animation');
var cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const app = express();
const {cookieSecret} = require('./secrets');
const db= require('./db');
const log = console.log;
app.use(cookieParser());
var petition = require('express-handlebars');
app.engine('handlebars', petition());
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname + "/public"));


app.use(cookieSession({
    secret: `I'm always angery.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));
// let private = (req, res, next) => {
//     if(!req.session.id) {
//         res.redirect('/error')
//     } else {
//         next()
//     }
// }
app.get('/', (req, res) => {
    res.redirect('/petition');
});
app.get('/petition', (req, res) => {
    db.getRowCount()
        .then(result => {
            res.render('petition', {
                count: result.rows[0].count,
                layout: 'main'
            });
        });
});

app.post('/petition', (req, res)=>{
    log(req.body.first);
    log("req.body",req.body);
    log(req.body.last);
    const firstName = req.body.first;
    const lastName = req.body.last;
    const signature = req.body.sign;
    // if(firstName && lastName){
    db.addUser(firstName,lastName, signature).then((result)=>{
        // res.cookie("username",`${firstName} ${lastName}`);
        console.log('added new entry in database');
        req.session = {
            id: result.rows[0].id,
            name: `${result.rows[0].first} ${result.rows[0].last}`
        };
        res.redirect('/thanks');
    // } else {
    }).catch(err =>{
        log(err.message);
        res.render('petition', {
            layout:"main",
            error: true
        });

    });
});

app.get('/signers', function(req, res){
    db.getSigners().then((signers)=>{
        log(signers.rows);
        res.render('signers', {
            layout:"main",
            signers:signers.rows
        });
    });
});

app.get('/thanks', function(req, res){
    log(req.body);
    db.getsignature(req.session.id).then((sign) => {
        log("req session in /thanks", req.session);
        res.render('thanks', {
            layout:"main",
            name:`${sign.rows[0].first} ${sign.rows[0].last}`,
            signature: sign.rows[0].signature
        });
    });
});

app.get('/petition', function(req, res){
    res.render('petition', {
        layout:"main",
    });
});
app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/petition');
});

app.listen(8080, ()=> ca.rainbow("I am listening port 8080!!"));
