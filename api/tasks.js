const { tasks } = require('../db/storage');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const allTasks = tasks.getAll();
    const status = req.query.status;
    if (status) {
      const filtered = allTasks.filter(t => t.status === status);
      return res.status(200).json(filtered);
    }
    return res.status(200).json(allTasks);
  }

  if (req.method === 'POST') {
    const { title, description, customerId, dueDate } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const newTask = tasks.add(title, description, customerId, dueDate);
    return res.status(201).json(newTask);
  }

  res.status(405).json({ error: 'Method not allowed' });
};
