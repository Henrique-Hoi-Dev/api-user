import * as Yup from 'yup';
import DepositMoney from "../app/models/DepositMoney";
import httpStatus from 'http-status-codes';

export default {
  async createDepositMoney(req, res) {
    let result = {}
    let depositMoneyBody = req;

    await DepositMoney.create(depositMoneyBody);

    result = { httpStatus: httpStatus.OK, status: "successful" }      
    return result
  },

  async getAllDepositMoney(req, res) {
    let result = {}

    const { page = 1, limit = 100, sort_order = 'ASC', sort_field = 'id' } = req.query;
    const total = (await DepositMoney.findAll()).length;

    const totalPages = Math.ceil(total / limit);

    const depositMoney = await DepositMoney.findAll({
      order: [[ sort_field, sort_order ]],
      limit: limit,
      offset: (page - 1) ? (page - 1) * limit : 0,
      attributes: [ 
        'id',
        'type_transaction', 
        'local', 
        'type_bank', 
        'value', 
        'proof_img', 
      ], 
    });

    const currentPage = Number(page)

    result = { 
      httpStatus: httpStatus.OK, 
      status: "successful", 
      total, 
      totalPages, 
      currentPage, 
      dataResult: depositMoney 
    } 

    return result
  },

  async getIdDepositMoney(req, res) {
    let result = {}

    let depositMoney = await DepositMoney.findByPk(req.id, {
      attributes: [ 
        'id',
        'type_transaction', 
        'local', 
        'type_bank', 
        'value', 
        'proof_img',
      ],  
    });

    if (!depositMoney) {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Deposit Money not found' }}      
      return result
    }

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: depositMoney }      
    return result
  },

  async updateDepositMoney(req, res) {   
    let result = {}

    let depositMoneys = req
    let depositMoneyId = res.id

    const depositMoney = await DepositMoney.findByPk(depositMoneyId);

    await depositMoney.update(depositMoneys);

    const depositMoneyResult = await DepositMoney.findByPk(depositMoneyId, {
      attributes: [
        'id',
        'type_transaction', 
        'local', 
        'type_bank', 
        'value', 
        'proof_img',
      ],
    });

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: depositMoneyResult }      
    return result
  },
  
  async deleteDepositMoney(req, res) {
    let result = {}
    
    const id  = req.id;

    const depositMoney = await DepositMoney.destroy({
      where: {
        id: id,
      },
    });

    if (!depositMoney) {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Deposit Money not found' }}      
      return result
    }

    result = {httpStatus: httpStatus.OK, status: "successful", responseData: { msg: 'Deleted deposit money' }}      
    return result
  }
}