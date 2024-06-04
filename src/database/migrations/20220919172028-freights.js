module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

        return queryInterface.createTable('freights', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
                primaryKey: true,
                allowNull: false,
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
            },
            final_freight_city: {
                type: Sequelize.STRING,
            },
            location_of_the_truck: {
                type: Sequelize.STRING,
            },
            contractor: {
                type: Sequelize.STRING,
            },
            truck_current_km: {
                type: Sequelize.INTEGER,
            },
            liter_of_fuel_per_km: {
                type: Sequelize.INTEGER,
            },
            preview_tonne: {
                type: Sequelize.INTEGER,
            },
            value_tonne: {
                type: Sequelize.INTEGER,
            },
            preview_value_diesel: {
                type: Sequelize.INTEGER,
            },
            status: {
                type: Sequelize.ENUM,
                values: ['APPROVAL_PROCESS', 'APPROVED', 'STARTING_TRIP', 'DENIED', 'FINISHED'],
            },

            // level two
            tons_loaded: {
                type: Sequelize.INTEGER,
            },
            toll_value: {
                type: Sequelize.INTEGER,
            },
            truck_km_completed_trip: {
                type: Sequelize.INTEGER,
            },
            discharge: {
                type: Sequelize.INTEGER,
            },
            img_proof_cte: {
                type: Sequelize.STRING,
            },
            img_proof_ticket: {
                type: Sequelize.STRING,
            },
            img_proof_freight_letter: {
                type: Sequelize.STRING,
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
