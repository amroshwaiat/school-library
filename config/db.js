const { Pool } = require('pg');

// وضع البيانات مباشرة للتأكد من تخطي مشكلة قراءة الـ .env
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'school_library',
//     password: '147258369', // تم تمريرها كنص صريح (String)
//     port: 5432,
// });


const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // هنا نستخدم الرابط مباشرة
});
// فحص الاتصال
pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ خطأ حرج في الاتصال بقاعدة البيانات:', err.stack);
    }
    console.log('✅ تم الاتصال بقاعدة البيانات PostgreSQL بنجاح وبدأت المتعة!');
    release();
});

module.exports = pool;