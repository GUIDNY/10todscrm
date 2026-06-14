require('dotenv').config();
const app = require('./api/index.js');

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ 10dots CRM API running on http://localhost:${PORT}`);
  });
}

module.exports = app;
