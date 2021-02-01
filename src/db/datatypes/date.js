const carbon = require('rhinojs/support/carbon');

module.exports = (Sequelize) => {
    const DataTypes = Sequelize.DataTypes;
    const BASE_DATEONLY = DataTypes.DATEONLY.prototype.constructor;

    class NF_DATEONLY extends BASE_DATEONLY
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
                value = carbon.createFromFormat(value, 'yyyy-MM-dd');
            }

            return value;
        }
    }
    
    NF_DATEONLY.prototype.key = NF_DATEONLY.key = 'NF_DATEONLY';
    DataTypes.NF_DATEONLY = Sequelize.Utils.classToInvokable(NF_DATEONLY);
    Sequelize.NF_DATEONLY = DataTypes.NF_DATEONLY;
};