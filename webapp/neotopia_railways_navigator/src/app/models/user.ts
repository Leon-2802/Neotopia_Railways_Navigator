export interface userdata {
    username: string;
    password: string;
}

export interface rememberMeData {
    username: string;
    verifier: string;
}

export interface refreshAccessTokenData {
    username: string;
    refreshToken: string;
};