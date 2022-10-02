import Sequelize, { Model } from 'sequelize';

class DepositMoney extends Model {
  static init(sequelize) {
    super.init(
      {
        financial_statements_id: Sequelize.INTEGER,
        freight_id: Sequelize.INTEGER,
        type_transaction: Sequelize.STRING,
        local: Sequelize.STRING,
        type_bank: Sequelize.STRING,
        value: Sequelize.DOUBLE,
        proof_img: Sequelize.STRING,
      },
      {
        sequelize,
        timestamps: true,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.FinancialStatements, { foreignKey: 'financial_statements_id', as: 'financialStatements' });
  }
}

export default DepositMoney;
