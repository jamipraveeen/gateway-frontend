class Shared {
    constructor() {
        if (!Shared.instance) {
            let wizards = [];
            this._data = [
                {id: 'wizards', data: wizards}
            ];
            Shared.instance = this;
        }
        return Shared.instance;
    }

    get(id) {
        return this._data.find(d => d.id === id).data;
    }
}

const instance = new Shared();
Object.freeze(instance);

export default instance;
