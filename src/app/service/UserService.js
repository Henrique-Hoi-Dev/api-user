import * as Yup from 'yup';
import { Op } from 'sequelize';

import User from '../models/User';
import Permission from '../models/Permission';

export default {
  async create(body) {
    let { email, name, password } = body;

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(8),
    });

    if (!(await schema.isValid(body))) throw Error('Validation failed!');

    // doing email verification
    const userExist = await User.findOne({ where: { email: email } });

    if (userExist) throw Error('This user email already exists.');

    const resultUser = await User.create({
      name,
      email,
      password,
    });

    const addPermissions = await Permission.findOne({
      where: { role: resultUser.type_role },
    });

    await resultUser.update({
      permission_id: addPermissions.id,
    });

    return { msg: 'Registered User Successful!' };
  },

  async getAll(query) {
    const {
      page = 1,
      limit = 100,
      sort_order = 'ASC',
      sort_field = 'name',
      name,
      id,
    } = query;

    const where = {};
    if (name) where.name = { [Op.iLike]: '%' + name + '%' };
    if (id) where.id = id;

    const total = (await User.findAll()).length;
    const totalPages = Math.ceil(total / limit);

    const users = await User.findAll({
      where: where,
      order: [[sort_field, sort_order]],
      limit: limit,
      offset: page - 1 ? (page - 1) * limit : 0,
      attributes: ['id', 'name', 'email', 'type_role'],
      include: {
        model: Permission,
        as: 'permissions',
        attributes: ['id', 'role', 'actions'],
      },
    });

    const currentPage = Number(page);

    return {
      dataResult: users,
      total,
      totalPages,
      currentPage,
    };
  },

  async getId(id) {
    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'type_role'],
      include: {
        model: Permission,
        as: 'permissions',
        attributes: ['id', 'role', 'actions'],
      },
    });

    if (!user) throw Error('User not found');

    return { dataResult: user };
  },

  async update(body, id) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
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

    const { email, oldPassword } = body;

    const user = await User.findByPk(id);

    if (email !== user.email) {
      const userExist = await User.findOne({ where: { email } });

      if (userExist) throw Error('This user email already exists.');
    }

    if (oldPassword && !(await user.checkPassword(oldPassword)))
      throw Error('Password does not match!');

    await user.update({
      name: body.name,
      password: body.password,
      confirmPassword: body.confirmPassword,
    });

    const userResult = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'type_role'],
    });

    return { dataResult: userResult };
  },

  async addRole(body, id) {
    const user = await User.findByPk(id);

    if (!user) throw Error('User not found');

    await user.update({
      type_role: body.role.toUpperCase(),
    });

    const addPermissions = await Permission.findOne({
      where: { role: user.type_role },
    });

    await user.update({
      permission_id: addPermissions.id,
    });

    return { msg: 'successful' };
  },

  async delete(id) {
    const user = await User.destroy({
      where: {
        id: id,
      },
    });

    if (!user) throw Error('User not found');

    return { msg: 'Deleted user' };
  },
};
