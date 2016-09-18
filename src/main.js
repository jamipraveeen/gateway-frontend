import Backend from "i18next-xhr-backend";
import {ViewLocator} from "aurelia-framework";
import {AdminLTE} from "admin-lte";
import environment from "./environment";

Promise.config({
    warnings: {
        wForgottenReturn: false
    }
});

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
            instance.i18next.use(Backend);
            return instance.setup({
                backend: {
                    loadPath: '/static/locale/{{lng}}/{{ns}}.json'
                },
                lng: 'en',
                attributes: ['data-i18n', 't', 'i18n'],
                fallbackLng: 'nl',
                debug: false,
                ns: ['translation']
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
