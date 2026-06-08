const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// نقوم باستيراد الميدل وير بشكل مفصل للتأكد
const auth = require('../middleware/authMiddleware');

// console.log("=== فحص الميدل وير في ملف المسارات ===");
// console.log("قيمة auth:", auth);
// console.log("قيمة auth.isAdmin:", auth.isAdmin);
// console.log("======================================");

// console.log("=== فحص Controller في المسارات ===");
// console.log("قيمة bookController:", bookController);
// console.log("هل getAdminPage دالة؟", typeof bookController.getAdminDashboard === 'function');
// console.log("==================================");
// استخدام auth.checkAuth، auth.isAdmin، auth.isTeacherOrAdmin
// بدلاً من الاستيراد المفكك الذي قد يسبب undefined إذا كان الملف غير محدث

router.get('/admin', auth.checkAuth, auth.isAdmin, bookController.getAdminDashboard);
router.post('/add', auth.checkAuth, auth.isAdmin, bookController.addBook);
router.post('/edit', auth.checkAuth, auth.isAdmin, bookController.postEditBook);
router.get('/delete/:id', auth.checkAuth, auth.isAdmin, bookController.deleteBook);

router.post('/categories/add', auth.checkAuth, auth.isAdmin, bookController.postAddCategory);
router.post('/categories/edit', auth.checkAuth, auth.isAdmin, bookController.postEditCategory);
router.get('/categories/delete/:id', auth.checkAuth, auth.isAdmin, bookController.postDeleteCategory);

router.get('/teacher', auth.checkAuth, auth.isTeacherOrAdmin, bookController.getTeacherBooks);
router.get('/view/:id', bookController.viewBook);
// مسار لعرض صفحة إدارة الكتب المنفصلة
// مسار لعرض صفحة إدارة الكتب المنفصلة
// مسار لعرض صفحة إدارة الكتب المنفصلة
// مسار لعرض صفحة إدارة الكتب المنفصلة باستخدام الـ Controller الفعلي للمشروع
router.get('/admin/books', auth.checkAuth, auth.isAdmin, bookController.getAdminBooksPage);
module.exports = router;