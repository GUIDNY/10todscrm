# 10dots CRM 📊

מערכת CRM אינטגרטיבית עם בוט טלגרם לניהול משימות, לקוחות ותקציבים.

## תכונות 🎯

- ✅ בוט טלגרם לעדכון מיידי
- 🌐 דוח לוח מחוונים ב-Vercel
- 👥 ניהול לקוחות
- 📋 ניהול משימות עם סטטוסים
- 📊 סטטיסטיקות בזמן אמת
- 💾 אחסון JSON פשוט (ניתן לעדכן ל-MongoDB)

## התקנה 🚀

### דרישות מוקדמות
- Node.js 14+
- npm

### צעדים

1. **התקן תלויות:**
```bash
cd 10dots-crm
npm install
```

2. **בדוק את `.env` ב-root:**
```
TELEGRAM_TOKEN=8654393904:AAEXwv5FcmEclsQaNyoXAlxhQxaZYf9So7k
PORT=3000
NODE_ENV=development
```

3. **הפעל את ה-API:**
```bash
npm run dev
```

4. **בטאב חדש - הפעל את הבוט:**
```bash
npm run bot
```

## שימוש 💡

### דרך טלגרם
```
/start - התחל
/add_task [משימה] - הוסף משימה
/tasks - ראה משימות
/done [מספר] - סימון כבוצע
/add_customer [שם] - הוסף לקוח
/customers - ראה לקוחות
/help - עזרה
```

### דרך לוח המחוונים
גש ל: `http://localhost:3000`

- הוסף משימות חדשות
- הוסף לקוחות חדשים
- ראה סטטיסטיקות בזמן אמת

## API Endpoints

### משימות
- `GET /api/tasks` - קבל כל משימות
- `POST /api/tasks` - הוסף משימה
- `PUT /api/tasks/:id/status` - עדכן סטטוס
- `DELETE /api/tasks/:id` - מחק משימה

### לקוחות
- `GET /api/customers` - קבל כל לקוחות
- `POST /api/customers` - הוסף לקוח
- `PUT /api/customers/:id` - עדכן לקוח
- `GET /api/customers/:id/tasks` - משימות לקוח

### סטטיסטיקות
- `GET /api/stats` - קבל סטטיסטיקות

## development 🔧

```bash
# הפעל את הבוט
npm run bot

# הפעל את ה-API
npm run dev
```

## Deployment ל-Vercel

1. צור repository ב-GitHub
2. חבר ל-Vercel
3. הגדר environment variables
4. Deploy!

## שיפורים עתידיים 🚀

- [ ] MongoDB integration
- [ ] אימות משתמשים
- [ ] דוחות מתקדמים
- [ ] צ'אט בטלגרם לעדכונים
- [ ] תקציבים וטעינת הוצאות
- [ ] API webhooks

---

**עדכון טוקן טלגרם:** לאחר השיתוף, עדכן את הטוקן דרך BotFather!
