import { Op, literal } from 'sequelize';

import FinancialStatements from '../models/FinancialStatements';
import Truck from '../models/Truck';

export default {
  async create(body) {
    let {
      truck_models,
      truck_name_brand,
      truck_board,
      truck_color,
      truck_km,
      truck_chassis,
      truck_year,
      truck_avatar,
    } = body;

    const chassisExist = await Truck.findOne({
      where: { truck_chassis: truck_chassis },
    });
    if (chassisExist) throw Error('This chassis truck already exists.');

    const boardExist = await Truck.findOne({
      where: { truck_board: truck_board },
    });

    if (boardExist) throw Error('This board truck already exists.');

    const data = {
      truck_models,
      truck_name_brand,
      truck_board,
      truck_color,
      truck_km,
      truck_chassis,
      truck_year,
      truck_avatar,
    };

    await Truck.create(data);

    return { msg: 'successful' };
  },

  async getAllSelect(req, res) {
    const select = await Truck.findAll({
      where: {
        id: {
          [Op.notIn]: literal(
            `(SELECT "truck_id" FROM "financial_statements")`
          ),
        },
      },
      attributes: ['id', 'truck_models'],
    });

    const selectFinancial = await Truck.findAll({
      attributes: ['id', 'truck_models'],
      include: [
        {
          model: FinancialStatements,
          as: 'financialStatements',
          required: true,
          where: {
            status: false,
          },
          attributes: ['id', 'truck_id', 'truck_models'],
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
      // truck_models,
      // id,
      search,
    } = query;

    const where = {};
    // if (id) where.id = id;

    const trucks = await Truck.findAll({
      where: search
        ? {
            [Op.or]: [
              // { id: search },
              { truck_name_brand: { [Op.iLike]: `%${search}%` } },
              { truck_year: { [Op.iLike]: `%${search}%` } },
              { truck_color: { [Op.iLike]: `%${search}%` } },
              { truck_models: { [Op.iLike]: `%${search}%` } },
            ],
          }
        : where,
      order: [[sort_field, sort_order]],
      limit: limit,
      offset: page - 1 ? (page - 1) * limit : 0,
      attributes: [
        'id',
        'truck_models',
        'truck_name_brand',
        'truck_board',
        'truck_km',
        'truck_color',
        'truck_chassis',
        'truck_year',
        'truck_avatar',
      ],
    });

    const total = await Truck.count();
    const totalPages = Math.ceil(total / limit);

    const currentPage = Number(page);

    return {
      dataResult: trucks,
      total,
      totalPages,
      currentPage,
    };
  },

  async getId(id) {
    const truck = await Truck.findByPk(id, {
      attributes: [
        'id',
        'truck_models',
        'truck_name_brand',
        'truck_board',
        'truck_km',
        'truck_color',
        'truck_chassis',
        'truck_year',
        'truck_avatar',
      ],
    });

    if (!truck) throw Error('Truck not found');

    return {
      dataResult: truck,
    };
  },

  async update(body, id) {
    const {
      truck_models,
      truck_name_brand,
      truck_color,
      truck_km,
      truck_year,
      truck_avatar,
    } = body;

    // const chassisExist = await Truck.findOne({ where: { truck_chassis: truck_chassis } });
    // const boardExist = await Truck.findOne({ where: { truck_board: truck_board } });

    // if (chassisExist) {
    //   result = { httpStatus: httpStatus.CONFLICT, msg: 'This chassis truck already exists.' };
    //   return result;
    // }

    // if (boardExist) {
    //   result = { httpStatus: httpStatus.CONFLICT, msg: 'This board truck already exists.' };
    //   return result;
    // }

    const data = {
      truck_models,
      truck_name_brand,
      truck_color,
      truck_km,
      truck_year,
      truck_avatar,
    };

    const truck = await Truck.findByPk(id);
    await truck.update(data);

    const truckResult = await Truck.findByPk(id, {
      attributes: [
        'id',
        'truck_models',
        'truck_name_brand',
        'truck_board',
        'truck_km',
        'truck_color',
        'truck_chassis',
        'truck_year',
        'truck_avatar',
      ],
    });

    return {
      dataResult: truckResult,
    };
  },

  async delete(id) {
    const truck = await Truck.destroy({
      where: {
        id: id,
      },
    });

    if (!truck) throw Error('Truck not found');

    return {
      responseData: { msg: 'Deleted truck' },
    };
  },
};
