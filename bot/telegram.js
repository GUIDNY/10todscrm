require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { query, initDB } = require('../db/postgres-storage');

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const helpText = `
📋 10dots CRM Bot - פקודות זמינות:

/add_task [משימה] - הוסף משימה חדשה
/tasks - ראה את כל המשימות
/add_customer [שם] - הוסף לקוח חדש
/customers - ראה את כל הלקוחות
/help - הצג עזרה

דוגמאות:
/add_task קריאה ללקוח X
/add_customer שם הלקוח
`;

// Get user ID from Telegram user info
function getUserId(telegramUser) {
  return telegramUser.id.toString();
}

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    await initDB();
    bot.sendMessage(chatId, `
שלום 👋 ${msg.from.first_name || 'משתמש'}!

ברוכים הבאים ל-10dots CRM!

זו מערכת ניהול משימות ולקוחות המחוברת לטלגרם.
${helpText}
    `);
  } catch (err) {
    console.error('Error in /start:', err);
    bot.sendMessage(chatId, '❌ שגיאה בחיבור למערכת');
  }
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, helpText);
});

bot.onText(/\/add_task (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const title = match[1];

  try {
    await initDB();
    const result = await query(
      `INSERT INTO tasks (user_id, title, status, priority)
       VALUES ($1, $2, $3, $4) RETURNING id, title`,
      [getUserId(msg.from), title, 'open', 'medium']
    );

    const task = result.rows[0];
    bot.sendMessage(chatId, `✅ משימה נוספה!\n\n📝 ${task.title}\nמזהה: ${task.id.substring(0, 8)}`);
  } catch (err) {
    console.error('Error in /add_task:', err);
    bot.sendMessage(chatId, '❌ שגיאה בהוספת משימה');
  }
});

bot.onText(/\/tasks/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    await initDB();
    const result = await query(
      'SELECT id, title, status, priority FROM tasks WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10',
      [getUserId(msg.from)]
    );

    if (result.rows.length === 0) {
      bot.sendMessage(chatId, '📭 אין משימות');
      return;
    }

    const tasksList = result.rows.map((task, i) =>
      `${i + 1}. ${task.title} (${task.status === 'done' ? '✅' : '⏳'})`
    ).join('\n');

    bot.sendMessage(chatId, `📋 המשימות שלך:\n\n${tasksList}`);
  } catch (err) {
    console.error('Error in /tasks:', err);
    bot.sendMessage(chatId, '❌ שגיאה בטעינת משימות');
  }
});

bot.onText(/\/add_customer (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const name = match[1];

  try {
    await initDB();
    const result = await query(
      `INSERT INTO customers (user_id, name)
       VALUES ($1, $2) RETURNING id, name`,
      [getUserId(msg.from), name]
    );

    const customer = result.rows[0];
    bot.sendMessage(chatId, `✅ לקוח נוסף!\n\n👤 ${customer.name}`);
  } catch (err) {
    console.error('Error in /add_customer:', err);
    bot.sendMessage(chatId, '❌ שגיאה בהוספת לקוח');
  }
});

bot.onText(/\/customers/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    await initDB();
    const result = await query(
      'SELECT id, name FROM customers WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10',
      [getUserId(msg.from)]
    );

    if (result.rows.length === 0) {
      bot.sendMessage(chatId, '👥 אין לקוחות');
      return;
    }

    const customersList = result.rows.map((customer, i) =>
      `${i + 1}. ${customer.name}`
    ).join('\n');

    bot.sendMessage(chatId, `👥 הלקוחות שלך:\n\n${customersList}`);
  } catch (err) {
    console.error('Error in /customers:', err);
    bot.sendMessage(chatId, '❌ שגיאה בטעינת לקוחות');
  }
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('🤖 Telegram bot started...');
