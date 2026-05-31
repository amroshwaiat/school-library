const express = require('express');
const router = express.Router(); // هذا هو السطر الذي كان مفقوداً أو خاطئاً
const bookController = require('../controllers/bookController'); // تأكد من المسار

// هذا هو المسار الذي تحتاجه ليختفي خطأ Cannot GET /
router.get('/', bookController.getPublicBooks);
// الآن يمكنك استخدام router
router.get('/about1', (req, res) => {
    res.render('about');
});

router.get('/team', (req, res) => {
    res.render('team');
});

module.exports = router; // تأكد من وجود هذا السطر في النهاية