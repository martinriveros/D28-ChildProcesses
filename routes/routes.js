const { Router } =          require("express");
const passport =            require('passport');
const registerCheck =       require ('../components/users/usersServices/registerCheck')
const router =              Router();
const usersHandler =        require("../components/users/usersHandlers/usersHandler");

module.exports = (app) => {
  
  app.use("/", router);
  
  router.get("/login", checkPrecedent ,usersHandler.userLoginForm);
  router.post("/login", passport.authenticate('login', {failureRedirect: '/faillogin', successRedirect: '/protectedContent'}));
  router.get("/faillogin", usersHandler.userFailLogin);
  
  router.get("/registro", usersHandler.userRegisterForm);
  router.post("/registro", checkFormData ,passport.authenticate('registro', {failureRedirect: '/failregistro', successRedirect: '/login'}));
  router.get("/registro", usersHandler.userFailRegistro);

  router.get(
    "/protectedContent", checkForAuth,  usersHandler.protectedContent);

  router.get("/welcome", usersHandler.getWelcomePage);
  router.get("/logout", usersHandler.logout);

  router.get('/info', usersHandler.getArgvInfo)
  router.get('/api/randoms', usersHandler.getRandoms)
  router.get('*', usersHandler.notMatchingRoute)

};


function checkForAuth (req, res, next){
  if(req.isAuthenticated()){
    next()
  }else{
    res.redirect('/login')
  }
}

function checkPrecedent(req, res, next){ // tries to jump isAuthenticated() if it comes from /registro

  if(req.rawHeaders[27]==='http://localhost:8080/registro'){
    req.comesFromRegistro=true
  }
    next();
}

function checkFormData(req, res, next){ // test for some rules in register form
  let formErrors = registerCheck(req.body)
  if(formErrors.length===0){
    next();
  }else{
    res.render("layouts/userRegister", {formErrors, ...req.body})
  }
}