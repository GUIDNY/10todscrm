const { tasks, customers } = require('../db/mongodb-storage');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const allTasks = await tasks.getAll();
    const allCustomers = await customers.getAll();

    const stats = {
      totalTasks: allTasks.length,
      openTasks: allTasks.filter(t => t.status === 'open').length,
      doneTasks: allTasks.filter(t => t.status === 'done').length,
      totalCustomers: allCustomers.length
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
