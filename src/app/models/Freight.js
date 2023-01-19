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
        truck_current_km: Sequelize.DOUBLE, // km atual registrado no caminhão
        travel_km_total: Sequelize.DOUBLE, // km total da viagem
        liter_of_fuel_per_km: Sequelize.DOUBLE, // media do caminhão
        preview_tonne: Sequelize.DOUBLE, // previa de tonelada
        preview_value_diesel: Sequelize.DOUBLE, // previa de valor do combustivel
        value_tonne: Sequelize.DOUBLE, // valor da tonelada
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
        tons_loaded: Sequelize.DOUBLE, // total da tonelada carregada
        toll_value: Sequelize.DOUBLE, // valor do pedagio
        truck_km_completed_trip: Sequelize.DOUBLE, // km do caminhão do final da viagem
        discharge: Sequelize.DOUBLE, // tonelada descarregada
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
