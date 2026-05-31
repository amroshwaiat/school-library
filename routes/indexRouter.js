const express = require('express');
const router = express.Router(); // هذا هو السطر الذي كان مفقوداً أو خاطئاً

// الآن يمكنك استخدام router
router.get('/about1', (req, res) => {
    res.render('about');
});

router.get('/team', (req, res) => {
    res.render('team');
});

module.exports = router; // تأكد من وجود هذا السطر في النهاية