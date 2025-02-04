const express = require('express');
const { z } = require('zod');
const { userModel, accountModel } = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const { authMiddleware } = require('../middleware');
const userRouter = express.Router();

const signupBody = z.object({
    username: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string()
})

const signinBody = z.object({
    username: z.string().email(),
    password: z.string()
})

const updatedBody = z.object({
    password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
})

userRouter.post('/signup', async function (req, res) {

    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
    const { username, firstName, lastName, password } = req.body;
    console.log(req.body);

    const existingUser = await userModel.findOne({
        username
    })

    if (existingUser) {
        return res.status(403).json({
            msg: "Email already taken / Incorrect inputs"
        })
    }

    const user = await userModel.create({
        username,
        firstName,
        lastName,
        password
    })

    await accountModel.create({
        userId: user._id,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({
        msg: "User created successfully",
        token: token
    })
});

userRouter.post('/signin', async function (req, res) {

    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const { username, password } = req.body;

    const existingUser = await userModel.findOne({
        username,
        password
    })

    if (existingUser) {
        const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET);

        res.json({
            token: token
        })
        return;
    }

    res.status(401).json({
        message: "Error while logging in"
    })

});

userRouter.put('/update', authMiddleware, async function (req, res) {

    const { success } = updatedBody.safeParse(req.body);
    console.log(success);
    if (!success) {
        res.status(411).json({
            msg: "Error while updating information"
        })
        return
    }

    await userModel.updateOne({
        _id: req.userId
    }, req.body)

    res.json({
        msg: "Updated successfully"
    })
})

userRouter.get("/bulk", authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";

    const users = await userModel.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })
    const currentUserId = req.userId;

    const allUsers = users.filter(user => user._id != currentUserId);

    res.json({
        user: allUsers.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

userRouter.get('/me', authMiddleware, async function (req, res) {

    const userId = req.userId;

    if (!userId) {
        res.json({
            msg: "User not found!"
        })
        return;
    }

    const user = await userModel.findOne({
        _id: userId
    })

    const account = await accountModel.findOne({
        userId: userId
    })

    res.json({
        firstName: user.firstName,
        balance: account.balance
    })
})

module.exports = userRouter;