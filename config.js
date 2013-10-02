/**
 * @overview
 *
 * @author
 * @version 2012/07/04
 */

module.exports = {
    ready: false,
    LiveReload: '1.6',
    applyJSLive: false,
    applyCSSLive: true,
    applyIMGLive: true,
    port: 35728,
    includeFile: [
        'php',
        'coffee',
        'css',
        'scss',
        'sass',
        'js'
    ],
    excludeFile: [
        'swp',
        'swa',
        '/index/static/mimgs'
    ]
};

