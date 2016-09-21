import {inject} from "aurelia-property-injection";
import {Base} from "../resources/base";
import {Authentication} from "../components/authentication";

export class Login extends Base {
    @inject(Authentication)
    authentication;

    constructor() {
        super();
        this.username = '';
        this.password = '';
        this.failure = false;
        this.error = undefined;
    };

    login() {
        this.failure = false;
        this.error = undefined;
        this.authentication.login(this.username, this.password)
            .catch((error) => {
                if (error.message.message === 'invalid_credentials') {
                    this.error = this.i18n.tr('pages.login.invalidcredentials');
                } else {
                    this.error = this.i18n.tr('generic.unknownerror');
                    console.error(error);
                }
                this.failure = true;
            });
    };

    attached() {
        super.attached();
    };

    activate() {
        this.password = '';
    };
}
