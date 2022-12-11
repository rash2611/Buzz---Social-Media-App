const User = require('../models/user');
module.exports.profile = function(req,res)
{
    return res.render('user_profile',{
        title:"Profile"
    });
}
module.exports.signUp = function(req,res){
    return res.render('user_sign_up',{
        title:"Buzz | Sign Up"
    });
}
 module.exports.signIn = function(req,res){
    return res.render('user_sign_in',{
        title: "Buzz | Sign In"
    });
 }
 module.exports.create = function(req,res)
 {
    if(req.body.password != req.body.confirm_password)
    {
        res.redirect('back');
    }
    User.findOne({email: req.body.email},function(err,user){
        if(err)
        {
            console.log('err in finding the user in signing up');
            return;
        }
        if(!user)
        {
            User.create(req.body,function(err,user)
            {
                if(err)
                {
                    console.log('error in creating the user while signing up');
                    return;
                }
                return res.redirect('/users/sign-in');
                
            })
        }
        else
        {
            return res.redirect('back');
        }
 });

 }

 module.exports.createSession = function(req,res)
 {
    
 }