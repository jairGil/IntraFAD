const { createProxyMiddleware } =  require('http-proxy-middleware');
const { create } = require('../datosPersonales/models/docente');

module.exports = (app) =>{
    app.use(
        '/api/docente',
        createProxyMiddleware({
            target: 'http:localhost:3000',
            changeOrigin: true
        }),
        '/api/image',
        createProxyMiddleware({
            target: 'http:localhost:3000',
            changeOrigin: true
        })
    );
}