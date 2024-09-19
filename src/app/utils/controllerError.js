import httpStatus from 'http-status';
import ev from 'express-validation';
// const camelcaseKeys = require('camelcase-keys');

export default {
    errorResponse(status, message, { field, reasons } = {}) {
        const err = new Error();
        err.status = status || httpStatus.UNPROCESSABLE_ENTITY;
        err.message = message || 'Unprocessable entity';
        if (field) err.field = field;
        if (reasons) err.reasons = reasons;

        return err;
    },

    sanitizeError(e) {
        const response = e.response;
        const config = e.config;

        return {
            message: e.message || (response.data && (response.data.errorMessage || response.data.message)),
            status: response.status,
            key: e.key,
            errors: { ...response.data, url: config.url, baseURL: config.baseURL, request: JSON.parse(config.data) },
        };
    },

    handleError(error) {
        if (error.response && error.config) return this.sanitizeError(error);

        if (this.errorHandler) {
            return this.errorHandler.errorResponse(error);
        }
        if (error instanceof ev.ValidationError || error.error === 'Unprocessable Entity') {
            return this.validationsErrorHandler.errorResponse(error);
        }
        let message = error.message || error.errorMessage;
        if (!message && typeof error.error === 'string') message = error.error;
        const status = error.status;
        return this.errorResponse(status, message, { field: error.field, reasons: error.reasons });
    },

    // parseKeysToCamelcase(payload) {
    //     payload = JSON.parse(JSON.stringify(payload));
    //     return camelcaseKeys(payload, { deep: true });
    // },
};
