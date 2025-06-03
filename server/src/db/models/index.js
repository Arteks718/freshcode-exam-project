const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const configPath =
  env === 'production'
    ? path.join(
        __dirname,
        '..',
        '..',
        '..',
        'src/server/config/postgresConfig.json'
      )
    : path.join(__dirname, '..', '/config/postgresConfig.json');
const config = require(configPath)[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

db['Contests'].belongsTo(db['Users'], { foreignKey: 'userId' });
db['Contests'].hasMany(db['Offers'], { foreignKey: 'contestId' });

db['Users'].hasMany(db['Offers'], { foreignKey: 'userId' });
db['Users'].hasMany(db['Contests'], { foreignKey: 'userId' });
db['Users'].hasMany(db['Ratings'], { foreignKey: 'userId' });
db['Users'].hasMany(db['Catalogs'], { foreignKey: 'userId' });
db['Users'].hasMany(db['Messages'], { foreignKey: 'sender' });

db['Offers'].belongsTo(db['Users'], { foreignKey: 'userId' });
db['Offers'].belongsTo(db['Contests'], { foreignKey: 'contestId' });
db['Offers'].hasOne(db['Ratings'], { foreignKey: 'offerId' });

db['Ratings'].belongsTo(db['Users'], { foreignKey: 'userId' });
db['Ratings'].belongsTo(db['Offers'], { foreignKey: 'offerId' });

db['Catalogs'].belongsTo(db['Users'], { foreignKey: 'userId' });
db['Catalogs'].hasMany(db['Chats'], { foreignKey: 'catalogId' });

db['Conversations'].hasMany(db['Messages'], { foreignKey: 'conversationId' });
db['Conversations'].hasMany(db['Chats'], { foreignKey: 'conversationId' });

db['Chats'].belongsTo(db['Catalogs'], { foreignKey: 'catalogId' });
db['Chats'].belongsTo(db['Conversations'], { foreignKey: 'conversationId' });

db['Messages'].belongsTo(db['Users'], { foreignKey: 'sender' });
db['Messages'].belongsTo(db['Conversations'], { foreignKey: 'conversationId' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
