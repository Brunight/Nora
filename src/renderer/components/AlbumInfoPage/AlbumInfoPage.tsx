/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Song } from '../SongsPage/song';

interface AlbumInfoPageProp {
  data: {
    albumId: string;
  };
  playSong: (songId: string) => void;
  currentSongData: AudioData;
  updateContextMenuData: (
    isVisible: boolean,
    menuItems: any[],
    pageX?: number,
    pageY?: number
  ) => void;
  currentlyActivePage: { pageTitle: string; data?: any };
  changeCurrentActivePage: (pageTitle: string, data?: any) => void;
}

export default (props: AlbumInfoPageProp) => {
  const [albumData, setAlbumData] = React.useState({} as Album);
  const [songsData, setSongsData] = React.useState([] as SongData[]);

  React.useEffect(() => {
    if (props.data.albumId) {
      window.api.getAlbumData(props.data.albumId).then((res) => {
        if (res && !Array.isArray(res)) {
          setAlbumData(res);
        }
      });
    }
  }, [props.data]);

  React.useEffect(() => {
    if (albumData.songs && albumData.songs.length > 0) {
      const temp: Promise<SongData | undefined>[] = [];
      albumData.songs.forEach((song) => {
        temp.push(window.api.getSongInfo(song.songId));
      });
      Promise.all(temp).then((res) => {
        const data = res.filter((x) => x !== undefined) as SongData[];
        setSongsData(data);
      });
    }
  }, [albumData.songs]);

  const songComponents =
    songsData.length > 0
      ? songsData.map((song) => {
          return (
            <Song
              key={song.songId}
              title={song.title}
              artists={song.artists}
              artworkPath={song.artworkPath}
              duration={song.duration}
              songId={song.songId}
              playSong={props.playSong}
              currentSongData={props.currentSongData}
              updateContextMenuData={props.updateContextMenuData}
              currentlyActivePage={props.currentlyActivePage}
              changeCurrentActivePage={props.changeCurrentActivePage}
            />
          );
        })
      : [];

  return (
    <div className="main-container album-info-page-container">
      <div className="album-img-and-info-container">
        <div className="album-cover-container">
          {albumData.artworkPath && (
            <img
              src={`otomusic://localFiles/${albumData.artworkPath}`}
              alt=""
            />
          )}{' '}
        </div>
        {albumData.title &&
          albumData.artists.length > 0 &&
          albumData.songs.length > 0 && (
            <div className="album-info-container">
              <div className="album-title">{albumData.title}</div>
              <div className="album-artists">
                {albumData.artists.map((artist, index) => (
                  <span
                    className="artist"
                    title={artist}
                    onClick={() =>
                      props.currentlyActivePage.pageTitle === 'ArtistInfo' &&
                      props.currentlyActivePage.data.artistName === artist
                        ? props.changeCurrentActivePage('Home')
                        : props.changeCurrentActivePage('ArtistInfo', {
                            artistName: artist,
                          })
                    }
                  >
                    {artist}
                    {index === albumData.artists.length - 1 ? '' : ', '}
                  </span>
                ))}
              </div>
              <div className="album-no-of-songs">{`${
                albumData.songs.length
              } song${albumData.songs.length === 1 ? '' : 's'}`}</div>
              {albumData.year && (
                <div className="album-year">{albumData.year}</div>
              )}
            </div>
          )}
      </div>
      <div className="album-songs-container secondary-container songs-list-container">
        <div className="title-container">Songs</div>
        <div className="songs-container">{songComponents}</div>
      </div>
    </div>
  );
};
