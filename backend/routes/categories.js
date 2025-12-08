const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyAccessToken } = require('../middlewares/auth.js');

const prisma = new PrismaClient();
const router = express.Router();


router.get('/', verifyAccessToken, async (req, res) => {
    const { search, hasProducts, productName } = req.query;

    try {
        const categories = await prisma.category.findMany({
            where: {
                AND: [
                    search
                        ? { name: { contains: search, mode: 'insensitive' } }
                        : {},

                    productName
                        ? {
                              products: {
                                  some: {
                                      name: {
                                          contains: productName,
                                          mode: 'insensitive'
                                      }
                                  }
                              }
                          }
                        : {},

                    hasProducts === "true"
                        ? { products: { some: {} } }
                        : hasProducts === "false"
                        ? { products: { none: {} } }
                        : {}
                ]
            },
            include: {
                products: true
            }
        });

        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch categories" });
    }
});


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
    const { name } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({ message: "Category name is required" });
    }

    try {
        const cleanName = name.trim();
        const existing = await prisma.category.findUnique({ where: { name: cleanName } });

        if (existing) {
            return res.status(409).json({ message: "Category already exists" });
        }

        const category = await prisma.category.create({
            data: { name: cleanName }
        });

        res.status(201).json(category);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});


router.delete('/:id', verifyAccessToken, async (req, res) => {
    const { id } = req.params;

    try {
        const category = await prisma.category.delete({
            where: { id: Number(id) }
        });

        res.json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete category" });
    }
});

module.exports = router;
