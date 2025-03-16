import OneSignal from 'onesignal-node';

const appId = process.env.ONESIGNAL_APP_ID; // ID do seu app OneSignal
const apiKey = process.env.ONESIGNAL_API_KEY; // REST API Key do OneSignal

const oneSignalClient = new OneSignal.Client(appId, apiKey);

export default {
    /**
     * Envia notificação push para um ou mais usuários específicos
     * @param {Array<string>} externalUserIds Lista de IDs únicos que você cadastrou na OneSignal
     * @param {string} title Título da notificação
     * @param {string} message Conteúdo da notificação
     * @returns {Promise<any>} Retorno da API da OneSignal
     */
    async sendToUsers({ externalUserIds, title, message }) {
        try {
            const notification = {
                include_external_user_ids: externalUserIds,
                headings: {
                    pt: title,
                },
                contents: {
                    pt: message,
                },
                app_id: appId,
                // data: {
                //     foo: 'bar',
                // },
            };

            const response = await oneSignalClient.createNotification(notification);
            return response.body;
        } catch (error) {
            console.error('Erro ao enviar notificação:', error);
            throw error;
        }
    },

    /**
     * Envia notificação push para todos os usuários (segmento "All")
     */
    async sendToAll({ title, message }) {
        try {
            const notification = {
                included_segments: ['All'],
                headings: { pt: title },
                contents: { pt: message },
                app_id: appId,
            };

            const response = await oneSignalClient.createNotification(notification);
            return response.body;
        } catch (error) {
            console.error('Erro ao enviar notificação para todos:', error);
            throw error;
        }
    },
};
