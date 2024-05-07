const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = {
  async generatePaymentLink(order) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `http://localhost:3001/payment/success/${order._id}`,
        cancel_url: 'http://localhost:3001/cancel',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: Math.round(order.totalAmount * 100), 
              product_data: {
                name: 'Restaurant Foods',
              },
            },
            quantity: 1,
          },
        ],
      });

      console.log('Session:', session);
      return {session:session};
    } catch (error) {
      throw new Error(`Failed to generate payment link: ${error.message}`);
    }
  }
};
