import SessionService from '../../service/SessionService';

class SessionController {
  
  async sessionUser(req, res) {
    try {
      let response = await SessionService.sessionUser(req.headers);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json({ msg: response.msg })
      }
        
    } catch (error) {
      return res.status(400).json({ mgs: error.message });
    }
  }

  async sessioDriver(req, res) {
    try {
      let response = await SessionService.sessionDriver(req.headers);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json({ msg: response.msg })
      }
        
    } catch (error) {
      return res.status(400).json({ mgs: error.message });
    }
  }
}
export default new SessionController();
