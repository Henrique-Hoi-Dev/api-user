require('dotenv/config');

// module.exports = {
//   dialect: process.env.HER_DIALECT,
//   host: process.env.HER_HOST,
//   username: process.env.HER_USER,
//   password: process.env.HER_PASS,
//   database: process.env.HER_NAME,
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false
//     }
//   },
//   define: {
//     timestamps: true,
//     underscored: true,
//     underscoredAll: true,
//   },
// }

// keys local

module.exports = {
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
}
