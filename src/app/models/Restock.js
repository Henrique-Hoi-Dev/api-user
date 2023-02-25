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
        value_fuel: Sequelize.DECIMAL,
        liters_fuel: Sequelize.DECIMAL,
        total_value_fuel: Sequelize.DECIMAL,
        total_nota_value: Sequelize.DECIMAL,
      },
      {
        sequelize,
        timestamps: true,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Freight, {
      foreignKey: 'freight_id',
      as: 'freights',
    });
    this.belongsTo(models.FinancialStatements, {
      foreignKey: 'financial_statements_id',
      as: 'financialStatements',
    });
  }
}

export default Restock;
