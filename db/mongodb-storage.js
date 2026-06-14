const mongoose = require('mongoose');
const { Task, Customer, User } = require('./models');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.warn('⚠️  MONGODB_URI not set - using local JSON storage');
      return false;
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log('✅ MongoDB connected');
    return true;
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed:', error.message);
    return false;
  }
};

const tasks = {
  add: async (title, description = '', customerId = null, dueDate = null, priority = 'medium') => {
    await connectDB();
    try {
      const newTask = await Task.create({
        title,
        description,
        customerId,
        dueDate,
        priority,
        status: 'open'
      });
      return newTask.toObject();
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  },

  getAll: async () => {
    await connectDB();
    try {
      const allTasks = await Task.find().sort({ createdAt: -1 });
      return allTasks.map(t => t.toObject());
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  },

  getById: async (id) => {
    await connectDB();
    try {
      const task = await Task.findById(id);
      return task ? task.toObject() : null;
    } catch (error) {
      console.error('Error getting task:', error);
      return null;
    }
  },

  updateStatus: async (id, status) => {
    await connectDB();
    try {
      const task = await Task.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      );
      return task ? task.toObject() : null;
    } catch (error) {
      console.error('Error updating task status:', error);
      return null;
    }
  },

  delete: async (id) => {
    await connectDB();
    try {
      await Task.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }
};

const customers = {
  add: async (name, email = '', phone = '', notes = '') => {
    await connectDB();
    try {
      const newCustomer = await Customer.create({
        name,
        email,
        phone,
        notes
      });
      return newCustomer.toObject();
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  },

  getAll: async () => {
    await connectDB();
    try {
      const allCustomers = await Customer.find().sort({ createdAt: -1 });
      return allCustomers.map(c => c.toObject());
    } catch (error) {
      console.error('Error getting customers:', error);
      return [];
    }
  },

  getById: async (id) => {
    await connectDB();
    try {
      const customer = await Customer.findById(id);
      return customer ? customer.toObject() : null;
    } catch (error) {
      console.error('Error getting customer:', error);
      return null;
    }
  },

  update: async (id, updates) => {
    await connectDB();
    try {
      const customer = await Customer.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      );
      return customer ? customer.toObject() : null;
    } catch (error) {
      console.error('Error updating customer:', error);
      return null;
    }
  }
};

const users = {
  addOrUpdate: async (telegramId, userData) => {
    await connectDB();
    try {
      const user = await User.findOneAndUpdate(
        { telegramId },
        { ...userData, updatedAt: new Date() },
        { upsert: true, new: true }
      );
      return user.toObject();
    } catch (error) {
      console.error('Error adding/updating user:', error);
      throw error;
    }
  },

  getByTelegramId: async (telegramId) => {
    await connectDB();
    try {
      const user = await User.findOne({ telegramId });
      return user ? user.toObject() : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  getAll: async () => {
    await connectDB();
    try {
      const allUsers = await User.find();
      return allUsers.map(u => u.toObject());
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }
};

module.exports = { tasks, customers, users, connectDB };
