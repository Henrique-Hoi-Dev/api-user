import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Driver extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        name_user: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        status: {
          type: Sequelize.ENUM,
          values: ['ACTIVE', 'INACTIVE', 'INCOMPLETE'],
          defaultValue: 'INCOMPLETE',
        },
        type_positions: {
          type: Sequelize.STRING,
          defaultValue: 'COLLABORATOR',
        },
        permission_id: Sequelize.INTEGER,
        // driver personal data
        cpf: Sequelize.STRING,
        number_cnh: Sequelize.STRING,
        valid_cnh: Sequelize.DATE,
        date_valid_mopp: Sequelize.DATE,
        date_valid_nr20: Sequelize.DATE,
        date_valid_nr35: Sequelize.DATE,
        date_admission: Sequelize.DATE,
        date_birthday: Sequelize.DATE,
        // walking data
        cart: Sequelize.STRING,
        truck: Sequelize.STRING,
        // financial data
        credit: Sequelize.INTEGER,
        transactions: {
          type: Sequelize.ARRAY(
            Sequelize.JSONB({
              typeTransactions: Sequelize.STRING,
              value: Sequelize.INTEGER,
            })
          ),
          defaultValue: null,
        },
        value_fix: Sequelize.INTEGER,
        percentage: Sequelize.INTEGER,
        daily: Sequelize.INTEGER,
      },
      {
        sequelize,
        timestamps: true,
      }
    );

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.FinancialStatements, {
      foreignKey: 'driver_id',
      as: 'financialStatements',
    });
    this.hasMany(models.Credit, {
      foreignKey: 'driver_id',
      as: 'credits',
    });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  addTransaction(transaction) {
    const transactions = this.transactions || [];
    transactions.push(transaction);
    this.transactions = transactions;
  }

  removeTransaction(index) {
    const transactions = this.transactions || [];
    transactions.splice(index, 1);
    this.transactions = transactions;
  }
}

export default Driver;
