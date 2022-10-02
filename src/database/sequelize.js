import Sequelize from 'sequelize';

import User from '../app/models/User';
import Driver from '../app/models/Driver';
import Truck from '../app/models/Truck';
import Cart from '../app/models/Cart';
import Freight from '../app/models/Freight';
import Restock from '../app/models/Restock';
import TravelExpenses from '../app/models/TravelExpenses';
import DepositMoney from '../app/models/DepositMoney';
import DataDriver from '../app/models/DataDriver';
import Notification from '../app/models/Notification';
import FinancialStatements from '../app/models/FinancialStatements';

import "dotenv/config"

const sequelize = new Sequelize(process.env.DATABASE_URL_AWS, {
  dialect: 'postgres',
  dialectOptions: { 
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
  },
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
});

// check connection (optional)
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

models
.map((model) => model.init(sequelize))
.map(
  (model) => model.associate && model.associate(sequelize.models)
);

sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((err) => console.error("Unable to connect to the database:", err));

export default sequelize;