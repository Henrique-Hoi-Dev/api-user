import HttpStatus from 'http-status';
import UserService from '../service/UserService';

class UserController {
  async create(req, res, next) {
    try {
      const data = await UserService.create(req.body);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async getAll(req, res, next) {
    try {
      const data = await UserService.getAll(req.query);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async getId(req, res, next) {
    try {
      const data = await UserService.getId(req.params.id);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async update(req, res, next) {
    try {
      const data = await UserService.update(req.body, req.params.id);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async addRole(req, res, next) {
    try {
      const data = await UserService.addRole(req.body, req.params.id);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async delete(req, res, next) {
    try {
      const data = await UserService.delete(req.params.id);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }
}

export default new UserController();
