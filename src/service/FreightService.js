import httpStatus from 'http-status-codes';

import Freight from "../app/models/Freight";
import User from "../app/models/User";
import Notification from "../app/models/Notification";
import FinancialStatements from "../app/models/FinancialStatements";
import Restock from '../app/models/Restock';
import TravelExpenses from '../app/models/TravelExpenses';
import DepositMoney from '../app/models/DepositMoney';

export default {
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
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Financial not found' }      
      return result
    }
    // ton value and predicted fuel value 
    const value_tonne = freight.value_tonne / 100
    const preview_valueDiesel = freight.preview_value_diesel / 100
    const preview_tonne = freight.preview_tonne * 100
    // predicted gross value
    const preview_valueGross = preview_tonne * value_tonne
    // fuel consumption forecast
    const amountSpentOnFuel = preview_valueDiesel / freight.preview_average_fuel
    const resultValue = Math.round(freight.travel_km/1000) * Math.round(amountSpentOnFuel)

    const discounted_fuel = preview_valueGross - Math.round(resultValue)*100

    // total value supplied
    const quantityRestock = freight.restock.map(function (res) {
      return parseInt(res.dataValues.total_value_fuel)
    })
    const totalQuantityRestock = quantityRestock.reduce(function(previousValue, currentValue) {
      return Number(previousValue) + Number(currentValue);
    }, 0 && quantityRestock)
    // total amount expenses
    const quantityExpenses = freight.travel_expense.map(function (res) {
      return parseInt(res.dataValues.value)
    })
    const totalQuantityExpenses = quantityExpenses.reduce(function(previousValue, currentValue) {
      return Number(previousValue) + Number(currentValue);
    }, 0 && quantityRestock)
    // total amount deposit money
    const quantityDepositMoney = freight.deposit_money.map(function (res) {
      return parseInt(res.dataValues.value)
    })
    const totalQuantityDepositMoney = quantityDepositMoney.reduce(function(previousValue, currentValue) {
      return Number(previousValue) + Number(currentValue);
    }, 0 && quantityRestock)

    result = { 
      httpStatus: httpStatus.OK, 
      status: "successful", 
      dataResult: {
        first_check: {
          start_city: freight.start_city,
          final_city: freight.final_city,
          location_truck: freight.location_of_the_truck,
          start_current_km: freight.start_km,
          travel_km: freight.travel_km,
          preview_average_fuel: freight.average_fuel,
          preview_tonne: freight.preview_tonne,
          preview_value_diesel: freight.preview_value_diesel,
          value_tonne: freight.value_tonne,
          status_check_order: freight.status_check_order,
          item_total: {  
            preview_valueGross: preview_valueGross,
            preview_fuel_expense: Math.round(resultValue)*100,
            fuel_discount_on_shipping: discounted_fuel,
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
            total_value_fuel: totalQuantityRestock,
            total_value_expenses: totalQuantityExpenses,
            total_deposit_money: totalQuantityDepositMoney
          } 
        },
        restock: freight.restock,
        travel_expense: freight.travel_expense,
        deposit_money: freight.deposit_money,
      }
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