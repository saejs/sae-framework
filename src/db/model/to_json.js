const arr = require('rhinojs/support/arr');

module.exports = (Model) => {
    const __toJSON = Model.prototype.toJSON;
    Model.prototype.__toJSON = __toJSON;
    Model.prototype.toJSON = function () {
        var values = Object.assign({}, this.get());

        if (!this.constructor.hiddens) {
            return values;
        }

        arr.each(this.constructor.hiddens, (k, v) => {
            delete values[v];
        });

        return values;
    }
}