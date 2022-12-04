import fs from 'fs'
import { notFoundError, ValidationError } from '../utils/index.js'
//constructor de productos
export class ProductManagerFilesystem {
    constructor(path){
        this.path = path
        this.#init()
    }
//crea la instancia de creacion de archivo
    #init() {
        //comprueba si existe el archivo
            try {
                const existFile = fs.existsSync(this.path)
                
                if(existFile) return
        //si no existe lo crea           
                fs.writeFileSync(this.path, JSON.stringify([]))
            } catch (erros) {
                console.log(error);
            }
    }
    //escritor de productos
    #writefile (data){
        return fs.promises.writeFile(this.path, JSON.stringify(data, null,  3));
    }

    //obtiene los productos desde el archivo
    async getProducts(){
        const response = await fs.promises.readFile(this.path, 'utf-8');
        return JSON.parse(response)
    }

    //obtener productos por ID 
    async getProductById(id) {
        const products = await this.getProducts();

        const productFound = products.find(p => p.id === id);

        return productFound;
    }
    //crear producrtos nuevos
    async saveProduct( {title, description, price, code}){
        const newProduct = {title, description, price, code};
        //obtienes los productos
        const products = await this.getProducts();
        //verificas que exista el code
        const existCodeInProducts = products.some(product => product.code === code);
        //si existe error
        if (existCodeInProducts){
           // return {error: "El codigo no se puede repetir}
        throw new ValidationError("El codigo no se puede repetir");
        }
        //si no lo crea y agrega
        newProduct.id = !products.length ? 1 : products[products.length - 1].id + 1;
        products.push(newProduct);

        await this.#writefile(products)
        return newProduct;

    }

    async update (newData, id) {
        const products = await this.getProducts()
            //si el elemento no existe, findIndex devuelve -1
        const productIndex = products.findIndex (p => p.id === id)

        if(productIndex === -1){
            throw new notFoundError("Producto no encontrado")
        }

        const product = products[productIndex]

        products[productIndex] = {...product, ...newData}

        await this.#writefile(products)

        return products[productIndex]
    }

    async deleteProduct(id) {
        const products = await this.getProducts()
        const productIndex = products.findIndex (p => p.id === id)
        if(productIndex === -1){
            throw new notFoundError("Producto no encontrado")
        }
        const deletedProduct = products.splice(productIndex, 1)

        await this.#writefile(products)

        return deletedProduct [0]

    }
}