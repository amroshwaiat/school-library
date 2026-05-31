// const db = require('../config/db');
// const path = require('path');

// // 🌟 دالة مساعدة مطورة ومرنة لاستخراج غلاف الكتاب من أي شكل لرابط Google Drive
// function extractGoogleDriveCover(pdfUrl, providedImageUrl) {
//     // 1. إذا قام الأدمن بإدخال رابط صورة يدوي حقيقي، نعتمد عليه فوراً
//     if (providedImageUrl && typeof providedImageUrl === 'string' && providedImageUrl.trim() !== '') {
//         return providedImageUrl.trim();
//     }

//     try {
//         if (pdfUrl && typeof pdfUrl === 'string' && pdfUrl.trim() !== '') {
//             // التعبير النمطي المحدث ليلقط الـ ID حتى لو انتهى الرابط بـ /preview أو /view
//             const matches = pdfUrl.match(/(?:https:\/\/drive\.google\.com\/(?:file\/d\/|open\?id=)|d\/)([a-zA-Z0-9_-]{25,45})/);
            
//             if (matches && matches[1]) {
//                 const fileId = matches[1];
//                 // توليد رابط المصغرة بجودة ممتازة
//                 return `https://drive.google.com/thumbnail?id=${fileId}&sz=w500`;
//             }
//         }
//     } catch (error) {
//         console.error("خطأ أثناء استخراج غلاف Google Drive:", error);
//     }

//     // 2. إذا لم ينجح الاستخراج، نضع رابط صورة كتاب افتراضية عامة
//     return 'https://cdn-icons-png.flaticon.com/512/330/330731.png';
// }

// // عرض الكتب العامة للجميع (محدث لجلب الأقسام مع الفلتر الديناميكي)
// exports.getPublicBooks = async (req, res) => {
//     try {
//         const query = `
//             SELECT books.*, categories.name AS category_name 
//             FROM books 
//             LEFT JOIN categories ON books.category_id = categories.id 
//             WHERE books.is_teacher_only = FALSE
//         `;
//         const booksResult = await db.query(query);
//         const categoriesResult = await db.query('SELECT * FROM categories ORDER BY id ASC');
        
//         res.render('index', { 
//             books: booksResult.rows, 
//             categories: categoriesResult.rows, 
//             user: req.session.user 
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("خطأ في تحميل الكتب العامة");
//     }
// };

// // 1. استقبال وحفظ التعديلات الجديدة للكتاب (معدل لمعالجة الـ Checkbox واستخراج الغلاف تلقائياً)
// exports.postEditBook = async (req, res) => {
//     const { id, title, pdf_url, image_url, is_teacher_only, category_id } = req.body;
    
//     const teacherOnly = (is_teacher_only === 'on' || is_teacher_only === 'true' || is_teacher_only === true || is_teacher_only === '1');
//     const catId = category_id ? parseInt(category_id) : null;

//     // ✨ السحر يعمل هنا عند التعديل
//     const finalImageUrl = extractGoogleDriveCover(pdf_url, image_url);

//     try {
//         await db.query(
//             'UPDATE books SET title = $1, pdf_url = $2, image_url = $3, is_teacher_only = $4, category_id = $5 WHERE id = $6',
//             [title, pdf_url, finalImageUrl, teacherOnly, catId, id]
//         );
//         console.log(`✨ تم تحديث بيانات وفئة القسم للكتاب رقم [${id}] وتوليد الغلاف بنجاح!`);
//         res.redirect('/books/admin');
//     } catch (err) {
//         console.error("خطأ أثناء تعديل فئة الكتاب المعلمين/العام والأقسام:", err);
//         res.status(500).send("حدث خطأ بالسيرفر أثناء تعديل البيانات.");
//     }
// };

// // 2. حذف كتاب نهائياً من النظام
// exports.deleteBook = async (req, res) => {
//     const bookId = req.params.id;
//     try {
//         await db.query('DELETE FROM books WHERE id = $1', [bookId]);
//         console.log(`🗑️ تم حذف الكتاب رقم [${bookId}] من قاعدة البيانات!`);
//         res.redirect('/books/admin');
//     } catch (err) {
//         console.error("خطأ حرج أثناء حذف الكتاب:", err);
//         res.status(500).send("حدث خطأ بالسيرفر أثناء عملية الحذف.");
//     }
// };

