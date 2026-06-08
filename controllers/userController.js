const db = require('../config/db');
const bcrypt = require('bcrypt');

// جلب جميع المستخدمين
exports.getAllUsers = async (req, res) => {
    try {
        const users = await db.query('SELECT id, username, role FROM users');
        res.render('admin-users', { users: users.rows });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).send("حدث خطأ أثناء جلب قائمة المستخدمين.");
    }
};
exports.addUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        // console.log("Adding user:", username); // للتأكد أن البيانات تصل

        // التأكد من أن قاعدة البيانات تعمل
        const existingUser = await db.query('SELECT id FROM users WHERE username = $1', [username]);
        
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ success: false, message: "اسم المستخدم موجود مسبقاً!" });
        }

        const hash = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
            [username, hash, role]
        );
        
        return res.json({ success: true, message: "تم إضافة المستخدم بنجاح!" });
    } catch (err) {
        console.error("Detailed Server Error:", err); // هذا السطر سيطبع الخطأ الحقيقي في الـ Terminal
        return res.status(500).json({ success: false, message: "حدث خطأ في السيرفر." });
    }
};
// تحديث الدور
exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        await db.query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
        res.redirect('/admin/users');
    } catch (err) {
        console.error("Error updating role:", err);
        res.status(500).send("حدث خطأ أثناء تحديث الصلاحية.");
    }
};

// // حذف مستخدم
// exports.deleteUser = async (req, res) => {
//     try {
//         await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
//         res.redirect('/admin/users');
//     } catch (err) {
//         console.error("Error deleting user:", err);
//         res.status(500).send("حدث خطأ أثناء حذف المستخدم.");
//     }
// };
// حذف مستخدم مع حماية "الأدمن الأخير"
exports.deleteUser = async (req, res) => {
    try {
        const userIdToDelete = req.params.id;

        // 1. التحقق: كم عدد الأدمن الموجودين في قاعدة البيانات؟
        const adminCountResult = await db.query('SELECT COUNT(*) FROM users WHERE role = $1', ['admin']);
        const adminCount = parseInt(adminCountResult.rows[0].count);

        // 2. جلب رتبة المستخدم الذي نريد حذفه
        const userToDeleteResult = await db.query('SELECT role FROM users WHERE id = $1', [userIdToDelete]);
        
        if (userToDeleteResult.rows.length === 0) {
            return res.status(404).send("المستخدم غير موجود.");
        }

        const roleOfUserToDelete = userToDeleteResult.rows[0].role;

        // 3. الشرط: إذا كان الأدمن الوحيد، امنع الحذف
        if (roleOfUserToDelete === 'admin' && adminCount <= 1) {
            return res.status(403).send("لا يمكنك حذف المدير الوحيد للنظام! يجب أن يبقى مدير واحد على الأقل.");
        }

        // 4. تنفيذ الحذف إذا كانت الشروط سليمة
        await db.query('DELETE FROM users WHERE id = $1', [userIdToDelete]);
        res.redirect('/admin/users');

    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).send("حدث خطأ أثناء حذف المستخدم.");
    }
};

// تغيير كلمة السر
exports.resetPassword = async (req, res) => {
    try {
        const { id, newPassword } = req.body;
        // التحقق من أن كلمة السر ليست فارغة
        if (!newPassword || newPassword.length < 4) {
            return res.status(400).send("كلمة السر يجب أن تكون 4 أحرف على الأقل.");
        }
        const hash = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE users SET password = $1 WHERE id = $2', [hash, id]);
        res.redirect('/admin/users');
    } catch (err) {
        console.error("Error resetting password:", err);
        res.status(500).send("حدث خطأ أثناء تغيير كلمة السر.");
    }
};