const { tasks, customers } = require('../db/storage');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const allTasks = tasks.getAll();
  const allCustomers = customers.getAll();

  const stats = {
    totalTasks: allTasks.length,
    openTasks: allTasks.filter(t => t.status === 'open').length,
    doneTasks: allTasks.filter(t => t.status === 'done').length,
    totalCustomers: allCustomers.length
  };

  res.status(200).json(stats);
};
