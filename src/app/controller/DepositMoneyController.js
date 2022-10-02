import DepositMoneyService from '../../service/DepositMoneyService';

class DepositMoneyController {

  async createDepositMoney(req, res) {
    try {
      let response = await DepositMoneyService.createDepositMoney(req.body);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json({ msg: response.msg })
      }
            
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  async getAllDepositMoney(req, res) {
    try {
      let response = await DepositMoneyService.getAllDepositMoney(req, res);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json({ msg: response.msg })
      }

    } catch (error) {
      return res.status(400).json({ mgs: error.message })
    }
  }

  async getIdDepositMoney(req, res) { 
    try {
      let response = await DepositMoneyService.getIdDepositMoney(req.params);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json(response)
      }

    } catch (error) {
      return res.status(400).json({ mgs: error.message })
    }
  }

  async updateDepositMoney(req, res) {
    try {
      let response = await DepositMoneyService.updateDepositMoney(req.body, req.params);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json({ msg: response.responseData })
      }

    } catch (error) {
      return res.status(400).json({ mgs: error.message })
    }
  } 

  async deleteDepositMoney(req, res) {
    try {
      let response = await DepositMoneyService.deleteDepositMoney(req.params);

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

export default new DepositMoneyController();
