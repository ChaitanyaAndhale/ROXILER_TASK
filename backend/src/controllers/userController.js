const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');

const prisma = new PrismaClient();

const ratingSchema = Joi.object({
    storeId: Joi.number().integer().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
});

const getStores = async (req, res) => {
    try {
        const { name, address, sort = 'asc' } = req.query;

        const where = {};
        if (name) where.name = { contains: name, mode: 'insensitive' };
        if (address) where.address = { contains: address, mode: 'insensitive' };

        const stores = await prisma.store.findMany({
            where,
            orderBy: { name: sort === 'desc' ? 'desc' : 'asc' },
        });

        const result = await Promise.all(
            stores.map(async (store) => {
                const avg = await prisma.rating.aggregate({
                    where: { storeId: store.id },
                    _avg: { rating: true },
                });

                // Get logged-in user's rating for this store
                const userRating = await prisma.rating.findUnique({
                    where: { userId_storeId: { userId: req.user.id, storeId: store.id } },
                });

                return {
                    ...store,
                    averageRating: avg._avg.rating ? parseFloat(avg._avg.rating.toFixed(2)) : null,
                    myRating: userRating ? userRating.rating : null,
                };
            })
        );

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const submitRating = async (req, res) => {
    try {
        const { error } = ratingSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { storeId, rating } = req.body;

        // Check store exists
        const store = await prisma.store.findUnique({ where: { id: storeId } });
        if (!store) return res.status(404).json({ message: 'Store not found' });

        const result = await prisma.rating.upsert({
            where: { userId_storeId: { userId: req.user.id, storeId } },
            update: { rating },
            create: { userId: req.user.id, storeId, rating },
        });

        res.status(201).json({ message: 'Rating submitted', rating: result });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { getStores, submitRating };
