export interface TokenInterface {
    user: {
        email: string;
        isadmin: boolean;
    };
}

export interface LooseObject {
    [key: string]: any
}