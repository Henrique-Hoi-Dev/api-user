import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Driver extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        name_user: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        number_cnh: Sequelize.STRING,
        type_position: Sequelize.STRING,
        cpf: Sequelize.STRING,
        valid_cnh: Sequelize.DATEONLY,
        date_valid_mopp: Sequelize.DATEONLY,
        date_valid_nr20: Sequelize.DATEONLY,
        date_valid_nr35: Sequelize.DATEONLY,
        date_admission: Sequelize.DATEONLY,
        date_birthday: Sequelize.DATEONLY,
        cart: Sequelize.STRING,
        truck: Sequelize.STRING,
        credit: Sequelize.DOUBLE,
        value_fix: Sequelize.DOUBLE,
        percentage: Sequelize.DOUBLE,
        daily: Sequelize.DOUBLE,
      },
      {
        sequelize,
        timestamps: true,
      }
    );

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.FinancialStatements, { foreignKey: 'driver_id', as: 'financialStatements' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default Driver;
