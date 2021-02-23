module.exports = (Model) => {
    Model.prototype.setAttributes = function (attrs) {
        if ((attrs == null) || (attrs == undefined)) {
            return;
        }

        var keys = Object.keys(attrs);

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            this[key] = attrs[key];
        }
    }
}