// // صفحة المعلم (يظهر فيها كتب المعلمين فقط مع الأقسام)
// exports.getTeacherBooks = async (req, res) => {
//     try {
//         const booksResult = await db.query('SELECT * FROM books WHERE is_teacher_only = TRUE');
//         const categoriesResult = await db.query('SELECT * FROM categories ORDER BY id ASC');
        
//         res.render('teacher-books', { 
//             books: booksResult.rows, 
//             categories: categoriesResult.rows, 
//             user: req.session.user 
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("خطأ في تحميل كتب المعلمين");
//     }
// };

// // لوحة تحكم الأدمن
// exports.getAdminDashboard = async (req, res) => {
//     try {
//         const query = `
//             SELECT books.*, categories.name AS category_name 
//             FROM books 
//             LEFT JOIN categories ON books.category_id = categories.id
//         `;
//         const books = await db.query(query);
//         const users = await db.query('SELECT id, username, role FROM users');
//         const categories = await db.query('SELECT * FROM categories');
        
//         res.render('admin', { 
//             books: books.rows, 
//             users: users.rows, 
//             categories: categories.rows 
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("خطأ في جلب البيانات");
//     }
// };

// // 🛠️ إضافة كتاب جديد - تم إصلاح الميزة وتفعيل دالة الغلاف السحرية هنا أيضاً!
// exports.addBook = async (req, res) => {
//     try {
//         const { title, pdf_url, image_url, category_id, is_teacher_only } = req.body;
        
//         const teacherOnly = (is_teacher_only === 'true' || is_teacher_only === 'on' || is_teacher_only === true); 
//         const catId = category_id ? parseInt(category_id) : null;

//         // 🌟 استدعاء الدالة هنا لتقوم بالتقاط الغلاف أوتوماتيكياً قبل عملية الـ INSERT
//         const finalImageUrl = extractGoogleDriveCover(pdf_url, image_url);

//         await db.query(
//             'INSERT INTO books (title, pdf_url, image_url, category_id, is_teacher_only) VALUES ($1, $2, $3, $4, $5)',
//             [title, pdf_url, finalImageUrl, catId, teacherOnly]
//         );
        
//         console.log(`✨ تم إضافة كتاب جديد واستخراج غلافه التلقائي بنجاح!`);
//         res.redirect('/books/admin');
//     } catch (err) {
//         console.error("حدث خطأ أثناء إضافة الكتاب وتوليد الغلاف:", err);
//         res.status(500).send("حدث خطأ أثناء إضافة الكتاب");
//     }
// };

// // فتح صفحة قارئ الكتب المحمية المخصصة
// exports.viewBook = async (req, res) => {
//     const bookId = req.params.id;
//     try {
//         const result = await db.query('SELECT * FROM books WHERE id = $1', [bookId]);
//         if (result.rows.length > 0) {
//             const book = result.rows[0];
//             if (book.is_teacher_only && !req.session.user) {
//                 return res.status(403).send("غير مصرح لك بقراءة هذا الكتاب");
//             }
//             res.render('viewer', { book: book });
//         } else {
//             res.status(404).send("الكتاب غير موجود");
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("خطأ في فتح القارئ");
//     }
// };

// // =================================================================
// // التحكم بالأقسام
// // =================================================================

// // 1. إضافة قسم جديد
// exports.postAddCategory = async (req, res) => {
//     const { category_name } = req.body;
//     try {
//         await db.query('INSERT INTO categories (name) VALUES ($1)', [category_name]);
//         res.redirect('/books/admin');
//     } catch (err) {
//         console.error("خطأ أثناء إضافة قسم جديد:", err);
//         res.status(500).send("حدث خطأ بالسيرفر أثناء إضافة القسم.");
//     }
// };

