import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import httpStatus from 'http-status-codes';

import User from '../models/User';
import authConfig from '../../config/auth';
import Permission from '../models/Permission';

export default {

  async sessionUser(req, res) {
    let result = {}
    let body = req

    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(body))) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Validation failed!' };
      return result
    }

    const { email, password } = body;
    
    const user = await User.findOne({ where: { email } });

    if (!user) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'User not found' }      
      return result
    }

    if (!(await user.checkPassword(password))) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Password is incorrect' }      
      return result
    }

    const { id, name, type_role, permission_id } = user;

    const permissions = await Permission.findByPk(permission_id, { attributes: ["role", "actions"]})

    const users = { id, name, email, type_role, permissions },
      token = jwt.sign({ id, type_role, permissions }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    result = { httpStatus: httpStatus.OK, dataResult: {users, token} }      
    return result
  },
}
