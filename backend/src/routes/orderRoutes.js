const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticate = require('../midleware/authenticate');
const Payment =require('../models/payment.model');
router.post('',authenticate, orderController.createOrder);
router.get('/user',authenticate, orderController.getAllUserOrders);
router.get('/getAllOrders',orderController.getAllOrders);
router.get('/getAllPayments',async (req,res)=>{
    try{
        const payments=await Payment.find({})
        res.json(payments);
    }catch(error){
        throw new Error(error.message);
    }
});
module.exports = router;
