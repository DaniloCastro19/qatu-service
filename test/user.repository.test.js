import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { userRepository } from '../src/dataAccessLayer/repositories/user.repository.js';
import User from '../src/dataAccessLayer/models/user.model.js';

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
  await User.deleteMany();
});

describe('User Repository', () => {
  it('should create a new user with default role', async () => {
    const user = await userRepository.createUser({
      name: 'Douglas',
      email: 'douglas@example.com',
      age: 30
    });

    expect(user.name).toBe('Douglas');
    expect(user.email).toBe('douglas@example.com');
    expect(user.role).toBe('customer'); // customer is the default value
  });

  it('should find user by id', async () => {
    const newUser = await userRepository.createUser({
      name: 'Ana',
      email: 'ana@example.com'
    });

    const foundUser = await userRepository.getUserById(newUser._id);
    expect(foundUser.email).toBe('ana@example.com');
  });

  it('should update user data', async () => {
    const user = await userRepository.createUser({
      name: 'Luis',
      email: 'luis@example.com'
    });

    const updated = await userRepository.updateUser(user._id, { name: 'Luisito' });
    expect(updated.name).toBe('Luisito');
  });

  it('should delete user', async () => {
    const user = await userRepository.createUser({
      name: 'Pedro',
      email: 'pedro@example.com'
    });

    await userRepository.deleteUser(user._id);
    const found = await userRepository.getUserById(user._id);
    expect(found).toBeNull();
  });

  it('should reject invalid role', async () => {
    await expect(userRepository.createUser({
      name: 'Fake',
      email: 'fake@example.com',
      role: 'hacker'
    })).rejects.toThrow();
  });
});
