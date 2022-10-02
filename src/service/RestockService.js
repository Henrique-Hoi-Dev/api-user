import httpStatus from 'http-status-codes';

import Restock from "../app/models/Restock";
import FinancialStatements from "../app/models/FinancialStatements";

export default {
  async createRestock(req, res) {
    let result = {}
    let { 
      financial_statements_id, 
      name_establishment, 
      city, 
      date, 
      value_fuel, 
      liters_fuel, 
      total_nota_value 
    } = req;

    const statements = await FinancialStatements.findByPk(financial_statements_id)

    if (!statements) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Financial statements not found' }      
      return result
    }

    let total_value_fuel = value_fuel * liters_fuel

    let restockBody = { 
      financial_statements_id, 
      name_establishment, 
      value_fuel, 
      liters_fuel, 
      city, 
      date, 
      total_nota_value, 
      total_value_fuel 
    } 

    await Restock.create(restockBody);

    result = { httpStatus: httpStatus.OK, status: "successful" }      
    return result
  },

  async getAllRestock(req, res) {
    let result = {}

    const { page = 1, limit = 100, sort_order = 'ASC', sort_field = 'id' } = req.query;
    const total = (await Restock.findAll()).length;

    const totalPages = Math.ceil(total / limit);

    const restocks = await Restock.findAll({
      order: [[ sort_field, sort_order ]],
      limit: limit,
      offset: (page - 1) ? (page - 1) * limit : 0,
      attributes: [ 
        'id',
        'name_establishment', 
        'city', 
        'date', 
        'value_fuel', 
        'liters_fuel', 
        'total_value_fuel', 
        'total_nota_value', 
      ], 
    });

    const currentPage = Number(page)

    result = { 
      httpStatus: httpStatus.OK, 
      status: "successful", 
      total, 
      totalPages, 
      currentPage, 
      dataResult: restocks 
    } 

    return result
  },

  async getIdRestock(req, res) {
    let result = {}

    let restock = await Restock.findByPk(req.id, {
      attributes: [ 
        'id',
        'name_establishment', 
        'city', 
        'date', 
        'value_fuel', 
        'liters_fuel', 
        'total_value_fuel', 
        'total_nota_value',
      ],  
    });

    if (!restock) {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Restocks not found' }}      
      return result
    }

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: restock }      
    return result
  },

  async updateRestock(req, res) {   
    let result = {}

    let restocks = req
    let restockId = res.id

    const restock = await Restock.findByPk(restockId);

    await restock.update(restocks);

    const restockResult = await Restock.findByPk(restockId, {
      attributes: [
        'id',
        'name_establishment', 
        'city', 
        'date', 
        'value', 
        'proof_img', 
      ],
    });

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: restockResult }      
    return result
  },
  
  async deleteRestock(req, res) {
    let result = {}
    
    const id  = req.id;

    const restock = await Restock.destroy({
      where: {
        id: id,
      },
    });

    if (!restock) {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Restocks not found' }}      
      return result
    }

    result = {httpStatus: httpStatus.OK, status: "successful", responseData: { msg: 'Deleted restock' }}      
    return result
  }
}