import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import Driver from '../app/models/Driver';
import Truck from '../app/models/Truck';
import Cart from '../app/models/Cart';
import Freight from '../app/models/Freight';
import Restock from '../app/models/Restock';
import TravelExpenses from '../app/models/TravelExpenses';
import DataDriver from '../app/models/DataDriver';
import DepositMoney from '../app/models/DepositMoney';
import Notification from '../app/models/Notification';
import FinancialStatements from '../app/models/FinancialStatements';

import databaseConfig from '../config/database.js';

const models = [ 
  User,
  Driver,
  Truck,
  Cart,
  Freight,
  DepositMoney,
  DataDriver,
  Notification,
  FinancialStatements,
  TravelExpenses,
  Restock,
];

class Database {
  constructor() {
    this.init();
    this.mongo()
  }

  init() {
    this.connetion = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connetion))
      .map(
        (model) => model.associate && model.associate(this.connetion.models)
      );
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/titon',
      { useNewUrlParser: true }
    )
  }
}

export default new Database();
