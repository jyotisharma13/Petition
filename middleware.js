//checks if you are logged out, before the code runs that route
const requireLoggedOutUser = (req, res, next) => {
    if(req.session.userId){
        return res.redirect('/petition');
    //&&(req.url =='/register'|| req.url)){}
    } else {
        next();
    }
};
//if you didnt sign yet, you'll go to petition
const requireSignature = (req, res, next)=>{
    if(!req.session.sigid){
        return res.redirect('/petition');
    //&&(req.url =='/register'|| req.url)){}
    } else {
        next();
    }
};
//if you signed already, you'll go to thankyou
const requireNoSignature = (req, res, next)=>{
    if(req.session.sigid){
        return res.redirect('/thanks');

    } else {
        next();
    }
};

module.exports = {
    requireSignature,
    requireNoSignature,
    requireLoggedOutUser
};
