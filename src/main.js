import XHR from "i18next-xhr-backend";
import {ViewLocator} from "aurelia-framework";
import {AdminLTE} from "admin-lte";
import environment from "./environment";

Promise.config({
    warnings: {
        wForgottenReturn: false
    }
});

function loadLocales(url, options, callback, data) {
    try {
        let waitForLocale = require('bundle!locale/' + url + '.json');
        waitForLocale((locale) => {
            callback(locale, {status: '200'});
        });
    } catch (e) {
        callback(null, {status: '404'});
    }
}

export async function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        .globalResources([
            'resources/translate',
            'resources/togglebutton/togglebutton',
            'resources/slider/slider',
            'resources/blockly/blockly',
            'resources/formatter'
        ])
        .plugin('aurelia-i18n', (instance) => {
            instance.i18next.use(XHR);
            return instance.setup({
                backend: {
                    loadPath: '{{lng}}/{{ns}}',
                    parse: (data) => data,
                    ajax: loadLocales
                },
                lng: 'en',
                attributes: ['data-i18n', 't', 'i18n'],
                fallbackLng: 'nl',
                debug: false,
                ns: ['translation', 'nav', 'secuident']
            });
        })
        .plugin('aurelia-dialog');

    if (environment.debug) {
        aurelia.use.developmentLogging();
    }
    aurelia.container.makeGlobal();

    await aurelia.start().then(() => {
        aurelia.setRoot('index');
    });
}
