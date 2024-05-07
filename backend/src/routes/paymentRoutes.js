const express=require('express');
const router=express.Router();
const { v4: uuidv4 } = require('uuid');
const authenticate = require('../midleware/authenticate');
const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment=require('../models/payment.model');

router.post('/create-checkout-session',async (req,res)=>{
    const {products}=req.body;
    console.log("Order :",products);
    const Products=products.cartItems;
    console.log("food :",products);
    const lineItems=Products.map((product)=>({
        price_data:{
            currency:'usd',
            product_data:{
                name:product.food.name,
                images:product.food.images[0]
            },
            unit_amount:Math.round(product.totalPrice*100), 
        },
        quantity:product.quantity,
    }));

    const session=await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        line_items:lineItems,
        mode:'payment',
        success_url: `http://localhost:3000/payment/success/${uuidv4()}`,
        cancel_url: 'http://localhost:3000/cancel',
    })

    res.json({id:session.id})
})

router.get('/getAllPaymentsByUserId',authenticate,async (req,res)=>{
    try{
        const user=req.user;
        const payments=await Payment.findMany({customerId:user._id});
        res.status(200).json(payments);
    }catch(error){
        throw new Error(error.message);
    }
})

module.exports = router;