import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import httpStatus from 'http-status-codes';

import User from '../app/models/User';
import authConfig from '../config/auth';
import authDriverConfig from '../config/authDriver';
import Driver from '../app/models/Driver';

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
    
    const user = await User.findOne({  where: { email } });

    if (!user) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'User not found' }      
      return result
    }

    if (!(await user.checkPassword(password))) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Password is incorrect' }      
      return result
    }

    const { id, name, type_position, cpf } = user;

    const users = { id, name, email, type_position, cpf },
      token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: {users, token} }      
    return result
  },

  async sessionDriver(req, res) {
    let result = {}

    let { name_user, password } = req

    let body = { name_user: name_user.toLowerCase(), password }

    const schema = Yup.object().shape({
      name_user: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(body))) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Validation failed!' };
      return result
    }

    const driver = await Driver.findOne({ where: { name_user: body.name_user } });

    if (!driver) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Driver not found' }      
      return result
    }

    if (!(driver.dataValues.type_position === "collaborator")) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: "You do not have permission to log into this account" }
      return result
    }

    if (!(await driver.checkPassword(password))) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Password is incorrect' }      
      return result
    }

    const { id, cpf, date_admission, type_position } = driver;

    const drivers = { id, name_user, cpf, date_admission, type_position },
      token = jwt.sign({ id }, authDriverConfig.secret, {
      expiresIn: authDriverConfig.expiresIn,
    });

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: {drivers, token} }      
    return result
  }
}
