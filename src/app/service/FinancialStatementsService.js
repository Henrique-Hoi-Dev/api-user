import httpStatus from 'http-status-codes';
import { Op } from 'sequelize';
import { isAfter, parseISO } from 'date-fns';

import Driver from '../models/Driver';
import Truck from '../models/Truck';
import Cart from '../models/Cart';
import Freight from '../models/Freight';
import Notification from '../models/Notification';
import FinancialStatements from '../models/FinancialStatements';
import User from '../models/User';

export default {
  async createFinancialStatements(user, body) {
    let result = {};

    let { driver_id, truck_id, cart_id, start_date } = body;

    const [userAdm, driver, truck, cart] = await Promise.all([
      User.findByPk(user.userId),
      Driver.findByPk(driver_id),
      Truck.findByPk(truck_id),
      Cart.findByPk(cart_id),
    ]);

    const currentDate = new Date();
    const previousDate = new Date(currentDate.getTime());
    previousDate.setDate(currentDate.getDate() - 1);

    if (
      !isAfter(
        parseISO(start_date),
        previousDate.setDate(currentDate.getDate() - 1)
      )
    ) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        msg: 'Cannot create fixed in the past',
      };
      return result;
    } else if (!userAdm) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'User not found' };
      return result;
    } else if (!driver) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Driver not found' };
      return result;
    } else if (!truck) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Truck not found' };
      return result;
    } else if (!cart) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Cart not found' };
      return result;
    }

    const existFileOpen = await FinancialStatements.findAll({
      where: { driver_id: driver_id, status: true },
    });

    if (existFileOpen.length > 0) {
      result = {
        httpStatus: httpStatus.CONFLICT,
        msg: 'Driver already has an open file',
      };
      return result;
    }

    const truckOnSheet = await FinancialStatements.findAll({
      where: { truck_id: truck_id, status: true },
    });

    if (truckOnSheet.length > 0) {
      result = {
        httpStatus: httpStatus.CONFLICT,
        msg: 'Truck already has an open file',
      };
      return result;
    }

    const cartOnSheet = await FinancialStatements.findAll({
      where: { cart_id: cart_id, status: true },
    });

    if (cartOnSheet.length > 0) {
      result = {
        httpStatus: httpStatus.CONFLICT,
        msg: 'Cart already has an open file',
      };
      return result;
    }

    const { name, value_fix, percentage, daily } = driver.dataValues;
    const { truck_models, truck_board, truck_avatar } = truck.dataValues;
    const { cart_bodyworks, cart_board } = cart.dataValues;

    await FinancialStatements.create({
      creator_user_id: user.userId,
      driver_id,
      truck_id,
      cart_id,
      start_date,
      percentage_commission: percentage,
      fixed_commission: value_fix,
      daily: daily,
      driver_name: name,
      truck_models,
      truck_board,
      truck_avatar,
      cart_models: cart_bodyworks,
      cart_board,
    });

    await Notification.create({
      content: `${user.name}, Criou Uma Nova Ficha!`,
      driver_id: driver_id,
    });

    await driver.update({
      credit: 0,
      truck: truck_models,
      cart: cart_bodyworks,
    });

    result = { httpStatus: httpStatus.CREATED, status: 'successful' };
    return result;
  },

  async getAllFinancialStatements(req, res) {
    let result = {};

    const {
      page = 1,
      limit = 100,
      sort_order = 'ASC',
      sort_field = 'id',
      status_check,
      status,
      search,
    } = req.query;

    const where = {};
    if (status) where.status = status;

    const whereStatus = {};
    if (status_check) whereStatus.status = status_check;

    const total = (await FinancialStatements.findAll()).length;
    const totalPages = Math.ceil(total / limit);

    const financialStatements = await FinancialStatements.findAll({
      where: search
        ? {
            [Op.or]: [
              { truck_board: { [Op.iLike]: `%${search}%` } },
              { driver_name: { [Op.iLike]: `%${search}%` } },
            ],
          }
        : where,
      order: [[sort_field, sort_order]],
      limit: limit,
      offset: page - 1 ? (page - 1) * limit : 0,
      include: {
        model: Freight,
        where: status_check ? whereStatus : null,
        as: 'freigth',
      },
    });

    const currentPage = Number(page);

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      total,
      totalPages,
      currentPage,
      dataResult: financialStatements,
    };

    return result;
  },

  async getIdFinancialStatements(id) {
    let result = {};

    const financial = await FinancialStatements.findByPk(id);

    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    const freight = await Freight.findAll({
      where: { financial_statements_id: financial.id },
    });

    if (!freight) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        responseData: { msg: 'Freight not found' },
      };
      return result;
    }

    if (!financial) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        responseData: { msg: 'Financial Statements not found' },
      };
      return result;
    }

    function valueTotalTonne(tonne, valueTonne) {
      const valueTonneReal = valueTonne / 100;
      const tonneDiv = tonne / 1000;

      const calculate = tonneDiv * valueTonneReal;

      return formatter.format(calculate.toFixed(2));
    }

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      dataResult: {
        ...financial.dataValues,
        freight: freight.map((res) => ({
          data: res.createdAt,
          status: res.status,
          locationTruck: res.location_of_the_truck,
          finalFreightCity: res.final_freight_city,
          totalFreight: valueTotalTonne(res.preview_tonne, res.value_tonne),
        })),
      },
    };

    return result;
  },

  async updateFinancialStatements(req, res) {
    let result = {};

    let financialStatements = req;

    let financialStatementId = res.id;

    const financialStatement = await FinancialStatements.findByPk(
      financialStatementId
    );

    if (!financialStatement) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        msg: 'Financial not found',
      };
      return result;
    }

    const resultUpdate = await financialStatement.update(financialStatements);

    const driverFinancial = await Driver.findByPk(resultUpdate.driver_id);

    const { truck_models, cart_models, total_value } = resultUpdate;

    await driverFinancial.update({
      credit: total_value,
      truck: truck_models,
      cart: cart_models,
    });

    result = { httpStatus: httpStatus.OK, status: 'successful' };
    return result;
  },

  async deleteFinancialStatements(req, res) {
    let result = {};

    const id = req.id;

    const propsFinancial = await FinancialStatements.findByPk(id);
    const nameUser = await User.findByPk(propsFinancial.creator_user_id);

    if (!propsFinancial) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        msg: 'Financial not found',
      };
      return result;
    }

    if (!nameUser) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'User not found' };
      return result;
    }

    const financialStatement = await FinancialStatements.destroy({
      where: {
        id: id,
      },
    });

    await Notification.create({
      content: `${nameUser.name}, Excluio Sua Ficha!`,
      driver_id: propsFinancial.driver_id,
    });

    if (!financialStatement) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        responseData: { msg: 'Financial Statements not found' },
      };
      return result;
    }

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      responseData: { msg: 'Deleted Financial Statements ' },
    };
    return result;
  },
};
