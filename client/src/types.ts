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
  cover: string | undefined;
  artist: string;
  title: string;
  uri: string;
}

export type TrackData = {
  title: string,
  artist: string,
  cover: string | undefined,
  uri: string
}

export type Playlist = {
  cover: string | undefined,
  title: string,
  uri: string,
  trackData: TrackData[]
}
