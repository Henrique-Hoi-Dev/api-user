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
import Permission from '../app/models/Permission';

import databaseConfig from '../config/database.js';

import 'dotenv/config';

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
  Permission,
];

class Database {
  constructor() {
    this.init();
    this.mongo();
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
      process.env.DATABASE_URL_MONGO,
      {
        useNewUrlParser: true,
        // useFindAndModify: true
      },
      console.log('moongo URL', process.env.DATABASE_URL_MONGO)
    );
  }
}

export default new Database();
