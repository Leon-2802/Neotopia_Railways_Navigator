export class UserDataDto {
    public username: string;
    public email: string;
    public password: string;

    constructor(username: string, email: string, password: string) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
export class LoginDataDto {
    public username: string;
    public password: string;
    public remember: boolean;

    constructor(username: string, password: string, remember: boolean) {
        this.username = username;
        this.password = password;
        this.remember = remember;
    }
}

export class DeleteDataDto {
    public username: string;

    constructor(username: string) {
        this.username = username;
    }
}