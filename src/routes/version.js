const fs = require('fs');

module.exports = (app) => {
    return (packageFile, partUri = '/version') => {
        // Registrar rota da versao
        app.get(partUri, async (req, res) => {

            // Carregar version
            if (!fs.existsSync(packageFile)) {
                return res.error('erro.versao.app.nao.encontrada');
            }

            const info = require(packageFile);
            if (!info) {
                return res.error('erro.versao.app.nao.encontrada');
            }

            res.json({
                app: info.name,
                version: info.version,
            });
        });
    }
}