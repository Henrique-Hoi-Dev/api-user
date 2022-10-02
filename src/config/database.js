require('dotenv/config');
 
// module.exports = {
//   dialect: process.env.HK_DIALECT,
//   host: process.env.HK_HOST,
//   username: process.env.HK_USER,
//   password: process.env.HK_PASS,
//   database: process.env.HK_NAME,
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

module.exports = {
  dialect: process.env.AWS_DIALECT,
  host: process.env.AWS_HOST,
  username: process.env.AWS_USER,
  password: process.env.AWS_PASS,
  database: process.env.AWS_NAME,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
}

// module.exports = {
//   dialect: process.env.DB_DIALECT,
//   host: process.env.DB_HOST,
//   username: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   define: {
//     timestamps: true,
//     underscored: true,
//     underscoredAll: true,
//   },
// }
