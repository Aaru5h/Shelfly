const express = require('express')
const { PrismaClient } = require('../generated/prisma/client.js');
const { verifyAccessToken } = require('../middlewares/auth.js');

const prisma = new PrismaClient();
const router = express.Router();

router.post('/', verifyAccessToken, async(req,res)=>{
    const {name, sku, description, price} = req.body
    try{
        const product = await prisma.product.create({
            data: {
                name,
                sku,
                description,
                price: parseFloat(price)
            }
        })

        res.status(201).json(product)
    }
    catch(err){
        console.log(err)
        res.status(500).json({"message": 'Something went wrong'})
    }
})

router.get('/', async(req,res)=>{
    try{
        const products = await prisma.product.findMany()
        res.status(200).json(products)
    }
    catch(err){
        console.log(err)
        res.status(500).json({"message": 'Something went wrong'})
    }
})

router.get('/:id', async(req,res)=>{
    const {id} = req.params 
    try{

        const product = await prisma.product.findUnique({
            where: {
                id: Number(id)
            }
        })

        if(!product){
            return res.status(404).json({"message": "Product not found"})
        }

        res.status(200).json(product)
        }
    catch(err){
        console.log(err)
        res.status(500).json({"message": "Something went wrong"})
    }
})

router.put('/:id', async(req,res)=>{
    const {id} = req.params
    const {name, sku, description, price} = req.body
    try{
        const product = await prisma.product.update({
            where: {
                id: Number(id)
            },
            data: {
                name,
                sku,
                description,
                price: parseFloat(price)
            }
        })
        res.status(200).json(product)
    }
    catch(err){
        console.log(err)
        res.status(500).json({"message": "Something went wrong"})
    }

    }
)

router.delete('/:id', async(req,res)=>{
    const {id} = req.params
    try{
        const product = await prisma.product.delete({
            where: {
                id: Number(id)
            }
        })
        res.status(200).json(product)
        }
    catch(err){
        console.log(err)
        res.status(500).json({"message": "Something went wrong"})
    }
})

module.exports = router;