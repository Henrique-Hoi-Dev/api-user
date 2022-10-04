import Sequelize, { Model } from 'sequelize';

class Freight extends Model {
  static init(sequelize) {
    super.init(
      {
        financial_statements_id: Sequelize.INTEGER,
        start_city: Sequelize.STRING,
        final_city: Sequelize.STRING,
        location_of_the_truck: Sequelize.STRING,
        contractor: Sequelize.STRING,
        start_km: Sequelize.DOUBLE,
        travel_km: Sequelize.DOUBLE,
        average_fuel: Sequelize.DOUBLE,
        preview_tonne: Sequelize.DOUBLE,
        preview_value_diesel: Sequelize.DOUBLE,
        value_tonne: Sequelize.DOUBLE,
        status_check_order: Sequelize.ENUM(
          { 
            values: ['approval_process', 'approved', 'denied', 'finished']
          }
        ),
        // level two
        final_km: Sequelize.DOUBLE,
        final_total_tonne: Sequelize.DOUBLE,
        toll_value: Sequelize.DOUBLE,
        discharge: Sequelize.DOUBLE,
        img_proof_cte: Sequelize.STRING,
        img_proof_ticket: Sequelize.STRING,
        img_proof_freight_letter: Sequelize.STRING,
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
    this.hasMany(models.DepositMoney, { foreignKey: 'freight_id', as: 'deposit_money' });
    this.hasMany(models.Restock, { foreignKey: 'freight_id', as: 'restock' });
    this.hasMany(models.TravelExpenses, { foreignKey: 'freight_id', as: 'travel_expense' })
  }
}

export default Freight;
