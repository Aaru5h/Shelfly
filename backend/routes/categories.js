const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { verifyAccessToken } = require('../middlewares/auth.js')

const prisma = new PrismaClient()
const router = express.Router()

router.get('/', verifyAccessToken, async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                products: true
            }
        });
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch categories" });
    }
})

router.get('/:id', verifyAccessToken, async (req, res) => {
    const { id } = req.params;

    try {
        const category = await prisma.category.findUnique({
            where: { id: Number(id) },
            include: { products: true }
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch category" });
    }
});


router.post('/', verifyAccessToken, async (req, res) => {
    const { name, sku, description, price, quantity, categoryName } = req.body;

    try {
        let category = null;

        if (categoryName && categoryName.trim() !== "") {
            const cleanName = categoryName.trim();

            category = await prisma.category.findUnique({
                where: { name: cleanName }
            });

            if (!category) {
                category = await prisma.category.create({
                    data: { name: cleanName }
                });
            }
        }

        const product = await prisma.product.create({
            data: {
                name,
                sku,
                description,
                price: parseFloat(price),
                quantity: Number(quantity),
                categoryId: category ? category.id : null
            },
            include: {
                category: true
            }
        });

        res.status(201).json(product);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.delete('/:id', verifyAccessToken, async (req, res) => {
    const { id } = req.params

    try {
        const category = await prisma.category.delete({
            where: { id: Number(id) }
        })

        res.json(category)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to delete category" })
    }
})

module.exports = router;
