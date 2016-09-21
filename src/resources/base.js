import {I18N} from "aurelia-i18n"
import {inject} from "aurelia-property-injection";
import {EventAggregator} from "aurelia-event-aggregator";
import {BindingSignaler} from "aurelia-templating-resources";
import {API} from "../components/api";

export class Base {
    @inject(I18N)
    i18n;
    @inject(Element)
    element;
    @inject(EventAggregator)
    ea;
    @inject(BindingSignaler)
    signaler;
    @inject(API)
    api;

    constructor() {
        this.ea.subscribe('i18n:locale:changed', () => {
            this.i18n.updateTranslations(this.element);
        });
    }

    attached() {
        this.i18n.updateTranslations(this.element);
    }
}
