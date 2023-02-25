import NotificationService from '../service/NotificationService';

class NotificationController {
  async getAll(req, res) {
    try {
      let response = await NotificationService.getAll(req, res);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json(response);
      }
    } catch (error) {
      return res.status(400).json({ mgs: error.message });
    }
  }

  async update(req, res) {
    try {
      let response = await NotificationService.update(req.body, req.params);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json(response);
      }
    } catch (error) {
      return res.status(400).json({ mgs: error.message });
    }
  }
}

export default new NotificationController();
