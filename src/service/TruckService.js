import Truck from "../app/models/Truck";
import httpStatus from 'http-status-codes';

export default {
  async createTruck(req, res) {
    let result = {}
    let {
      truck_models,
      truck_name_brand,
      truck_board,
      truck_color,
      truck_km,
      truck_chassis,
      truck_year,
      truck_avatar
    } = req;

    const chassisExist = await Truck.findOne({ where: { truck_chassis: truck_chassis } });
    const boardExist = await Truck.findOne({ where: { truck_board: truck_board } });

    if (chassisExist) {
      result = { httpStatus: httpStatus.CONFLICT, msg: 'This chassis truck already exists.' };
      return result;
    }

    if (boardExist) {
      result = { httpStatus: httpStatus.CONFLICT, msg: 'This board truck already exists.' };
      return result;
    }

    const truckBody = { 
      truck_models,
      truck_name_brand,
      truck_board,
      truck_color,
      truck_km,
      truck_chassis,
      truck_year,
      truck_avatar
    }

    await Truck.create(truckBody);

    result = { httpStatus: httpStatus.OK, status: "successful" }      
    return result
  },

  async getAllTruck(req, res) {
    let result = {}
    
    const { page = 1, limit = 100, sort_order = 'ASC', sort_field = 'id' } = req.query;
    const total = (await Truck.findAll()).length;

    const totalPages = Math.ceil(total / limit);

    const trucks = await Truck.findAll({
      order: [[ sort_field, sort_order ]],
      limit: limit,
      offset: (page - 1) ? (page - 1) * limit : 0,
      attributes: [ 
        'id', 
        'truck_models',
        'truck_name_brand',
        'truck_board', 
        'truck_km', 
        'truck_color',
        'truck_chassis',
        'truck_year',
        'truck_avatar',
      ], 
    });

    const currentPage = Number(page)

    result = { 
      httpStatus: httpStatus.OK, 
      status: "successful", 
      total, 
      totalPages, 
      currentPage, 
      dataResult: trucks 
    } 

    return result
  },

  async getIdTruck(req, res) {
    let result = {}

    let truck = await Truck.findByPk(req.id, {
      attributes: [ 
        'id', 
        'truck_models',
        'truck_name_brand',
        'truck_board', 
        'truck_km', 
        'truck_color',
        'truck_chassis',
        'truck_year',
        'truck_avatar',
      ],  
    });

    if (!truck) {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Truck not found' }}      
      return result
    }

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: truck }      
    return result
  },

  async updateTruck(req, res) {   
    let result = {}
    let truckId = res.id

    let {
      truck_models,
      truck_name_brand,
      truck_color,
      truck_km,
      truck_year,
      truck_avatar
    } = req;

    // const chassisExist = await Truck.findOne({ where: { truck_chassis: truck_chassis } });
    // const boardExist = await Truck.findOne({ where: { truck_board: truck_board } });

    // if (chassisExist) {
    //   result = { httpStatus: httpStatus.CONFLICT, msg: 'This chassis truck already exists.' };
    //   return result;
    // }

    // if (boardExist) {
    //   result = { httpStatus: httpStatus.CONFLICT, msg: 'This board truck already exists.' };
    //   return result;
    // }

    const truckBody = { 
      truck_models,
      truck_name_brand,
      truck_color,
      truck_km,
      truck_year,
      truck_avatar
    }

    const truck = await Truck.findByPk(truckId);
    await truck.update(truckBody);

    const truckResult = await Truck.findByPk(truckId, {
      attributes: [
        'id', 
        'truck_models',
        'truck_name_brand',
        'truck_board', 
        'truck_km', 
        'truck_color',
        'truck_chassis',
        'truck_year',
        'truck_avatar',
      ],
    });

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: truckResult }      
    return result
  },
  
  async deleteTruck(req, res) {
    let result = {}
    
    const id  = req.id;

    const truck = await Truck.destroy({
      where: {
        id: id,
      },
    });

    if (!truck) {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Truck not found' }}      
      return result
    }

    result = {httpStatus: httpStatus.OK, status: "successful", responseData: { msg: 'Deleted truck' }}      
    return result
  }
}