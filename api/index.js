require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { tasks, customers, users } = require('../db/storage');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '10dots CRM API is running' });
});

// TASKS API
app.get('/api/tasks', (req, res) => {
  const allTasks = tasks.getAll();
  const status = req.query.status;

  if (status) {
    const filtered = allTasks.filter(t => t.status === status);
    return res.json(filtered);
  }

  res.json(allTasks);
});

app.post('/api/tasks', (req, res) => {
  const { title, description, customerId, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = tasks.add(title, description, customerId, dueDate);
  res.status(201).json(newTask);
});

app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.getById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

app.put('/api/tasks/:id/status', (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const task = tasks.updateStatus(req.params.id, status);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  tasks.delete(req.params.id);
  res.json({ success: true });
});

// CUSTOMERS API
app.get('/api/customers', (req, res) => {
  const allCustomers = customers.getAll();
  res.json(allCustomers);
});

app.post('/api/customers', (req, res) => {
  const { name, email, phone, notes } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const newCustomer = customers.add(name, email, phone, notes);
  res.status(201).json(newCustomer);
});

app.get('/api/customers/:id', (req, res) => {
  const customer = customers.getById(req.params.id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  res.json(customer);
});

app.put('/api/customers/:id', (req, res) => {
  const customer = customers.update(req.params.id, req.body);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  res.json(customer);
});

app.get('/api/customers/:id/tasks', (req, res) => {
  const allTasks = tasks.getAll();
  const customerTasks = allTasks.filter(t => t.customerId === req.params.id);
  res.json(customerTasks);
});

// STATS API
app.get('/api/stats', (req, res) => {
  const allTasks = tasks.getAll();
  const allCustomers = customers.getAll();

  const stats = {
    totalTasks: allTasks.length,
    openTasks: allTasks.filter(t => t.status === 'open').length,
    doneTasks: allTasks.filter(t => t.status === 'done').length,
    totalCustomers: allCustomers.length
  };

  res.json(stats);
});

// USERS API
app.get('/api/users', (req, res) => {
  const allUsers = users.getAll();
  res.json(allUsers);
});

// Serve dashboard HTML
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>10dots CRM</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Arial', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    header {
      text-align: center;
      color: white;
      margin-bottom: 30px;
    }

    h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .card {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      transition: transform 0.3s ease;
    }

    .card:hover {
      transform: translateY(-5px);
    }

    .stat {
      text-align: center;
    }

    .stat-number {
      font-size: 2.5em;
      font-weight: bold;
      color: #667eea;
      margin: 10px 0;
    }

    .stat-label {
      color: #666;
      font-size: 0.9em;
    }

    .icon {
      font-size: 2em;
      margin-bottom: 10px;
    }

    .form-section {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      margin-bottom: 30px;
    }

    .form-section h2 {
      color: #333;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #667eea;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      color: #333;
      font-weight: bold;
    }

    input, textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-family: inherit;
      font-size: 1em;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
    }

    button {
      background: #667eea;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      transition: background 0.3s ease;
    }

    button:hover {
      background: #764ba2;
    }

    .list-section {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }

    .list-section h2 {
      color: #333;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #667eea;
    }

    .list-item {
      padding: 10px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .list-item:last-child {
      border-bottom: none;
    }

    .list-item-content {
      flex: 1;
    }

    .list-item-title {
      font-weight: bold;
      color: #333;
    }

    .list-item-meta {
      font-size: 0.85em;
      color: #999;
      margin-top: 5px;
    }

    .status {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 20px;
      font-size: 0.85em;
      font-weight: bold;
    }

    .status.open {
      background: #ffeaa7;
      color: #d63031;
    }

    .status.done {
      background: #55efc4;
      color: #00b894;
    }

    .loading {
      text-align: center;
      color: #999;
      padding: 20px;
    }

    @media (max-width: 768px) {
      h1 {
        font-size: 1.8em;
      }

      .grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>📊 10dots CRM</h1>
      <p>מערכת ניהול משימות ולקוחות</p>
    </header>

    <div class="grid" id="statsGrid">
      <div class="card stat">
        <div class="icon">📋</div>
        <div class="stat-number" id="totalTasks">0</div>
        <div class="stat-label">משימות כוללות</div>
      </div>
      <div class="card stat">
        <div class="icon">🔵</div>
        <div class="stat-number" id="openTasks">0</div>
        <div class="stat-label">משימות פתוחות</div>
      </div>
      <div class="card stat">
        <div class="icon">✅</div>
        <div class="stat-number" id="doneTasks">0</div>
        <div class="stat-label">משימות בוצעו</div>
      </div>
      <div class="card stat">
        <div class="icon">👥</div>
        <div class="stat-number" id="totalCustomers">0</div>
        <div class="stat-label">לקוחות</div>
      </div>
    </div>

    <div class="form-section">
      <h2>➕ הוסף משימה חדשה</h2>
      <form id="taskForm">
        <div class="form-group">
          <label for="taskTitle">כותרת המשימה *</label>
          <input type="text" id="taskTitle" placeholder="לדוגמה: קריאה ללקוח" required>
        </div>
        <div class="form-group">
          <label for="taskDescription">תיאור</label>
          <textarea id="taskDescription" placeholder="פרטים נוספים..." rows="3"></textarea>
        </div>
        <button type="submit">הוסף משימה</button>
      </form>
    </div>

    <div class="list-section">
      <h2>📋 משימות</h2>
      <div id="tasksList" class="loading">טוען...</div>
    </div>

    <br>

    <div class="form-section">
      <h2>➕ הוסף לקוח חדש</h2>
      <form id="customerForm">
        <div class="form-group">
          <label for="customerName">שם הלקוח *</label>
          <input type="text" id="customerName" placeholder="שם מלא" required>
        </div>
        <div class="form-group">
          <label for="customerEmail">אימייל</label>
          <input type="email" id="customerEmail" placeholder="email@example.com">
        </div>
        <div class="form-group">
          <label for="customerPhone">טלפון</label>
          <input type="tel" id="customerPhone" placeholder="05X-XXXXXXX">
        </div>
        <button type="submit">הוסף לקוח</button>
      </form>
    </div>

    <div class="list-section">
      <h2>👥 לקוחות</h2>
      <div id="customersList" class="loading">טוען...</div>
    </div>
  </div>

  <script>
    const API_URL = 'http://localhost:3000';

    async function loadStats() {
      try {
        const res = await fetch(API_URL + '/api/stats');
        const stats = await res.json();
        document.getElementById('totalTasks').textContent = stats.totalTasks;
        document.getElementById('openTasks').textContent = stats.openTasks;
        document.getElementById('doneTasks').textContent = stats.doneTasks;
        document.getElementById('totalCustomers').textContent = stats.totalCustomers;
      } catch (err) {
        console.error('Error loading stats:', err);
      }
    }

    async function loadTasks() {
      try {
        const res = await fetch(API_URL + '/api/tasks');
        const tasksList = await res.json();
        const container = document.getElementById('tasksList');

        if (tasksList.length === 0) {
          container.innerHTML = '<p class="loading">אין משימות כרגע</p>';
          return;
        }

        container.innerHTML = tasksList.map(task => \`
          <div class="list-item">
            <div class="list-item-content">
              <div class="list-item-title">\${task.title}</div>
              <div class="list-item-meta">
                <span class="status \${task.status}">\${task.status === 'open' ? 'פתוחה' : 'בוצעה'}</span>
                \${task.description ? \` • \${task.description}\` : ''}
              </div>
            </div>
          </div>
        \`).join('');
      } catch (err) {
        console.error('Error loading tasks:', err);
      }
    }

    async function loadCustomers() {
      try {
        const res = await fetch(API_URL + '/api/customers');
        const customersList = await res.json();
        const container = document.getElementById('customersList');

        if (customersList.length === 0) {
          container.innerHTML = '<p class="loading">אין לקוחות כרגע</p>';
          return;
        }

        container.innerHTML = customersList.map(customer => \`
          <div class="list-item">
            <div class="list-item-content">
              <div class="list-item-title">\${customer.name}</div>
              <div class="list-item-meta">
                \${customer.email ? \`📧 \${customer.email}\` : ''}
                \${customer.phone ? \` • 📱 \${customer.phone}\` : ''}
              </div>
            </div>
          </div>
        \`).join('');
      } catch (err) {
        console.error('Error loading customers:', err);
      }
    }

    document.getElementById('taskForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('taskTitle').value;
      const description = document.getElementById('taskDescription').value;

      try {
        const res = await fetch(API_URL + '/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description })
        });

        if (res.ok) {
          document.getElementById('taskForm').reset();
          loadTasks();
          loadStats();
        }
      } catch (err) {
        console.error('Error adding task:', err);
      }
    });

    document.getElementById('customerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('customerName').value;
      const email = document.getElementById('customerEmail').value;
      const phone = document.getElementById('customerPhone').value;

      try {
        const res = await fetch(API_URL + '/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone })
        });

        if (res.ok) {
          document.getElementById('customerForm').reset();
          loadCustomers();
          loadStats();
        }
      } catch (err) {
        console.error('Error adding customer:', err);
      }
    });

    // Load data on page load
    loadStats();
    loadTasks();
    loadCustomers();

    // Refresh every 5 seconds
    setInterval(() => {
      loadStats();
      loadTasks();
      loadCustomers();
    }, 5000);
  </script>
</body>
</html>
  `);
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ 10dots CRM API running on http://localhost:${PORT}`);
  });
}
