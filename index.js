const express =                 require('express');
const path =                    require('path')
const {config}  =               require('./config/index.js');
const serverRoutes =            require('./routes/routes.js');
const cors =                    require('cors');
const session =                 require('express-session');
const MongoStore =              require('connect-mongo');
const flash =                   require('connect-flash');
const passport =                require('passport')
const LocalStrategy=            require('passport-local').Strategy
const usersModel =              require('./config/db');
const bcrypt =                  require ('bcryptjs');



const app = express()
const PORT = config.port

// Since version 1.5.0, the cookie-parser middleware no longer needs to be used for this module to work
app.use(session({      // it creates a cookie for the session id (connect.sid -- akjdhf2jkhkj3hljk2) and a session id with the same id in memory
    store: MongoStore.create({
            mongoUrl: process.env.MONGO_DB_URI,
            collectionName:'userssessions'
            // ,crypto: {
            //     secret: process.env.SECRET
            // }
            }),
    cookie:{maxAge: 60000},    // all the settings for the connect.sid cookie created (domain, expires, httpOnly, etc, etc). Some defaults are set though
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false
  }));

app.use(flash())                  // middleware to show fancy msgs
app.use((req, res, next)=>{       // several global variables and utils
  console.log(`${req.method} - ${req.url}`)
  res.locals.successMsg = req.flash('Bien!')
  res.locals.errorMsg = req.flash('Algo salio mal')
  next() // determines the method and the path previous to router
})

// settings

app.set('view engine', 'ejs');                        // template views engine
app.set('views', path.join(__dirname, 'views'))     // views path
app.use(express.static(path.join(__dirname, './public'))) /// static css and js files for html


app.use(passport.initialize())             // initialize passport
app.use(passport.session())               // manage session within passport

passport.serializeUser(function(user, done){
  done(null, user.id)
}) 

passport.deserializeUser(function(id, done){
  usersModel.findById(id).then(user => {
    
    done(null, user)
    })
})


// app.use(express.json());                              // interprets json format in post/fetch request
app.use(express.urlencoded({extended:true}));         // stores data from POST and PUT requests to req.body attr

app.use(cors(`${config.cors}`))
// Routes
serverRoutes(app);

app.listen(PORT,  ()=>{console.log('server on fire, listening dotenv', PORT, config.email_support)});



passport.use('login',
new LocalStrategy({
    
    usernameField:'email', // Both fields define the name of the properties in the POST body that are sent to the server.        
    passwordField:'password',

},async (username, password, done) => {
        
        let email = username // because the USERNAME in passport is not stored in DB, EMAIL is.
        
        usersModel.findOne({email}, async (error, user)=>{

            console.log(user)
            
            if(error) { return done(error)}
            if(!user) { return done(null, false, {message:'el email no existe, registrate primero'})}
            
            if(user){
                               
                if(! await verifyPassword(password, user.password)){
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
        
        }, async (req, username, password, done) => { // in this case, USERNAME from passport = EMAIL from the form

          try {
              let email = username // because the USERNAME in passport is not stored in DB, EMAIL is.

              let registeredUser = await usersModel.findOne({email})

              if(registeredUser){
                return done(null, false, {message: 'el email ya esta registrado'})}
              if(!registeredUser){
                
                let hashedPassword = await bcrypt.hash(password, 12); // password encryption                   
                
                let newUser = new usersModel({
                    name: req.body.name,
                    email,
                    password: hashedPassword,
                });
                
                newUser.save();
            
                return done (null, newUser)
            }}        
                
          catch (error) {
                return done(error)
            }
                    
            
}))

async function verifyPassword (formPassword, dbPassword){
  return await bcrypt.compare(formPassword, dbPassword)}