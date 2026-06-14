const crypto = require('crypto');
const { query, initDB } = require('./postgres-storage');

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const auth = {
  register: async (email, name, password) => {
    try {
      await initDB();
      const hashedPassword = hashPassword(password);

      const result = await query(
        'INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING id, email, name',
        [email.toLowerCase(), name, hashedPassword]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  },

  login: async (email, password) => {
    try {
      await initDB();
      const hashedPassword = hashPassword(password);

      const result = await query(
        'SELECT id, email, name FROM users WHERE email = $1 AND password = $2',
        [email.toLowerCase(), hashedPassword]
      );

      if (result.rows.length === 0) {
        throw new Error('Invalid credentials');
      }

      const user = result.rows[0];
      const token = generateToken();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await query(
        'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [user.id, token, expiresAt]
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  verify: async (token) => {
    try {
      await initDB();
      const result = await query(
        'SELECT u.id, u.email, u.name FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = $1 AND s.expires_at > NOW()',
        [token]
      );

      if (result.rows.length === 0) {
        throw new Error('Invalid or expired token');
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  },

  logout: async (token) => {
    try {
      await query('DELETE FROM sessions WHERE token = $1', [token]);
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = auth;
