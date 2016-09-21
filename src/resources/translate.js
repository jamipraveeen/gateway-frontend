import {customAttribute} from "aurelia-framework";
import {inject} from "aurelia-property-injection";
import Shared from "../components/shared";

@customAttribute('translate')
@inject(Element)
export class Translate {
    @inject(I18N)
    i18n;
    @inject(Element)
    element;

    valueChanged(newValue) {
        this.element.innerHTML = this.i18n.tr(newValue);
    };
}
