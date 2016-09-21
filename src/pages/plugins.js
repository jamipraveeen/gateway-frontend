import $ from "jquery";
import {computedFrom} from "aurelia-framework";
import {Base} from "../resources/base";
import {Refresher} from "../components/refresher";
import {Toolbox} from "../components/toolbox";
import {Plugin} from "../containers/plugin";

export class Plugins extends Base {
    constructor() {
        super();
        this.refresher = new Refresher(() => {
            this.loadPlugins().then(() => {
                this.signaler.signal('reload-plugins');
            });
        }, 60000);

        this.plugins = [];
        this.pluginsLoading = true;
        this.activePlugin = undefined;
        this.requestedRemove = false;
    };

    loadPlugins() {
        return this.api.getPlugins()
            .then((data) => {
                Toolbox.crossfiller(data.plugins, this.plugins, 'name', (name) => {
                    let plugin = new Plugin(name);
                    plugin.initializeConfig();
                    return plugin;
                });
                this.plugins.sort((a, b) => {
                    return a.name > b.name ? 1 : -1;
                });
                if (this.activePlugin === undefined && this.plugins.length > 0) {
                    this.selectPlugin(this.plugins[0]);
                }
                this.pluginsLoading = false;
            })
            .catch((error) => {
                if (!this.api.isDeduplicated(error)) {
                    console.error('Could not load Plugins');
                }
            });
    };

    selectPlugin(plugin) {
        if (this.activePlugin !== undefined) {
            this.activePlugin.stopLogWatcher();
        }
        this.activePlugin = plugin;
        this.activePlugin.startLogWatcher();
    }

    requestRemove() {
        this.requestedRemove = true;
    }

    confirmRemove() {
        if (this.requestedRemove === true) {
            this.activePlugin.remove()
                .then(() => {
                    this.requestedRemove = false;
                    this.plugins.remove(this.activePlugin);
                    this.activePlugin = this.plugins[0];
                });
        }
    }

    abortRemove() {
        this.requestedRemove = false;
    }

    installPlugin() {
        $('#install-plugin-token').val(this.api.token);
        $('#upload-frame').off('load.install-plugin').on('load.install-plugin', function () {
            let result = this.contentWindow.document.body.innerHTML;
            console.log(result);
        });
        let form = $('#upload-plugin');
        form.attr('action', this.api.endpoint + 'install_plugin');
        form.submit();
    }

    // Aurelia
    attached() {
        super.attached();
    };

    activate() {
        this.refresher.run();
        this.refresher.start();
        if (this.activePlugin !== undefined) {
            this.activePlugin.startLogWatcher();
        }
    };

    deactivate() {
        this.refresher.stop();
        if (this.activePlugin !== undefined) {
            this.activePlugin.stopLogWatcher();
        }
    }
}
