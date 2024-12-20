interface Image {
  url: string;
}

export interface Album {
  images: Image[];
  name: string;
}

export interface Artist {
  name: string;
}

export interface Track {
  album: Album;
  artists: Artist[];
  name: string;
  uri: string;
}

interface TrackItem {
  track: Track;
}

interface Tracks {
  items: TrackItem[];
}

export interface PlaylistResponse {
  images: Image[];
  name: string;
  tracks: Tracks;
}

export interface PlaylistMinimumResponse {
    images: Image[],
    name: string;
}
