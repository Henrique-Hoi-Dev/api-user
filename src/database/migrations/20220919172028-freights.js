module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('freights', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      financial_statements_id: {
        type: Sequelize.INTEGER,
        references: { model: 'financial_statements', key: 'id' },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      start_freight_city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      final_freight_city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      location_of_the_truck: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contractor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      truck_current_km: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      liter_of_fuel_per_km: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      preview_tonne: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      value_tonne: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      preview_value_diesel: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM,
        values: [
          'APPROVAL_PROCESS',
          'APPROVED',
          'STARTING_TRIP',
          'DENIED',
          'FINISHED',
        ],
        defaultValue: 'APPROVAL_PROCESS',
      },

      // level two
      tons_loaded: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      toll_value: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      truck_km_completed_trip: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      discharge: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      img_proof_cte: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      img_proof_ticket: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      img_proof_freight_letter: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('freights');
  },
};
