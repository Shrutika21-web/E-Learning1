/**
 * database/generateSeedHashes.js
 *
 * Run this AFTER `npm install` (needs bcryptjs, which is a project dependency).
 * It hashes the seed passwords and prints INSERT statements with real bcrypt
 * hashes, which you can paste into / run against mern_db instead of the
 * placeholder hashes in seed.sql.
 *
 * Usage:
 *   npm run seed:hashes
 *   # or
 *   node database/generateSeedHashes.js
 */
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

const users = [
  { email: 'admin@mern.com', password: 'admin123', role: 'admin' },
  { email: 'student1@gmail.com', password: 'stud123', role: 'student', name: 'Rahul Sharma', mobile: '9876543210' },
  { email: 'student2@gmail.com', password: 'stud123', role: 'student', name: 'Priya Verma', mobile: '9123456780' },
  { email: 'student3@gmail.com', password: 'stud123', role: 'student', name: 'Amit Singh', mobile: '9988776655' },
];

(async () => {
  console.log('-- Generated seed INSERT statements (bcrypt hashes, salt rounds = 10)');
  console.log('USE mern_db;\n');

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, SALT_ROUNDS);
    console.log(`-- ${u.email} / plain password: ${u.password}`);
    console.log(`INSERT INTO users (email, password, role) VALUES ('${u.email}', '${hash}', '${u.role}');`);
  }

  console.log('\n-- After running the INSERTs above, look up the resulting user_id values');
  console.log('-- for the student accounts (SELECT user_id, email FROM users;) and use them below:\n');

  const students = users.filter((u) => u.role === 'student');
  students.forEach((s, i) => {
    console.log(`-- INSERT INTO students (user_id, name, mobile_no) VALUES (<user_id_for_${s.email}>, '${s.name}', '${s.mobile}');`);
  });
})();
