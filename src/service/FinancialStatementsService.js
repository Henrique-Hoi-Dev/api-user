import httpStatus from 'http-status-codes';

import Driver from '../app/models/Driver';
import Truck from '../app/models/Truck';
import Cart from '../app/models/Cart';
import Freight from '../app/models/Freight';
import Notification from '../app/models/Notification';
import FinancialStatements from "../app/models/FinancialStatements";
import User from '../app/models/User';

export default {
  async createFinancialStatements(req, res) {
    let result = {}

    let { 
      driver_id, 
      truck_id, 
      cart_id, 
      creator_user_id, 
      start_date 
    } = req;

    const user = await User.findByPk(creator_user_id)
    const driver = await Driver.findByPk(driver_id)
    const truck = await Truck.findByPk(truck_id)
    const cart = await Cart.findByPk(cart_id)

    if (!user) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'User not found' }      
      return result
    }

    if (!driver) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Driver not found' }      
      return result
    }

    if (!truck) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Truck not found' }      
      return result
    }

    if (!cart) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Cart not found' }      
      return result
    }

    const existFileOpen = await FinancialStatements.findAll({ where: { driver_id: driver_id, status: true }})

    if (existFileOpen.length > 0) {
      result = { httpStatus: httpStatus.CONFLICT, msg: 'Driver already has an open file' }      
      return result
    }

    const truckOnSheet = await FinancialStatements.findAll({ where: { truck_id: truck_id, status: true }})

    if (truckOnSheet.length > 0) {
      result = { httpStatus: httpStatus.CONFLICT, msg: 'Truck already has an open file' }      
      return result
    }

    const cartOnSheet = await FinancialStatements.findAll({ where: { cart_id: cart_id, status: true }})

    if (cartOnSheet.length > 0) {
      result = { httpStatus: httpStatus.CONFLICT, msg: 'Cart already has an open file' }      
      return result
    }

    const { name, value_fix, percentage, daily } = driver.dataValues
    const { truck_models, truck_board, truck_avatar } = truck.dataValues
    const { cart_models, cart_board } = cart.dataValues

    const body = {
      creator_user_id,
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
      cart_models,
      cart_board,
    }

    await FinancialStatements.create(body);

    await Notification.create({
      content: `${user.name}, Criou Uma Nova Ficha!`,
      driver_id: driver_id,
    })

    const creditUser = 0

    await driver.update({ credit: creditUser, truck: truck_models, cart: cart_models });
    
    result = { httpStatus: httpStatus.CREATED, status: "successful" }      
    return result
  },

  async getAllFinancialStatements(req, res) {
    let result = {}

    const { page = 1, limit = 100, sort_order = 'ASC', sort_field = 'id' } = req.query;
    const total = (await FinancialStatements.findAll()).length;

    const totalPages = Math.ceil(total / limit);

    const financialStatements = await FinancialStatements.findAll({
      order: [[ sort_field, sort_order ]],
      limit: limit,
      offset: (page - 1) ? (page - 1) * limit : 0,
      attributes: [ 
        'id', 
        'creator_user_id',
        'driver_id',
        'truck_id',
        'cart_id',
        'status',
        'start_km',
        'final_km',
        'start_date',
        'final_date',
        'driver_name',
        'percentage_commission',
        'fixed_commission',
        'daily',
        'truck_models',
        'truck_board',
        'cart_models',
        'cart_board',
        'invoicing_all',
        'medium_fuel_all',
        'total_value',
        'truck_avatar',
      ],
      include: {
        model: Freight,
        as: "freigth",
        attributes: [
          "id",
          "financial_statements_id",
          "start_city",
          "final_city",
          "location_of_the_truck",
          "contractor",
          "start_km",
          "status_check_order",
          "preview_tonne",
          "value_tonne",
          'preview_average_fuel',
          "preview_value_diesel",
          "final_km",
          "final_total_tonne",
          "toll_value",
          "discharge",
          "img_proof_cte",
          "img_proof_ticket",
          "img_proof_freight_letter",
        ]
      }
    });

    const currentPage = Number(page)

    result = { 
      httpStatus: httpStatus.OK, 
      status: "successful", 
      total, 
      totalPages, 
      currentPage, 
      dataResult: financialStatements 
    }      
    
    return result
  },

  async getIdFinancialStatements(req, res) {
    let result = {}

    let financialStatement = await FinancialStatements.findByPk(req.id, {
      attributes: [ 
        'id', 
        'creator_user_id',
        'driver_id',
        'truck_id',
        'cart_id',
        'status',
        'start_km',
        'final_km',
        'start_date',
        'final_date',
        'driver_name',
        'daily',
        'percentage_commission',
        'fixed_commission',
        'truck_models',
        'truck_board',
        'cart_models',
        'cart_board',
        'invoicing_all',
        'medium_fuel_all',
        'total_value',
        'truck_avatar',
      ],
      include: {
        model: Freight,
        as: "freigth",
        attributes: [
          "id",
          "financial_statements_id",
          "start_city",
          "final_city",
          'preview_average_fuel',
          "location_of_the_truck",
          "contractor",
          "start_km",
          "status_check_order",
          "preview_tonne",
          "value_tonne",
          "preview_value_diesel",
          "final_km",
          "final_total_tonne",
          "toll_value",
          "discharge",
          "img_proof_cte",
          "img_proof_ticket",
          "img_proof_freight_letter",
        ]
      }
    });

    if (!financialStatement) {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Financial Statements not found' }}      
      return result
    }

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: financialStatement }      
    return result
  },

  async updateFinancialStatements(req, res) {   
    let result = {}

    let financialStatements = req

    let financialStatementId = res.id
    
    const financialStatement = await FinancialStatements.findByPk(financialStatementId);

    if (!financialStatement) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Financial not found' }      
      return result
    }

    const resultUpdate = await financialStatement.update(financialStatements);
    
    const driverFinancial = await Driver.findByPk(resultUpdate.driver_id);

    const { truck_models, cart_models, total_value } = resultUpdate

    await driverFinancial.update({ credit: total_value, truck: truck_models, cart: cart_models });

    result = { httpStatus: httpStatus.OK, status: "successful" }      
    return result
  },
  
  async deleteFinancialStatements(req, res) {
    let result = {}
    
    const id  = req.id;

    const propsFinancial = await FinancialStatements.findByPk(id)
    const nameUser = await User.findByPk(propsFinancial.creator_user_id)

    if (!propsFinancial) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Financial not found' }      
      return result
    }

    if (!nameUser) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'User not found' }      
      return result
    }

    const financialStatement = await FinancialStatements.destroy({
      where: {
        id: id,
      },
    });

    await Notification.create({
      content: `${nameUser.name}, Excluio Sua Ficha!`,
      driver_id: propsFinancial.driver_id,
    })  

    if (!financialStatement) {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Financial Statements not found' }}      
      return result
    }

    result = {httpStatus: httpStatus.OK, status: "successful", responseData: { msg: 'Deleted Financial Statements ' }}      
    return result
  },
}