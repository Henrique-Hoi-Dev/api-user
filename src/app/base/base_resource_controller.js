import BaseController from '../base/base_controller';

class BaseResourceController extends BaseController {
  constructor(model, errorHandler) {
    super(errorHandler);
    this.model = model;
  }
}

module.exports = BaseResourceController;
