const express = require('express')
const contenedorImportado = require('../contenedor')
const cont1 = contenedorImportado.Contenedor
const contenedor = new cont1('./src/products.json')
const { log } = require('console')
const fs = require('fs').promises

const router = express.Router()

// ENDPOINTS:

router.get("/api/products", async (req, res) => {
    let limit = req.query.limit
    if (!limit || limit === NaN) {
        const allProducts = await contenedor.getAll()
        res.send(allProducts)
        console.log(req.query);
    } else {
        const allProducts = await contenedor.getAll()
        let limitedProducts = allProducts.slice(0, limit)
        res.send(limitedProducts)
    }
})

router.get("/api/products/:pid", async (req, res) => {
    let id = parseInt(req.params.pid)
    const allProducts = await contenedor.getAll()
    let filteredProduct = allProducts.filter((o) => o.id === id)
    console.log(filteredProduct);
    res.send(filteredProduct)
})

router.post("/api/products", async (req, res) => {
    let newProduct = {
        title: req.body.title,
        description: req.body.description,
        code: req.body.code,
        price: parseInt(req.body.price),
        status: true,
        stock: parseInt(req.body.stock),
        category: req.body.category,
        thumbnail: req.body.thumbnail
    }
    console.log(newProduct.title);
    if (newProduct.title === undefined || newProduct.description === undefined || newProduct.code === undefined || newProduct.price === undefined || newProduct.stock === undefined || newProduct.category === undefined || newProduct.price === NaN || newProduct.stock === NaN) {
        res.send("Falta información para agregar el producto")
    } else {
        await contenedor.save(newProduct)
        res.send("Producto agregado con exito")
    }

})

router.put("/api/products/:pid", async (req, res) => {
    let id = parseInt(req.params.pid)
    let allProducts = await contenedor.getAll()
    if (allProducts.find((p) => p.id === id)) {
        let productToUpdate = allProducts.find((p) => p.id === id)
        let updatedProduct = {
            id: id,
            title: req.body.title === undefined ? productToUpdate.title : req.body.title,
            description: req.body.description === undefined ? productToUpdate.description : req.body.description,
            code: req.body.code === undefined ? productToUpdate.code : req.body.code,
            price: req.body.price === undefined ? productToUpdate.price : req.body.price,
            status: req.body.status === undefined ? productToUpdate.status : req.body.status,
            stock: req.body.stock === undefined ? productToUpdate.stock : req.body.stock,
            category: req.body.category === undefined ? productToUpdate.category : req.body.categpry,
            thumbnail: req.body.thumbnail === undefined ? productToUpdate.thumbnail : req.body.thumbnail
        }
        let newProducts = allProducts.filter((p) => p.id !== id)
        newProducts.push(updatedProduct)
        console.log(newProducts);
        await contenedor.saveProducts(newProducts)
        res.send("Producto actualizado")
    } else {
        res.send("No se ha encontrado un producto con el ID ingresado")
    }
})

router.delete("/api/products/:pid", async (req, res) => {
    let id = parseInt(req.params.pid)
    await contenedor.deleteById(id)
    res.send("Producto Eliminado con éxito")
})

module.exports = router