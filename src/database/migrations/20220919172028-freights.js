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
      start_city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      final_city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      location_of_the_truck: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contractor: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      start_km: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      travel_km: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      average_fuel: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      preview_tonne: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      value_tonne: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      preview_value_diesel: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      status_check_order: {
        type: Sequelize.ENUM,
        values: ['approval_process', 'approved', 'denied', 'finished'],
        defaultValue: 'approval_process',
      },
      // level two
      final_km: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      final_total_tonne: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      toll_value: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      discharge: {
        type: Sequelize.DOUBLE,
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
