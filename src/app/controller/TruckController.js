import HttpStatus from 'http-status';
import TruckService from '../service/TruckService';

class TruckController {
    async create(req, res, next) {
        try {
            const data = await TruckService.create(req.body);
            return res.status(HttpStatus.CREATED).json(JSON.parse(JSON.stringify(data)));
        } catch (error) {
            next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
        }
    }

    async getAll(req, res, next) {
        try {
            const data = await TruckService.getAll(req.query);
            return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
        } catch (error) {
            next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
        }
    }

    async getAllSelect(req, res, next) {
        try {
            const data = await TruckService.getAllSelect(req.query);
            return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
        } catch (error) {
            next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
        }
    }

    async getId(req, res, next) {
        try {
            const data = await TruckService.getId(req.params.id);
            return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
        } catch (error) {
            next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
        }
    }

    async update(req, res, next) {
        try {
            const data = await TruckService.update(req.body, req.params.id);
            return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
        } catch (error) {
            next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
        }
    }

    async uploadImage(req, res, next) {
        try {
            const data = await TruckService.uploadImage(req.body, req.params.id);
            return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
        } catch (error) {
            next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
        }
    }

    async delete(req, res, next) {
        try {
            const data = await TruckService.delete(req.params.id);
            return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
        } catch (error) {
            next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
        }
    }
}

export default new TruckController();
