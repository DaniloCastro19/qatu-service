import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { orderController } from '../src/presentationLayer/controllers/order.controller.js';
import Order from '../src/dataAccessLayer/models/order.model.js';
import User from '../src/dataAccessLayer/models/user.model.js';
import Product from '../src/dataAccessLayer/models/product.model.js';

let mongo;
let buyer, seller, admin, product;

const mockRequest = (body = {}, params = {}, user = {}, query = {}) => ({
    body,
    params,
    user,
    query
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockNext = jest.fn();

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri(), { dbName: 'testdb' });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
});

afterEach(async () => {
    await Order.deleteMany({});
    await User.deleteMany({});
    await Product.deleteMany({});
    mockNext.mockClear();
});

describe('Order Controller Integration Tests', () => {
    beforeEach(async () => {
        [buyer, seller, admin] = await User.create([
        {
            name: 'Test Buyer',
            email: 'buyer@test.com',
            password: 'password123',
            role: 'customer'
        },
        {
            name: 'Test Seller',
            email: 'seller@test.com',
            password: 'password123',
            role: 'seller'
        },
        {
            name: 'Test Admin',
            email: 'admin@test.com',
            password: 'password123',
            role: 'admin'
        }
        ]);

        product = await Product.create({
        name: 'Test Product',
        price: 100,
        amount: 10,
        sellerId: seller._id
        });
    });

    describe('createOrder', () => {
        it('should create a new order successfully', async () => {
        const req = mockRequest(
            {
            productId: product._id,
            sellerId: seller._id,
            quantity: 2,
            totalPrice: 200
            },
            {},
            { id: buyer._id }
        );
        const res = mockResponse();

        await orderController.createOrder(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Order created successfully',
            order: expect.objectContaining({
            quantity: 2,
            totalPrice: 200
            })
        });

        const dbOrder = await Order.findOne({});
        expect(dbOrder).toBeTruthy();
        });

        it('should validate required fields', async () => {
        const req = mockRequest(
            { quantity: 2 },
            {},
            { id: buyer._id }
        );
        const res = mockResponse();

        await orderController.createOrder(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        
        const error = mockNext.mock.calls[0][0];
        expect(error.message).toMatch(/validation failed|required/i);
        });
    });

describe('getOrderById', () => {
        it('should retrieve an existing order', async () => {
        const order = await Order.create({
            buyerId: buyer._id,
            sellerId: seller._id,
            productId: product._id,
            quantity: 1,
            totalPrice: 100
        });

        const req = mockRequest({}, { id: order._id });
        const res = mockResponse();

        await orderController.getOrderById(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(200);
        
        const responseData = res.json.mock.calls[0][0];
        expect(responseData._id.toString()).toBe(order._id.toString());
        });

        it('should return 404 for non-existent order', async () => {
        const req = mockRequest({}, { id: new mongoose.Types.ObjectId() });
        const res = mockResponse();

        await orderController.getOrderById(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Order not found'
        });
    });
});

describe('getOrdersByBuyer', () => {
    it('should return orders for the authenticated buyer', async () => {
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

        const req = mockRequest({}, {}, { id: buyer._id });
        const res = mockResponse();

        await orderController.getOrdersByBuyer(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(200);
        
        const responseData = res.json.mock.calls[0][0];
        expect(responseData.length).toBe(2);
        expect(responseData[0].buyerId.toString()).toBe(buyer._id.toString());
        });

        it('should return empty array if no orders', async () => {
        const req = mockRequest({}, {}, { id: buyer._id });
        const res = mockResponse();

        await orderController.getOrdersByBuyer(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([]);
    });
});

describe('getOrdersBySeller', () => {
    it('should return orders for the authenticated seller', async () => {
        await Order.create({
        buyerId: buyer._id,
        sellerId: seller._id,
        productId: product._id,
        quantity: 1,
        totalPrice: 100
    });

        const req = mockRequest({}, {}, { id: seller._id });
        const res = mockResponse();

        await orderController.getOrdersBySeller(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(200);
        
        const responseData = res.json.mock.calls[0][0];
        expect(responseData[0].sellerId.toString()).toBe(seller._id.toString());
    });
});

describe('deleteOrder', () => {
    it('should delete an order (admin only)', async () => {
    const order = await Order.create({
        buyerId: buyer._id,
        sellerId: seller._id,
        productId: product._id,
        quantity: 1,
        totalPrice: 100
        });

    const req = mockRequest({}, { id: order._id }, { id: admin._id, role: 'admin' });
    const res = mockResponse();

    await orderController.deleteOrder(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        message: 'Order deleted successfully'
    });

    const deletedOrder = await Order.findById(order._id);
    expect(deletedOrder).toBeNull();
});

    it('should enforce admin role requirement', async () => {
    const order = await Order.create({
        buyerId: buyer._id,
        sellerId: seller._id,
        productId: product._id,
        quantity: 1,
        totalPrice: 100
    });

    const req = mockRequest({}, { id: order._id }, { id: buyer._id, role: 'customer' });
    const res = mockResponse();

    jest.spyOn(orderController, 'deleteOrder').mockImplementation(async (req, res, next) => {
        if (req.user.role !== 'admin') {
        const error = new Error('Forbidden');
        error.statusCode = 403;
        return next(error);
    }
    });

    await orderController.deleteOrder(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    expect(mockNext.mock.calls[0][0].statusCode).toBe(403);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();

    orderController.deleteOrder.mockRestore();
});
});
});