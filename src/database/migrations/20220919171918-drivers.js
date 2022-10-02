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
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      date_valid_mopp: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      date_valid_nr20: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      date_valid_nr35: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      date_admission: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      date_birthday: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      type_position: {
        type: Sequelize.STRING,
        allowNull: false,
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
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      value_fix: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      percentage: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      daily: {
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
    return queryInterface.dropTable('drivers');
  },
};
