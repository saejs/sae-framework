module.exports = (Sequelize) => {
    require('./password')(Sequelize);
    require('./date')(Sequelize);
    require('./datetime')(Sequelize);
};