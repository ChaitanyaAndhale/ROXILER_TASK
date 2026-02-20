const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getMyStore = async (req, res) => {
    try {
        const store = await prisma.store.findFirst({
            where: { ownerId: req.user.id },
        });

        if (!store) return res.status(404).json({ message: 'No store found for this owner' });

        const avg = await prisma.rating.aggregate({
            where: { storeId: store.id },
            _avg: { rating: true },
            _count: { rating: true },
        });

        res.json({
            store,
            averageRating: avg._avg.rating ? parseFloat(avg._avg.rating.toFixed(2)) : null,
            totalRatings: avg._count.rating,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getRaters = async (req, res) => {
    try {
        const store = await prisma.store.findFirst({
            where: { ownerId: req.user.id },
        });

        if (!store) return res.status(404).json({ message: 'No store found for this owner' });

        const ratings = await prisma.rating.findMany({
            where: { storeId: store.id },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(ratings);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { getMyStore, getRaters };
