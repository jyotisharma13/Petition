const requireLoggedOutUser = (req, res, next) => {
    if(req.session.userId){
        return res.redirect('/petition');
    //&&(req.url =='/register'|| req.url)){}
    } else {
        next();
    }
};
const requireSignature = (req, res, next)=>{
    if(!req.session.sigid){
        return res.redirect('/petition');
    //&&(req.url =='/register'|| req.url)){}
    } else {
        next();
    }
};
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
