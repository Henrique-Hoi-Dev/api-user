import httpStatus from 'http-status-codes';

import Cart from "../app/models/Cart";

export default {
  async createCart(req, res) {
    let result = {}
    let cartBody = req;

    const chassisExist = await Cart.findOne({ where: { cart_chassis: cartBody.cart_chassis } });
    const boardExist = await Cart.findOne({ where: { cart_board: cartBody.cart_board } });

    if (chassisExist) {
      result = { httpStatus: httpStatus.CONFLICT, msg: 'This chassis cart already exists.' };
      return result;
    }

    if (boardExist) {
      result = { httpStatus: httpStatus.CONFLICT, msg: 'This board cart already exists.' };
      return result;
    }

    await Cart.create(cartBody);

    result = { httpStatus: httpStatus.OK, status: "successful" }      
    return result
  },

  async getAllCart(req, res) {
    let result = {}
    
    const { page = 1, limit = 100, sort_order = 'ASC', sort_field = 'id' } = req.query;
    const total = (await Cart.findAll()).length;

    const totalPages = Math.ceil(total / limit);

    const carts = await Cart.findAll({
      order: [[ sort_field, sort_order ]],
      limit: limit,
      offset: (page - 1) ? (page - 1) * limit : 0,
      attributes: [ 
        'id', 
        'cart_models', 
        'cart_brand', 
        'cart_tara', 
        'cart_color',
        'cart_bodyworks',
        'cart_year',
        'cart_chassis',
        'cart_liter_capacity',
        'cart_ton_capacity',
        'cart_board',
      ], 
    });

    const currentPage = Number(page)

    result = { 
      httpStatus: httpStatus.OK, 
      status: "successful", 
      total, 
      totalPages, 
      currentPage, 
      dataResult: carts 
    } 

    return result
  },

  async getIdCart(req, res) {
    let result = {}

    let cart = await Cart.findByPk(req.id, {
      attributes: [ 
        'id', 
        'cart_models', 
        'cart_brand', 
        'cart_tara', 
        'cart_color',
        'cart_bodyworks',
        'cart_year',
        'cart_chassis',
        'cart_liter_capacity',
        'cart_ton_capacity',
        'cart_board',
      ],  
    });

    if (!cart) {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Cart not found' }}      
      return result
    }

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: cart }      
    return result
  },

  async updateCart(req, res) {   
    let result = {}

    let carts = req
    let cartId = res.id

    const cart = await Cart.findByPk(cartId);

    await cart.update(carts);

    const cartResult = await Cart.findByPk(cartId, {
      attributes: [
        'id', 
        'cart_models', 
        'cart_brand', 
        'cart_tara', 
        'cart_color',
        'cart_bodyworks',
        'cart_year',
        'cart_chassis',
        'cart_liter_capacity',
        'cart_ton_capacity',
        'cart_board',
      ],
    });

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: cartResult }      
    return result
  },
  
  async deleteCart(req, res) {
    let result = {}
    
    const id  = req.id;

    const cart = await Cart.destroy({
      where: {
        id: id,
      },
    });

    if (!cart) {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Cart not found' }}      
      return result
    }

    result = {httpStatus: httpStatus.OK, status: "successful", responseData: { msg: 'Deleted cart' }}      
    return result
  }
}