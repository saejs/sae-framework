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

        options.transaction = this.t.transaction;

        return true;
    }

    get() {
        return this.t;
    }

    async start() {
        if (this.t) {
            return this.t;
        }
        
        // Gerar nova transação
        var $this = this;
        var trans = await this.sequelize.transaction();

        this.t = {
            transaction: trans,

            async commit() {
                await trans.commit();
                $this.t = null;
            },

            async rollback() {
                await trans.rollback();
                $this.t = null;
            }
        };

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