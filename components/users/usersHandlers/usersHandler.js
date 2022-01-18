const usersModel = require("../../../config/db");;
const cp = require('child_process')
const path = require('path')
const {calculateRandom} = require('../usersServices/calculateRandom')
var calculateRandomCP
var childProcessActive=false

class UsersHandler {
    
    async protectedContent(req, res) {
      let user = await usersModel.findById(req.session.passport.user)
      res.render("layouts/protectedContent", { loggedUser: user.name });
    }

  async userLoginForm(req, res) {
    let user
    try {
      user = await usersModel.findById(req.session.passport.user)
    } catch (error) {
      console.log('no existe el usuario registrado aun')
    }
       
  if (req.isAuthenticated()) {
      if(req.comesFromRegistro===true){
        return res.render("layouts/userLogin",{ loggedUser: user.name });
      } else {
        return res.redirect("/protectedContent");
      }
    } else {
      return res.render("layouts/userLogin", { loggedUser: 'Gest' })
    }}
    

  async userRegisterForm(req, res) {
    let formErrors = req.formErrors
    if (req.isAuthenticated()) {
      return res.redirect("/protectedContent");
    } else {
      return res.render("layouts/userRegister", {formErrors});
    }
  }

  async userFailLogin(req, res) {
      res.send('fail login')
  }
  async userFailRegistro(req, res) {
      res.send('fail registro')
  }
  async notMatchingRoute(req, res) {
      res.send('el contenido al que estas tratando de llegar no existe')
  }
  async getWelcomePage(req, res, next) {
    res.render("layouts/welcomePage");
  }

  async logout(req, res, next) {
    res.logout();
    res.render('/welcome')
  }
  async getArgvInfo(req, res, next) {

    const data = [
      
      {desc: 'Argumentos de entrada: ', value: process.argv.length === 2 ?  'no arguments on command line': process.argv[2]},
      {desc: 'Path de Ejecucion: ', value: process.execPath},
      {desc: 'Sistema operativo: ', value: process.platform},
      {desc: 'Version de Node: ', value: process.version},
      {desc: 'Uso de CPU: ', value: process.memoryUsage.rss()},
      {desc: 'Numero de CPUs: ', value: cpus().length},
      {desc: 'ID de Proceso: ', value:process.pid},
      {desc: 'Carpeta de Proyecto', value: process.cwd()},
    ];

    res.render('layouts/info', {data})
  }

  async getRandoms(req, res, next){
    
    const {cant} = req.query;
    
    if(!cant) cant=1000000;
    
    console.log(process.argv[2])
    
    if(process.argv[2]==='--fork' && !childProcessActive){
            
        calculateRandomCP = cp.fork(path.join(__dirname, '../usersServices/calculateRandom'))          
        
        calculateRandomCP.on('message', response =>{
          res.send(response.data)
          calculateRandomCP.kill()
        })
  
        calculateRandomCP.send(cant)}
    
    else{
      
      if(process.argv[2]!=='--fork') res.send(calculateRandom(cant))
      
      if(childProcessActive) calculateRandomCP.send(cant)
    }
}
}
module.exports = new UsersHandler();
