const mongoose = require('mongoose');
const { User, Session } = require('./models');
const crypto = require('crypto');

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

const ensureConnected = async () => {
  if (mongoose.connection.readyState !== 1) {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not configured');
    }
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 1,
      });
    } catch (error) {
      console.error('MongoDB connection error:', error.message);
      throw new Error('Database connection failed: ' + error.message);
    }
  }
};

const auth = {
  register: async (email, name, password) => {
    try {
      await ensureConnected();
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = hashPassword(password);
      const newUser = await User.create({
        email: email.toLowerCase(),
        name,
        password: hashedPassword
      });

      return newUser.toObject();
    } catch (error) {
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      await ensureConnected();
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        throw new Error('User not found');
      }

      const hashedPassword = hashPassword(password);
      if (user.password !== hashedPassword) {
        throw new Error('Invalid password');
      }

      const token = crypto.randomBytes(32).toString('hex');
      const session = await Session.create({
        userId: user._id.toString(),
        token
      });

      return {
        token: session.token,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name
        }
      };
    } catch (error) {
      throw error;
    }
  },

  verify: async (token) => {
    try {
      await ensureConnected();
      const session = await Session.findOne({ token });
      if (!session) {
        throw new Error('Invalid token');
      }

      if (new Date() > session.expiresAt) {
        await Session.deleteOne({ _id: session._id });
        throw new Error('Token expired');
      }

      const user = await User.findById(session.userId);
      if (!user) {
        throw new Error('User not found');
      }

      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name
      };
    } catch (error) {
      throw error;
    }
  },

  logout: async (token) => {
    try {
      await ensureConnected();
      await Session.deleteOne({ token });
    } catch (error) {
      throw error;
    }
  }
};

module.exports = auth;
