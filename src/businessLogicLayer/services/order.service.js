import { orderRepository } from "../../dataAccessLayer/repositories/order.repository.js";

export const orderService = {
    async createOrder(buyerId, sellerId, productId, quantity, totalPrice) {
        const orderData = { buyerId, sellerId, productId, quantity, totalPrice };
        return await orderRepository.createOrder(orderData);
    },

    async getOrderById(orderId) {
        return await orderRepository.getOrderById(orderId);
    },

    async getOrdersByBuyer(buyerId) {
        return await orderRepository.getOrdersByBuyer(buyerId);
    },

    async getOrdersBySeller(sellerId) {
        return await orderRepository.getOrdersBySeller(sellerId);
    },

    async deleteOrder(orderId) {
        return await orderRepository.deleteOrder(orderId);
    },

    async hasUserPurchasedProduct(userId, productId) {
        const orders = await orderRepository.getOrdersByBuyer(userId);
        
        const result = orders.some(order => 
            order.productId && order.productId._id.toString() === productId.toString()
        );
        return result;
    }    
};