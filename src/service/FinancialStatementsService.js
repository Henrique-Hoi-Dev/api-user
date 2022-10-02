import httpStatus from 'http-status-codes';

import Driver from '../app/models/Driver';
import Truck from '../app/models/Truck';
import Cart from '../app/models/Cart';
import Freight from '../app/models/Freight';
import DataDriver from "../app/models/DataDriver";
import FinancialStatements from "../app/models/FinancialStatements";

export default {
  async createFinancialStatements(req, res) {
    let result = {}
    let { driver_id, truck_id, cart_id, start_date } = req;

    const driver = await Driver.findByPk(driver_id)
    const truck = await Truck.findByPk(truck_id)
    const cart = await Cart.findByPk(cart_id)

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

    const driver_name = driver.dataValues.name
    const { truck_models, truck_board, truck_avatar } = truck.dataValues
    const { cart_models, cart_board } = cart.dataValues

    const body = { 
      driver_id, 
      truck_id,
      cart_id,
      status: true,
      start_date, 
      driver_name, 
      truck_models, 
      truck_board, 
      truck_avatar,
      cart_models,
      cart_board,
      total_value: 0,
      total_amount_paid: 0
    }

    await FinancialStatements.create(body);
    
    result = { httpStatus: httpStatus.OK, status: "successful" }      
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
        'driver_id',
        'truck_id',
        'cart_id',
        'status',
        'start_km',
        'final_km',
        'start_date',
        'final_date',
        'driver_name',
        'truck_models',
        'truck_avatar',
        'truck_board',
        'cart_models',
        'cart_board',
        'invoicing_all',
        'medium_fuel_all',
        'total_value',
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
          'average_fuel',
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
        'driver_id',
        'truck_id',
        'cart_id',
        'status',
        'start_km',
        'final_km',
        'start_date',
        'final_date',
        'driver_name',
        'truck_models',
        'truck_avatar',
        'truck_board',
        'cart_models',
        'cart_board',
        'invoicing_all',
        'medium_fuel_all',
        'total_value',
      ],
      include: {
        model: Freight,
        as: "freigth",
        attributes: [
          "id",
          "financial_statements_id",
          "start_city",
          "final_city",
          'average_fuel',
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

    const creditUser = 0

    const { truck_models, cart_models } = resultUpdate

    await driverFinancial.update({ credit: creditUser, truck: truck_models, cart: cart_models });

    result = { httpStatus: httpStatus.OK, status: "successful" }      
    return result
  },
  
  async deleteFinancialStatements(req, res) {
    let result = {}
    
    const id  = req.id;

    const financialStatement = await FinancialStatements.destroy({
      where: {
        id: id,
      },
    });

    if (!financialStatement) {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Financial Statements not found' }}      
      return result
    }

    result = {httpStatus: httpStatus.OK, status: "successful", responseData: { msg: 'Deleted Financial Statements ' }}      
    return result
  },

  async getDataDriver(req, res) {
    let result = {}

    const { page = 1, limit = 100, sort_order = 'ASC', sort_field = 'id' } = req.query;
    const total = (await DataDriver.findAll()).length;

    const totalPages = Math.ceil(total / limit);

    const dataDrivers = await DataDriver.findAll({
      order: [[ sort_field, sort_order ]],
      limit: limit,
      offset: (page - 1) ? (page - 1) * limit : 0,
      attributes: [ 
        'id', 
        'credit',
        'driver_name',
        'truck_models',
        'cart_models',
      ],
    });

    const currentPage = Number(page)

    result = { 
      httpStatus: httpStatus.OK, 
      status: "successful", 
      total, 
      totalPages, 
      currentPage, 
      dataResult: dataDrivers 
    }      
    
    return result
  }
}