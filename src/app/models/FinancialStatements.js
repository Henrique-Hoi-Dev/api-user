import Sequelize, { Model } from 'sequelize';

class FinancialStatements extends Model {
  static init(sequelize) {
    super.init(
      {
        creator_user_id: Sequelize.INTEGER,
        driver_id: Sequelize.INTEGER,
        truck_id: Sequelize.INTEGER,
        cart_id: Sequelize.INTEGER,
        status: {
          type: Boolean,
          defaultValue: true
        },
        start_km: Sequelize.DOUBLE,
        final_km: Sequelize.DOUBLE,
        start_date: Sequelize.DATEONLY,
        final_date: Sequelize.DATEONLY,
        driver_name: Sequelize.STRING,
        truck_models: Sequelize.STRING,
        truck_board: Sequelize.STRING,
        truck_avatar: Sequelize.STRING,
        cart_models: Sequelize.STRING,
        cart_board: Sequelize.STRING,
        invoicing_all: Sequelize.DOUBLE,
        medium_fuel_all: Sequelize.DOUBLE,
        total_value: Sequelize.DOUBLE,
      },
      {
        sequelize,
        timestamps: true,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Driver, { foreignKey: 'driver_id', as: 'driver' });
    this.belongsTo(models.Truck, { foreignKey: 'truck_id', as: 'truck' });
    this.belongsTo(models.Cart, { foreignKey: 'cart_id', as: 'cart' });
    this.hasMany(models.Freight, { foreignKey: 'financial_statements_id', as: 'freigth' });
    this.hasMany(models.DepositMoney, { foreignKey: 'financial_statements_id', as: 'deposit_money' });
    this.hasMany(models.Restock, { foreignKey: 'financial_statements_id', as: 'restock' });
    this.hasMany(models.TravelExpenses, { foreignKey: 'financial_statements_id', as: 'travel_expense' });
  }
}

export default FinancialStatements;
