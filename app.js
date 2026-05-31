// require('dotenv').config(); // يجب أن يكون في السطر الأول دائماً
// const express = require('express');
// const session = require('express-session');
// const path = require('path');

// const userController = require('./controllers/userController');
// const userRoutes = require('./routes/userRoutes');
// const bookRoutes = require('./routes/bookRoutes');
// const authRoutes = require('./routes/authRoutes');
// const bookController = require('./controllers/bookController');

// const app = express();
// app.use(express.json()); // ضروري جداً لقراءة الـ JSON

// // إعداد المحرك EJS
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // ملفات الاستايل والميديا العامة
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.urlencoded({ extended: true }));
// const indexRoutes = require('./routes/indexRouter'); // تأكد من المسار الصحيح لملف الروابط الخاص بك

// // ... بعد تعريف الـ app
// app.use('/', indexRoutes); // هذا السطر يخبر Express أن يستخدم الروابط الموجودة في هذا الملف
// // إعداد الجلسات (Sessions)
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'secret-key',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 24 * 60 * 60 * 1000 } // تنتهي بعد يوم واحد
// }));

// // جعل بيانات المستخدم متاحة في جميع صفحات الـ EJS بدون تمريرها يدوياً كل مرة
// app.use((req, res, next) => {
//     res.locals.user = req.session.user || null;
//     next();
// });

// // المسارات (Routes)
// app.use('/auth', authRoutes);
// app.use('/books', bookRoutes);
// app.use('/admin', userRoutes);

// // الصفحة الرئيسية للموقع (المكتبة العامة للجميع)
// app.get('/', bookController.getPublicBooks);

// // تشغيل السيرفر
// const PORT = process.env.PORT || 3000;
// const db = require('./config/db');
// const bcrypt = require('bcrypt');

// // async function updatePasswordsNow() {
// //     try {
// //         // توليد هاش جديد تماماً ومضمون للأدمن والمعلم
// //         const adminHash = await bcrypt.hash('admin123', 10);
// //         const teacherHash = await bcrypt.hash('teacher123', 10);

// //         // تنظيف الجدول وإعادة الإدخال بالقيم الجديدة المشفرة محلياً
// //         await db.query('TRUNCATE TABLE users;');
        
// //         await db.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', ['admin1', adminHash, 'admin']);
// //         await db.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', ['teacher1', teacherHash, 'teacher']);
        
// //         console.log('✨ [تحديث أمني] تم إعادة تشفير حسابات admin1 و teacher1 بنجاح من داخل السيرفر!');
// //     } catch (err) {
// //         console.error('خطأ أثناء التحديث التلقائي:', err);
// //     }
// // }

// // // استدعاء الدالة لتنفيذ التحديث فوراً عند تشغيل السيرفر
// // updatePasswordsNow();
// app.listen(PORT, () => {
//     console.log(`المكتبة تعمل بنجاح على الرابط التالي: http://localhost:${PORT}`);
// });
require('dotenv').config(); // يجب أن يكون في السطر الأول دائماً
const express = require('express');
const session = require('express-session');
const path = require('path');

const userController = require('./controllers/userController');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');
const bookController = require('./controllers/bookController');
const indexRoutes = require('./routes/indexRouter'); 

const app = express();

// 1. إعدادات قراءة البيانات والملفات العامة
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 2. إعداد المحرك EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 3. إعداد الجلسات (Sessions) - يجب أن تكون قبل المسارات حتماً!
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // تنتهي بعد يوم واحد
}));

// 4. جعل بيانات المستخدم متاحة في جميع صفحات الـ EJS
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// 5. تعريف المسارات (Routes) مرتبة

app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/admin', userRoutes);
app.use('/', indexRoutes); 

// الصفحة الرئيسية للموقع (المكتبة العامة للجميع)
app.get('/', bookController.getPublicBooks);

// 6. تشغيل السيرفر وقاعدة البيانات
const PORT = process.env.PORT || 3000;
const db = require('./config/db');
const bcrypt = require('bcrypt');

app.listen(PORT, () => {
    console.log(`المكتبة تعمل بنجاح على الرابط التالي: http://localhost:${PORT}`);
});