# Quick Start Guide 🚀

## מה בנינו?

מערכת CRM מלאה עם שתי ממשקים:

### 1️⃣ **בוט טלגרם** 🤖
- פקודות פשוטות להוסיף משימות ולקוחות
- עדכון מיידי מטלגרם לשרת
- תצוגת משימות ולקוחות בצורה נוחה

### 2️⃣ **לוח מחוונים (Dashboard)** 📊
- ממשק יפה לניהול משימות ולקוחות
- סטטיסטיקות בזמן אמת
- פורמים להוסיף/לנהל נתונים
- ממשק RTL בעברית

---

## התחלה עכשיו ⚡

### שלב 1: בדוק שהשרתים רצים
```bash
# בטאב 1 - API
npm run dev

# בטאב 2 - Bot
npm run bot
```

### שלב 2: גש ל-Dashboard
פתח בדפדפן:
```
http://localhost:3000
```

תראה:
- 📊 סטטיסטיקות בזמן אמת
- ✏️ טופס להוסף משימה
- ✏️ טופס להוסף לקוח
- 📋 רשימת משימות
- 👥 רשימת לקוחות

### שלב 3: בוט טלגרם

חפש את הבוט שלך בטלגרם בשם (או לפי ID):
```
Bot Username: [תלוי בשם שיצרת ב-BotFather]
```

נסה את הפקודות:
```
/start
/add_task קריאה ללקוח חדש
/tasks
/add_customer שם הלקוח
/customers
```

---

## מבנה הפרויקט 📁

```
10dots-crm/
├── api/
│   └── index.js          # Express server + Dashboard
├── bot/
│   └── telegram.js       # Telegram bot
├── db/
│   └── storage.js        # Data management (JSON)
├── db/data/              # Data files (created at runtime)
├── package.json
├── .env                  # Config (Telegram token)
└── README.md
```

---

## API Endpoints 🔌

### שמורות (Tasks)
```
GET  /api/tasks                    # קבל הכל
POST /api/tasks                    # הוסף חדשה
PUT  /api/tasks/:id/status         # עדכן סטטוס
DELETE /api/tasks/:id              # מחק
```

### לקוחות (Customers)
```
GET  /api/customers                # קבל הכל
POST /api/customers                # הוסף חדש
PUT  /api/customers/:id            # עדכן
GET  /api/customers/:id/tasks      # משימות של לקוח
```

### סטטיסטיקות
```
GET  /api/stats                    # נתונים סטטיסטיים
```

---

## דוגמה: זרימת עבודה 💼

1. **בטלגרם:** `/add_task קריאה ללקוח X`
   ↓
2. **Backend:** שמור בקובץ JSON
   ↓
3. **Dashboard:** המשימה מופיעה מיד ✅

---

## עדכונים עתידיים 🎯

- [ ] MongoDB integration
- [ ] אימות (Login/Sign up)
- [ ] תקציבים
- [ ] דוחות
- [ ] Webhook notifications
- [ ] Mobile app

---

## עזרה 🆘

**הבוט לא מגיב?**
```bash
# בדוק שזה רץ
npm run bot
```

**ה-Dashboard לא עדכן?**
```bash
# בדוק את ה-API
curl http://localhost:3000/health
```

**צריך להחליף טוקן?**
1. עדכן ב-.env
2. הפעל מחדש את הבוט

---

Enjoy! 🎉
