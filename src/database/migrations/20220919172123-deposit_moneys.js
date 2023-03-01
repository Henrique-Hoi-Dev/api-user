module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deposit_moneys', {
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
      freight_id: {
        type: Sequelize.INTEGER,
        references: { model: 'freights', key: 'id' },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      type_transaction: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      local: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      type_bank: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      value: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      proof_img: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      payment: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {
          modo: '',
          value: 0,
          parcels: 0,
          flag: '',
        },
        validate: {
          notEmpty: true,
        },
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
    return queryInterface.dropTable('deposit_moneys');
  },
};
