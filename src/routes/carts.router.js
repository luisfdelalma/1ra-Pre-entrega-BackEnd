const express = require('express')
const contenedorImportado = require('../contenedor')
const cont2 = contenedorImportado.Contenedor
const contenedor = new cont2('./src/carts.json')
const contenedorP = new cont2('./src/products.json')

const router = express.Router()

// ENDPOINTS:

router.post("/api/carts", async (req, res) => {
    let newCart = {
        products: []
    }
    await contenedor.save(newCart)
    res.send("Carrito agregado con exito")

})

router.post("/api/carts/:cid/product/:pid", async (req, res) => {
    let cartID = parseInt(req.params.cid)
    let productID = parseInt(req.params.pid)
    let productList = await contenedorP.getAll()

    if (productList.find((p) => p.id === productID)) {

        let allCarts = await contenedor.getAll()
        let cartToAdd = allCarts.find((c) => c.id === cartID)

        if (cartToAdd.products.find((p) => p.productID === productID)) {
            let allSubProducts = cartToAdd.products
            let modCart = cartToAdd.products.find((p) => p.productID === productID)
            let newProduct = {
                productID: productID,
                quantity: modCart.quantity + parseInt(req.body.quantity)
            }
            cartToAdd.products = cartToAdd.products.filter((p) => p.productID != productID)
            cartToAdd.products.push(newProduct)

            console.log(cartToAdd);

            let newAllCarts = allCarts.filter((c) => c.id !== cartID)
            newAllCarts.push(cartToAdd)
            await contenedor.saveProducts(newAllCarts)
            res.send("producto agregado al carrito con éxito")
        } else {
            let newProduct = {
                productID: productID,
                quantity: parseInt(req.body.quantity)
            }
            cartToAdd.products.push(newProduct)
            let newAllCarts = allCarts.filter((c) => c.id !== cartID)
            newAllCarts.push(cartToAdd)
            await contenedor.saveProducts(newAllCarts)
            res.send("producto agregado al carrito con éxito")
        }

    } else {
        res.send("No hemos encontrado el producto correspondiente al ID ingresado, por favor intente de nuevo")
    }


})

router.get("/api/carts/:cid", async (req, res) => {
    let id = parseInt(req.params.cid)
    let allCarts = await contenedor.getAll()
    if (allCarts.find((c) => c.id === id)) {
        let selectedCart = await contenedor.getById(id)
        res.send(selectedCart.products)
    } else {
        res.send("No se ha encontrado ningún carrito con el ID proporcionado")
    }
})


module.exports = router