import httpStatus from 'http-status-codes';

import User from '../app/models/User';
import Driver from '../app/models/Driver';
import Notification from "../app/schemas/Notification";
import Notifications from "../app/models/Notification";

export default {
  async getAllNotification(req, res) {
    let result = {}

    const checkIsMaster = await User.findOne({
      where: { id: req.userId, type_position: "master" }
    })

    if (!checkIsMaster) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'User not is Master' }      
      return result
    }

    console.log("id", req.userId)

    const notifications = await Notification.find({
      // user: req.userId
    }).sort({ createdAt: "desc" })
      .limit(20)

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: notifications } 

    return result
  },

  async getAll(req, res) {
    let result = {}

    const checkIsMaster = await User.findOne({
      where: { id: req.userId, type_position: "master" }
    })

    if (!checkIsMaster) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'User not is Master' }      
      return result
    } else if (!checkIsMaster) {
      const notificationss = await Notifications.findAll({
        where: { user_id: req.userId },
        order: [["createdAt", "desc"]],
        attributes: [ 'id', 'content', 'user_id', 'read' ]
      })
  
      result = { httpStatus: httpStatus.OK, status: "successful", dataResult: notificationss } 
      return result
    }

    const checkIsDriver = await Driver.findOne({
      where: { id: req.userId, type_position: "collaborator" }
    })

    if (!checkIsDriver) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'User not is Driver' }      
      return result
    } else if (!checkIsDriver) {
      const notificationsDriver = await Notifications.findAll({
        where: { driver_id: req.userId },
        order: [["createdAt", "desc"]],
        attributes: [ 'id', 'content', 'driver_id', 'read' ]
      })

      result = { httpStatus: httpStatus.OK, status: "successful", dataResult: notificationsDriver } 
      return result
    }
  },

  async updateNotification(req, res) {   
    let result = {}

    let notificationId = res.id

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    )

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: notification }      
    return result
  },

  async update(req, res) {   
    let result = {}

    let notificationId = res.id

    const notificationReq = await Notifications.findByPk(notificationId)

    if (!notificationReq) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Notification not found' }      
      return result
    }

    await notificationReq.update({ read: true })

    const notification = await Notifications.findByPk(notificationId)

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: notification }      
    return result
  },
}