import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { orderService } from '../src/businessLogicLayer/services/order.service.js';
import Order from '../src/dataAccessLayer/models/order.model.js';
import User from '../src/dataAccessLayer/models/user.model.js';
import Product from '../src/dataAccessLayer/models/product.model.js';

let mongo;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri(), { dbName: 'testdb' });
    });

    afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
    });

    afterEach(async () => {
    await Order.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();
    });

    describe('Order Service', () => {
    let buyer, seller, product;

    beforeEach(async () => {
        buyer = await User.create({
        name: 'Buyer User',
        email: 'buyer@test.com',
        password: 'password',
        role: 'customer'
        });

        seller = await User.create({
        name: 'Seller User',
        email: 'seller@test.com',
        password: 'password',
        role: 'seller'
        });

        product = await Product.create({
        name: 'Test Product',
        price: 100,
        amount: 10,
        sellerId: seller._id
        });
    });

    describe('createOrder', () => {
        it('should create a new order', async () => {
        const orderData = {
            buyerId: buyer._id,
            sellerId: seller._id,
            productId: product._id,
            quantity: 2,
            totalPrice: 200
        };

        const order = await orderService.createOrder(
            orderData.buyerId,
            orderData.sellerId,
            orderData.productId,
            orderData.quantity,
            orderData.totalPrice
        );

        expect(order).toBeDefined();
        expect(order.buyerId.toString()).toBe(buyer._id.toString());
        expect(order.sellerId.toString()).toBe(seller._id.toString());
        expect(order.productId.toString()).toBe(product._id.toString());
        expect(order.quantity).toBe(2);
        expect(order.totalPrice).toBe(200);
        });
    });

    describe('getOrderById', () => {
        it('should retrieve an order by id', async () => {
        const order = await Order.create({
            buyerId: buyer._id,
            sellerId: seller._id,
            productId: product._id,
            quantity: 1,
            totalPrice: 100
        });

        const foundOrder = await orderService.getOrderById(order._id);
        
        expect(foundOrder).toBeDefined();
        expect(foundOrder._id.toString()).toBe(order._id.toString());
        });

        it('should return null for non-existent order', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const foundOrder = await orderService.getOrderById(nonExistentId);
        
        expect(foundOrder).toBeNull();
        });
    });

    describe('getOrdersByBuyer', () => {
        it('should retrieve all orders for a buyer', async () => {
        await Order.create([
            {
            buyerId: buyer._id,
            sellerId: seller._id,
            productId: product._id,
            quantity: 1,
            totalPrice: 100
            },
            {
            buyerId: buyer._id,
            sellerId: seller._id,
            productId: product._id,
            quantity: 2,
            totalPrice: 200
            }
        ]);

        const orders = await orderService.getOrdersByBuyer(buyer._id);
        
        expect(orders).toHaveLength(2);
        orders.forEach(order => {
            expect(order.buyerId.toString()).toBe(buyer._id.toString());
        });
        });

        it('should return empty array for buyer with no orders', async () => {
        const orders = await orderService.getOrdersByBuyer(buyer._id);
        expect(orders).toHaveLength(0);
        });
    });

    describe('getOrdersBySeller', () => {
        it('should retrieve all orders for a seller', async () => {
        await Order.create([
            {
            buyerId: buyer._id,
            sellerId: seller._id,
            productId: product._id,
            quantity: 1,
            totalPrice: 100
            },
            {
            buyerId: buyer._id,
            sellerId: seller._id,
            productId: product._id,
            quantity: 3,
            totalPrice: 300
            }
        ]);

        const orders = await orderService.getOrdersBySeller(seller._id);
        
        expect(orders).toHaveLength(2);
        orders.forEach(order => {
            expect(order.sellerId.toString()).toBe(seller._id.toString());
        });
        });

        it('should return empty array for seller with no orders', async () => {
        const orders = await orderService.getOrdersBySeller(seller._id);
        expect(orders).toHaveLength(0);
        });
    });

    describe('deleteOrder', () => {
        it('should delete an existing order', async () => {
        const order = await Order.create({
            buyerId: buyer._id,
            sellerId: seller._id,
            productId: product._id,
            quantity: 1,
            totalPrice: 100
        });

        const deletedOrder = await orderService.deleteOrder(order._id);
        
        expect(deletedOrder).toBeDefined();
        expect(deletedOrder._id.toString()).toBe(order._id.toString());
        
        const foundOrder = await Order.findById(order._id);
        expect(foundOrder).toBeNull();
        });

        it('should return null when trying to delete non-existent order', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const deletedOrder = await orderService.deleteOrder(nonExistentId);
        
        expect(deletedOrder).toBeNull();
        });
    });

    describe('hasUserPurchasedProduct', () => {
        it('should return true if user has purchased the product', async () => {
        await Order.create({
            buyerId: buyer._id,
            sellerId: seller._id,
            productId: product._id,
            quantity: 1,
            totalPrice: 100
        });

        const result = await orderService.hasUserPurchasedProduct(buyer._id, product._id);
        expect(result).toBe(true);
        });

        it('should return false if user has not purchased the product', async () => {
        const result = await orderService.hasUserPurchasedProduct(buyer._id, product._id);
        expect(result).toBe(false);
        });

        it('should return false for different product', async () => {
        await Order.create({
            buyerId: buyer._id,
            sellerId: seller._id,
            productId: product._id,
            quantity: 1,
            totalPrice: 100
        });

        const otherProduct = await Product.create({
            name: 'Other Product',
            price: 50,
            amount: 5,
            sellerId: seller._id
        });

        const result = await orderService.hasUserPurchasedProduct(buyer._id, otherProduct._id);
        expect(result).toBe(false);
        });
    });
});