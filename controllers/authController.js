const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.getLogin = (req, res) => {
    res.render('login', { error: null });
};



exports.addTeacher = async (req, res) => {
    try {
        const { username, password, ministerial_number } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await db.query(
            'INSERT INTO users (username, password, ministerial_number, role) VALUES ($1, $2, $3, $4)', 
            [username, hashedPassword, ministerial_number, 'teacher']
        );
        res.redirect('/admin'); // تأكد أن هذا المسار يطابق تعريفك في app.js
    } catch (error) {
        console.error(error);
        res.status(500).send("خطأ أثناء إضافة المعلم");
    }
};

exports.deleteTeacher = async (req, res) => {
    try {
        await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send("خطأ أثناء حذف المعلم");
    }
};

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (isMatch) {
                req.session.user = user;
                return user.role === 'admin' ? res.redirect('/books/admin') : res.redirect('/books/teacher');
            }
        }
        res.render('login', { error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    } catch (err) {
        console.error(err);
        res.send("خطأ في السيرفر");
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};