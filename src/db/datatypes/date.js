module.exports = (Sequelize) => {
    const DataTypes = Sequelize.DataTypes;
    const BASE_DATEONLY = DataTypes.DATEONLY.prototype.constructor;

    class NF_DATEONLY extends BASE_DATEONLY
    {
        /**
         * TRanformar o valor em data e hora depois de pegar no banco.
         * @param {*} value Valor do model
         * @returns {Date|null}
         */
        static parse(value) {
            return value;
        }
    }
    
    NF_DATEONLY.prototype.key = NF_DATEONLY.key = 'NF_DATEONLY';
    DataTypes.NF_DATEONLY = Sequelize.Utils.classToInvokable(NF_DATEONLY);
    Sequelize.NF_DATEONLY = DataTypes.NF_DATEONLY;
};