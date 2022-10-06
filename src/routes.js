import { Router } from 'express';

import SessionController from './app/controller/SessionController';
import UserController from './app/controller/UserController';
import TruckController from './app/controller/TruckController';
import FreightController from './app/controller/FreightController';
import FinancialStatementsController from './app/controller/FinancialStatementsController';
import CartController from './app/controller/CartController';
import NotificationController from './app/controller/NotificationController';
import DriverController from './app/controller/DriverController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// cadastro
routes.post('/user/register', UserController.createUser);
routes.post('/user/authenticate', SessionController.sessionUser);

routes.post('/driver/register', DriverController.createDriver);

// autenticação
routes.use(authMiddleware);

// users
routes.put('/user/:id', UserController.updateUser)
      .get('/user/:id', UserController.getIdUser)
      .get('/users', UserController.getAllUser)
      .delete('/user/:id', UserController.deleteUser);

// users driver
routes.put('/user/driver/:id', DriverController.updateDriver)
      .get('/user/driver/:id', DriverController.getIdDriver)
      .get('/drivers', DriverController.getAllDriver)
      .delete('/user/driver/:id', DriverController.deleteDriver);

// financial statements
routes.post('/user/financialStatement', FinancialStatementsController.createFinancialStatements)
      .put('/user/financialStatement/:id', FinancialStatementsController.updateFinancialStatements)
      .get('/user/financialStatement/:id', FinancialStatementsController.getIdFinancialStatements)
      .get('/financialStatements', FinancialStatementsController.getAllFinancialStatements)
      .delete('/user/financialStatement/:id', FinancialStatementsController.deleteFinancialStatements);

// freight
routes.post('/user/freight', FreightController.createFreight)
      .put('/user/freight/:id', FreightController.updateFreight)
      .get('/user/freight/:id', FreightController.getIdFreight)
      .get('/freights', FreightController.getAllFreight)
      .delete('/user/freight/:id', FreightController.deleteFreight)

// notification
// routes.get('/user/notifications', NotificationController.getAllNotification);
routes.get('/notifications', NotificationController.getAll);
routes.put('/notification/:id', NotificationController.updateNotification);
routes.put('/notifications/:id', NotificationController.update);

// trucks
routes.post('/user/truck', TruckController.createTruck)
      .put('/user/truck/:id', TruckController.updateTruck)
      .get('/user/truck/:id', TruckController.getIdTruck)
      .get('/trucks', TruckController.getAllTruck)
      .delete('/user/truck/:id', TruckController.deleteTruck);

// cart
routes.post('/user/cart', CartController.createCart)
      .put('/user/cart/:id', CartController.updateCart)
      .get('/user/cart/:id', CartController.getIdCart)
      .get('/carts', CartController.getAllCart)
      .delete('/user/cart/:id', CartController.deleteCart);


export default routes;
