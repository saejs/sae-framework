class Events
{
    constructor() {
        this.list = {};
    }

    /**
     * Executar um evento.
     * 
     * @param {String} eventId Evento ID
     * @param {Array} payload Lista de parametros
     * @returns {boolean}
     */
    async emit(eventId) {
        const payload = Array.prototype.slice.call(arguments).slice(1);

        if (!this.list[eventId]) {
            return false;
        }

        for (var i = 0; i < this.list[eventId].length; i++) {
            var eventCall = this.list[eventId][i];

            // Executar evento sync
            var ret = await eventCall.apply(null, payload);
            if (!((ret == undefined) || (ret == null))) {
                return ret;
            }
        }

        return true;
    }

    /**
     * Registrar novo callback do evento.
     * 
     * @param {string} eventId Evento ID
     * @param {Function} callback Call para executar quando o evento foi executado
     * @returns {boolean}
     */
    on(eventId, callback) {
        // Verificar se evento já foi registrado
        if (!this.list[eventId]) {
            this.list[eventId] = [];
        }

        // Registrar callback na lista do evento
        this.list[eventId].push(callback);

        return true;
    }
}

module.exports = Events;