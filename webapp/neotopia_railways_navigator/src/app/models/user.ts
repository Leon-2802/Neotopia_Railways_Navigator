export interface User {
    username: string;
    email: string;
    password: string;
    confirmed: boolean;
    createdAt: Date;
}