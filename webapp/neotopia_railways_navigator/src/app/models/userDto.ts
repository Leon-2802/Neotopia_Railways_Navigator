export class UserDataRequestDto {
    public username: string;
    public email: string;
    public password: string;

    constructor(username: string, email: string, password: string) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
export class UserDataResponseDto {
    public username: string;
    public email: string;
    public password: string;
    public confirmed: Buffer;
    public createdAt: string;

    constructor(username: string, email: string, password: string, confirmed: Buffer, createdAt: string) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.confirmed = confirmed;
        this.createdAt = createdAt;
    }
};
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

export class UsernameDto {
    public username: string;

    constructor(username: string) {
        this.username = username;
    }
}