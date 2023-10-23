export interface userdata {
    username: string;
    password: string;
}

export interface loginData {
    username: string;
    password: string;
    remember: boolean;
}

export interface rememberMeData {
    username: string;
    verifier: string;
}

export interface refreshAccessTokenData {
    username: string;
    refreshToken: string;
};