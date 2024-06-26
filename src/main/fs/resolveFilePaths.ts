import path from 'path';
import { platform } from 'process';

import { DEFAULT_ARTWORK_SAVE_LOCATION, DEFAULT_FILE_URL } from '../filesystem';

import albumCoverImage from '../../renderer/src/assets/images/webp/album_cover_default.webp?asset';
import songCoverImage from '../../renderer/src/assets/images/webp/song_cover_default.webp?asset';
import artistCoverImage from '../../renderer/src/assets/images/webp/artist_cover_default.webp?asset';
import playlistCoverImage from '../../renderer/src/assets/images/webp/playlist_cover_default.webp?asset';
import favoritesPlaylistCoverImage from '../../renderer/src/assets/images/webp/favorites-playlist-icon.webp?asset';
import historyPlaylistCoverImage from '../../renderer/src/assets/images/webp/history-playlist-icon.webp?asset';

let timestamps = {
  songs: Date.now(),
  artists: Date.now(),
  albums: Date.now(),
  playlists: Date.now(),
  genres: Date.now()
};

export const resetArtworkCache = (type: keyof typeof timestamps | 'all') => {
  const now = Date.now();
  if (type === 'all') {
    timestamps = {
      songs: now,
      artists: now,
      albums: now,
      playlists: now,
      genres: now
    };
  } else timestamps[type] = now;
  return now;
};

export const getSongArtworkPath = (
  id: string,
  isArtworkAvailable = true,
  resetCache = false,
  sendRealPath = false
): ArtworkPaths => {
  if (resetCache) resetArtworkCache('songs');

  const FILE_URL = sendRealPath ? '' : DEFAULT_FILE_URL;
  const timestampStr = sendRealPath ? '' : `?ts=${timestamps.songs}`;

  if (isArtworkAvailable) {
    return {
      isDefaultArtwork: !isArtworkAvailable,
      artworkPath: path.join(FILE_URL, DEFAULT_ARTWORK_SAVE_LOCATION, `${id}.webp`) + timestampStr,
      optimizedArtworkPath:
        path.join(FILE_URL, DEFAULT_ARTWORK_SAVE_LOCATION, `${id}-optimized.webp`) + timestampStr
    };
  }
  const defaultPath = path.join(FILE_URL, songCoverImage) + timestampStr;
  return {
    isDefaultArtwork: isArtworkAvailable,
    artworkPath: defaultPath,
    optimizedArtworkPath: defaultPath
  };
};

export const getArtistArtworkPath = (artworkName?: string, resetCache = false): ArtworkPaths => {
  if (resetCache) resetArtworkCache('artists');

  const timestampStr = `?ts=${timestamps.artists}`;

  if (artworkName) {
    return {
      isDefaultArtwork: !artworkName,
      artworkPath:
        path.join(DEFAULT_FILE_URL, DEFAULT_ARTWORK_SAVE_LOCATION, `${artworkName}`) + timestampStr,
      optimizedArtworkPath:
        path.join(
          DEFAULT_FILE_URL,
          DEFAULT_ARTWORK_SAVE_LOCATION,
          `${artworkName.replace(/\.webp^/, '-optimized.webp')}`
        ) + timestampStr
    };
  }
  const defaultPath = path.join(DEFAULT_FILE_URL, artistCoverImage);
  return {
    isDefaultArtwork: !artworkName,
    artworkPath: defaultPath,
    optimizedArtworkPath: defaultPath
  };
};

export const getAlbumArtworkPath = (artworkName?: string, resetCache = false): ArtworkPaths => {
  if (resetCache) resetArtworkCache('albums');

  const timestampStr = `?ts=${timestamps.albums}`;

  if (artworkName) {
    return {
      isDefaultArtwork: !artworkName,
      artworkPath:
        path.join(DEFAULT_FILE_URL, DEFAULT_ARTWORK_SAVE_LOCATION, `${artworkName}`) + timestampStr,
      optimizedArtworkPath:
        path.join(
          DEFAULT_FILE_URL,
          DEFAULT_ARTWORK_SAVE_LOCATION,
          `${artworkName.replace(/\.webp^/, '-optimized.webp')}`
        ) + timestampStr
    };
  }
  const defaultPath = path.join(DEFAULT_FILE_URL, albumCoverImage);
  return {
    isDefaultArtwork: !artworkName,
    artworkPath: defaultPath,
    optimizedArtworkPath: defaultPath
  };
};

export const getGenreArtworkPath = (artworkName?: string, resetCache = false): ArtworkPaths => {
  if (resetCache) resetArtworkCache('genres');

  const timestampStr = `?ts=${timestamps.genres}`;

  if (artworkName) {
    return {
      isDefaultArtwork: !artworkName,
      artworkPath:
        path.join(DEFAULT_FILE_URL, DEFAULT_ARTWORK_SAVE_LOCATION, `${artworkName}`) + timestampStr,
      optimizedArtworkPath:
        path.join(
          DEFAULT_FILE_URL,
          DEFAULT_ARTWORK_SAVE_LOCATION,
          `${artworkName.replace(/\.webp^/, '-optimized.webp')}`
        ) + timestampStr
    };
  }
  const defaultPath = path.join(DEFAULT_FILE_URL, songCoverImage);
  return {
    isDefaultArtwork: !artworkName,
    artworkPath: defaultPath,
    optimizedArtworkPath: defaultPath
  };
};

export const getPlaylistArtworkPath = (
  playlistId: string,
  isArtworkAvailable: boolean,
  resetCache = false
): ArtworkPaths => {
  if (resetCache) resetArtworkCache('playlists');

  const timestampStr = `?ts=${timestamps.playlists}`;

  const artworkPath =
    playlistId === 'History'
      ? path.join(DEFAULT_FILE_URL, historyPlaylistCoverImage) + timestampStr
      : playlistId === 'Favorites'
        ? path.join(DEFAULT_FILE_URL, favoritesPlaylistCoverImage) + timestampStr
        : isArtworkAvailable
          ? path.join(DEFAULT_FILE_URL, DEFAULT_ARTWORK_SAVE_LOCATION, `${playlistId}.webp`) +
            timestampStr
          : path.join(DEFAULT_FILE_URL, playlistCoverImage) + timestampStr;
  return {
    isDefaultArtwork: !isArtworkAvailable,
    artworkPath,
    optimizedArtworkPath: artworkPath
  };
};

export const removeDefaultAppProtocolFromFilePath = (filePath: string) => {
  const strippedPath = filePath.replace(
    /nora:[/\\]{1,2}localfiles[/\\]{1,2}|\?[\w+=\w+&?]+$/gm,
    ''
  );

  if (platform === 'linux') return `/${strippedPath}`;
  return strippedPath;
};
