const { customers } = require('../db/storage');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const allCustomers = customers.getAll();
    return res.status(200).json(allCustomers);
  }

  if (req.method === 'POST') {
    const { name, email, phone, notes } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const newCustomer = customers.add(name, email, phone, notes);
    return res.status(201).json(newCustomer);
  }

  res.status(405).json({ error: 'Method not allowed' });
};
