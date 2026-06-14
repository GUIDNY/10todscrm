require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { tasks, customers, users, connectDB } = require('./db/mongodb-storage');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

connectDB();

// Root - Serve professional dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '10dots CRM API is running' });
});

// TASKS API
app.get('/api/tasks', async (req, res) => {
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

app.post('/api/tasks', async (req, res) => {
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

app.get('/api/tasks/:id', async (req, res) => {
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

app.put('/api/tasks/:id/status', async (req, res) => {
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

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await tasks.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CUSTOMERS API
app.get('/api/customers', async (req, res) => {
  try {
    const allCustomers = await customers.getAll();
    res.json(allCustomers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/customers', async (req, res) => {
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

app.get('/api/customers/:id', async (req, res) => {
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

app.put('/api/customers/:id', async (req, res) => {
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

app.get('/api/customers/:id/tasks', async (req, res) => {
  try {
    const allTasks = await tasks.getAll();
    const customerTasks = allTasks.filter(t => t.customerId === req.params.id);
    res.json(customerTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// STATS API
app.get('/api/stats', async (req, res) => {
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
app.get('/api/users', async (req, res) => {
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
