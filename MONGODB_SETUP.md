# MongoDB Atlas Setup Guide 🍃

## שלבים להכנת MongoDB

### 1️⃣ צור חשבון ב-MongoDB Atlas
https://account.mongodb.com/account/register

- בחר Email/Password
- אימות דוא"ל
- יצירת ארגון חדש

### 2️⃣ צור Cluster חינמי
1. לחץ **"Create"** ← **"Clusters"**
2. בחר **M0 (Free)**
3. בחר Region: **EU (Ireland)** או הקרוב ביותר
4. לחץ **"Create Cluster"** - תמתין 2-3 דקות

### 3️⃣ הרשה קשר מהרשת
1. **Network Access** בתפריט הצד
2. **Add IP Address**
3. בחר **Allow access from anywhere** (0.0.0.0/0)
4. **Confirm**

### 4️⃣ צור משתמש בסיס נתונים
1. **Database Users** בתפריט
2. **Add New Database User**
3. בחר **Password**
4. Username: `10dots` (או בחרת)
5. Password: (בחר סיסמה חזקה) 
6. **Grant any role** ← **Built-in Role**
7. **Add User**

### 5️⃣ קבל Connection String
1. **Clusters** → **Connect**
2. **Drivers** → **Node.js**
3. בחר version: `4.0+`
4. **Copy** את Connection String

יראה כך:
```
mongodb+srv://10dots:PASSWORD@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

### 6️⃣ עדכן את .env
```bash
MONGODB_URI=mongodb+srv://10dots:PASSWORD@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

### 7️⃣ עדכן ב-Vercel
1. Vercel Dashboard → Project Settings
2. **Environment Variables**
3. הוסף:
   - **Name:** `MONGODB_URI`
   - **Value:** (הConnection String שלך)
4. **Save**
5. Redeploy

---

## ✅ בדיקה

**מקומי:**
```bash
npm run dev
# ודא ש: ✅ MongoDB connected
```

**ב-Vercel:**
```bash
curl https://10dots-crm.vercel.app/api/stats
# אמור להחזיר JSON עם stats
```

---

## 🎉 סיים!

כעת:
- ✅ MongoDB מחובר
- ✅ POST requests עובדים
- ✅ Vercel זמין ב-production
- ✅ בוט טלגרם עובד

---

## 💡 עצות

- **סיסמה**: הכנס סיסמה חזקה
- **IP Whitelist**: למעתק כדי להגביל ל-IP ספציפיות
- **Backup**: MongoDB Atlas משמרת automatic backups
- **Scaling**: כשאתה גדל, upgrade ל-M2/M5

---

אם יש בעיות, בדוק את:
- Network Access מופעל
- Username/Password נכונים
- Connection String נוכחי
