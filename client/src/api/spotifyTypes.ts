interface Image {
  url: string;
}

interface Album {
  images: Image[];
  name: string;
}

interface Artist {
  name: string;
}

interface Track {
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
