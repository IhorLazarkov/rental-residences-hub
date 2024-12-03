const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth, requireAuthorization } = require('../../utils/auth');
const { User, Spot } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('First Name is required.'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Last Name is required.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

router.post(
    '/',
    validateSignup,
    async (req, res,) => {
        const { email, password, username, firstName, lastName } = req.body;
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { username }]
            }
        });
        if (existingUser) {
            const errors = {};
            errors.email = 'User with that email already exists';
            errors.username = 'User with that username already exists';

            return res.status(500).json({
                message: 'User already exists',
                username,
                errors,
            });
        }
        const hashedPassword = bcrypt.hashSync(password);
        const user = await User.create({
            email,
            username,
            firstname: firstName,
            lastname: lastName,
            hashedPassword,
        });
        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstname,
            lastName: user.lastname
        };

        await setTokenCookie(res, safeUser);
        return res.status(201).json({
            user: safeUser
        });
    }
);

module.exports = router;