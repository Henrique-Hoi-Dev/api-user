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
import Credit from '../app/models/Credit';
import Cities from '../app/models/Cities.js';
import States from '../app/models/States.js';
// import ValidateCode from '../app/models/ValidateCode';

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
    Credit,
    Cities,
    States,
    // ValidateCode,
];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connetion = new Sequelize(databaseConfig);

        models
            .map((model) => model.init(this.connetion))
            .map((model) => model.associate && model.associate(this.connetion.models));
    }
}

export default new Database();
