import { Router } from 'express';

import SessionController from './app/controller/SessionController';
import UserController from './app/controller/UserController';
import TruckController from './app/controller/TruckController';
import FreightController from './app/controller/FreightController';
import FinancialStatementsController from './app/controller/FinancialStatementsController';
import CartController from './app/controller/CartController';
import NotificationController from './app/controller/NotificationController';
import DriverController from './app/controller/DriverController';
import PermissionController from './app/controller/PermissionController';

import authMiddleware, { verifyIfUserHasRole } from './app/middlewares/auth';

// const fs = require("fs");

const routes = new Router();

routes.post('/user/register', UserController.create);
routes.post('/user/authenticate', SessionController.sessionUser);

routes.post('/driver/register', DriverController.create);

// sistema de relatorios
// routes.get("/download", (req, res) => {
// // Lê o conteúdo do arquivo xlsx
// const file = fs.readFileSync("./sales-18-12-2022.xlsx");

// // Define o cabeçalho da resposta para indicar que está enviando um arquivo xlsx
// res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
// res.setHeader("Content-Disposition", "attachment; filename=meu_arquivo.xlsx");

// // Envia o conteúdo do arquivo como resposta
// res.send(file);
// });

routes.use(authMiddleware);

routes
  .put('/user/:id', verifyIfUserHasRole('MASTER'), UserController.update)
  .get('/user/:id', verifyIfUserHasRole('MASTER'), UserController.getId)
  .get('/users', verifyIfUserHasRole('MASTER'), UserController.getAll)
  .delete('/user/:id', verifyIfUserHasRole('MASTER'), UserController.delete);

routes
  .get('/user/driver/:id', DriverController.getId)
  .get('/drivers', DriverController.getAll)
  .get('/drivers-select', DriverController.getAllSelect)
  .delete('/user/driver/:id', DriverController.delete);

routes
  .post('/user/financialStatement', FinancialStatementsController.create)
  .patch('/user/financialStatement/:id', FinancialStatementsController.update)
  .get('/user/financialStatement/:id', FinancialStatementsController.getId)
  .get('/financialStatements', FinancialStatementsController.getAll)
  .delete('/user/financialStatement/:id', FinancialStatementsController.delete);

routes
  .post('/user/freight', FreightController.create)
  .patch(
    '/freight/:id',
    verifyIfUserHasRole('MASTER'),
    FreightController.update
  )
  .get(
    '/user/first-check/:id',
    verifyIfUserHasRole('MASTER'),
    FreightController.firstCheckId
  )
  .get('/user/freight/:id', FreightController.getId)
  .delete('/user/freight/:id', FreightController.delete);

routes.get(
  '/notifications',
  verifyIfUserHasRole('MASTER'),
  NotificationController.getAll
);

routes.put(
  '/notifications/:id',
  verifyIfUserHasRole('MASTER'),
  NotificationController.updateRead
);

routes
  .post('/user/truck', TruckController.create)
  .put('/user/truck/:id', TruckController.update)
  .get('/user/truck/:id', TruckController.getId)
  .get('/trucks', TruckController.getAll)
  .get('/trucks-select', TruckController.getAllSelect)
  .delete('/user/truck/:id', TruckController.delete);

routes
  .post('/user/cart', CartController.create)
  .put('/user/cart/:id', CartController.update)
  .get('/user/cart/:id', CartController.getId)
  .get('/carts', CartController.getAll)
  .get('/carts-select', CartController.getAllSelect)
  .delete('/user/cart/:id', CartController.delete);

routes
  .post(
    '/user/permission',
    verifyIfUserHasRole('MASTER'),
    PermissionController.createPermission
  )
  .put(
    '/user/permission/:id',
    verifyIfUserHasRole('MASTER'),
    PermissionController.updatePermission
  )
  .get(
    '/permissions',
    verifyIfUserHasRole('MASTER'),
    PermissionController.getAllPermission
  );

routes.put(
  '/user/add-role/:id',
  verifyIfUserHasRole('MASTER'),
  UserController.addRole
);

export default routes;
