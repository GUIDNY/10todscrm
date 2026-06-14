require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { tasks, customers, users } = require('../db/mongodb-storage');

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const helpText = `
📋 10dots CRM Bot - פקודות זמינות:

/add_task [משימה] - הוסף משימה חדשה
/tasks - ראה את כל המשימות
/done [מספר] - סימון משימה כבוצעה
/add_customer [שם] - הוסף לקוח חדש
/customers - ראה את כל הלקוחות
/help - הצג עזרה

דוגמאות:
/add_task קריאה ללקוח X
/add_customer שם הלקוח
`;

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  users.addOrUpdate(msg.from.id, {
    username: msg.from.username || 'unknown',
    firstName: msg.from.first_name,
    chatId: chatId
  });

  bot.sendMessage(chatId, `
שלום 👋 ${msg.from.first_name || 'משתמש'}!

ברוכים הבאים ל-10dots CRM!

זו מערכת ניהול משימות ולקוחות המחוברת לטלגרם.
${helpText}
  `);
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, helpText);
});

bot.onText(/\/add_task (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const title = match[1];

  const newTask = tasks.add(title);
  bot.sendMessage(chatId, `✅ משימה נוספה!\n\n📝 ${newTask.title}\nמזהה: ${newTask.id.substring(0, 8)}`);
});

bot.onText(/\/tasks/, (msg) => {
  const chatId = msg.chat.id;
  const allTasks = tasks.getAll();

  if (allTasks.length === 0) {
    bot.sendMessage(chatId, 'אין משימות כרגע 📭');
    return;
  }

  let message = '📋 רשימת משימות:\n\n';
  allTasks.forEach((task, index) => {
    const status = task.status === 'done' ? '✅' : '🔵';
    message += `${index + 1}. ${status} ${task.title}\n`;
    if (task.description) message += `   📝 ${task.description}\n`;
  });

  message += '\n💡 הקלד /done [מספר] כדי לסמן משימה כבוצעה';
  bot.sendMessage(chatId, message);
});

bot.onText(/\/done (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const taskIndex = parseInt(match[1]) - 1;
  const allTasks = tasks.getAll();

  if (taskIndex < 0 || taskIndex >= allTasks.length) {
    bot.sendMessage(chatId, '❌ משימה לא נמצאה');
    return;
  }

  const task = allTasks[taskIndex];
  tasks.updateStatus(task.id, 'done');
  bot.sendMessage(chatId, `✅ משימה סומנה כבוצעה: ${task.title}`);
});

bot.onText(/\/add_customer (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const name = match[1];

  const newCustomer = customers.add(name);
  bot.sendMessage(chatId, `✅ לקוח נוסף!\n\n👤 ${newCustomer.name}`);
});

bot.onText(/\/customers/, (msg) => {
  const chatId = msg.chat.id;
  const allCustomers = customers.getAll();

  if (allCustomers.length === 0) {
    bot.sendMessage(chatId, 'אין לקוחות כרגע 📭');
    return;
  }

  let message = '👥 רשימת לקוחות:\n\n';
  allCustomers.forEach((customer, index) => {
    message += `${index + 1}. ${customer.name}\n`;
    if (customer.email) message += `   📧 ${customer.email}\n`;
    if (customer.phone) message += `   📱 ${customer.phone}\n`;
  });

  bot.sendMessage(chatId, message);
});

bot.on('message', (msg) => {
  // Handle messages that don't match any pattern
  if (msg.text && !msg.text.startsWith('/')) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    users.addOrUpdate(userId, {
      username: msg.from.username || 'unknown',
      firstName: msg.from.first_name,
      lastMessage: msg.text,
      chatId: chatId
    });
  }
});

console.log('🤖 Telegram Bot started!');
console.log('Bot is polling for messages...');
