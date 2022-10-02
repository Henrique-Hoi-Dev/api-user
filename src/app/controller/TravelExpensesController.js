import TravelExpensesService from '../../service/TravelExpensesService';

class TravelExpensesController {

  async createTravelExpenses(req, res) {
    try {
      let response = await TravelExpensesService.createTravelExpenses(req.body);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json({ msg: response.msg })
      }
            
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  async getAllTravelExpenses(req, res) {
    try {
      let response = await TravelExpensesService.getAllTravelExpenses(req, res);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json({ msg: response.msg })
      }

    } catch (error) {
      return res.status(400).json({ mgs: error.message })
    }
  }

  async getIdTravelExpenses(req, res) { 
    try {
      let response = await TravelExpensesService.getIdTravelExpenses(req.params);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json(response)
      }

    } catch (error) {
      return res.status(400).json({ mgs: error.message })
    }
  }

  async updateTravelExpenses(req, res) {
    try {
      let response = await TravelExpensesService.updateTravelExpenses(req.body, req.params);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json(response)
      }

    } catch (error) {
      return res.status(400).json({ mgs: error.message })
    }
  } 

  async deleteTravelExpenses(req, res) {
    try {
      let response = await TravelExpensesService.deleteTravelExpenses(req.params);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json(response)
      }

    } catch (error) {
      return res.status(200).json({ mgs: error.message})
    }
  }
}

export default new TravelExpensesController();
