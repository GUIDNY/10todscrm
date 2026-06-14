# Deployment to Vercel 🚀

## שלבים להעלאה ל-Vercel

### 1️⃣ גש לדשבורד של Vercel
https://vercel.com/guidnys-projects

### 2️⃣ Import מ-GitHub
- לחץ על "Add New..."
- בחר "Project"
- בחר "Import Git Repository"
- בחר: `GUIDNY/10todscrm`

### 3️⃣ הגדר Enviroment Variables
לפני הדיפלוי, הוסף:

**Name:** `TELEGRAM_TOKEN`  
**Value:** `8654393904:AAEXwv5FcmEclsQaNyoXAlxhQxaZYf9So7k`

(או החלף בטוקן חדש אם החלפת)

### 4️⃣ תצורה
- **Framework Preset:** Node.js
- **Build Command:** `npm install`
- **Output Directory:** `.`
- **Install Command:** `npm install`

### 5️⃣ Deploy!
לחץ על "Deploy" - תמתין 2-3 דקות

---

## אחרי הדיפלוי ✅

### Dashboard יהיה available ב:
```
https://10todscrm.vercel.app
```
(או כל דומיין שהיצקת)

### Bot יחזור לעבודה
- הבוט יתחיל לעבוד מן הענן
- כל בקשה בטלגרם תשלח ל-Vercel

---

## עדכון קוד

כלשום תעדכן את הקוד:

1. עדכן locally
2. Commit
3. Push ל-GitHub
4. Vercel ידויק אוטומטית 🔄

```bash
git add .
git commit -m "Update description"
git push origin main
```

---

## דלבוגינג (אם יש בעיות)

### בדוק logs ב-Vercel:
1. גש ל-Vercel Dashboard
2. בחר את הפרויקט
3. "Deployments" tab
4. ראה את ה-logs

### בדוק Environment Variables:
Settings → Environment Variables → וודא שה-token שם

### בוט לא מגיב?
- בדוק שה-token נכון
- בדוק את Vercel logs

---

## MongoDB (אופציונלי בעתיד)

אם תרצה להחליף מ-JSON ל-MongoDB:

1. צור MongoDB Atlas cluster
2. הוסף `MONGODB_URI` ל-environment variables
3. עדכן `db/storage.js` להשתמש ב-MongoDB

---

## דומיין Custom (אופציונלי)

אם יש לך דומיין משלך:
1. Vercel Dashboard → Settings
2. "Domains"
3. הוסף דומיין משלך

---

**עזרה?** תשאל! 💬
