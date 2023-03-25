import * as Yup from 'yup';
import { Op, literal } from 'sequelize';

import Driver from '../models/Driver';
import FinancialStatements from '../models/FinancialStatements';

export default {
  async create(body) {
    const {
      name_user,
      password,
      name,
      value_fix = 0,
      percentage = 0,
      daily = 0,
    } = body;

    let data = {
      name_user: name_user.toLowerCase(),
      password,
      name,
      type_position: 'collaborator',
      credit: 0,
      value_fix,
      percentage,
      daily,
    };

    // doing name user verification
    const driverExist = await Driver.findOne({
      where: { name_user: body.name_user },
    });

    if (driverExist) throw Error('This driver name user already exists.');

    const schema = Yup.object().shape({
      name_user: Yup.string().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(data))) throw Error('Validation failed!');

    await Driver.create(data);

    return { msg: 'successful' };
  },

  async getAllSelect(req, res) {
    const select = await Driver.findAll({
      where: {
        id: {
          [Op.notIn]: literal(
            `(SELECT "driver_id" FROM "financial_statements")`
          ),
        },
      },
      attributes: ['id', 'name'],
    });

    const selectFinancial = await Driver.findAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: FinancialStatements,
          as: 'financialStatements',
          required: true,
          where: {
            status: false,
          },
          attributes: ['id', 'driver_id', 'driver_name'],
        },
      ],
    });

    return {
      dataResult: [...select.concat(...selectFinancial)],
    };
  },

  async getAll(query) {
    const {
      page = 1,
      limit = 100,
      sort_order = 'ASC',
      sort_field = 'id',
      name,
      id,
      search,
    } = query;

    const where = {};
    // if (id) where.id = id;

    const total = (await Driver.findAll()).length;
    const totalPages = Math.ceil(total / limit);

    const drivers = await Driver.findAll({
      where: search
        ? {
            [Op.or]: [
              // { id: search },
              { truck: { [Op.iLike]: `%${search}%` } },
              { name: { [Op.iLike]: `%${search}%` } },
            ],
          }
        : where,
      order: [[sort_field, sort_order]],
      limit: limit,
      offset: page - 1 ? (page - 1) * limit : 0,
      attributes: [
        'id',
        'name',
        'name_user',
        'credit',
        'value_fix',
        'percentage',
        'daily',
        'cart',
        'truck',
      ],
    });

    const currentPage = Number(page);

    return {
      dataResult: drivers,
      total,
      totalPages,
      currentPage,
    };
  },

  async getId(id) {
    const driver = await Driver.findByPk(id, {
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

    if (!driver) throw Error('Driver not found');

    return {
      dataResult: driver,
    };
  },

  async update(body, id) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      oldPassword: Yup.string().min(8),
      password: Yup.string()
        .min(8)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(body))) throw Error('Validation failed!');

    const { oldPassword } = body;

    const driver = await Driver.findByPk(id);

    if (oldPassword && !(await driver.checkPassword(oldPassword)))
      throw Error('Password does not match!');

    await driver.update(body);

    const driverResult = await Driver.findByPk(id, {
      attributes: [
        'id',
        'name',
        'name_user',
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

    return {
      dataResult: driverResult,
    };
  },

  async delete(id) {
    const driver = await Driver.destroy({
      where: {
        id: id,
      },
    });

    if (!driver) throw Error('Driver not found');

    return {
      responseData: { msg: 'Deleted driver' },
    };
  },
};
