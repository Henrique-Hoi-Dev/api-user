import * as Yup from 'yup';
import httpStatus from 'http-status-codes';

import Driver from "../app/models/Driver";

export default {
  async createDriver(req, res) {
    let result = {}

    let { name_user, password, name, value_fix = 0, percentage = 0, daily = 0 } = req;

    let body = { 
      name_user: name_user.toLowerCase(), 
      password, 
      name, 
      type_position: "collaborator",
      credit: 0,
      value_fix,
      percentage,
      daily,
    }

    // doing name user verification
    const driverExist = await Driver.findOne({ where: { name_user: body.name_user } });

    if (driverExist) {
      result = { httpStatus: httpStatus.CONFLICT, msg: 'This driver name user already exists.' };
      return result;
    }

    const schema = Yup.object().shape({
      name_user: Yup.string().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(body))) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Validation failed!' };
      return result
    }

    await Driver.create(body);

    result = { httpStatus: httpStatus.OK, status: "successful" }      
    return result
  },

  async getAllDriver(req, res) {
    let result = {}

    const { page = 1, limit = 100, sort_order = 'ASC', sort_field = 'id' } = req.query;
    const total = (await Driver.findAll()).length;

    const totalPages = Math.ceil(total / limit);

    const drivers = await Driver.findAll({
      order: [[ sort_field, sort_order ]],
      limit: limit,
      offset: (page - 1) ? (page - 1) * limit : 0,
      attributes: [ 
        'id',
        'name',
        "name_user",
        'credit',
        'value_fix',
        'percentage',
        'daily',
        'cart',
        'truck',
      ],
    });

    const currentPage = Number(page)

    result = { 
      httpStatus: httpStatus.OK, 
      status: "successful", 
      total, 
      totalPages, 
      currentPage, 
      dataResult: drivers
    } 

    return result
  },

  async getIdDriver(req, res) {
    let result = {}

    let driver = await Driver.findByPk(req.id, {
      attributes: [ 
        'id',
        'name', 
        'number_cnh', 
        'valid_cnh', 
        'date_valid_mopp', 
        'date_valid_nr20', 
        'date_valid_nr35', 
        'cpf', 
        'date_admission', 
        'date_birthday', 
        'credit',
        'value_fix',
        'percentage',
        'daily',
      ],  
    });

    if (!driver) {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Driver not found' }}      
      return result
    }

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: driver }      
    return result
  },

  async updateDriver(req, res) {   
    let result = {}

    let drivers = req
    let driverId = res.id

    const schema = Yup.object().shape({
        name: Yup.string(),
        oldPassword: Yup.string().min(8),
        password: Yup.string().min(8).when('oldPassword', (oldPassword, field) => oldPassword ? field.required() : field),
        confirmPassword: Yup.string().when('password', (password, field) => password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(drivers))) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Validation failed!' };
      return result
    }

    const { oldPassword } = drivers ;
    
    const driver = await Driver.findByPk(driverId);

    if (oldPassword && !(await driver.checkPassword(oldPassword))) {
      result = { httpStatus: httpStatus.METHOD_FAILURE, msg: 'Password does not match!' };
      return result;
    }

    await driver.update(drivers);

    const driverResult = await Driver.findByPk(driverId, {
      attributes: [
        'id',
        'name',
        "name_user",
        'number_cnh', 
        'valid_cnh', 
        'date_valid_mopp', 
        'date_valid_nr20', 
        'date_valid_nr35', 
        'cpf', 
        'date_admission', 
        'date_birthday', 
        'credit',
        'value_fix',
        'percentage',
        'daily',
      ],
    });

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: driverResult }      
    return result
  },
  
  async deleteDriver(req, res) {
    let result = {}
    
    const id  = req.id;

    const driver = await Driver.destroy({
      where: {
        id: id,
      },
    });

    if (!driver) {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Driver not found' }}      
      return result
    }

    result = {httpStatus: httpStatus.OK, status: "successful", responseData: { msg: 'Deleted driver' }}      
    return result
  }
}