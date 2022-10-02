import Freight from "../app/models/Freight";
import User from "../app/models/User";
// import Notification from "../app/schemas/Notification";
import Notification from "../app/models/Notification";
import FinancialStatements from "../app/models/FinancialStatements";

export default {
  async createFreight(req, res) {
    let result = {}
    let freightBody = req;

    const financial = await FinancialStatements.findByPk(freightBody.financial_statements_id)

    if (!financial) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Financial not found' }      
      return result
    }

    await Freight.create(freightBody);

    await Notification.create({
      content: `${financial.driver_name}, Requisitando Um Novo Check Frete!`,
      driver_id: financial.driver_id,
    })

    result = { httpStatus: httpStatus.OK, status: "First check order successful!" }      
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

    let freight = await Freight.findByPk(req.id, {});

    //validar valor liquido do frete
    // precisa do km total que sera feito na viagem
    // e multiplicar pelo valor do disel
    // pegar api do gle para calcular as kms de cidades

    const valueGross = freight.preview_tonne * freight.value_tonne

    const valueDiesel = freight.preview_value_diesel / 100

    const amountSpentOnFuel = freight.travel_km / freight.average_fuel  

    const resultValue = amountSpentOnFuel * valueDiesel

    console.log("valores", resultValue)
    

    if (!freight) {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Freight not found' }}      
      return result
    }

    result = { 
      httpStatus: httpStatus.OK, 
      status: "successful", 
      dataResult: {
        freight, 
        amountSpentOnFuel: resultValue,
        freight_fuel_price: (resultValue - valueGross)
      }
    }      
    return result
  },

  async updateFreight(req, res) {   
    let result = {}

    let freightReq = req

    const freight = await Freight.findByPk(res.id);
    const typeUser = await User.findByPk(req.user_id)

    if (typeUser.type_position === "master") {
      await freight.update({
        status_check_order: freightReq.status_check_order,
      });

      await Notification.create({
        content: `${typeUser.name}, Aceitou Seu Check Frete!`,
        user_id: typeUser.id,
      })

      const freightResult = await Freight.findByPk(res.id);

      return result = { httpStatus: httpStatus.OK, status: "successful", dataResult: freightResult }      
    } else if (req.type_position) {
      result = { httpStatus: httpStatus.BAD_REQUEST, dataResult: { msg: 'User is not master' } }
      return result
    }

    if (freight.dataValues.status_check_order === "approved") {
      await freight.update(freightReq);

      const freightResult = await Freight.findByPk(freightId);

      result = { httpStatus: httpStatus.OK, status: "successful", dataResult: freightResult }
      return result   
    } else {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Shipping was not approved' }}
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