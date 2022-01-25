const cp =                    require('child_process')
const path =                  require('path')
const {calculateRandom} =     require('../usersServices/calculateRandom')
const args =                  require('./utils/yargs')

var calculateRandomCP
var childProcessActive=false

let {mode, port} = args

class UsersHandler {
  
  
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
    
    console.log('esto hay dentro de args', args)
    res.render('layouts/info', {data})
  }

  async getRandoms(req, res, next){
    
    const {cant} = req.query;
    
    if(!cant) cant=1000000;
    
    console.log(process.argv[2])
    
    if(args.mode==='--fork' && !childProcessActive){
            
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
