import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import httpStatus from 'http-status-codes';

import User from '../models/User';
import authConfig from '../../config/auth';
import Permission from '../models/Permission';

export default {
    async sessionUser(body) {
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        });

        if (!(await schema.isValid(body))) throw Error('VALIDATION_ERROR');

        const { email, password } = body;

        const user = await User.findOne({ where: { email } });

        if (!user) throw Error('USER_NOT_FOUND');

        if (!(await user.checkPassword(password))) throw Error('INVALID_USER_PASSWORD');

        const { id, name, type_role, permission_id } = user;

        const permissions = await Permission.findByPk(permission_id, {
            attributes: ['role', 'actions'],
        });

        const token = jwt.sign({ id, name, email, type_role, permissions }, authConfig.secret, {
            expiresIn: authConfig.expiresIn,
        });

        return { dataResult: { token } };
    },
};
