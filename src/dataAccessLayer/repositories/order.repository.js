import Order from "../models/order.model.js";

export const orderRepository = {
    async createOrder(orderData) {
        const order = new Order(orderData);
        return await order.save();
    },

    async getOrderById(orderId) {
        return await Order.findById(orderId)
            .populate('buyerId', 'name email')
            .populate('sellerId', 'name email')
            .populate('productId', 'name price');
    },

    async getOrdersByBuyer(buyerId) {
        return await Order.find({ buyerId })
            .populate('productId', 'name price');
    },

    async getOrdersBySeller(sellerId) {
        return await Order.find({ sellerId })
            .populate('productId', 'name price');
    },

    async deleteOrder(orderId) {
        return await Order.findByIdAndDelete(orderId);
    }
};