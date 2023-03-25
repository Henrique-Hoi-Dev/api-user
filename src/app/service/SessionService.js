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

    if (!(await schema.isValid(body))) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        msg: 'Validation failed!',
      };
      return result;
    }

    const { email, password } = body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'User not found' };
      return result;
    }

    if (!(await user.checkPassword(password)))
      throw Error('Password is incorrect');

    const { id, name, type_role, permission_id } = user;

    const permissions = await Permission.findByPk(permission_id, {
      attributes: ['role', 'actions'],
    });

    const userProps = { id, name, email, type_role, permissions },
      token = jwt.sign(
        { id, name, email, type_role, permissions },
        authConfig.secret,
        {
          expiresIn: authConfig.expiresIn,
        }
      );

    return { dataResult: { userProps, token } };
  },
};
