//llamar al modulo de MYSQL
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "demo"
});

connection.connect((err)=>{
    if(err){
        console.log("Error en la conexion de la base de datos", err)
    }else{
        console.log("conexion exitosa")
    }
});

module.exports = connection;