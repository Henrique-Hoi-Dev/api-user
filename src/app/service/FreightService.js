import httpStatus from 'http-status-codes';

import Freight from "../models/Freight";
import User from "../models/User";
import Notification from "../models/Notification";
import FinancialStatements from "../models/FinancialStatements";
import Restock from '../models/Restock';
import TravelExpenses from '../models/TravelExpenses';
import DepositMoney from '../models/DepositMoney';

export default {
  async _findValurDriver(id) {
    let result = {}
    let driverDaily = {}
    let driverValue = {}
    
    const financial = await FinancialStatements.findByPk(id)
    if (!financial) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Financial not found' }      
      return result
    }
    
    if (financial.percentage_commission > 0) {
      driverValue = { percentage: financial.percentage_commission } 
    } 
    if (financial.fixed_commission > 0) {
      driverValue = { fixedValue: financial.fixed_commission } 
    }
    if (financial.daily > 0) {
      driverDaily = { dailyValue: financial.daily } 
    }

    return result = { driverDaily, driverValue }
  },

  async _findValueExpensesTravel(value) {
    const quantityExpenses = value.map(function (res) {
      return parseInt(res.dataValues.value)
    })
    const totalQuantityExpenses = quantityExpenses.reduce(function(previousValue, currentValue) {
      return Number(previousValue) + Number(currentValue);
    }, 0 && quantityExpenses)

    return totalQuantityExpenses
  },

  async _findValueOfFuel(value) {
    const quantityRestock = value.map(function (res) {
      return parseInt(res.dataValues.total_value_fuel)
    })
    const totalQuantityRestock = quantityRestock.reduce(function(previousValue, currentValue) {
      return Number(previousValue) + Number(currentValue);
    }, 0 && quantityRestock)

    return totalQuantityRestock
  },

  async _findValueDepositMoney(value) {
    const quantityDepositMoney = value.map(function (res) {
      return parseInt(res.dataValues.value)
    })
    const totalQuantityDepositMoney = quantityDepositMoney.reduce(function(previousValue, currentValue) {
      return Number(previousValue) + Number(currentValue);
    }, 0 && quantityDepositMoney)

    return totalQuantityDepositMoney
  },

  async createFreight(req, res) {
    let result = {}
    let freightBody = req;

    const financial = await FinancialStatements.findByPk(freightBody.financial_statements_id)
    if (!financial) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Financial not found' }      
      return result
    }

    const userFinancial = await User.findByPk(financial.creator_user_id)
    if (!userFinancial) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'User not found' }      
      return result
    }

    await Freight.create(freightBody);

    await Notification.create({
      content: `${userFinancial.name}, Requisitou Um Novo Frete Para Você!`,
      driver_id: financial.driver_id,
    })

    result = { httpStatus: httpStatus.CREATED, status: "First check order successful!" }      
    return result
  },

  async getAllFreight(req, res) {
    let result = {}
    
    const { page = 1, limit = 100, sort_order = 'ASC', sort_field = 'id' } = req.query;
    
    const total = (await Freight.findAll()).length;
    const totalPages = Math.ceil(total / limit);

    const freights = await Freight.findAll({
      order: [[ sort_field, sort_order ]],
      limit: limit,
      offset: (page - 1) ? (page - 1) * limit : 0,
      include: {
        model: FinancialStatements,
        as: 'financialStatements',
        attributes: [ 'driver_name', 'truck_board' ]
      }
    });

    const currentPage = Number(page)

    result = { 
      httpStatus: httpStatus.OK, 
      status: "successful", 
      total, 
      totalPages, 
      currentPage, 
      dataResult: freights 
    } 

    return result
  },

  async getIdFreight(req, res) {
    let result = {}

    let freight = await Freight.findByPk(req.id, {
      include: [
        {
          model: Restock,
          as: "restock",
          attributes: [
            'id',
            'name_establishment', 
            'city', 
            'date', 
            'value_fuel', 
            'total_nota_value',
            'total_value_fuel',
            'liters_fuel'
          ]
        },
        {
          model: TravelExpenses,
          as: "travel_expense",
          attributes: [
            'id',
            'name_establishment',
            'type_establishment',
            'expense_description',
            'value',
          ]
        },
        {
          model: DepositMoney,
          as: "deposit_money",
          attributes: [
            'id',
            'type_transaction',
            'local',
            'type_bank',
            'value',
          ]
        },
      ]
    });

    if (!freight) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Freight not found' }      
      return result
    }

    const valueDriver = await this._findValurDriver(freight.financial_statements_id)

    const valueDiesel = freight.preview_value_diesel
    const preview_valueGross = (Math.round(freight.preview_tonne * freight.value_tonne / 100) * 100)
 
    const amountSpentOnFuel = valueDiesel / freight.liter_of_fuel_per_km
    const resultValue = Math.round(freight.travel_km_total/1000) * Math.round(amountSpentOnFuel)

    const discounted_fuel = preview_valueGross - (Math.round(resultValue))
    
    let valueNet = {}

    if (valueDriver.driverValue.percentage > 0) {
      valueNet = { res: discounted_fuel - (discounted_fuel * (valueDriver.driverValue.percentage / 100)) } 
    }

    if (valueDriver.driverValue.fixedValue > 0) {
      valueNet = { res: discounted_fuel - valueDriver.driverValue.fixedValue } 
    }

    if (valueDriver.driverDaily.dailyValue >= 0) {
      valueNet = valueNet.res - valueDriver.driverDaily.dailyValue
    }

    const valueTotalExpensesTravel = await this._findValueExpensesTravel(freight.travel_expense)
    const valueTotalOfFuelTravel = await this._findValueOfFuel(freight.restock)
    const valueTotalDepositMoney = await this._findValueDepositMoney(freight.deposit_money)

    result = { 
      httpStatus: httpStatus.OK, 
      status: "successful", 
      dataResult: {
        first_check: {
          start_freight_city: freight.start_freight_city,
          final_freight_city: freight.final_freight_city,
          location_truck: freight.location_of_the_truck,
          start_current_km: freight.start_current_km,
          travel_km_total: freight.travel_km_total,
          liter_of_fuel_per_km: freight.liter_of_fuel_per_km,
          preview_tonne: freight.preview_tonne,
          preview_value_diesel: freight.preview_value_diesel,
          value_tonne: freight.value_tonne,
          status_check_order: freight.status_check_order,
          item_total: {  
            valueGross: preview_valueGross, // valor bruto
            fuel_expense: Math.round(resultValue), // valor combustível
            fuel_discount_on_shipping: discounted_fuel, // valor frete com desconto combustível
            valueNet: Math.round(valueNet), // valor liquido
          },
        },
        // check apoapproved
        second_check: {
          final_km: freight.final_km,
          final_total_tonne: freight.final_total_tonne,
          toll_value: freight.toll_value,
          discharge: freight.discharge,
          img_proof_cte: freight.img_proof_cte,
          img_proof_ticket: freight.img_proof_ticket,
          img_proof_freight_letter: freight.img_proof_freight_letter,
          item_total: {
            total_value_fuel: valueTotalOfFuelTravel,
            total_value_expenses: valueTotalExpensesTravel,
            total_deposit_money: valueTotalDepositMoney
          } 
        },
        restock: freight.restock,
        travel_expense: freight.travel_expense,
        deposit_money: freight.deposit_money,
      }
    }  

    if (freight.status_check_order === "finished") {
      const financial = await FinancialStatements.findByPk(freight.financial_statements_id)
      const value = freight.final_total_tonne * freight.value_tonne

      console.log("entro", value)

      const discount = value - (valueTotalOfFuelTravel + valueTotalExpensesTravel)

      await financial.update({
        total_value: discount,
      });
    }

    if (freight.final_km === null) delete result.dataResult.second_check.final_km
    if (freight.final_total_tonne === null) delete result.dataResult.second_check.final_total_tonne
    if (freight.toll_value === null) delete result.dataResult.second_check.toll_value
    if (freight.discharge === null) delete result.dataResult.second_check.discharge
    if (freight.img_proof_cte === null) delete result.dataResult.second_check.img_proof_cte
    if (freight.img_proof_ticket === null) delete result.dataResult.second_check.img_proof_ticket
    if (freight.img_proof_freight_letter === null) delete result.dataResult.second_check.img_proof_freight_letter
    
    return result
  },

  async updateFreight(req, res) {   
    let result = {}

    let freightReq = req

    const freight = await Freight.findByPk(res.id);

    const typeUser = await User.findByPk(req.user_id)

    const driverId = await User.findByPk(req.driver_id)

    if (!freight) {
      result = {httpStatus: httpStatus.BAD_REQUEST, dataResult: { msg: 'Freight not found' }}      
      return result
    }

    if (freight.status_check_order === "approved") {
      result = {httpStatus: httpStatus.CONFLICT, dataResult: { msg: 'This shipping has already been approved.' }}      
      return result
    }

    if (!typeUser) {
      result = {httpStatus: httpStatus.BAD_REQUEST, dataResult: { msg: 'Type user not found' }}      
      return result
    }

    if (!driverId) {
      result = {httpStatus: httpStatus.BAD_REQUEST, dataResult: { msg: 'Driver not found' }}      
      return result
    }

    if (typeUser.type_position === "master") {
      await freight.update({
        status_check_order: freightReq.status_check_order,
      });

      await Notification.create({
        content: `${typeUser.name}, Aceitou Seu Check Frete, DE ${freight.start_city.toUpperCase()} PARA ${freight.final_city.toUpperCase()} Tenha uma BOA VIAGEM`,
        driver_id: driverId.id,
      })

      result = { httpStatus: httpStatus.OK, status: "successful"}    
      return result
    } 
  },
  
  async deleteFreight(req, res) {
    let result = {}
    
    const id  = req.id;

    const freight = await Freight.destroy({
      where: {
        id: id,
      },
    });

    if (!freight) {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Freight not found' }}      
      return result
    }

    result = {httpStatus: httpStatus.OK, status: "successful", responseData: { msg: 'Deleted freight' }}      
    return result
  }
}