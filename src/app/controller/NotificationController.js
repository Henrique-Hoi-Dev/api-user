import HttpStatus from 'http-status';
import NotificationService from '../service/NotificationService';

class NotificationController {
    async getAll(req, res, next) {
        try {
            const data = await NotificationService.getAll(req, res);
            return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
        } catch (error) {
            next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
        }
    }

    async updateRead(req, res, next) {
        try {
            const data = await NotificationService.updateRead(req.params.id);
            return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
        } catch (error) {
            next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
        }
    }
}

export default new NotificationController();
