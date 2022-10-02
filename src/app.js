import express from 'express';
import routes from './routes';
import cors from 'cors';
import sequelize from './database/sequelize';
import "dotenv/config"

// só para rodar migration na Produção ou confinguração local
// import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.sequelize();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }

  sequelize() {
    sequelize
  }
}

export default new App().server;
