import HttpStatus from 'http-status';
import SessionService from '../service/SessionService';

class SessionController {
    async sessionUser(req, res, next) {
        try {
            const data = await SessionService.sessionUser(req.body);
            return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify({ data: data })));
        } catch (error) {
            next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.menssage }));
        }
    }
}
export default new SessionController();
