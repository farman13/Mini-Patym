const express = require('express');
const { authMiddleware } = require('../middleware');
const { accountModel } = require('../db');
const { default: mongoose } = require('mongoose');
const accountRouter = express.Router();


accountRouter.get('/balance', authMiddleware, async function (req, res) {

    const account = await accountModel.findOne({
        userId: req.userId
    })

    console.log("balance:", account.balance);

    res.json({
        balance: account.balance
    })
})

accountRouter.post('/transfer', authMiddleware, async function (req, res) {

    const session = await mongoose.startSession();   // ensures that no two concurrent transactions occur at the same time , also ensures that the trasanction is not partially done!

    session.startTransaction();

    const { amount, to } = req.body;

    const account = await accountModel.findOne({
        userId: req.userId
    }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            msg: "Insufficient balance"
        });
    }

    const toAccount = await accountModel.findOne({
        userId: to
    }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            msg: "Invalid account"
        });
    }

    await accountModel.updateOne({
        userId: req.userId
    }, { $inc: { balance: -amount } }).session(session);

    await accountModel.updateOne({
        userId: to
    }, { $inc: { balance: amount } }).session(session);

    await session.commitTransaction();

    res.json({
        msg: "Transaction successful"
    })
})

module.exports = accountRouter;