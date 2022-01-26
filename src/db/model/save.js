module.exports = (Model) => {
    const __save = Model.prototype.save;
    Model.prototype.__save = __save;
    Model.prototype.save = async function (options = {}) {
        // Verificar se deve atribuir a transacao atual
        this.$db.transaction.apply(options);

        // Aplicar atributos de contexto
        this.setAttributesContext(this);

        // Executue touches do model
        if (options.noSelfTouches !== false) {
            await this.executeTouch({ inSave: true });
        }

        // Executar o save original
        var ret = await this.__save(options);

        // Executar os touches
        await this.touchAttributes(options);

        return ret;
    }
}