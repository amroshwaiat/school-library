// const express = require('express');
// const router = express.Router(); // هذا هو السطر الذي كان مفقوداً أو خاطئاً
// const bookController = require('../controllers/bookController'); // تأكد من المسار

// // هذا هو المسار الذي تحتاجه ليختفي خطأ Cannot GET /
// router.get('/', bookController.getPublicBooks);
// // الآن يمكنك استخدام router
// router.get('/about1', (req, res) => {
//     res.render('about');
// });

// router.get('/team', (req, res) => {
//     res.render('team');
// });

const express = require('express');
const router = express.Router(); // هذا السطر هو الذي كان مفقوداً
const db = require('../config/db'); // يجب استيراد قاعدة البيانات هنا أيضاً
const bookController = require('../controllers/bookController');

// دالة زيادة العداد
router.get('/', async (req, res, next) => {
    try {
        // زيادة الرقم في قاعدة البيانات
        await db.query('UPDATE site_stats SET views = views + 1 WHERE id = 1');
    } catch (err) {
        console.error("خطأ في تحديث العداد:", err);
    }
    // ثم عرض الكتب
    bookController.getPublicBooks(req, res, next);
});

// باقي الصفحات
router.get('/about1', (req, res) => {
    res.render('about');
});

router.get('/team', (req, res) => {
    res.render('team');
});

module.exports = router;