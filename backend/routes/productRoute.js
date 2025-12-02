const express = require('express')
const { PrismaClient } = require('../generated/prisma/client.js');
const { verifyAccessToken } = require('../middlewares/auth.js');

const prisma = new PrismaClient();
const router = express.Router();

const normalizeString = (value) =>
    typeof value === 'string' ? value.trim() : '';

const nullableString = (value) => {
    const normalized = normalizeString(value);
    return normalized || null;
};

const toMoney = (value) => {
    const parsed = typeof value === 'number' ? value : parseFloat(value);
    if (!Number.isFinite(parsed)) {
        return null;
    }
    return parsed;
};

const toQuantity = (value) => {
    if (value === undefined || value === null || value === '') {
        return 0;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return 0;
    }
    return Math.max(0, Math.round(parsed));
};

const resolveCategoryId = async (rawName) => {
    if (!rawName || typeof rawName !== 'string') {
        return null;
    }
    const cleanName = rawName.trim();
    if (!cleanName) {
        return null;
    }

    const existing = await prisma.category.findUnique({ where: { name: cleanName } });
    if (existing) {
        return existing.id;
    }

    const created = await prisma.category.create({ data: { name: cleanName } });
    return created.id;
};

const presentProduct = (product) => {
    const { category, ...rest } = product;
    return {
        ...rest,
        categoryName: category?.name || '',
    };
};

router.post('/', verifyAccessToken, async (req, res) => {
    const { name, sku, description, price, quantity, categoryName } = req.body;

    const normalizedName = normalizeString(name);
    const priceValue = toMoney(price);

    if (!normalizedName || priceValue === null) {
        return res.status(400).json({ message: 'Name and price are required' });
    }

    try {
        const categoryId = await resolveCategoryId(categoryName);

        const data = {
            name: normalizedName,
            price: priceValue,
            quantity: toQuantity(quantity),
            categoryId,
        };

        if (description !== undefined) {
            data.description = nullableString(description);
        }

        if (sku !== undefined) {
            data.sku = nullableString(sku);
        }

        const product = await prisma.product.create({
            data,
            include: {
                category: true,
            },
        });

        res.status(201).json(presentProduct(product));
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.get('/', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).json(products.map(presentProduct));
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                category: true,
            },
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(presentProduct(product));
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.put('/:id', verifyAccessToken, async (req, res) => {
    const { id } = req.params;
    const { name, sku, description, price, quantity, categoryName } = req.body;

    const normalizedName = normalizeString(name);
    const priceValue = toMoney(price);

    if (!normalizedName || priceValue === null) {
        return res.status(400).json({ message: 'Name and price are required' });
    }

    try {
        const categoryId = await resolveCategoryId(categoryName);

        const data = {
            name: normalizedName,
            price: priceValue,
            quantity: toQuantity(quantity),
            categoryId,
        };

        if (description !== undefined) {
            data.description = nullableString(description);
        }

        if (sku !== undefined) {
            data.sku = nullableString(sku);
        }

        const product = await prisma.product.update({
            where: {
                id: Number(id),
            },
            data,
            include: {
                category: true,
            },
        });
        res.status(200).json(presentProduct(product));
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.delete('/:id', verifyAccessToken, async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.delete({
            where: {
                id: Number(id),
            },
        });
        res.status(200).json(product);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

module.exports = router;