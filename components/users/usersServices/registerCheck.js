module.exports = data => {
        
        const { email, password, name, rePassword } = data;
        
        let errors = [];

        // check for required fields
    
        if (!email || !password || !name || !rePassword) {
          errors.push({ field: "CAMPOS", msg: "completalos TODOS"});
        }

        // check passwords match
    
        if (password !== rePassword) {
          errors.push({ field: "CONTRASENA", msg: "no COINCIDEN"});
        }
        // check password length
    
        if (password.length < 4) {
          errors.push({field: "CONTRASENA", msg: "debe tener AL MENOS 4 CARACTERES"});
        }        
        return errors

}
