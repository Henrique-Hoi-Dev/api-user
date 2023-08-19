import * as Yup from 'yup';
import { Op, literal } from 'sequelize';

import Driver from '../models/Driver';
import FinancialStatements from '../models/FinancialStatements';
import validateCpf from '../utils/validateCpf';

export default {
    async create(body) {
        const cpf = body.cpf.replace(/\D/g, '');
        const validCpf = validateCpf(cpf);

        const data = {
            cpf: validCpf,
            password: body.password,
            name: body.name,
            type_position: 'COLLABORATOR',
            credit: 0,
            value_fix: body.value_fix || 0,
            percentage: body.percentage || 0,
            daily: body.daily || 0,
        };

        // doing name user verification
        const driverExist = await Driver.findOne({
            where: { cpf: validCpf },
        });

        if (driverExist) throw new Error('THIS_CPF_ALREADY_EXISTS');

        const schema = Yup.object().shape({
            cpf: Yup.string().required(),
            password: Yup.string().required().min(6),
        });

        if (!(await schema.isValid(body))) throw Error('VALIDATION_ERROR');

        await Driver.create(data);

        return { msg: 'successful' };
    },

    async getAllSelect(req, res) {
        const select = await Driver.findAll({
            where: {
                id: {
                    [Op.notIn]: literal(`(SELECT "driver_id" FROM "financial_statements")`),
                },
            },
            attributes: ['id', 'name'],
        });

        const selectFinancial = await Driver.findAll({
            attributes: ['id', 'name'],
            include: [
                {
                    model: FinancialStatements,
                    as: 'financialStatements',
                    required: true,
                    where: {
                        status: false,
                    },
                    attributes: ['id', 'driver_id', 'cpf'],
                },
            ],
        });

        return {
            dataResult: [...select.concat(...selectFinancial)],
        };
    },

    async getAll(query) {
        const { page = 1, limit = 100, sort_order = 'ASC', sort_field = 'id', name, id, search } = query;

        const where = {};
        // if (id) where.id = id;

        const drivers = await Driver.findAll({
            where: search
                ? {
                      [Op.or]: [
                          // { id: search },
                          { truck: { [Op.iLike]: `%${search}%` } },
                          { name: { [Op.iLike]: `%${search}%` } },
                      ],
                  }
                : where,
            order: [[sort_field, sort_order]],
            limit: limit,
            offset: page - 1 ? (page - 1) * limit : 0,
            attributes: ['id', 'name', 'cpf', 'credit', 'value_fix', 'percentage', 'daily', 'cart', 'truck'],
        });

        const total = await Driver.count();
        const totalPages = Math.ceil(total / limit);

        const currentPage = Number(page);

        return {
            dataResult: drivers,
            total,
            totalPages,
            currentPage,
        };
    },

    async getId(id) {
        const driver = await Driver.findByPk(id, {
            attributes: [
                'id',
                'name',
                'number_cnh',
                'valid_cnh',
                'date_valid_mopp',
                'date_valid_nr20',
                'date_valid_nr35',
                'cpf',
                'date_admission',
                'date_birthday',
                'credit',
                'value_fix',
                'percentage',
                'daily',
                'transactions',
            ],
        });

        if (!driver) throw Error('Driver not found');

        return {
            dataResult: driver,
        };
    },

    async update(body, id) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            oldPassword: Yup.string().min(8),
            password: Yup.string()
                .min(8)
                .when('oldPassword', (oldPassword, field) => (oldPassword ? field.required() : field)),
            confirmPassword: Yup.string().when('password', (password, field) =>
                password ? field.required().oneOf([Yup.ref('password')]) : field
            ),
        });

        if (!(await schema.isValid(body))) throw Error('Validation failed!');

        const { oldPassword } = body;

        const driver = await Driver.findByPk(id);

        if (oldPassword && !(await driver.checkPassword(oldPassword))) throw Error('Password does not match!');

        await driver.update(body);

        const driverResult = await Driver.findByPk(id, {
            attributes: [
                'id',
                'name',
                'cpf',
                'number_cnh',
                'valid_cnh',
                'date_valid_mopp',
                'date_valid_nr20',
                'date_valid_nr35',
                'cpf',
                'date_admission',
                'date_birthday',
                'credit',
                'value_fix',
                'percentage',
                'daily',
            ],
        });

        return {
            dataResult: driverResult,
        };
    },

    async delete(id) {
        const driver = await Driver.destroy({
            where: {
                id: id,
            },
        });

        if (!driver) throw Error('Driver not found');

        return {
            responseData: { msg: 'Deleted driver' },
        };
    },
};
