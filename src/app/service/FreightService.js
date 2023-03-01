import httpStatus from 'http-status-codes';

import Freight from '../models/Freight';
import User from '../models/User';
import Notification from '../models/Notification';
import FinancialStatements from '../models/FinancialStatements';
import Restock from '../models/Restock';
import TravelExpenses from '../models/TravelExpenses';
import DepositMoney from '../models/DepositMoney';
import Driver from '../models/Driver';

import ApiGoogle from '../providers/router_map_google';
import { format } from 'date-fns';

export default {
  async _findValurDriver(id) {
    let result = {};
    let driverDaily = {};
    let driverValue = {};

    const financial = await FinancialStatements.findByPk(id);
    if (!financial) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        msg: 'Financial not found',
      };
      return result;
    }

    if (financial.percentage_commission > 0) {
      driverValue = { percentage: financial.percentage_commission };
    }
    if (financial.fixed_commission > 0) {
      driverValue = { fixedValue: financial.fixed_commission };
    }
    if (financial.daily > 0) {
      driverDaily = { dailyValue: financial.daily };
    }

    return (result = { driverDaily, driverValue });
  },

  async _findValueExpensesTravel(value) {
    const quantityExpenses = value.map(function (res) {
      return parseInt(res.dataValues.value);
    });
    const totalQuantityExpenses = quantityExpenses.reduce(function (
      previousValue,
      currentValue
    ) {
      return Number(previousValue) + Number(currentValue);
    },
    0 && quantityExpenses);

    return totalQuantityExpenses;
  },

  async _findValueOfFuel(value) {
    const quantityRestock = value.map(function (res) {
      return parseInt(res.dataValues.total_value_fuel);
    });
    const totalQuantityRestock = quantityRestock.reduce(function (
      previousValue,
      currentValue
    ) {
      return Number(previousValue) + Number(currentValue);
    },
    0 && quantityRestock);

    return totalQuantityRestock;
  },

  async _findValueDepositMoney(value) {
    const quantityDepositMoney = value.map(function (res) {
      return parseInt(res.dataValues.value);
    });
    const totalQuantityDepositMoney = quantityDepositMoney.reduce(function (
      previousValue,
      currentValue
    ) {
      return Number(previousValue) + Number(currentValue);
    },
    0 && quantityDepositMoney);

    return totalQuantityDepositMoney;
  },

  async createFreight(req, res) {
    let result = {};
    let freightBody = req;

    const financial = await FinancialStatements.findByPk(
      freightBody.financial_statements_id
    );
    if (!financial) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        msg: 'Financial not found',
      };
      return result;
    }

    const userFinancial = await User.findByPk(financial.creator_user_id);
    if (!userFinancial) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'User not found' };
      return result;
    }

    await Freight.create(freightBody);

    await Notification.create({
      content: `${userFinancial.name}, Requisitou Um Novo Frete Para Você!`,
      driver_id: financial.driver_id,
    });

    result = {
      httpStatus: httpStatus.CREATED,
      status: 'First check order successful!',
    };
    return result;
  },

  async getAllFreight(req, res) {
    let result = {};

    const {
      page = 1,
      limit = 100,
      sort_order = 'ASC',
      sort_field = 'id',
    } = req.query;

    const total = (await Freight.findAll()).length;
    const totalPages = Math.ceil(total / limit);

    const freights = await Freight.findAll({
      order: [[sort_field, sort_order]],
      limit: limit,
      offset: page - 1 ? (page - 1) * limit : 0,
      include: {
        model: FinancialStatements,
        as: 'financialStatements',
        attributes: ['driver_name', 'truck_board'],
      },
    });

    const currentPage = Number(page);

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      total,
      totalPages,
      currentPage,
      dataResult: freights,
    };

    return result;
  },

  _formatRealValue(value) {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    return formatter.format(value);
  },

  async getIdFreight(freightId, res) {
    let result = {};

    let freight = await Freight.findByPk(freightId);

    if (!freight) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Freight not found' };
      return result;
    }

    const restock = await Restock.findAll({
      where: { freight_id: freightId },
    });

    const travelExpenses = await TravelExpenses.findAll({
      where: { freight_id: freightId },
    });

    const depositMoney = await DepositMoney.findAll({
      where: { freight_id: freightId },
    });

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      dataResult: {
        freightTotal: 0,
        freightNet: 0,
        fuelValueTotal: 0,
        expenses: 0,
        driverCommission: 0,
        restock: restock.map((res) => ({
          date: format(res.date, 'yyyy-MM-dd'),
          time: format(res.date, 'HH:mm'),
          local: res.city,
          liters_fuel: res.liters_fuel,
          value_fuel: this._formatRealValue(res.value_fuel / 100),
          payment: {
            flag: res.payment.flag,
            modo: res.payment.modo,
            value: this._formatRealValue(res.payment.value / 100),
            parcels: res.payment.parcels,
          },
        })),
        travelExpenses: travelExpenses.map((res) => ({
          date: format(res.date, 'yyyy-MM-dd'),
          time: format(res.date, 'HH:mm'),
          local: res.city,
          expenseDescription: res.expense_descriptionm,
          payment: {
            flag: res.payment.flag,
            modo: res.payment.modo,
            value: this._formatRealValue(res.payment.value / 100),
            parcels: res.payment.parcels,
          },
        })),
        depositMoney: depositMoney.map((res) => ({
          date: format(res.createdAt, 'yyyy-MM-dd'),
          time: format(res.createdAt, 'HH:mm'),
          local: res.local,
          typeBank: res.type_bank,
          payment: {
            flag: res.payment.flag,
            modo: res.payment.modo,
            value: this._formatRealValue(res.payment.value / 100),
            parcels: res.payment.parcels,
          },
        })),
      },
    };

    return result;
  },

  _unmaskMoney(string) {
    return Number(
      string.toString().replace('.', '').replace('.', '').replace(/\D/g, '')
    );
  },

  async firstCheckId(id) {
    let result = {};

    const freight = await Freight.findByPk(id);

    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    const driver = await FinancialStatements.findByPk(
      freight.financial_statements_id
    );

    if (!freight) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        responseData: { msg: 'Freight not found' },
      };
      return result;
    }

    if (!driver) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        responseData: { msg: 'Driver not found' },
      };
      return result;
    }

    const kmTravel = await ApiGoogle.getRoute(
      freight.start_freight_city,
      freight.final_freight_city,
      'driving'
    );

    if (!kmTravel) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        responseData: { msg: 'Erro api google' },
      };
      return result;
    }

    function calculatesLiters(distance, consumption) {
      const distanceInKm = distance / 1000;
      const consumptionLt = consumption / 100;

      const calculate = distanceInKm / consumptionLt;
      return Number(calculate.toFixed(0));
    }

    function valuePerKm(distance, totalLiters, fuelValue) {
      const distanceInKm = distance / 1000;
      const fuelValueReal = fuelValue / 100;

      const calculate = (totalLiters * fuelValueReal) / distanceInKm;

      return formatter.format(calculate.toFixed(2));
    }

    function valueTotalGasto(totalLiters, fuelValue) {
      const fuelValueReal = fuelValue / 100;

      const calculate = totalLiters * fuelValueReal;

      return formatter.format(calculate.toFixed(2));
    }

    function valueTotalTonne(tonne, valueTonne) {
      const valueTonneReal = valueTonne / 100;
      const tonneDiv = tonne / 1000;

      const calculate = tonneDiv * valueTonneReal;

      return formatter.format(calculate.toFixed(2));
    }

    function valueDriver(percentage, fixedValue, totalFreight) {
      if (percentage > 0) {
        const percentageReal = percentage / 100;
        const freightReal = totalFreight / 100;

        const calculate = freightReal * percentageReal;

        return formatter.format(calculate.toFixed(2));
      } else {
        return formatter.format(fixedValue / 100);
      }
    }

    function valueNetFreight(totalDriver, totalFreight, totalAmountSpent) {
      const totalDiscount = totalDriver + totalAmountSpent;
      const calculate = totalFreight - totalDiscount;

      return formatter.format(calculate / 100);
    }

    const totalLiters = calculatesLiters(
      kmTravel.distance.value,
      freight.liter_of_fuel_per_km
    );

    const totalValuePerKm = valuePerKm(
      kmTravel.distance.value,
      totalLiters,
      freight.preview_value_diesel
    );

    const totalAmountSpent = valueTotalGasto(
      totalLiters,
      freight.preview_value_diesel
    );

    const totalFreight = valueTotalTonne(
      freight.preview_tonne,
      freight.value_tonne
    );

    const totalDriver = valueDriver(
      driver.percentage_commission,
      driver.fixed_commission,
      this._unmaskMoney(totalFreight)
    );

    const totalNetFreight = valueNetFreight(
      this._unmaskMoney(totalDriver),
      this._unmaskMoney(totalFreight),
      this._unmaskMoney(totalAmountSpent)
    );

    result = {
      httpStatus: httpStatus.OK,
      responseData: {
        status: freight.status,
        start_freight_city: freight.start_freight_city,
        final_freight_city: freight.final_freight_city,
        previous_average: `${freight.liter_of_fuel_per_km / 100} M`,
        distance: kmTravel.distance.text,
        consumption: `${totalLiters} L`,
        KM_price: totalValuePerKm,
        fuel_estimate: totalAmountSpent,
        full_freight: totalFreight,
        driver_commission: totalDriver,
        net_freight: totalNetFreight,
      },
    };

    return result;
  },

  async approvedFreight(body, res) {
    let result = {};

    const freight = await Freight.findByPk(res.id);

    const typeUser = await User.findByPk(body.user_id);

    const driverId = await Driver.findByPk(body.driver_id);

    if (!freight) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        dataResult: { msg: 'Freight not found' },
      };
      return result;
    }

    if (freight.status === 'APPROVED') {
      result = {
        httpStatus: httpStatus.CONFLICT,
        dataResult: { msg: 'This shipping has already been approved.' },
      };
      return result;
    }

    if (!typeUser) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        dataResult: { msg: 'This user is not MASTER' },
      };
      return result;
    }

    if (!driverId) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        dataResult: { msg: 'Driver not found' },
      };
      return result;
    }

    if (typeUser.type_role === 'MASTER') {
      await freight.update({
        status: body.status,
      });

      await Notification.create({
        content: `${
          typeUser.name
        }, Aceitou Seu Check Frete, DE ${freight.start_freight_city.toUpperCase()} PARA ${freight.final_freight_city.toUpperCase()} Tenha uma BOA VIAGEM`,
        driver_id: driverId.id,
      });

      result = { httpStatus: httpStatus.OK, status: 'successful' };
      return result;
    }
  },

  async deleteFreight(req, res) {
    let result = {};

    const id = req.id;

    const freight = await Freight.destroy({
      where: {
        id: id,
      },
    });

    if (!freight) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        responseData: { msg: 'Freight not found' },
      };
      return result;
    }

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      responseData: { msg: 'Deleted freight' },
    };
    return result;
  },
};
