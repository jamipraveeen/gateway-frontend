import {customElement, bindable, bindingMode} from "aurelia-framework";
import {inject} from "aurelia-property-injection";
import $ from "jquery";
import "bootstrap";
import "bootstrap-toggle";
import "bootstrap-toggle/css/bootstrap-toggle.css";

@bindable({
    name: 'checked',
    defaultBindingMode: bindingMode.twoWay
})
@bindable({
    name: 'options'
})
@customElement('toggle-button')
export class ToggleButton {
    @inject(Element)
    i18n;

    constructor(element) {
        this.element = element;
        this._lastChecked = undefined;
    }

    bind() {
        this.toggleElement = $(this.element.querySelector('[data-toggle="toggle"]'));
        let settings = {
            on: this.i18n.tr('generic.on'),
            off: this.i18n.tr('generic.off'),
            width: this.width
        };
        if (this.options !== undefined) {
            if (this.options.size !== undefined) {
                settings.size = this.options.size;
            }
            if (this.options.height !== undefined) {
                settings.height = this.options.height;
            }
        }
        this.toggleElement.bootstrapToggle(settings);
        this.toggleElement.change(() => {
            this.checked = this.toggleElement.prop('checked');
            if (this.checked !== this._lastChecked) {
                this._lastChecked = this.checked;
                let cEvent = new CustomEvent('change', {
                    bubbles: true,
                    detail: {
                        value: this.checked
                    }
                });
                this.element.dispatchEvent(cEvent);
            }
        });
        this.checkedChanged(this.checked);
        this._lastChecked = this.checked;
    }

    checkedChanged(newValue) {
        if (newValue) {
            this.toggleElement.bootstrapToggle('on');
        } else {
            this.toggleElement.bootstrapToggle('off');
        }
    }

    unbind() {
        this.toggleElement.bootstrapToggle('destroy');
    }
}
