module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('drivers', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name_user: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      number_cnh: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      valid_cnh: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      date_valid_mopp: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      date_valid_nr20: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      date_valid_nr35: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      date_admission: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      date_birthday: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM,
        values: ['ACTIVE', 'INACTIVE', 'INCOMPLETE'],
        defaultValue: 'ACTIVE',
      },
      type_positions: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      permission_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      cart: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      truck: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      credit: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      credit: Sequelize.INTEGER,
      transactions: {
        type: Sequelize.ARRAY({
          type: Sequelize.JSONB,
          defaultValue: {
            typeTransactions: Sequelize.STRING,
            value: Sequelize.INTEGER,
          },
        }),
        defaultValue: [],
      },
      value_fix: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      percentage: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      daily: {
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('drivers');
  },
};
