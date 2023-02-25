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
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: { decimalNumbers: true },
        },
      },
      liter_of_fuel_per_km: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        validate: {
          isDecimal: { decimalNumbers: true },
        },
      },
      preview_tonne: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        validate: {
          isDecimal: { decimalNumbers: true },
        },
      },
      value_tonne: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        validate: {
          isDecimal: { decimalNumbers: true },
        },
      },
      preview_value_diesel: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        validate: {
          isDecimal: { decimalNumbers: true },
        },
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
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      toll_value: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      truck_km_completed_trip: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      discharge: {
        type: Sequelize.DECIMAL,
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
