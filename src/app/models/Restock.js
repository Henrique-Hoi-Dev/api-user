import Sequelize, { Model } from 'sequelize';

class Restock extends Model {
  static init(sequelize) {
    super.init(
      {
        financial_statements_id: Sequelize.INTEGER,
        freight_id: Sequelize.INTEGER,
        name_establishment: Sequelize.STRING,
        city: Sequelize.STRING,
        date: Sequelize.DATEONLY,
        value_fuel: Sequelize.DOUBLE,
        liters_fuel: Sequelize.DOUBLE,
        total_value_fuel: Sequelize.DOUBLE,
        total_nota_value: Sequelize.DOUBLE,
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

export default Restock;
