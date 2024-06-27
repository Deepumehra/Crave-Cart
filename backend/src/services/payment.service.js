const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = {
  async generatePaymentLink(order) {
    try {
      console.log("Order:", order);

      const options = {
        amount: Math.round(order.totalAmount * 100), // amount in smallest currency unit
        currency: "INR",
        receipt: `order_rcptid_${order._id}`,
        payment_capture: 1,
        notes: {
          description: "Restaurant Foods"
        }
      };

      const orderResponse = await razorpay.orders.create(options);
      console.log('Order Response:', orderResponse);

      const paymentLinkOptions = {
        amount: options.amount,
        currency: options.currency,
        description: "Restaurant Foods",
        callback_url: `http://localhost:3000/payment/success/${order._id}`,
        callback_method: "get",
        // Remove order_id and notes if not supported by the API
      };

      const paymentLink = await razorpay.paymentLink.create(paymentLinkOptions);
      console.log('Payment Link:', paymentLink);

      return { paymentLink: paymentLink };
    } catch (error) {
      console.error('Error generating payment link:', error);
      throw new Error(`Failed to generate payment link: ${error.message}`);
    }
  }
};
