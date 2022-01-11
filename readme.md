# Simple passport.js example

My first approach to [passport-local](https://www.passportjs.org/packages/passport-local/), with [Mongo Atlas](https://www.mongodb.com/es/cloud/atlas/register) for Session and Profile storage.

## To run

Install all dependencies

```bash
npm install
```
then, simply:
```bash
npm run dev
```

## These are the routes

```bash
localhost:8080/welcome
localhost:8080/registro
localhost:8080/login
```


## This is a work in progress, so these are a couple of known isues:

Don't like them. Gotta find a better way

```javascript
// route middleware

function checkFormData(req, res, next){ // test for some rules in register form
  let formErrors = registerCheck(req.body)
  if(formErrors.length===0){
    next();
  }else{
    res.render("layouts/userRegister", {formErrors, ...req.body})
  }
}
```

```javascript
function checkPrecedent(req, res, next){ // tries to jump isAuthenticated() if it comes from /registro

  if(req.rawHeaders[27]==='http://localhost:8080/registro'){
    req.comesFromRegistro=true
  }
    next();
}
```