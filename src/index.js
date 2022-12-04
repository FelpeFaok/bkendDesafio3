import  express  from "express";
import { ERROR } from "./const/errors.js";
import { productManager} from "./Managers/index.js";
const app = express()

//para leer JSON
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const PORT = 8080;

app.get('/api/products', async (req, res) => {
    try {
        const {limit, skip} = req.query
    
        const allProducts = await productManager.getProducts()
    //determina el query
        if (!limit || limit < 1){
            return res.send({success: true, products: allProducts});
        }
    //devuelve los productos por query
        const products = allProducts.slice(0,limit) //crear un paginado
        //const products = allProducts.slice((skip ?? 0, limit + skip) || limit) //crear un paginado
        res.send({success: true, products});
        
    } catch (error) {
        console.log(error);

        res.send({success: false, error: "▲ EXPLOTO! ▲"})
    }
});
//obtener producto por param id
app.get('/api/products/:id', async (req, res) => {
    try {
        const {id: paramId }= req.params

        const id = Number(paramId)
        //comprobamos que sea valido como numero
        if(Number.isNaN(id) || id<0){
            return res.send({success: false, error: "El Id es invalido"})
        }
        const product = await productManager.getProductById(id)
        //comprobamos existencia
        if(!product){
            return res.send({success: false, error: "Producto no encontrado"})
        }

        res.send({success: true, product})

    } catch (error) {
        console.log(error);
        res.send({success: false, error:"▲ EXPLOTO! ▲"})
    }
})
//obtener productos desde el body
app.post('/api/products', async (req, res) => {
    try {
        //obtenemos los productos
        const {title, description, price, code} = req.body
        //comprobamos las variables si existen 
        if(!title || !description || !price || !code) {
            return res.send({success: false, error: "Las variables son obligatorias"})
        }
        //creamos los productos
        const savedProduct  = await productManager.saveProduct({title, description, price, code})
        res.send({success: true, product: savedProduct})

    } catch (error) {
        //validacion de error por cliente, por medio de instancias 
        console.log( error);
        if(error.name === ERROR.VALIDATION_ERRROR){
            return res.send({
                success: false,
                error: `${error.name}: ${error.message}`
            })
        }

        res.send({success: false, error:"▲ EXPLOTO! ▲"})
    }
});

app.put('/api/products/:id', async(req, res) => {
    try {
        const {id: paramId }= req.params

        const id = Number(paramId)
        //comprobamos que sea valido
        if(Number.isNaN(id) || id<0){
            return res.send({success: false, error: "El Id es invalido"})
        }

        const {title, description, price, code} = req.body

        const updateProduct = await productManager.update({title, description, price, code}, id)
        res.send({
            success: true,
            product: updateProduct,
        })
    } catch (error) {
        console.log(error);

        if(error.name === ERROR.NOT_FOUND_ERRROR){
            return res.send({
                success: false,
                error: `${error.name}: ${error.message}`
            })
        }
    res.send({success: false, error:"▲ EXPLOTO! ▲"})
    }
})

app.delete('/api/products/:id', async (req, res) => {
    try {
        const {id: paramId }= req.params

        const id = Number(paramId)
        //comprobamos que sea valido
        if(Number.isNaN(id) || id<0){
            return res.send({success: false, error: "El Id es invalido"})
        }

        const deletedProduct = await productManager.deleteProduct(id)
        return res.send({
            success: true, 
            deleted: deletedProduct
        })

    } catch (error) {
        console.log(error);

        if(error.name === ERROR.NOT_FOUND_ERRROR){
            return res.send({
                success: false,
                error: `${error.name}: ${error.message}`
            })
        }
    res.send({success: false, error:"▲ EXPLOTO! ▲"})
    }

})
//running server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
