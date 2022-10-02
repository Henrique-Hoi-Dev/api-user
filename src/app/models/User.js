import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        type_position: Sequelize.ENUM(
          { 
            values: ['master', 'director',  'manager', 'collaborator']
          }
        ),
        cpf: Sequelize.STRING,
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

  // static associate(models) {
  //   this.hasOne(models.Adress, { foreignKey: 'user_id', as: 'adress' });
  //   this.hasMany(models.FinancialBox, { foreignKey: 'user_id', as: 'financialBox' });
  //   this.hasMany(models.Order, { foreignKey: 'seller_id', as: 'order' });
  // }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
