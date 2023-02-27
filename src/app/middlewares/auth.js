import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

// faz validação do usuário para que possa fazer mudanças no seu cadastro
export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'User token not found' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;
    req.userProps = decoded;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'User token invalid' });
  }
};

export function verifyIfUserHasRole(role) {
  return function (req, res, next) {
    try {
      const user = req.userProps;

      if (user.type_role === 'MASTER') {
        next();
      } else {
        return res.status(401).json({ error: 'User not role "MASTER"' });
      }
    } catch (err) {
      next(err);
    }
  };
}
