const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  customerId: String,
  dueDate: Date,
  status: { type: String, default: 'open' },
  priority: { type: String, default: 'medium' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  telegramId: { type: Number, unique: true },
  username: String,
  firstName: String,
  chatId: Number,
  lastMessage: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);
const Customer = mongoose.model('Customer', customerSchema);
const User = mongoose.model('User', userSchema);

module.exports = { Task, Customer, User };
