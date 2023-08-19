import HttpStatus from 'http-status';
import CreditService from '../service/CreditService';

class CreditController {
    async create(req, res, next) {
        try {
            const data = await CreditService.create(req.body);
            return res.status(HttpStatus.CREATED).json(JSON.parse(JSON.stringify(data)));
        } catch (error) {
            next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
        }
    }

    async getAll(req, res, next) {
        try {
            const data = await CreditService.getAll(req.query);
            return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
        } catch (error) {
            next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
        }
    }

    async getId(req, res, next) {
        try {
            const data = await CreditService.getId(req.params.id);
            return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
        } catch (error) {
            next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
        }
    }

    async delete(req, res, next) {
        try {
            const data = await CreditService.delete(req.params.id);
            return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
        } catch (error) {
            next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
        }
    }
}

export default new CreditController();
