import Credit from '../models/Credit';
import FinancialStatements from '../models/FinancialStatements';
import Driver from '../models/Driver';
import Notification from '../models/Notification';
import Freight from '../models/Freight';

export default {
  async create(body) {
    const financialProps = await FinancialStatements.findOne({
      where: { driver_id: body.driver_id, status: true },
    });
    const freight = await Freight.findOne({
      where: {
        financial_statements_id: financialProps.id,
        status: 'STARTING_TRIP',
      },
    });

    if (!financialProps) throw Error('Financial not found.');

    const result = await Credit.create({
      driver_id: body.driver_id,
      freight_id: freight.id,
      financial_statements_id: financialProps.id,
      value: body.value,
      description: body.description,
    });

    const driverFind = await Driver.findByPk(result.driver_id);

    driverFind.addTransaction({
      value: result.value,
      typeTransactions: result.description,
      date: new Date(),
    });

    await Notification.create({
      content: `${driverFind.name}, Você recebeu um crédito!`,
      driver_id: body.driver_id,
    });

    const driver = await Driver.findByPk(driverFind.id);
    console.log('🚀 ~ file: CreditService.js:37 ~ create ~ driver:', driver);
    const values = driverFind.transactions
      .map((res) => {
        if (res !== null) {
          return res.value;
        }
      })
      .filter((value) => typeof value === 'number');
    console.log('🚀 ~ file: CreditService.js:43 ~ values ~ values:', values);
    const total = values.reduce((acc, cur) => acc + cur, 0);
    console.log('🚀 ~ file: CreditService.js:44 ~ create ~ total:', total);

    const resultF = await driver.update({
      transactions: driverFind.transactions,
      credit: total,
    });

    return { resultF, result };
  },

  async getAll(query) {
    const {
      page = 1,
      limit = 100,
      sort_order = 'ASC',
      sort_field = 'id',
    } = query;

    const credits = await Credit.findAll({
      order: [[sort_field, sort_order]],
      limit: limit,
      offset: page - 1 ? (page - 1) * limit : 0,
    });

    const total = credits.length;
    const totalPages = Math.ceil(total / limit);

    const currentPage = Number(page);

    return {
      dataResult: credits,
      total,
      totalPages,
      currentPage,
    };
  },

  async getId(id) {
    let credit = await Credit.findByPk(id);

    if (!credit) throw Error('Credit not found');

    return {
      dataResult: credit,
    };
  },

  async delete(id) {
    const credit = await Credit.destroy({
      where: {
        id: id,
      },
    });

    if (!credit) throw Error('Credit not found');

    return {
      msg: 'Deleted credit',
    };
  },
};
