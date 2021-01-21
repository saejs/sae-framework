module.exports = (Model) => {
    const __save = Model.prototype.save;
    Model.prototype.__save = __save;
    Model.prototype.save = async function (options = {}) {

        // Verificar se deve atribuir a transacao atual
        this.$db.transaction.apply(options);

        return await this.__save(options);
    }
}