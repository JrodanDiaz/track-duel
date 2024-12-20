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

export type DB_PLAYLISTS_ROW = {
    playlist_id: number,
    user_id: number,
    playlist_url: string
}