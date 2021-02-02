//const cors = require('cors');
const express = require("express");
//const EventEmitter = require('events');
const EventEmitter = require('./events');

// middlewares
const middlewareCors = require('./middlewares/cors');
const middlewareResJson = require('./middlewares/res_json');
const middlewareResError = require('./middlewares/res_error');
const middlewareReqGetClientIp = require('./middlewares/req_getclientip');
const middlewareReqValidate = require('./middlewares/req_validate');
const middlewareReqJson = require('./middlewares/req_json');
const middlewareAuth = require('./middlewares/auth');

// rotas
const routeAlias = require('./routes/routes');
const routeError404 = require('./routes/error404');

class App {
    /**
     * Construtor.
     */
    constructor() {
        this.booted = false;

        // Carregar env
        require('dotenv').config()

        this.$route = express();
        //this.router = express.Router();

        // Registrar alias das rotas
        routeAlias(this);

        // Configurações
        //this.$route.set('json spaces', 4); // removido por usar o JSON View

        this.events = new EventEmitter();

        //this.boot(); Não executando o boot no create, para poder dar tempo de alguma especificação usar o evento booted
    }

    /**
     * Execute boot application.
     */
    boot() {
        if (this.booted) {
            return false;
        }

        // Middlewares padrao
        //this.$route.use(cors({ origin: '*', methods: '*', allowedHeaders: '*', preflightContinue: true }));
        this.$route.use(middlewareCors());
        this.$route.use(express.json());

        // Middlewares controles
        this.$route.use(middlewareResError());
        this.$route.use(middlewareResJson());
        this.$route.use(middlewareReqGetClientIp());
        this.$route.use(middlewareReqJson());
        this.$route.use(middlewareReqValidate());
        this.$route.use(middlewareAuth.prepare());

        // Event para registrar middlewares
        this.events.emit('booted', this, this.$route);

        this.booted = true;
    }

    /**
     * Registrar um evento.
     * 
     * @param {String} event ID do evento
     * @param {Function} callback Callback do evento
     */
    on(event, callback) {
        this.events.on(event, callback);
    }

    /**
     * Abrir porta para receber as requisicoes.
     * 
     * @param {Integer} port Numero da portar que ira atender as requisicoes
     */
    listen(port) {
        // Registrar rotas padrao
        routeError404(this);        

        // Iniciar servico
        var srv = this.$route.listen(port, () => {
            var sHost = srv.address().address;
            var sPort = srv.address().port;

            console.log(`App listen on port: ${sPort} in ${sHost}`);
        });
    }
}

module.exports = App;