// OneSignalService.js
import OneSignal from 'onesignal-node';

// Aqui você pode definir as variáveis de ambiente ou usar valores fixos
// mas o ideal é colocar no .env e acessar via process.env
const appId = process.env.ONESIGNAL_APP_ID; // ID do seu app OneSignal
const apiKey = process.env.ONESIGNAL_API_KEY; // REST API Key do OneSignal

// Inicializa o cliente da OneSignal
const oneSignalClient = new OneSignal.Client(appId, apiKey);

export default {
    /**
     * Envia notificação push para um ou mais usuários específicos
     * @param {Array<string>} externalUserIds Lista de IDs únicos que você cadastrou na OneSignal
     * @param {string} title Título da notificação
     * @param {string} message Conteúdo da notificação
     * @returns {Promise<any>} Retorno da API da OneSignal
     */
    async sendToUsers(externalUserIds, title, message) {
        try {
            const notification = {
                // IDs de usuário que você associou na OneSignal usando 'external_user_id'
                // Geralmente você envia do front-end para o OneSignal a identificação do usuário
                include_external_user_ids: externalUserIds,

                // Conteúdo da notificação
                headings: {
                    en: title, // ou "pt": se quiser personalizar em PT-BR
                },
                contents: {
                    en: message,
                },

                // ID do seu app (caso não tenha setado no Client)
                app_id: appId,

                // Qualquer dado extra que queira enviar
                data: {
                    foo: 'bar',
                },
            };

            const response = await oneSignalClient.createNotification(notification);
            return response.body; // Retorna dados da API
        } catch (error) {
            console.error('Erro ao enviar notificação:', error);
            throw error;
        }
    },

    /**
     * Envia notificação push para todos os usuários (segmento "All")
     */
    async sendToAll(title, message) {
        try {
            const notification = {
                included_segments: ['All'],
                headings: { en: title },
                contents: { en: message },
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
