import CartService from '../../service/CartService';

class CartController {

  async createCart(req, res) {
    try {
      let response = await CartService.createCart(req.body);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json({ msg: response.msg })
      }
            
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  async getAllCart(req, res) {
    try {
      let response = await CartService.getAllCart(req, res);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json({ msg: response.msg })
      }

    } catch (error) {
      return res.status(400).json({ mgs: error.message })
    }
  }

  async getIdCart(req, res) { 
    try {
      let response = await CartService.getIdCart(req.params);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json(response)
      }

    } catch (error) {
      return res.status(400).json({ mgs: error.message })
    }
  }

  async updateCart(req, res) {
    try {
      let response = await CartService.updateCart(req.body, req.params);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json({ msg: response.msg })
      }

    } catch (error) {
      return res.status(400).json({ mgs: error.message })
    }
  } 

  async deleteCart(req, res) {
    try {
      let response = await CartService.deleteCart(req.params);

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

export default new CartController();
