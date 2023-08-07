const express = require('express')
const usersRouter = require('./routes/users.router.js')
const petsRouter = require('./routes/pets.router.js')
const path = require('path')
// const handlebars = require('express-handlebars')

const app = express()
const PORT = 8080

//Agregar path de public
app.use('/static', express.static(__dirname + '/public'))


//Middleware para analizar el cuerpo de las solicitudes JSON y x-www-form-urlencoded
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Carpeta pública para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')))

// RUTAS
app.use("/", usersRouter)
app.use("/", petsRouter)

//Ruta para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

//Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})