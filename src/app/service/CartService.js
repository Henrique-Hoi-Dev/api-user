import { Op, literal } from 'sequelize';

import Cart from '../models/Cart';
import FinancialStatements from '../models/FinancialStatements';

export default {
  async create(body) {
    const chassisExist = await Cart.findOne({
      where: { cart_chassis: body.cart_chassis },
    });
    if (chassisExist) throw Error('This chassis cart already exists.');

    const boardExist = await Cart.findOne({
      where: { cart_board: body.cart_board },
    });
    if (boardExist) throw Error('This board cart already exists.');

    await Cart.create(body);

    return { msg: 'successful' };
  },

  async getAll(query) {
    const {
      page = 1,
      limit = 100,
      sort_order = 'ASC',
      sort_field = 'id',
      cart_models,
      id,
      search,
    } = query;

    const where = {};
    // if (id) where.id = id;

    const total = (await Cart.findAll()).length;
    const totalPages = Math.ceil(total / limit);

    const carts = await Cart.findAll({
      where: search
        ? {
            [Op.or]: [
              // { id: search },
              { cart_color: { [Op.iLike]: `%${search}%` } },
              { cart_models: { [Op.iLike]: `%${search}%` } },
              { cart_year: { [Op.iLike]: `%${search}%` } },
              { cart_brand: { [Op.iLike]: `%${search}%` } },
            ],
          }
        : where,
      order: [[sort_field, sort_order]],
      limit: limit,
      offset: page - 1 ? (page - 1) * limit : 0,
      attributes: [
        'id',
        'cart_models',
        'cart_brand',
        'cart_tara',
        'cart_color',
        'cart_bodyworks',
        'cart_year',
        'cart_chassis',
        'cart_liter_capacity',
        'cart_ton_capacity',
        'cart_board',
      ],
    });

    const currentPage = Number(page);

    return {
      dataResult: carts,
      total,
      totalPages,
      currentPage,
    };
  },

  async getAllSelect(req, res) {
    const select = await Cart.findAll({
      where: {
        id: {
          [Op.notIn]: literal(`(SELECT "cart_id" FROM "financial_statements")`),
        },
      },
      attributes: ['id', 'cart_models'],
    });

    const selectFinancial = await Cart.findAll({
      attributes: ['id', 'cart_models'],
      include: [
        {
          model: FinancialStatements,
          as: 'financialStatements',
          required: true,
          where: {
            status: false,
          },
          attributes: ['id', 'cart_id', 'cart_models'],
        },
      ],
    });

    return {
      dataResult: [...select.concat(...selectFinancial)],
    };
  },

  async getId(id) {
    let cart = await Cart.findByPk(id, {
      attributes: [
        'id',
        'cart_models',
        'cart_brand',
        'cart_tara',
        'cart_color',
        'cart_bodyworks',
        'cart_year',
        'cart_chassis',
        'cart_liter_capacity',
        'cart_ton_capacity',
        'cart_board',
      ],
    });

    if (!cart) throw Error('Cart not found');

    return {
      dataResult: cart,
    };
  },

  async update(body, id) {
    const cart = await Cart.findByPk(id);

    await cart.update(body);

    const cartResult = await Cart.findByPk(id, {
      attributes: [
        'id',
        'cart_models',
        'cart_brand',
        'cart_tara',
        'cart_color',
        'cart_bodyworks',
        'cart_year',
        'cart_chassis',
        'cart_liter_capacity',
        'cart_ton_capacity',
        'cart_board',
      ],
    });

    return {
      dataResult: cartResult,
    };
  },

  async delete(id) {
    const cart = await Cart.destroy({
      where: {
        id: id,
      },
    });

    if (!cart) throw Error('Cart not found');

    return {
      responseData: { msg: 'Deleted cart' },
    };
  },
};
