import { observable, computed, reaction, action } from 'mobx';

class AuthStore {
    @observable username = "";
    @observable password = "";

    //@action
}

const authStore = new AuthStore();

export default authStore;
export { authStore };