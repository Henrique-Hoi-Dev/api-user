import HttpStatus from 'http-status';
import FinancialStatementsService from '../service/FinancialStatementsService';

class FinancialStatementsController {
  async create(req, res, next) {
    try {
      const data = await FinancialStatementsService.create(req, req.body);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async getAll(req, res, next) {
    try {
      const data = await FinancialStatementsService.getAll(req.query);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async getId(req, res, next) {
    try {
      const data = await FinancialStatementsService.getId(
        req.userId,
        req.params.id
      );
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async update(req, res, next) {
    try {
      const data = await FinancialStatementsService.update(
        req.body,
        req.params.id
      );
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async delete(req, res) {
    try {
      const data = await FinancialStatementsService.delete(req.params.id);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async getDataDriver(req, res) {
    try {
      let response = await FinancialStatementsService.getDataDriver(req, res);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json(response);
      }
    } catch (error) {
      return res.status(200).json({ mgs: error.message });
    }
  }
}

export default new FinancialStatementsController();