// // 2. تعديل اسم قسم حالي
// exports.postEditCategory = async (req, res) => {
//     const { id, name } = req.body;
//     try {
//         await db.query('UPDATE categories SET name = $1 WHERE id = $2', [name, id]);
//         res.redirect('/books/admin');
//     } catch (err) {
//         console.error("خطأ أثناء تعديل القسم:", err);
//         res.status(500).send("حدث خطأ بالسيرفر أثناء تعديل القسم.");
//     }
// };

// // 3. حذف قسم نهائياً
// exports.postDeleteCategory = async (req, res) => {
//     const catId = req.params.id;
//     try {
//         await db.query('DELETE FROM categories WHERE id = $1', [catId]);
//         res.redirect('/books/admin');
//     } catch (err) {
//         console.error("خطأ أثناء حذف القسم:", err);
//         res.status(500).send("حدث خطأ بالسيرفر أثناء حذف القسم.");
//     }
// };
const db = require('../config/db');
const path = require('path');

// 🌟 دالة مساعدة مطورة ومرنة لاستخراج غلاف الكتاب من أي شكل لرابط Google Drive
function extractGoogleDriveCover(pdfUrl, providedImageUrl) {
    // 1. إذا قام الأدمن بإدخال رابط صورة يدوي حقيقي، نعتمد عليه فوراً
    if (providedImageUrl && typeof providedImageUrl === 'string' && providedImageUrl.trim() !== '') {
        return providedImageUrl.trim();
    }

    try {
        if (pdfUrl && typeof pdfUrl === 'string' && pdfUrl.trim() !== '') {
            // التعبير النمطي المحدث ليلقط الـ ID حتى لو انتهى الرابط بـ /preview أو /view
            const matches = pdfUrl.match(/(?:https:\/\/drive\.google\.com\/(?:file\/d\/|open\?id=)|d\/)([a-zA-Z0-9_-]{25,45})/);
            
            if (matches && matches[1]) {
                const fileId = matches[1];
                // توليد رابط المصغرة بجودة ممتازة
                return `https://drive.google.com/thumbnail?id=${fileId}&sz=w500`;
            }
        }
    } catch (error) {
        console.error("خطأ أثناء استخراج غلاف Google Drive:", error);
    }

    // 2. إذا لم ينجح الاستخراج، نضع رابط صورة كتاب افتراضية عامة
    return 'https://cdn-icons-png.flaticon.com/512/330/330731.png';
}

