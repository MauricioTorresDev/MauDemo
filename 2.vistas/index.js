//IMPORTACION DE MODULOS
const express = require('express');
const app = express();
const db = require('./config/db')

app.set('view engine', 'ejs');
app.set('views', './views')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//renderizado

//envio de texto a la ruta principal del servidor 
app.get("/", (req, res) => {
     res.render('index')
});
//nombres,apellidos,dni,fechaNacimiento
app.post('/guardar', (req, res) => {
     const { nombres, apellidos, dni, fechaNacimiento } = req.body
     console.log('Datos recibidos: ', req.body)
     const query = 'INSERT INTO datos(nombres, apellidos, dni, fechaNacimiento, fechaRegistro) VALUES(?,?,?,?, NOW())';

     db.query(query, [nombres, apellidos, dni, fechaNacimiento], (err, result) => {
          if (err) {
               console.error('Error al guardar en la base de datos: ', err);
               res.send('Error al guardar en la base de datos');
          } else {
               console.log('Datos guardados correctamente');
               //res.send('Datos guardados correctamente');
               res.redirect('/mostrar');
          }
     })
})

//traer datos
app.get('/mostrar', (req, res) => {
     const query = 'SELECT id, nombres, apellidos, dni, DATE_FORMAT(fechaNacimiento, "%d/%m/%Y") as fechaNacimiento, DATE_FORMAT(fechaRegistro, "%d/%m/%Y %H:%i:%s") as fechaRegistro FROM datos';
     db.query(query, (err, result) => {
          if (err) {
               console.error('Error al obtener los datos: ', err)
               res.send('Error al obtener los datos:', err)
          } else {
               res.render('mostrar', { datos: result })
          }
     })
})

//ruta para actulizar una base de datos
app.get('/actualizar/:id', (req, res) => {
     const id = req.params.id;
     const query = 'SELECT id, nombres, apellidos, dni, DATE_FORMAT(fechaNacimiento, "%Y-%m-%d") as fechaNacimiento FROM datos WHERE id = ?'
     db.query(query, [id], (err, result) => {
          if (err) {
               console.error("Error al actualizar el dato")
               res.send('Error al actualizar el dato ' + err)
          } else {
               res.render('actualizar', { datos: result[0] });
          }
     });
});
app.post('/actualizar/:id', (req, res) => {
     const id = req.params.id;
     const { nombres, apellidos, dni, fechaNacimiento } = req.body;
     const query = 'UPDATE datos SET nombres=?, apellidos=?, dni=?, fechaNacimiento=? WHERE id=?'
     db.query(query, [nombres, apellidos, dni, fechaNacimiento, id], (err, result) => {
          if (err) {
               console.error('Error al actualizar en la base de datos:', err);
               res.send('Error al actualizar en la base de datos:', err);
          } else {
               console.log('Datos Actualizados')
               res.redirect('/mostrar')
          }
     });
});
//Eliminar un dato de la tabla
app.get('/borrar/:id', (req, res) => {
     const id = req.params.id;
     const query = 'SELECT id, nombres, apellidos, dni, DATE_FORMAT(fechaNacimiento, "%Y-%m-%d") as fechaNacimiento FROM datos WHERE id = ?'
     db.query(query, [id], (err, result) => {
          if (err) {
               console.error("Error al borrar el dato")
               res.send('Error al borrar el dato ' + err)
          } else {
               res.render('borrar', { datos: result[0] });
          }
     });
});
app.post('/borrar/:id', (req, res) => {
     const id = req.params.id;
     const query = 'DELETE FROM datos WHERE id=?';
     db.query(query, [id], (err, result) => {
          if (err) {
               console.error('Error al borrar en la base de datos: ', err);
               res.send('Error al borrar en la base de datos');
          } else {
               console.log('Datos borrados correctamente');
               res.redirect('/mostrar');
          }
     });
})

//INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
     console.log(`El servidor esta funcionando en http://localhost:${PORT}`)
});