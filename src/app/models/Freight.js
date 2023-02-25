import Sequelize, { Model } from 'sequelize';

class Freight extends Model {
  static init(sequelize) {
    super.init(
      {
        financial_statements_id: Sequelize.INTEGER,
        start_freight_city: Sequelize.STRING, // cidade iniciar do frete
        final_freight_city: Sequelize.STRING, // cidade final do frete
        location_of_the_truck: Sequelize.STRING, // local atual do caminhão
        contractor: Sequelize.STRING, // empresa que foi pego o frete
        truck_current_km: Sequelize.DECIMAL, // km atual registrado no caminhão
        liter_of_fuel_per_km: Sequelize.DECIMAL, // media do caminhão
        preview_tonne: Sequelize.DECIMAL, // previa de tonelada
        preview_value_diesel: Sequelize.DECIMAL, // previa de valor do combustivel
        value_tonne: Sequelize.DECIMAL, // valor da tonelada
        status: Sequelize.ENUM({
          values: [
            'APPROVAL_PROCESS',
            'APPROVED',
            'STARTING_TRIP',
            'DENIED',
            'FINISHED',
          ],
        }),
        // level two
        tons_loaded: Sequelize.DECIMAL, // total da tonelada carregada
        toll_value: Sequelize.DECIMAL, // valor do pedagio
        truck_km_completed_trip: Sequelize.DECIMAL, // km do caminhão do final da viagem
        discharge: Sequelize.DECIMAL, // tonelada descarregada
        img_proof_cte: Sequelize.STRING, // url imagem cte
        img_proof_ticket: Sequelize.STRING, // url imagem ticket
        img_proof_freight_letter: Sequelize.STRING, // url imagem carta frete
      },
      {
        sequelize,
        timestamps: true,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.FinancialStatements, {
      foreignKey: 'financial_statements_id',
      as: 'financialStatements',
    });
    this.hasMany(models.DepositMoney, {
      foreignKey: 'freight_id',
      as: 'deposit_money',
    });
    this.hasMany(models.Restock, { foreignKey: 'freight_id', as: 'restock' });
    this.hasMany(models.TravelExpenses, {
      foreignKey: 'freight_id',
      as: 'travel_expense',
    });
  }
}

export default Freight;
