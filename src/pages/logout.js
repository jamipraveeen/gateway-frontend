import {inject} from "aurelia-property-injection";
import {Base} from "../resources/base";
import {Authentication} from "../components/authentication";

export class Logout extends Base {
    @inject(Authentication)
    authentication;

    constructor() {
        super();
    };

    // Aurelia
    attached() {
        super.attached();
    };

    activate() {
        this.authentication.logout();
    };
}
