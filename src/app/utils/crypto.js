import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const authenticatePassword = (plainTextPassword, encryptedPassword) =>
  bcrypt.compareSync(plainTextPassword, encryptedPassword);

export const encryptPassword = (password) => bcrypt.hashSync(password, 10);

export const generateRandomCode = (size = 3) =>
  crypto.randomBytes(size).toString('hex').toUpperCase();
