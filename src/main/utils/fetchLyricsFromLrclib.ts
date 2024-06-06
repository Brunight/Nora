import { version, repository } from '../../../package.json';
import log from '../log';

interface LrclibTrackInfoStructure {
  track_name: string;
  artist_name: string;
  album_name?: string;
  duration: string;
}

interface LrclibLyrics {
  id: number;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number;
  instrumental: boolean;
  plainLyrics: string;
  syncedLyrics: string;
}

type LrclibLyricsAPI =
  | LrclibLyrics
  | {
      statusCode: number;
      name: string;
      message: string;
    };

type ParsedLrclibLyrics = {
  lrclibId: number;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number;
  lyrics: string;
  lyricsType: LyricsTypes;
};
const LRCLIB_BASE_URL = 'https://lrclib.net/';

const parseLrclibResponseData = (
  data: LrclibLyricsAPI,
  lyricsType: LyricsTypes
): ParsedLrclibLyrics | undefined => {
  if ('statusCode' in data) return undefined;

  const output: ParsedLrclibLyrics = {
    lrclibId: data.id,
    trackName: data.trackName,
    artistName: data.artistName,
    albumName: data.albumName,
    duration: data.duration,
    lyrics: data.syncedLyrics || data.plainLyrics,
    lyricsType: 'syncedLyrics' in data ? 'SYNCED' : 'UN_SYNCED'
  };

  if (lyricsType === 'SYNCED') {
    if ('syncedLyrics' in data) {
      output.lyrics = data.syncedLyrics;
    }
    return undefined;
  }

  return output;
};

const fetchLyricsFromLrclib = async (
  trackInfo: LrclibTrackInfoStructure,
  lyricsType: LyricsTypes = 'ANY',
  abortSignal?: AbortSignal
): Promise<ParsedLrclibLyrics | undefined> => {
  const headers = new Headers();
  headers.append('User-Agent', `Nora ${version} (${repository.url})`);

  const url = new URL('/api/get', LRCLIB_BASE_URL);

  for (const [key, value] of Object.entries(trackInfo)) {
    if (typeof value === 'string') url.searchParams.set(key, value);
  }

  try {
    const res = await fetch(url, { headers, signal: abortSignal });
    if (res.ok) {
      const data = (await res.json()) as LrclibLyricsAPI;
      const lyrics = parseLrclibResponseData(data, lyricsType);

      return lyrics;
    }
    throw new Error(
      `Error occurred when fetching lyrics from Lrclib.\nError : ${res.status} - ${res.statusText}`
    );
  } catch (error) {
    log('Error ocurred when fetching lyrics from Lrclib', { error }, 'ERROR');
    throw error;
  }
};

export default fetchLyricsFromLrclib;