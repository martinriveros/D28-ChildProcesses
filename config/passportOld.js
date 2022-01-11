const passport =                require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require ('bcryptjs');
const usersModel = require('./db');
const registerCheck = require ('../components/users/usersServices/registerCheck')


module.exports = passport => {
    
    
    passport.use('login',
        new LocalStrategy({
            
            usernameField:'email', // Both fields define the name of the properties in the POST body that are sent to the server.        
            passwordField:'password',
        
        }, async (email, password, done) => {
            
                await usersModel.findOne({email}, (error, user)=>{
                    
                    if(error) { return done(error)}
                    if(!user) { return done(null, false, {message:'el email no existe, registrate primero'})}
                    if(user){
                        if(!verifyPassword(password, user.password)){
                            return done(null, false, {message:'password equivocado'})
                        } else { 
                            return done(null, user)
                        }
                    }})}));
            
    passport.use('registro',
         new LocalStrategy({
                    
            usernameField:'email', // Both fields define the name of the properties in the POST body that are sent to the server.                 
            passwordField:'password',
            passReqToCallback: true // req object available in callback
                
                }, async (req, done) => {
                        
                    if(registerCheck(req.body).length===0){

                        let {name, email, password} = req.body

                        
                        await usersModel.findOne({email}, async (error, user)=>{
                                
                            if(error) { return done(error)}
                                
                            if(user) {

                                return done(null, false, {message:'email ya registrado, prueba logueandote'})
                            
                            } else {

                                let hashedPassword = await bcrypt.hash(password, 12); // password encryption

                                let user = new usersModel({
                                    name,
                                    email,
                                    password: hashedPassword,
                                });
                                user.save()
                                console.log('esto es lo que hay dentro del user y que se retorna en done(null, user)', user)
                                return done (null, user)
                            }        
                        })} else {
                            return done (null, false, registerCheck(req.body))
                        }}))
}

async function verifyPassword (formPassword, dbPassword){
    return await bcrypt.compare(formPassword, dbPassword)
};