// عرض الكتب العامة للجميع (محدث لجلب الأقسام والمستويات والمواد مع الفلتر الديناميكي)
exports.getPublicBooks = async (req, res) => {
    try {
        const query = `
            SELECT books.*, categories.name AS category_name 
            FROM books 
            LEFT JOIN categories ON books.category_id = categories.id 
            WHERE books.is_teacher_only = FALSE
        `;
        const booksResult = await db.query(query);
        const categoriesResult = await db.query('SELECT * FROM categories ORDER BY id ASC');
        
        res.render('index', { 
            books: booksResult.rows, 
            categories: categoriesResult.rows, 
            user: req.session.user 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("خطأ في تحميل الكتب العامة");
    }
};

// 1. استقبال وحفظ التعديلات الجديدة للكتاب (معدل لاستقبال وحفظ level و subject_id)
exports.postEditBook = async (req, res) => {
    // 🌟 تم إضافة level و subject_id هنا
    const { id, title, pdf_url, image_url, is_teacher_only, category_id, level, subject_id } = req.body;
    
    const teacherOnly = (is_teacher_only === 'on' || is_teacher_only === 'true' || is_teacher_only === true || is_teacher_only === '1');
    const catId = category_id ? parseInt(category_id) : null;
    const bookLevel = level ? level.trim() : null;
    const bookSubject = subject_id ? subject_id.trim() : null;

    // ✨ السحر يعمل هنا عند التعديل
    const finalImageUrl = extractGoogleDriveCover(pdf_url, image_url);

    try {
        // 🌟 تحديث الاستعلام ليشمل الأعمدة الجديدة بالتنسيق المتوافق مع PostgreSQL
        const query = `
            UPDATE books 
            SET title = $1, pdf_url = $2, image_url = $3, is_teacher_only = $4, category_id = $5, level = $6, subject_id = $7 
            WHERE id = $8
        `;
        await db.query(query, [title, pdf_url, finalImageUrl, teacherOnly, catId, bookLevel, bookSubject, id]);
        
        console.log(`✨ تم تحديث بيانات الكتاب رقم [${id}] وتعديل المستوى والمادة بنجاح!`);
      // اذهب للسطر 59 تقريباً واستبدله بـ:
res.redirect('/books/admin/books');
    } catch (err) {
        console.error("خطأ أثناء تعديل بيانات الكتاب والأقسام والمستويات:", err);
        res.status(500).send("حدث خطأ بالسيرفر أثناء تعديل البيانات.");
    }
};

// 2. حذف كتاب نهائياً من النظام
exports.deleteBook = async (req, res) => {
    const bookId = req.params.id;
    try {
        await db.query('DELETE FROM books WHERE id = $1', [bookId]);
        console.log(`🗑️ تم حذف الكتاب رقم [${bookId}] من قاعدة البيانات!`);
    // اذهب للسطر 59 تقريباً واستبدله بـ:
res.redirect('/books/admin/books');
    } catch (err) {
        console.error("خطأ حرج أثناء حذف الكتاب:", err);
        res.status(500).send("حدث خطأ بالسيرفر أثناء عملية الحذف.");
    }
};

// صفحة المعلم (محدثة لجلب حقول المستويات والمواد أيضاً)
exports.getTeacherBooks = async (req, res) => {
    try {
        const query = `
            SELECT books.*, categories.name AS category_name 
            FROM books 
            LEFT JOIN categories ON books.category_id = categories.id 
            WHERE books.is_teacher_only = TRUE
        `;
        const booksResult = await db.query(query);
        const categoriesResult = await db.query('SELECT * FROM categories ORDER BY id ASC');
        
        res.render('teacher-books', { 
            books: booksResult.rows, 
            categories: categoriesResult.rows, 
            user: req.session.user 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("خطأ في تحميل كتب المعلمين");
    }
};

// لوحة تحكم الأدمن (محدثة للتأكد من جلب الأعمدة الجديدة وعرضها بالجدول)
// لوحة تحكم الأدمن (محدثة للتأكد من جلب الأعمدة الجديدة وعرضها بالجدول وطباعة الحسابات)
exports.getAdminDashboard = async (req, res) => {
    try {
        const query = `
            SELECT books.*, categories.name AS category_name 
            FROM books 
            LEFT JOIN categories ON books.category_id = categories.id
            ORDER BY books.id DESC
        `;
        const books = await db.query(query);
        const users = await db.query('SELECT id, username, role FROM users');
        const categories = await db.query('SELECT * FROM categories ORDER BY id ASC');
        
        // 🔍 سطر الفحص الذكي: سيطبع لك الحسابات الـ 5 الموجودة حالياً في الـ Terminal لتعرف من الغائب!
        console.log("👥 الحسابات المقروءة حالياً من قاعدة البيانات:", users.rows);
        
        res.render('admin', { 
            books: books.rows, 
            users: users.rows, 
            categories: categories.rows 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("خطأ في جلب البيانات للوحة التحكم");
    }
};
// 🛠️ إضافة كتاب جديد - تم تحديث الاستعلام لحفظ قيم الـ Level والـ Subject في السيرفر وقاعدة البيانات!
exports.addBook = async (req, res) => {
    try {
        // 🌟 استخراج البيانات القادمة من فورم لوحة التحكم الجديد
        const { title, pdf_url, image_url, category_id, is_teacher_only, level, subject_id } = req.body;
        
        const teacherOnly = (is_teacher_only === 'true' || is_teacher_only === 'on' || is_teacher_only === true); 
        const catId = category_id ? parseInt(category_id) : null;
        const bookLevel = level ? level.trim() : null;
        const bookSubject = subject_id ? subject_id.trim() : null;

        // 🌟 استدعاء دالة التقاط غلاف جوجل درايف تلقائياً قبل الحفظ
        const finalImageUrl = extractGoogleDriveCover(pdf_url, image_url);

        // 🌟 إدراج البيانات في قاعدة البيانات مع الأعمدة الجديدة
        const query = `
            INSERT INTO books (title, pdf_url, image_url, category_id, is_teacher_only, level, subject_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        await db.query(query, [title, pdf_url, finalImageUrl, catId, teacherOnly, bookLevel, bookSubject]);
        
        console.log(`✨ تم إضافة كتاب جديد بنجاح وتصنيفه تحت المادة والمستوى المطلق!`);
      // اذهب للسطر 59 تقريباً واستبدله بـ:
res.redirect('/books/admin/books');
    } catch (err) {
        console.error("حدث خطأ أثناء إضافة الكتاب وتوليد الغلاف:", err);
        res.status(500).send("حدث خطأ أثناء إضافة الكتاب");
    }
};

// فتح صفحة قارئ الكتب المحمية المخصصة
exports.viewBook = async (req, res) => {
    const bookId = req.params.id;
    try {
        const result = await db.query('SELECT * FROM books WHERE id = $1', [bookId]);
        if (result.rows.length > 0) {
            const book = result.rows[0];
            if (book.is_teacher_only && !req.session.user) {
                return res.status(403).send("غير مصرح لك بقراءة هذا الكتاب");
            }
            res.render('viewer', { book: book });
        } else {
            res.status(404).send("الكتاب غير موجود");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("خطأ في فتح القارئ");
    }
};

// =================================================================
// التحكم بالأقسام
// =================================================================

// 1. إضافة قسم جديد
exports.postAddCategory = async (req, res) => {
    const { category_name } = req.body;
    try {
        await db.query('INSERT INTO categories (name) VALUES ($1)', [category_name]);
        res.redirect('/books/admin');
    } catch (err) {
        console.error("خطأ أثناء إضافة قسم جديد:", err);
        res.status(500).send("حدث خطأ بالسيرفر أثناء إضافة القسم.");
    }
};

// 2. تعديل اسم قسم حالي
exports.postEditCategory = async (req, res) => {
    const { id, name } = req.body;
    try {
        await db.query('UPDATE categories SET name = $1 WHERE id = $2', [name, id]);
        res.redirect('/books/admin');
    } catch (err) {
        console.error("خطأ أثناء تعديل القسم:", err);
        res.status(500).send("حدث خطأ بالسيرفر أثناء تعديل القسم.");
    }
};

// 3. حذف قسم نهائياً
exports.postDeleteCategory = async (req, res) => {
    const catId = req.params.id;
    try {
        await db.query('DELETE FROM categories WHERE id = $1', [catId]);
        res.redirect('/books/admin');
    } catch (err) {
        console.error("خطأ أثناء حذف القسم:", err);
        res.status(500).send("حدث خطأ بالسيرفر أثناء حذف القسم.");
    }
};
// دالة مخصصة لجلب البيانات وعرض لوحة إدارة الكتب المنفصلة
exports.getAdminBooksPage = async (req, res) => {
    try {
        // جلب الكتب مع اسم القسم الخاص بها بمرونة تتوافق مع نظام مشروعك
        const booksResult = await db.query(`
            SELECT books.*, categories.name AS category_name 
            FROM books 
            LEFT JOIN categories ON books.category_id = categories.id
            ORDER BY books.id DESC
        `);
        
        // جلب جميع الأقسام لتغذية قائمة الخيارات (Select) في نموذج الإضافة
        const categoriesResult = await db.query('SELECT * FROM categories ORDER BY name ASC');

        // استخراج المصفوفات بشكل آمن يتوافق مع PostgreSQL
        const books = booksResult.rows || [];
        const categories = categoriesResult.rows || [];

        // رندر لصفحة إدارة الكتب المنفصلة وتمرير البيانات الحقيقية لها
        return res.render('admin-books', { books: books, categories: categories });

    } catch (error) {
        console.error("❌ خطأ أثناء تحميل صفحة إدارة الكتب الحقيقية:", error);
        return res.status(500).send("حدث خطأ في السيرفر أثناء جلب بيانات المستودع");
    }
};