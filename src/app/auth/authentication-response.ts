export interface AuthenticationResponse {
    isAuthenticated: boolean;
    authenticationStatus: AuthenticationStatus;
    token: string;
}

export enum AuthenticationStatus {
    NotAuthenticated = 0,
    UserNotFound = 1,
    InvalidCredentials = 2,
    Authenticated = 3
}
