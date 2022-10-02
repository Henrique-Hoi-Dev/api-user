import FinancialStatementsService from '../../service/FinancialStatementsService';

class FinancialStatementsController {

  async createFinancialStatements(req, res) {
    try {
      let response = await FinancialStatementsService.createFinancialStatements(req.body);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json({ msg: response.msg })
      }
            
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  async getAllFinancialStatements(req, res) {
    try {
      let response = await FinancialStatementsService.getAllFinancialStatements(req, res);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json({ msg: response.msg })
      }

    } catch (error) {
      return res.status(400).json({ mgs: error.message })
    }
  }

  async getIdFinancialStatements(req, res) { 
    try {
      let response = await FinancialStatementsService.getIdFinancialStatements(req.params);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json(response)
      }

    } catch (error) {
      return res.status(400).json({ mgs: error.message })
    }
  }

  async updateFinancialStatements(req, res) {
    try {
      let response = await FinancialStatementsService.updateFinancialStatements(req.body, req.params);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json({ msg: response.msg })
      }

    } catch (error) {
      return res.status(400).json({ mgs: error.message })
    }
  } 

  async deleteFinancialStatements(req, res) {
    try {
      let response = await FinancialStatementsService.deleteFinancialStatements(req.params);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json(response)
      }

    } catch (error) {
      return res.status(200).json({ mgs: error.message})
    }
  }

  async getDataDriver(req, res) {
    try {
      let response = await FinancialStatementsService.getDataDriver(req, res);

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

export default new FinancialStatementsController();
