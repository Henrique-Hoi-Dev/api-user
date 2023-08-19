import jwt from 'jsonwebtoken';
import HttpStatus from 'http-status';
import { promisify } from 'util';

import authConfig from '../../config/auth';

// faz validação do usuário para que possa fazer mudanças no seu cadastro
export default async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'INVALID_TOKEN' });
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);

        req.userId = decoded.id;
        req.userProps = decoded;

        return next();
    } catch (err) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'INVALID_TOKEN' });
    }
};

export function verifyIfUserHasRole(role) {
    return function (req, res, next) {
        try {
            const user = req.userProps;

            if (user.type_role === 'MASTER') {
                next();
            } else {
                return res.status(HttpStatus.FORBIDDEN).json({ error: 'INVALID_ROLE' });
            }
        } catch (err) {
            next(err);
        }
    };
}
