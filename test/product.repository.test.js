
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { productRepository } from '../src/dataAccessLayer/repositories/product.repository.js';
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
  await Product.deleteMany();
});

describe('Product Repository', () => {
  it('should create a new product with default role', async () => {
    const product = await productRepository.createProduct({
      name: 'Product1',
      price: 100,
      amount: 1
    });

    expect(product.name).toBe('Product1');
    expect(product.price).toBe(100);
    expect(product.amount).toBe(1);
  });

  it('should find product by id', async () => {
    const newProduct = await productRepository.createProduct({
        name: 'Product1',
        price: 100,
        amount: 1
    });

    const foundProduct = await productRepository.getProductById(newProduct._id);
    expect(foundProduct.name).toBe('Product1');
  });

  it('should update product data', async () => {
    const product = await productRepository.createProduct({
        name: 'Product1',
        price: 100,
        amount: 1
    });

    const updated = await productRepository.updateProduct(product._id, { name: 'Product2' });
    expect(updated.name).toBe('Product2');
  });

  it('should delete product', async () => {
    const product = await productRepository.createProduct({
        name: 'Product1',
        price: 100,
        amount: 1
    });

    await productRepository.deleteProduct(product._id);
    const found = await productRepository.getProductById(product._id);
    expect(found).toBeNull();
  });
});