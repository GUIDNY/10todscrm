require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { tasks, customers, users, connectDB } = require('./db/mongodb-storage');
const auth = require('./db/auth-storage');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

connectDB();

// Middleware to verify token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const user = await auth.verify(token);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await auth.register(email, name, password);
    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await auth.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.post('/api/auth/logout', verifyToken, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    await auth.logout(token);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Root - Serve login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '10dots CRM API is running' });
});

// TASKS API
app.get('/api/tasks', verifyToken, async (req, res) => {
  try {
    const allTasks = await tasks.getAll();
    const status = req.query.status;
    if (status) {
      const filtered = allTasks.filter(t => t.status === status);
      return res.json(filtered);
    }
    res.json(allTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks', verifyToken, async (req, res) => {
  try {
    const { title, description, customerId, dueDate, priority } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const newTask = await tasks.add(title, description, customerId, dueDate, priority);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tasks/:id', verifyToken, async (req, res) => {
  try {
    const task = await tasks.getById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tasks/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const task = await tasks.updateStatus(req.params.id, status);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tasks/:id', verifyToken, async (req, res) => {
  try {
    await tasks.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CUSTOMERS API
app.get('/api/customers', verifyToken, async (req, res) => {
  try {
    const allCustomers = await customers.getAll();
    res.json(allCustomers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/customers', verifyToken, async (req, res) => {
  try {
    const { name, email, phone, notes } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const newCustomer = await customers.add(name, email, phone, notes);
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/customers/:id', verifyToken, async (req, res) => {
  try {
    const customer = await customers.getById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/customers/:id', verifyToken, async (req, res) => {
  try {
    const customer = await customers.update(req.params.id, req.body);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/customers/:id/tasks', verifyToken, async (req, res) => {
  try {
    const allTasks = await tasks.getAll();
    const customerTasks = allTasks.filter(t => t.customerId === req.params.id);
    res.json(customerTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// STATS API
app.get('/api/stats', verifyToken, async (req, res) => {
  try {
    const allTasks = await tasks.getAll();
    const allCustomers = await customers.getAll();
    const stats = {
      totalTasks: allTasks.length,
      openTasks: allTasks.filter(t => t.status === 'open').length,
      doneTasks: allTasks.filter(t => t.status === 'done').length,
      totalCustomers: allCustomers.length
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// USERS API
app.get('/api/users', verifyToken, async (req, res) => {
  try {
    const allUsers = await users.getAll();
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ 10dots CRM API running on http://localhost:${PORT}`);
  });
}
