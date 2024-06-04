import { Op } from 'sequelize';
import { isAfter, parseISO, sub } from 'date-fns';
// import { zonedTimeToUtc } from 'date-fns-tz';

import Driver from '../models/Driver';
import Truck from '../models/Truck';
import Cart from '../models/Cart';
import Freight from '../models/Freight';
import Notification from '../models/Notification';
import FinancialStatements from '../models/FinancialStatements';
import User from '../models/User';

export default {
    async create(user, body) {
        const { driver_id, truck_id, cart_id, start_date } = body;

        const [userAdm, driver, truck, cart] = await Promise.all([
            User.findByPk(user.id),
            Driver.findByPk(driver_id),
            Truck.findByPk(truck_id),
            Cart.findByPk(cart_id),
        ]);

        const currentDate = new Date();
        const previousDate = new Date(currentDate.getTime());
        previousDate.setDate(currentDate.getDate() - 1);

        if (!isAfter(parseISO(start_date), previousDate.setDate(currentDate.getDate() - 1)))
            throw Error('CANNOT_CREATE_FIXED_IN_THE_PAST');

        if (!userAdm) throw Error('USER_NOT_FOUND');
        if (!driver) throw Error('DRIVER_NOT_FOUND');
        if (!truck) throw Error('TRUCK_NOT_FOUND');
        if (!cart) throw Error('CART_NOT_FOUND');

        const existFileOpen = await FinancialStatements.findAll({
            where: { driver_id: driver_id, status: true },
        });

        if (existFileOpen.length > 0) throw Error('DRIVER_ALREADY_HAS_AN_OPEN_FILE');

        const truckOnSheet = await FinancialStatements.findAll({
            where: { truck_id: truck_id, status: true },
        });

        if (truckOnSheet.length > 0) throw Error('TRUCK_ALREADY_HAS_AN_OPEN_FILE');

        const cartOnSheet = await FinancialStatements.findAll({
            where: { cart_id: cart_id, status: true },
        });

        if (cartOnSheet.length > 0) throw Error('CART_ALREADY_HAS_AN_OPEN_FILE');

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
            truck: truck_models,
            cart: cart_bodyworks,
        });

        return { msg: 'SUCCESSFUL' };
    },

    async getAll(query) {
        const { page = 1, limit = 100, sort_order = 'ASC', sort_field = 'id', status_check, status, search } = query;

        const where = {};
        if (status) where.status = status;

        const whereStatus = {};
        if (status_check) whereStatus.status = status_check;

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
            include: [
                {
                    model: Driver,
                    as: 'driver',
                    attributes: ['credit'],
                },
                {
                    model: Freight,
                    where: status_check ? whereStatus : null,
                    as: 'freigth',
                },
            ],
        });

        const total = await FinancialStatements.count();
        const totalPages = Math.ceil(total / limit);

        const currentPage = Number(page);

        return {
            dataResult: financialStatements,
            total,
            totalPages,
            currentPage,
        };
    },

    _valueTotalTonne(tonne, valueTonne) {
        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });

        const valueTonneReal = valueTonne / 100;
        const tonneDiv = tonne / 1000;

        const calculate = tonneDiv * valueTonneReal;

        return formatter.format(calculate.toFixed(2));
    },

    async getId(id) {
        const financial = await FinancialStatements.findByPk(id, {
            include: {
                model: Driver,
                as: 'driver',
                attributes: ['credit'],
            },
        });

        if (!financial) throw Error('Financial Statements not found');

        const freight = await Freight.findAll({
            where: { financial_statements_id: financial.id },
        });
        if (!freight) throw Error('Freight not found');

        const notifications = await Notification.findAll({
            where: {
                financial_statements_id: financial.id,
                user_id: financial.creator_user_id,
            },
            attributes: ['id', 'content', 'createdAt', 'driver_id', 'freight_id'],
        });

        return {
            dataResult: {
                ...financial.dataValues,
                freight: freight.map((res) => ({
                    id: res.id,
                    date: res.createdAt,
                    status: res.status,
                    locationTruck: res.location_of_the_truck,
                    finalFreightCity: res.final_freight_city,
                    totalFreight: this._valueTotalTonne(res.preview_tonne, res.value_tonne),
                })),
                notifications: notifications.map((res) => res.dataValues),
            },
        };
    },

    async update(body, id) {
        const financialStatement = await FinancialStatements.findByPk(id);

        if (!financialStatement) throw Error('Financial not found');

        const result = await financialStatement.update(body);

        const driverFinancial = await Driver.findByPk(result.driver_id);

        const { truck_models, cart_models, total_value } = result;

        await driverFinancial.update({
            credit: total_value,
            truck: truck_models,
            cart: cart_models,
        });

        return result;
    },

    async delete(id) {
        const financial = await FinancialStatements.findByPk(id);
        if (!financial) throw Errro('Financial not found');

        const user = await User.findByPk(financial.creator_user_id);
        if (!user) throw Errro('User not found');

        const retult = await FinancialStatements.destroy({
            where: {
                id: id,
            },
        });

        await Notification.create({
            content: `${user.name}, Excluio Sua Ficha!`,
            driver_id: financial.driver_id,
        });

        return retult;
    },
};
