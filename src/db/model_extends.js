module.exports = (Model) => {
    // Extender method model
    const __save = Model.prototype.save;
    Model.prototype.__save = __save;

    Model.prototype.save = async function(options) {
        return await this.__save(options);
    }
};