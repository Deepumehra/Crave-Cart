const Address = require("../models/adress.model");
const Order = require("../models/order.model");
const OrderItem = require("../models/orderItem.model");
const Payment = require("../models/payment.model");
const Restaurant = require("../models/restaurant.model");
const cartService = require("./cart.service");
const paymentService = require("./payment.service");

module.exports = {
  async createOrder(order, user) {
    try {
      const address = order.deliveryAddress;
      console.log('Address :',address);
      let savedAddress;
      if (address?._id) {
        const isAddressExist = await Address.findById(address._id);
        if (isAddressExist) {
          savedAddress = isAddressExist;
        } else {
          const shippingAddress = new Address({...order.deliveryAddress,_id:new mongoose.Types.ObjectId()});
          savedAddress = await shippingAddress.save();
        }
      }
      else{
        savedAddress=new Address(order.deliveryAddress);
        savedAddress.save();
      }
      console.log('Saved Address :',savedAddress);
      if (!user.addresses.some(addressId => addressId.equals(savedAddress._id))) {
        user.addresses.push(savedAddress._id);
        await user.save();
      }

      const restaurant = await Restaurant.findById(order.restaurantId);
      if (!restaurant) {
        throw new Error(`Restaurant not found with ID ${order.restaurantId}`);
      }

      const cart = await cartService.findCartByUserId(user._id);

      if (!cart) {
        throw new Error("cart not found");
      }
      const orderItems = [];

      for (const cartItem of cart.items) {
        const orderItem = new OrderItem({
          food: cartItem.food,
          ingredients: cartItem.ingredients,
          quantity: cartItem.quantity,
          totalPrice: cartItem.food.price * cartItem.quantity,
        });
        const savedOrderItem = await orderItem.save();
        orderItems.push(savedOrderItem._id);
      }

      const totalPrice = await cartService.calculateCartTotals(cart);
      console.log('Total Price :',totalPrice);
      const createdOrder = new Order({
        customer: user._id,
        deliveryAddress: savedAddress._id,
        createdAt: new Date(),
        orderStatus: "PENDING",
        totalAmount: totalPrice,
        restaurant: restaurant._id,
        items: orderItems,
      });
      const savedOrder = await createdOrder.save();
      console.log('Saved Order :',savedOrder);
      restaurant.orders.push(savedOrder._id);
      await restaurant.save();
      const paymentResponse = await paymentService.generatePaymentLink(
        savedOrder
      );
      // console.log("user :",user);
      user.orders.push(savedOrder._id);
      console.log('Payment Response :',paymentResponse);
      await user.save();
      const paymentRes=new Payment({
        customerId:user._id,
        orderId:savedOrder._id,
        paymentMethod:'Card',
        paymentStatus:'Successful',
        totalAmount:totalPrice
      })
      await paymentRes.save();
      console.log(paymentResponse);
      return paymentResponse;
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  },

  async cancelOrder(orderId) {
    try {
      await Order.findByIdAndDelete(orderId);
    } catch (error) {
      throw new Error(
        `Failed to cancel order with ID ${orderId}: ${error.message}`
      );
    }
  },

  async findOrderById(orderId) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error(`Order not found with ID ${orderId}`);
      }
      return order;
    } catch (error) {
      throw new Error(
        `Failed to find order with ID ${orderId}: ${error.message}`
      );
    }
  },

  async getUserOrders(userId) {
    try {
      const orders = await Order.find({ customer: userId }).populate({
        path: "items",populate:{path:"food"}
      });
      return orders;
    } catch (error) {
      throw new Error(`Failed to get user orders: ${error.message}`);
    }
  },

  async getOrdersOfRestaurant(restaurantId, orderStatus) {
    try {
      let orders = await Order.find({ restaurant: restaurantId }).populate([{
        path: "items",populate:{path:"food"}
      },'customer']);
      if (orderStatus) {
        orders = orders.filter((order) => order.orderStatus === orderStatus);
      }
      return orders;
    } catch (error) {
      throw new Error(
        `Failed to get orders of restaurant with ID ${restaurantId}: ${error.message}`
      );
    }
  },

  async updateOrder(orderId, orderStatus) {
    console.log(orderId,orderStatus);
    try {
      const validStatuses = [
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "COMPLETED",
        "PENDING",
      ];
      if (!validStatuses.includes(orderStatus)) {
        throw new Error("Please select a valid order status");
      }

      const order = await Order.findById(orderId).populate({
        path: "items",populate:{path:"food"}
      });
      if (!order) {
        throw new Error(`Order not found with ID ${orderId}`);
      }

      order.orderStatus = orderStatus;
      await order.save();
      return order;
    } catch (error) {
      throw new Error(
        `Failed to update order with ID ${orderId}: ${error.message}`
      );
    }
  },
  async getAllOrders() {
    try {
      const orders = await Order.find({})
        .populate('customer')
        .populate('deliveryAddress') 
        .populate('items') 
        .populate('restaurant'); 
      return orders;
    } catch (error) {
      throw new Error(`Failed to find all orders: ${error.message}`);
    }
  }
};
