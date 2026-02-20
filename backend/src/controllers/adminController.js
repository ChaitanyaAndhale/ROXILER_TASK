const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

const prisma = new PrismaClient();

const addUserSchema = Joi.object({
    name: Joi.string().min(20).max(60).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(8).max(16)
        .pattern(/[A-Z]/, 'uppercase')
        .pattern(/[!@#$%^&*(),.?":{}|<>]/, 'special character')
        .required(),
    address: Joi.string().max(400).required(),
    role: Joi.string().valid('ADMIN', 'USER', 'STORE_OWNER').required(),
});

const addStoreSchema = Joi.object({
    name: Joi.string().min(20).max(60).required(),
    email: Joi.string().email().required(),
    address: Joi.string().max(400).required(),
    ownerId: Joi.number().integer().required(),
});

const getDashboard = async (req, res) => {
    try {
        const [totalUsers, totalStores, totalRatings] = await Promise.all([
            prisma.user.count(),
            prisma.store.count(),
            prisma.rating.count(),
        ]);
        res.json({ totalUsers, totalStores, totalRatings });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const addUser = async (req, res) => {
    try {
        const { error } = addUserSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { name, email, password, address, role } = req.body;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(409).json({ message: 'Email already registered' });

        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashed, address, role },
        });

        res.status(201).json({ message: 'User created', userId: user.id });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const addStore = async (req, res) => {
    try {
        const { error } = addStoreSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { name, email, address, ownerId } = req.body;

        // Verify owner exists and is a STORE_OWNER
        const owner = await prisma.user.findUnique({ where: { id: ownerId } });
        if (!owner || owner.role !== 'STORE_OWNER') {
            return res.status(400).json({ message: 'Owner not found or is not a STORE_OWNER' });
        }

        const store = await prisma.store.create({ data: { name, email, address, ownerId } });
        res.status(201).json({ message: 'Store created', storeId: store.id });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const { name, email, role, sort = 'asc' } = req.query;

        const where = {};
        if (name) where.name = { contains: name, mode: 'insensitive' };
        if (email) where.email = { contains: email, mode: 'insensitive' };
        if (role) where.role = role;

        const users = await prisma.user.findMany({
            where,
            orderBy: { name: sort === 'desc' ? 'desc' : 'asc' },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true,
                createdAt: true,
            },
        });

        // For each user, get their avg rating if they are a store owner
        const result = await Promise.all(
            users.map(async (user) => {
                if (user.role === 'STORE_OWNER') {
                    const store = await prisma.store.findFirst({ where: { ownerId: user.id } });
                    if (store) {
                        const avg = await prisma.rating.aggregate({
                            where: { storeId: store.id },
                            _avg: { rating: true },
                        });
                        return { ...user, storeRating: avg._avg.rating ?? null };
                    }
                }
                return user;
            })
        );

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getStores = async (req, res) => {
    try {
        const { name, sort = 'asc' } = req.query;

        const where = {};
        if (name) where.name = { contains: name, mode: 'insensitive' };

        const stores = await prisma.store.findMany({
            where,
            orderBy: { name: sort === 'desc' ? 'desc' : 'asc' },
            include: { owner: { select: { name: true, email: true } } },
        });

        const result = await Promise.all(
            stores.map(async (store) => {
                const avg = await prisma.rating.aggregate({
                    where: { storeId: store.id },
                    _avg: { rating: true },
                });
                return { ...store, averageRating: avg._avg.rating ?? null };
            })
        );

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { getDashboard, addUser, addStore, getUsers, getStores };
