const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { generateToken } = require('../utils/jwt');
const { AppError } = require('../middleware/errorMiddleware');

const SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS ? Number(process.env.BCRYPT_SALT_ROUNDS) : 10;

/**
 * Authenticates a user by email + password.
 * Returns { token, user } on success. Throws AppError(401) on invalid credentials.
 */
async function login(email, password) {
  const [rows] = await pool.execute(
    `SELECT u.user_id, u.email, u.password, u.role, s.name
     FROM users u LEFT JOIN students s ON s.user_id = u.user_id WHERE u.email = ?`,
    [email]
  );

  if (rows.length === 0) {
    throw new AppError('Invalid email or password', 401);
  }

  const user = rows[0];

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken({
    userId: user.user_id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      userId: user.user_id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
  };
}

async function register(fullName, email, password) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const [userResult] = await connection.execute(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, 'student']
    );
    await connection.execute(
      'INSERT INTO students (user_id, name, mobile_no) VALUES (?, ?, ?)',
      [userResult.insertId, fullName, '0000000000']
    );
    await connection.commit();

    const user = { userId: userResult.insertId, email, role: 'student', name: fullName };
    return { token: generateToken(user), user };
  } catch (err) {
    await connection.rollback();
    if (err.code === 'ER_DUP_ENTRY') throw new AppError('An account with this email already exists', 409);
    throw err;
  } finally {
    connection.release();
  }
}

async function createAdmin(email, password) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  try {
    const [result] = await pool.execute(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, 'admin']
    );
    return { userId: result.insertId, email, role: 'admin' };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') throw new AppError('An account with this email already exists', 409);
    throw err;
  }
}

module.exports = { login, register, createAdmin };
