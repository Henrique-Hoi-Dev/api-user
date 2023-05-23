import Credit from '../models/Credit';
import FinancialStatements from '../models/FinancialStatements';
import Driver from '../models/Driver';
import Notification from '../models/Notification';
import Freight from '../models/Freight';

export default {
  _formatRealValue(value) {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    return formatter.format(value);
  },

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
      type_method: body.type_method,
    });

    const driverFind = await Driver.findByPk(result.driver_id);

    driverFind.addTransaction({
      value: result.value,
      typeTransactions: result.description,
      date: new Date(),
      type_method: result.type_method,
    });

    await Notification.create({
      content: `${driverFind.name}, Foi registrado um ${
        result.type_method === 'DEBIT' ? 'Débito' : 'Crédito'
      }! no valor de ${this._formatRealValue(body.value / 100)}`,
      driver_id: body.driver_id,
    });

    const driver = await Driver.findByPk(driverFind.id);

    // const values = driverFind.transactions
    //   .map((res) => {
    //     if (res !== null) {
    //       return res.value;
    //     }
    //   })
    //   .filter((value) => typeof value === 'number');

    const { creditTransactions, debitTransactions } =
      driverFind.transactions.reduce(
        (acc, transaction) => {
          if (transaction !== null) {
            if (transaction.type_method === 'CREDIT') {
              acc.creditTransactions.push(transaction.value);
            } else if (transaction.type_method === 'DEBIT') {
              acc.debitTransactions.push(transaction.value);
            }
          }
          return acc;
        },
        { creditTransactions: [], debitTransactions: [] }
      );
    console.log(
      '🚀 ~ file: CreditService.js:77 ~ create ~ creditTransactions:',
      creditTransactions
    );
    console.log(
      '🚀 ~ file: CreditService.js:77 ~ create ~ debitTransactions:',
      debitTransactions
    );

    const totalCredit = creditTransactions.reduce((acc, cur) => acc + cur, 0);
    const totalDebit = debitTransactions.reduce((acc, cur) => acc + cur, 0);
    const netAmount = totalCredit - totalDebit;

    const resultF = await driver.update({
      transactions: driverFind.transactions,
      credit: netAmount,
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
