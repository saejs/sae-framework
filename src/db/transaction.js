const ApiError = require("../api_error");

class Transaction{
    constructor (sequelize)
    {
        this.sequelize = sequelize;
        this.t = null;
    }
    
    apply(options) {
        if (options.transaction) {
            return;
        }

        if (!this.t) {
            return;
        }

        options.transaction = this.t;

        return true;
    }

    get() {
        return this.t;
    }

    async start() {
        if (!this.t) {
            this.t = await this.sequelize.transaction();
        }

        return this.t;
    }

    async commit() {
        if (!this.t) {
            throw ApiError('erro.db.transacao.nao.iniciada');
        }

        await this.t.commit();

        return true;
    }

    async rollback() {
        if (!this.t) {
            throw ApiError('erro.db.transacao.nao.iniciada');
        }

        await this.t.rollback();

        return true;
    }
}

module.exports = Transaction;