module.exports = (Sequelize) => {
    const DataTypes = Sequelize.DataTypes;
    const BASE_DATE = DataTypes.DATE.prototype.constructor;

    class NF_DATE extends BASE_DATE
    {
        /**
         * Tranformar o valor em data e hora depois de pegar no banco.
         * @param {*} value Valor do model
         * @returns {Date|null}
         */
        _sanitize(value) {
            if (!value) {
                return value;
            }

            if ((typeof value == 'string') && (value != '')) {
                value = carbon.createFromFormat(value, 'yyyy-MM-dd hh:mm:ss');
            }

            return value;
        }
    }
    
    NF_DATE.prototype.key = NF_DATE.key = 'NF_DATE';
    DataTypes.NF_DATE = Sequelize.Utils.classToInvokable(NF_DATE);
    Sequelize.NF_DATE = DataTypes.NF_DATE;
};