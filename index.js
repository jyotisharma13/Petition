const express = require('express');
const bodyParser= require('body-parser');
const ca = require('chalk-animation');
var cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const app = express();
const {checkProfile} = require('./utils');      // validateForm
const bcrypt = require('./bcrypt.js');
// const {cookieSecret} = require('./secrets');
const csurf = require('csurf');
const db= require('./db');
const log = console.log;
app.use(cookieParser());
//tell express which template to use (handlebars)
var petition = require('express-handlebars');
app.engine('handlebars', petition());
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname + "/public"));
const {requireSignature, requireNoSignature, requireLoggedOutUser,isRegistered } = require('./middleware.js');
app.disable('x-powered-by');
//middleware
app.use(cookieParser());
app.use(cookieSession({
    secret: `I'm always angery.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));
// user that are logged out try to type other url then registration or login are redirected to registration
app.use(function(req, res, next) {
    if (
        !req.session.userId &&
        req.url != '/register' &&
        req.url != '/login'
    ) {
        res.redirect('/register');
    } else {
        next();
    }
});
app.use(csurf());//use after body parser nd body token
app.use((req, res, next)=>{
    res.locals.csrfToken = req.csrfToken();
    res.setHeader('X-Frame-Options','DENY');
    next();
});
//routes handler
app.get('/', (req, res) => {
    if(req.session.signId){
        res.redirect('/thanks');
    } else {
        res.render('petition',{
            layout:'main'
        });
    }
});

// login get method
app.get('/login',requireLoggedOutUser, (req, res)=>{
    res.render('login', {
        layout: 'main'
    });
});
//Login post method
app.post('/login', (req, res) => {
    console.log('req.body: ', req.body);
    // let userId = '';
    // let first = '';
    // let last = '';
    db.getUserByEmail(req.body.email).then(data => {
        log('data body:', data);
        return bcrypt
            .comparePassword(req.body.password, data.rows[0].password)
            .then(
                bool => {
                    if (bool) {
                        req.session.userId = data.rows[0].id;
                        req.session.first = data.rows[0].first;
                        req.session.last = data.rows[0].last;
                        db.alreadySigned(req.session.userId).then(data => {
                            console.log('Data from alreadySigned: ', data);
                            if (data.rows.length >= 1) {
                                req.session.sigid = data.rows[0].id;
                                res.redirect('/thanks');
                            } else {
                                res.redirect('/petition');
                            }
                        }); //closes alreadySigned
                    } else {
                        req.session = null;
                        res.render('/login', {
                            layout: 'main',
                            error: true
                        });
                    }
                } // closes bool
            )
            .catch(error => {
                console.log('erroorrrrrrrrrrrrrrrrrrrr in login', error);
                res.render('login', {
                    errorMessage: "This email address is not existing please register yourself.",
                    layout: 'main'
                });
            });
    }); //closes getUserByEMail
});
app.get('/register',(req, res)=>{
    res.render('register', {
        layout: 'main'
    });
    // res.redirect('/petition');
});

app.post('/register',(req, res)=>{
    console.log('req.body:', req.body);
    bcrypt
        .hash(req.body.password)
        .then(hashedPass => {
            return db.registerUser(
                req.body.first,
                req.body.last,
                req.body.email,
                hashedPass
            );
        }).then(data => {
            console.log('Data: ', data);
            req.session.userId = data.rows[0].id;
            req.session.first = data.rows[0].first;
            req.session.last = data.rows[0].last;
            console.log('User has been registered!');
            // res.redirect('/petition');
            res.redirect('/userProfile');
        })
        .catch(err => {
            console.log(err);
            res.render('register', {
                layout: 'main',
                error: true
            });
        });
});


app.get('/petition', requireNoSignature, (req, res) => {
    log('testing 1');
    db.getRowCount()
        .then(result => {
            res.render('petition', {
                count: result.rows[0].count,
                layout: 'main'
            });
        });
});

app.post('/petition', requireNoSignature, (req, res)=>{
    // log("1st:",req.body.first);
    // log("2nd:",req.body.last);
    log("req.body",req.body);
    // const firstName = req.session.first;
    // const lastName = req.session.last;
    const signature = req.body.sign;
    const userId = req.session.userId;
    db.addUser(signature, userId)       //firstName, lastName,
        .then(data => {
            console.log('Signer has been saved to DB');
            req.session.sigid = data.rows[0].id;
            // req.session = {
            //     sigid: data.rows[0].id
            //     // name: `${data.rows[0].first} ${data.rows[0].last}`
            // };
            // console.log('req.session name: ', req.session.name);
            log("sigid:",req.session.sigid);
            res.redirect('/thanks');
        //     res.render('thanks', {
        //         layout:'main'});
        })
        .catch(function(err) {
            console.log('Error in addSign:', err);
            res.render('petition', {
                error: true,
                layout: 'main'
            });
        });
});

app.get('/signers', (req, res) => {
    db.getSigners()
        .then(data => {
            console.log('signers data rows: ', data.rows);
            res.render('signers', {
                numOfSigners: data.rows.length - 1,
                signers: data.rows,
                layout: 'main'
            });
        })
        .catch(err => console.log('Error in signers:', err));
});



app.get('/signers/:city',requireSignature , (req, res) => {
    db.getSignersFromCity(req.params.city)
        .then((data)=> {
            res.render('signers', {
                location: req.params.city,
                name: req.session.name,
                signers: data.rows,
                layout: "main"
            });
        }).catch(err => log('Error in signers city:', err));
});


app.get('/thanks', requireSignature, function(req, res){
    log('testing 2');
    log("req.session.sigid:",req.session.sigid);
    Promise.all([db.getRowCount(),db.getSignature(req.session.userId)]).then(function([countResult, signResult]) {
        console.log("signatures:",signResult);
        log(countResult);
        log("req session in /thanks", req.session);
        res.render('thanks', {
            layout:"main",
            count: countResult.rows[0].count,
            // // name:req.session.name,
            // // name:`${signResult.rows[0].first} ${signResult.rows[0].last}`,
            signature: signResult.rows[0].sign,
            first: req.session.first
        });

    }).catch(err => log('err in thanks', err));
});
app.post('/thanks', (req, res)=>{
    db.deleteSigner(req.session.userId).then(()=>{
        req.session.sigid = null;
    }).then(()=>{
        log('deleted signatures');
        res.redirect('/petition');

    }).catch(err =>{
        log('Delete signature',err);
    });
});


app.get('/userProfile', (req, res) => {
    res.render('userProfile', {
        layout: 'main',
        firstName: req.session.first
    });
});
app.post('/userProfile', (req, res) => {
    console.log('req.Body of Profile: ', req.body);
    db.addProfile(
        req.body.age,
        req.body.city,
        req.body.url,
        // req.session.age,
        // req.session.city,
        // req.session.url,
        req.session.userId
    ).then(data => {
        console.log('data as addProfile:', data);
        res.redirect('/petition');
    }).catch(error=>log("user profile error:",error));
});
app.get('/editProfile',(req, res) =>{
    console.log(req.session.userId);
    db.getSignersProfilesToEdit(req.session.userId)
        .then(profile => {
            log("profile",profile);
            res.render('editProfile', {
                firstName: profile.rows[0].first,
                lastName: profile.rows[0].last,
                email: profile.rows[0].email,
                age: profile.rows[0].age || null,
                city: profile.rows[0].city || null,
                url: profile.rows[0].url || null,
                layout: 'main'
            });
        })
        .catch(err => {
            console.log(err.message);
            res.redirect('/editProfile');
        });
    // res.redirect('signers');
});
// app.get('/editProfile', (req, res)=>{
// res.render('editProfile',{
//     layout:"main"
// });
app.post('/editProfile', isRegistered, (req, res) => {
    let profile = checkProfile(req.body.age, req.body.city, req.body.url);
    if (req.body.password) {
        bcrypt
            .hash(req.body.password)
            .then(hashedPass => {
                return Promise.all([db.updateUserAndPassword(req.session.userId, req.body.first, req.body.last, req.body.email, hashedPass),
                    db.upsertUserProfile(profile.age, profile.city, profile.url, req.session.userId)]);
            })//then closes
            .then(() => {
                req.session.first = req.body.first;
                req.session.last = req.body.last;
                console.log('message', 'Your profile has been edited');
                if (req.session.userId) {
                    res.redirect('/thanks');
                    // return;
                } else {
                    res.redirect('/petition');
                    // return;
                }//else closes
            })//. then again closes
            .catch(err => {
                console.log(err.message);
                res.redirect('/editProfile');
            });//catch closes
    } else {
        Promise.all([db.updateUser(req.session.userId, req.body.first, req.body.last, req.body.email),
            db.upsertUserProfile(profile.age, profile.city, profile.url, req.session.userId)])
            .then(() => {
                req.session.first = req.body.first;
                req.session.last = req.body.last;
                if (req.session.userId) {
                    res.redirect('/thanks');
                    // return
                } else {
                    res.redirect('/petition');
                    // return
                }// if else closes
            })//then closes
            .catch(err => {
                console.log(err.message);
                res.redirect('/editProfile');
            });// catch closes
    }//if else closes
});// post method closes
// });
//
app.get('/petition', function(req, res){
    res.render('petition', {
        layout:"main",
    });
});

// for logout from petition page
app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/petition');
});
// app.listen(8080, () => ca.rainbow("I am listening port 8080!!"));
app.listen(process.env.PORT || 8080, () => ca.rainbow("I am listening port 8080!!"));
