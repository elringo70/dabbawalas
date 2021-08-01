"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error404 = void 0;
class Error404 {
    get404Page(req, res) {
        res.status(404).render('404', {
            title: 'Error 404. Página no encontrada'
        });
    }
}
exports.error404 = new Error404();
