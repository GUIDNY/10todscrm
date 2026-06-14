const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_DIR = path.join(__dirname, 'data');
const TASKS_FILE = path.join(DB_DIR, 'tasks.json');
const CUSTOMERS_FILE = path.join(DB_DIR, 'customers.json');
const USERS_FILE = path.join(DB_DIR, 'users.json');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const initFiles = () => {
  if (!fs.existsSync(TASKS_FILE)) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(CUSTOMERS_FILE)) {
    fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  }
};

const readJSON = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
};

const writeJSON = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

const tasks = {
  add: (title, description = '', customerId = null, dueDate = null) => {
    initFiles();
    const data = readJSON(TASKS_FILE);
    const newTask = {
      id: uuidv4(),
      title,
      description,
      customerId,
      dueDate,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.push(newTask);
    writeJSON(TASKS_FILE, data);
    return newTask;
  },

  getAll: () => {
    initFiles();
    return readJSON(TASKS_FILE);
  },

  getById: (id) => {
    initFiles();
    const data = readJSON(TASKS_FILE);
    return data.find(t => t.id === id);
  },

  updateStatus: (id, status) => {
    initFiles();
    const data = readJSON(TASKS_FILE);
    const task = data.find(t => t.id === id);
    if (task) {
      task.status = status;
      task.updatedAt = new Date().toISOString();
      writeJSON(TASKS_FILE, data);
    }
    return task;
  },

  delete: (id) => {
    initFiles();
    const data = readJSON(TASKS_FILE);
    const filtered = data.filter(t => t.id !== id);
    writeJSON(TASKS_FILE, filtered);
  }
};

const customers = {
  add: (name, email = '', phone = '', notes = '') => {
    initFiles();
    const data = readJSON(CUSTOMERS_FILE);
    const newCustomer = {
      id: uuidv4(),
      name,
      email,
      phone,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.push(newCustomer);
    writeJSON(CUSTOMERS_FILE, data);
    return newCustomer;
  },

  getAll: () => {
    initFiles();
    return readJSON(CUSTOMERS_FILE);
  },

  getById: (id) => {
    initFiles();
    const data = readJSON(CUSTOMERS_FILE);
    return data.find(c => c.id === id);
  },

  update: (id, updates) => {
    initFiles();
    const data = readJSON(CUSTOMERS_FILE);
    const customer = data.find(c => c.id === id);
    if (customer) {
      Object.assign(customer, updates);
      customer.updatedAt = new Date().toISOString();
      writeJSON(CUSTOMERS_FILE, data);
    }
    return customer;
  }
};

const users = {
  addOrUpdate: (telegramId, userData) => {
    initFiles();
    const data = readJSON(USERS_FILE);
    let user = data.find(u => u.telegramId === telegramId);
    if (!user) {
      user = {
        id: uuidv4(),
        telegramId,
        ...userData,
        createdAt: new Date().toISOString()
      };
      data.push(user);
    } else {
      Object.assign(user, userData);
    }
    user.updatedAt = new Date().toISOString();
    writeJSON(USERS_FILE, data);
    return user;
  },

  getByTelegramId: (telegramId) => {
    initFiles();
    const data = readJSON(USERS_FILE);
    return data.find(u => u.telegramId === telegramId);
  },

  getAll: () => {
    initFiles();
    return readJSON(USERS_FILE);
  }
};

module.exports = { tasks, customers, users };
