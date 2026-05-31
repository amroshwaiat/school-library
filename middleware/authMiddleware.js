// middleware/authMiddleware.js

const checkAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/auth/login');
    }
};

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('ليس لديك صلاحية للوصول إلى هذه الصفحة');
    }
};

const isTeacherOrAdmin = (req, res, next) => {
    if (req.session.user && (req.session.user.role === 'teacher' || req.session.user.role === 'admin')) {
        next();
    } else {
        res.status(403).send('هذه الصفحة خاصة بالمعلمين والإدارة فقط');
    }
};

// تصدير الكل معاً بشكل صحيح
module.exports = {
    checkAuth,
    isAdmin,
    isTeacherOrAdmin
};