import User from '../models/User';
import Notifications from '../models/Notification';

export default {
    async getAll(req) {
        const checkIsMaster = await User.findOne({
            where: { id: req.userId, type_role: 'MASTER' },
        });

        if (!checkIsMaster) throw Error('User not is Master');

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
                'user_id',
                'financial_statements_id',
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
                'user_id',
                'financial_statements_id',
            ],
        });

        return { notifications, history };
    },

    async updateRead(id) {
        const notification = await Notifications.findByPk(id);

        if (!notification) throw Error('Notification not found');
        if (notification.user_id === null) throw Error('Do not have permission for this notification');
        if (notification.read === true) throw Error('Has already been read.');

        await notification.update({ read: true });

        return await Notifications.findByPk(id, {
            attributes: ['id', 'content', 'read', 'freight_id', 'driver_id'],
        });
    },
};
