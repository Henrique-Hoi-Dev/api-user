'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Adiciona o novo valor 'PENDING' ao tipo enum
        await queryInterface.sequelize.query("ALTER TYPE enum_freights_status ADD VALUE 'PENDING';");

        // Atualiza os valores existentes de 'APPROVAL_PROCESS' para 'PENDING'
        await queryInterface.bulkUpdate('freights', { status: 'PENDING' }, { status: 'APPROVAL_PROCESS' });
    },

    async down(queryInterface, Sequelize) {},
};
