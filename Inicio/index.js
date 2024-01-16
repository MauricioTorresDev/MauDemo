//IMPORTACION DE MODULOS
const express = require('express');
const app = express();
const db = require('./db/db')

//envio de texto a la ruta principal del servidor 
app.get("/", (req,res)=>{
    res.send("hola mundo")
})
//INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`El servidor esta funcionando en http://localhost:${PORT}`)
});