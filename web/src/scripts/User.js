export default class User {
    static get CurrentUser() {
        return JSON.parse(localStorage.getItem('user') ?? null);
    }

    static set CurrentUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }
}