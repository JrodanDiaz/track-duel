export type UserCredentials = {
  username: string;
  password: string;
};

export type User = {
  auth_token: string
  spotify_token: string
  username: string
} 

export interface Track {
  artist: string;
  title: string;
  uri: string;
}
