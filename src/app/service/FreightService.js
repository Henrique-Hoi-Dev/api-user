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
  async _googleQuery(startCity, finalCity) {
    const kmTravel = await ApiGoogle.getRoute(startCity, finalCity, 'driving');

    return kmTravel;
  },

  _formatRealValue(value) {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    return formatter.format(value);
  },

  _calculatesLiters(distance, consumption) {
    const distanceInKm = distance / 1000;
    const consumptionLt = consumption / 100;

    const calculate = distanceInKm / consumptionLt;
    return Number(calculate.toFixed(0));
  },

  _valueTotalGasto(totalLiters, fuelValue) {
    const fuelValueReal = fuelValue / 100;

    const calculate = totalLiters * fuelValueReal;

    return this._formatRealValue(calculate.toFixed(2));
  },

  _valueTotalTonne(tonne, valueTonne) {
    const valueTonneReal = valueTonne / 100;
    const tonneDiv = tonne / 1000;

    const calculate = tonneDiv * valueTonneReal;

    return this._formatRealValue(calculate.toFixed(2));
  },

  _valueNetFreight(totalDriver, totalFreight, totalAmountSpent) {
    const totalDiscount = totalDriver + totalAmountSpent;
    const calculate = totalFreight - totalDiscount;

    return this._formatRealValue(calculate / 100);
  },

  _leftoverLiquid(totalFreight, totalAmountSpent) {
    const calculate = totalFreight - totalAmountSpent;

    return this._formatRealValue(calculate / 100);
  },

  _valueDriver(percentage, fixedValue, totalFreight) {
    if (percentage > 0) {
      const percentageReal = percentage / 100;
      const freightReal = totalFreight / 100;

      const calculate = freightReal * percentageReal;

      return this._formatRealValue(calculate.toFixed(2));
    } else {
      return this._formatRealValue(fixedValue / 100);
    }
  },

  async create(body) {
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

    await Freight.create(body);

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

  async getId(freightId) {
    const freight = await Freight.findByPk(freightId);

    if (!freight) throw Error('Freight not found');

    const financial = await FinancialStatements.findByPk(
      freight.financial_statements_id
    );

    if (!financial) throw Error('Financial not found');

    const driver = await Driver.findByPk(financial.driver_id);

    const restock = await Restock.findAll({
      where: { freight_id: freightId },
    });

    if (!restock) throw Error('Restock not found');

    const travelExpenses = await TravelExpenses.findAll({
      where: { freight_id: freightId },
    });

    if (!travelExpenses) throw Error('Travel expenses not found');

    const depositMoney = await DepositMoney.findAll({
      where: { freight_id: freightId },
    });

    if (!depositMoney) throw Error('Deposit money not found');

    const kmTravel = await this._googleQuery(
      freight.start_freight_city,
      freight.final_freight_city
    );

    const totalFreight = this._valueTotalTonne(
      freight.preview_tonne,
      freight.value_tonne
    );

    const totalLiters = this._calculatesLiters(
      kmTravel.distance.value,
      freight.liter_of_fuel_per_km
    );

    const totalAmountSpent = this._valueTotalGasto(
      totalLiters,
      freight.preview_value_diesel
    );

    const totalDriver = this._valueDriver(
      driver.percentage,
      driver.value_fix,
      this._unmaskMoney(totalFreight)
    );

    const totalNetFreight = this._valueNetFreight(
      this._unmaskMoney(totalDriver),
      this._unmaskMoney(totalFreight),
      this._unmaskMoney(totalAmountSpent)
    );

    return {
      dataResult: {
        status: freight.status,
        freightTotal: totalFreight,
        totalDriver: totalDriver,
        fuelValueTotal: totalAmountSpent,
        totalNetFreight: totalNetFreight,
        expenses: 0,
        totalLiters: totalLiters,
        driverCommission:
          driver.percentage > 0 ? driver.percentage : driver.value_fix,
        startCity: freight.start_freight_city,
        finalCity: freight.final_freight_city,
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
          expenseDescription: res.expense_description,
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
  },

  _unmaskMoney(string) {
    return Number(
      string.toString().replace('.', '').replace('.', '').replace(/\D/g, '')
    );
  },

  async firstCheckId(id) {
    const freight = await Freight.findByPk(id);

    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    if (!freight) throw Error('Freight not found');

    const driver = await FinancialStatements.findByPk(
      freight.financial_statements_id
    );

    if (!driver) throw Error('Driver not found');

    const kmTravel = await this._googleQuery(
      freight.start_freight_city,
      freight.final_freight_city
    );

    if (!kmTravel) throw Error('Erro api google');

    function valuePerKm(distance, totalLiters, fuelValue) {
      const distanceInKm = distance / 1000;
      const fuelValueReal = fuelValue / 100;

      const calculate = (totalLiters * fuelValueReal) / distanceInKm;

      return formatter.format(calculate.toFixed(2));
    }

    const totalLiters = this._calculatesLiters(
      kmTravel.distance.value,
      freight.liter_of_fuel_per_km
    );

    const totalValuePerKm = valuePerKm(
      kmTravel.distance.value,
      totalLiters,
      freight.preview_value_diesel
    );

    const totalAmountSpent = this._valueTotalGasto(
      totalLiters,
      freight.preview_value_diesel
    );

    const totalFreight = this._valueTotalTonne(
      freight.preview_tonne,
      freight.value_tonne
    );

    const totalDriver = this._valueDriver(
      driver.percentage_commission,
      driver.fixed_commission,
      this._unmaskMoney(totalFreight)
    );

    const totalNetFreight = this._valueNetFreight(
      this._unmaskMoney(totalDriver),
      this._unmaskMoney(totalFreight),
      this._unmaskMoney(totalAmountSpent)
    );

    const totalleftoverLiquid = this._leftoverLiquid(
      this._unmaskMoney(totalFreight),
      this._unmaskMoney(totalAmountSpent)
    );

    return {
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
        leftover_liquid: totalleftoverLiquid,
      },
    };
  },

  async update(user, body, id) {
    const [freight, driver] = await Promise.all([
      Freight.findByPk(id),
      Driver.findByPk(body.driver_id),
    ]);

    if (!user.type_role === 'MASTER') throw Error('This user is not MASTER');
    if (!freight) throw Error('Freight not found');
    if (!driver) throw Error('Driver not found');

    if (freight.status === 'APPROVED') {
      await freight.update({
        status: body.status,
      });

      const financial = await FinancialStatements.findOne({
        where: { driver_id: driver.id, status: true },
      });

      if (!financial) throw Error('Financial not found');

      await Notification.create({
        content: `${
          user.name
        }, Aceitou Seu Check Frete, DE ${freight.start_freight_city.toUpperCase()} PARA ${freight.final_freight_city.toUpperCase()} Tenha uma BOA VIAGEM`,
        driver_id: driver.id,
        financial_statements_id: financial.id,
      });

      return { status: 'APPROVED' };
    }

    return {};
  },

  async delete(id) {
    const freight = await Freight.destroy({
      where: {
        id: id,
      },
    });

    if (!freight) throw Error('Freight not found');

    return { msg: 'Deleted freight' };
  },
};
