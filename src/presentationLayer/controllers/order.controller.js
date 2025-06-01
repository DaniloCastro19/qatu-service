import { orderService } from "../../businessLogicLayer/services/order.service.js";

export const orderController = {
    createOrder: async (req, res, next) => {
        try {
            const { productId, quantity, totalPrice } = req.body;
            const buyerId = req.user.id;
            const sellerId = req.body.sellerId;

            const order = await orderService.createOrder(buyerId, sellerId, productId, quantity, totalPrice);
            res.status(201).json({ message: "Order created successfully", order });
        } catch (error) {
            next(error);
        }
    },

    getOrderById: async (req, res, next) => {
        try {
            const order = await orderService.getOrderById(req.params.id);
            if (!order) return res.status(404).json({ message: "Order not found" });
            res.status(200).json(order);
        } catch (error) {
            next(error);
        }
    },

    getOrdersByBuyer: async (req, res, next) => {
        try {
            const orders = await orderService.getOrdersByBuyer(req.user.id);
            res.status(200).json(orders);
        } catch (error) {
            next(error);
        }
    },

    getOrdersBySeller: async (req, res, next) => {
        try {
            const orders = await orderService.getOrdersBySeller(req.user.id);
            res.status(200).json(orders);
        } catch (error) {
            next(error);
        }
    },

    deleteOrder: async (req, res, next) => {
        try {
            const order = await orderService.deleteOrder(req.params.id);
            if (!order) return res.status(404).json({ message: "Order not found" });
            res.status(200).json({ message: "Order deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
};