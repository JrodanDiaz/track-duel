export type UserCredentials = {
    username: string,
    password: string
}

export type ErrorMessage = {
    errorMessage: string
}

export type DB_USERS_ROW = {
    id: number,
    username: string,
    passhash: string
}