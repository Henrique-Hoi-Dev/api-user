import httpStatus from 'http-status-codes';

import User from '../models/User';
// import Notification from "../schemas/Notification";
import Notifications from '../models/Notification';

export default {
  async getAll(req, res) {
    let result = {};

    const checkIsMaster = await User.findOne({
      where: { id: req.userId, type_role: 'MASTER' },
    });

    if (!checkIsMaster) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        msg: 'User not is Master',
      };
      return result;
    }

    const notifications = await Notifications.findAll({
      where: { user_id: req.userId, read: false },
      order: [['created_at', 'DESC']],
      attributes: [
        'id',
        'content',
        'read',
        'created_at',
        'freight_id',
        'driver_id',
      ],
    });

    const history = await Notifications.findAll({
      where: { user_id: req.userId, read: true },
      order: [['created_at', 'DESC']],
      attributes: [
        'id',
        'content',
        'read',
        'created_at',
        'freight_id',
        'driver_id',
      ],
    });

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      dataResult: { notifications, history },
    };

    return result;
  },

  async update(req, res) {
    let result = {};

    let notificationId = res.id;

    const notificationReq = await Notifications.findByPk(notificationId);

    if (!notificationReq) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        msg: 'Notification not found',
      };
      return result;
    }

    if (notificationReq.user_id === null) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        msg: 'Do not have permission for this notification',
      };
      return result;
    }

    if (notificationReq.read === true) {
      result = {
        httpStatus: httpStatus.CONFLICT,
        dataResult: { msg: 'Has already been read.' },
      };
      return result;
    }

    await notificationReq.update({ read: true });

    const notification = await Notifications.findByPk(notificationId);

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      dataResult: notification,
    };
    return result;
  },
};
