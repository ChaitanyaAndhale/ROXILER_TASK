const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const prisma = new PrismaClient();

const signupSchema = Joi.object({
    name: Joi.string().min(20).max(60).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(8).max(16)
        .pattern(/[A-Z]/, 'uppercase')
        .pattern(/[!@#$%^&*(),.?":{}|<>]/, 'special character')
        .required(),
    address: Joi.string().max(400).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const updatePasswordSchema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string()
        .min(8).max(16)
        .pattern(/[A-Z]/, 'uppercase')
        .pattern(/[!@#$%^&*(),.?":{}|<>]/, 'special character')
        .required(),
});

const signup = async (req, res) => {
    try {
        const { error } = signupSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { name, email, password, address } = req.body;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(409).json({ message: 'Email already registered' });

        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashed, address, role: 'USER' },
        });

        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { error } = updatePasswordSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { oldPassword, newPassword } = req.body;
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });

        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) return res.status(401).json({ message: 'Current password is incorrect' });

        const hashed = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } });

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { signup, login, updatePassword };
