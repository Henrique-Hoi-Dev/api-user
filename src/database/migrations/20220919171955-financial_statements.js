module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('financial_statements', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      driver_id: {
        type: Sequelize.INTEGER,
        references: { model: 'drivers', key: 'id' },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      truck_id: {
        type: Sequelize.INTEGER,
        references: { model: 'trucks', key: 'id' },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      cart_id: {
        type: Sequelize.INTEGER,
        references: { model: 'carts', key: 'id' },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      start_km: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      final_km: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      final_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      driver_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      truck_models: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      truck_board: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      truck_avatar: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cart_models: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cart_board: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      invoicing_all: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      medium_fuel_all: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      total_value: {
        type: Sequelize.DOUBLE,
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
    return queryInterface.dropTable('financial_statements');
  },
};
