import PermissionService from '../service/PermissionService';

class PermissionController {
    async createPermission(req, res) {
        try {
            let response = await PermissionService.createPermission(req.body);

            if (response.httpStatus === 200) {
                return res.send(response);
            } else {
                return res.status(response.httpStatus).json(response);
            }
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async updatePermission(req, res) {
        try {
            let response = await PermissionService.updatePermission(req.body, req.params);

            if (response.httpStatus === 200) {
                return res.send(response);
            } else {
                return res.status(response.httpStatus).json(response);
            }
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getAllPermission(req, res) {
        try {
            let response = await PermissionService.getAllPermission();

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

export default new PermissionController();
