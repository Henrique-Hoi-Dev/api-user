import FreightService from '../../service/FreightService';

class FreightController {

  async createFreight(req, res) {
    try {
      let response = await FreightService.createFreight(req.body);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json(response)
      }
            
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  async getAllFreight(req, res) {
    try {
      let response = await FreightService.getAllFreight(req, res);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json(response)
      }

    } catch (error) {
      return res.status(400).json({ mgs: error.message })
    }
  }

  async getIdFreight(req, res) { 
    try {
      let response = await FreightService.getIdFreight(req.params);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json(response)
      }

    } catch (error) {
      return res.status(400).json({ mgs: error.message })
    }
  }

  async updateFreight(req, res) {
    try {
      let response = await FreightService.updateFreight(req.body, req.params);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json(response)
      }

    } catch (error) {
      return res.status(400).json({ mgs: error.message })
    }
  } 

  async deleteFreight(req, res) {
    try {
      let response = await FreightService.deleteFreight(req.params);

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

export default new FreightController();
