// / / / / / / / / / / / /
// WINDOW CONTROLS
const appCloseBtn = document.querySelector('.close-btn') as HTMLElement | null;
const appMinimizeBtn = document.querySelector('.minimize-btn') as HTMLElement | null;
const appMaximizeBtn = document.querySelector('.maximize-btn') as HTMLElement | null;
// BODY
const bodyContainer = document.querySelector('.body') as HTMLElement | null;
// SIDEBAR LINKS
const mainLinks = document.querySelectorAll('.side-bar ul li');
// AUDIO ELEMENT
const audio = document.querySelector('audio') as HTMLAudioElement | null;
// SONG SEEKBAR
const seekBarSliderContainer = document.querySelector('.seek-bar') as HTMLElement | null;
const seekBarSlider = document.getElementById('seek-bar-slider') as HTMLInputElement | null;
// SONG CONTROLS
const skipbackBtn = document.querySelector('.skip-back-btn') as HTMLElement | null;
const playBtn = document.querySelector('.play-pause-btn') as HTMLElement | null;
const skipForwardBtn = document.querySelector('.skip-forward-btn') as HTMLElement | null;
const repeatBtn = document.querySelector('.repeat-btn') as HTMLElement | null;
const lyricsBtn = document.querySelector('.lyrics-btn') as HTMLElement | null;
const shuffleBtn = document.querySelector('.shuffle-btn') as HTMLElement | null;
// SONG INFO CONTAINERS
const currentSongCoverContainer = document.getElementById('currentSongCover') as HTMLElement | null;
const currentSongTitle = document.getElementById('currentSongTitle') as HTMLElement | null;
const currentSongArtists = document.getElementById('currentSongArtists') as HTMLElement | null;
// VOLUME CONTROLS
const volumeSlider = document.getElementById('volumeSlider') as HTMLInputElement | null;
// CONTEXT MENU
const contextMenu = document.querySelector('.context-menu') as HTMLElement | null;
//OTHER
const queueBtn = document.querySelector('.queue-btn') as HTMLElement | null;
const likeBtn = document.querySelector('.like-btn') as HTMLElement | null;
// / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / /

const options = {
	repeat: false,
};

// / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / /

const calculateTime = (secs: number) => {
	const minutes = Math.floor(secs / 60);
	const seconds = Math.floor(secs % 60);
	const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
	return `${minutes}:${returnedSeconds}`;
};

const showHomePage = (songsData: SongData[]) => {
	if (bodyContainer) {
		clearPreviousActives('.home');
		bodyContainer.innerHTML = `				
				<div class="main-container recently-added-songs-container">
					<div class="title-container">Recently Added Songs</div>
					<div class="songs-container">
					</div>
				</div>
				<div class="main-container recently-played-songs-container">
					<div class="title-container">Recently Played Songs</div>
					<div class="songs-container">
					</div>
				</div>
				`;

		const recentlyAddedSongsContainer = document.querySelector(
			'.recently-added-songs-container .songs-container'
		) as HTMLElement;
		const recentlyPlayedSongsContainer = document.querySelector(
			'.recently-played-songs-container .songs-container'
		) as HTMLElement;
		songsData
			.sort((a, b) => {
				if (
					new Date(a.createdDate as string).getTime() >
					new Date(b.createdDate as string).getTime()
				) {
					return -1;
				} else return 1;
			})
			.forEach((songData, index) => {
				if (index < 3) {
					const [r, g, b] = songData?.palette?.LightVibrant._rgb ||
						songData?.palette?.LightVibrant.rgb || [47, 49, 55];
					const [fr, fg, fb] = songData?.palette?.DarkVibrant._rgb ||
						songData?.palette?.DarkVibrant.rgb || [222, 220, 217];

					const background = `background:linear-gradient(90deg,rgba(${r},${g},${b},1) 0%,rgba(${r},${g},${b},1) 50%,rgba(${r},${g},${b},0.6) 70%,rgba(${r},${g},${b},0) 100%);`;
					const fontColor = `color:rgba(${fr},${fg},${fb},1)`;
					if (recentlyAddedSongsContainer && songData.artists) {
						recentlyAddedSongsContainer.innerHTML += `
					<div class="song ${songData.songId}" data-song-id="${songData.songId}">
							<div class="song-cover-container" data-song-id="${songData.songId}">
								<img src="${songData.artworkPath}" loading="lazy" alt="" data-song-id="${songData.songId}" />
							</div>
							<div class="song-info-and-play-btn-container" style="${background}" data-song-id="${
							songData.songId
						}">
								<div class="song-info-container" style="${fontColor}" data-song-id="${songData.songId}">
									<div class="song-title" title="${songData.title}" data-song-id="${songData.songId}">${
							songData.title
						}</div>
									<div class="song-artists" title="${songData.artists.join(', ')}" data-song-id="${
							songData.songId
						}">${songData.artists.join(', ')}</div>
								</div>
								<div class="play-btn-container" data-song-id="${songData.songId}">
									<i class="fa-solid fa-circle-play" onclick="getAudioData('${songData.songId}')" data-song-id="${
							songData.songId
						}"></i>
								</div>
							</div>
						</div>`;
					}
				}
			});
		window.api
			.getUserData()
			.then((res: UserData) => {
				// console.log(res);
				if (res.recentlyPlayedSongs && res.recentlyPlayedSongs.length > 0) {
					(
						document.querySelector('.recently-played-songs-container') as HTMLElement
					).classList.add('active');
					recentlyPlayedSongsContainer.innerHTML = res.recentlyPlayedSongs
						.map((songData) => {
							if (songData) {
								const [r, g, b] = songData?.palette?.LightVibrant._rgb ||
									songData?.palette?.LightVibrant.rgb || [47, 49, 55];
								const [fr, fg, fb] = songData?.palette?.DarkVibrant._rgb ||
									songData?.palette?.DarkVibrant.rgb || [222, 220, 217];

								const background = `background:linear-gradient(90deg,rgba(${r},${g},${b},1) 0%,rgba(${r},${g},${b},1) 50%,rgba(${r},${g},${b},0.6) 70%,rgba(${r},${g},${b},0) 100%);`;
								const fontColor = `color:rgba(${fr},${fg},${fb},1)`;
								if (recentlyPlayedSongsContainer && songData.artists) {
									return `
									<div class="song ${songData.songId}" data-song-id="${songData.songId}">
										<div class="song-cover-container" data-song-id="${songData.songId}">
											<img src="${songData.artworkPath}" loading="lazy" alt="" data-song-id="${songData.songId}" />
										</div>
										<div class="song-info-and-play-btn-container" style="${background}" data-song-id="${
										songData.songId
									}">
											<div class="song-info-container" style="${fontColor}" data-song-id="${songData.songId}">
												<div class="song-title" title="${songData.title}" data-song-id="${songData.songId}">${
										songData.title
									}</div>
												<div class="song-artists" title="${songData.artists.join(', ')}" data-song-id="${
										songData.songId
									}">${songData.artists.join(', ')}</div>
											</div>
											<div class="play-btn-container" data-song-id="${songData.songId}">
												<i class="fa-solid fa-circle-play" onclick="getAudioData('${songData.songId}')" data-song-id="${
										songData.songId
									}"></i>
											</div>
										</div>
									</div>`;
								}
							}
						})
						.join('');
				} else
					(
						document.querySelector('.recently-played-songs-container') as HTMLElement
					).classList.remove('active');
			})
			.catch((err: Error) => console.log(err))
			.finally(() => showContextMenu());
	}
};

const showSongsList = (songsData: SongData[]) => {
	clearPreviousActives('.songs');
	if (bodyContainer) {
		bodyContainer.innerHTML = `				
				<div class="main-container songs-list-container">
					<div class="title-container">Songs</div>
					<div class="songs-container">
						${songsData
							.map((songData) => {
								return `<div class="song ${songData.songId}" data-song-id="${
									songData.songId
								}">
							<div class="song-cover-and-play-btn-container" data-song-id="${songData.songId}">
								<div class="play-btn-container" data-song-id="${songData.songId}">
									<i class="fa-solid fa-circle-play" onclick="getAudioData('${songData.songId}')" data-song-id="${
									songData.songId
								}"></i>
								</div>
								<div class="song-cover-container" data-song-id="${songData.songId}">
									<img src="${songData.artworkPath}" loading="lazy" alt=""  data-song-id="${songData.songId}"/>
								</div>
							</div>
								<div class="song-info-container" data-song-id="${songData.songId}">
									<div class="song-title" title="${songData.title}" data-song-id="${songData.songId}">${
									songData.title
								}</div>
									<div class="song-artists" title="${songData.artists.join(', ')}" data-song-id="${
									songData.songId
								}">${songData.artists.join(', ')}</div>
									<div class="song-duration" data-song-id="${songData.songId}">${
									songData.duration ? calculateTime(songData.duration) : `-- : --`
								}</div>
								</div>
						</div>`;
							})
							.join('')}
					</div>
				</div>`;

		showContextMenu();
	}
};

const showCurrentQueue = (queue: Queue) => {
	if (bodyContainer) {
		clearPreviousActives('.queue-btn');
		bodyContainer.innerHTML = `				
				<div class="main-container songs-list-container playlist-container">
					<div class="title-container">Playlist</div>
					<div class="songs-container">
						${queue.queue
							.map((songData) => {
								return `<div class="song ${songData.songId}" data-song-id="${
									songData.songId
								}">
							<div class="song-cover-and-play-btn-container">
								<div class="play-btn-container">
									<i class="fa-solid fa-circle-play" onclick="getAudioData('${songData.songId}')"></i>
								</div>
								<div class="song-cover-container">
									<img src="${songData.artworkPath}" loading="lazy" alt="" />
								</div>
							</div>
								<div class="song-info-container">
									<div class="song-title" title="${songData.title}">${songData.title}</div>
									<div class="song-artists" title="${songData.title}">${songData.artists.join(', ')}</div>
									<div class="song-duration">${songData.duration ? calculateTime(songData.duration) : `-- : --`}</div>
								</div>
						</div>`;
							})
							.join('')}
					</div>
				</div>`;
		showContextMenu();
	}
};

const showSearchPage = () => {
	if (bodyContainer) {
		clearPreviousActives('.search');
		bodyContainer.innerHTML = `
            <div class="main-container search-container">
					<div class="search-bar-container">
						<img src="images/icons/search.svg" alt="" />
						<input
							type="search"
							name="search"
							id="searchBar"
							aria-label="Search"
							placeholder="Search for anything"
						/>
					</div>
					<div class="search-filters-container">
						<ul>
							<li class="active">All</li>
							<li>Songs</li>
							<li>Albums</li>
							<li>Artists</li>
							<li>Album Artists</li>
						</ul>
					</div>
					<div class="search-results-container">
						<div class="secondary-container most-relevant-results-container">
							<div class="title-container">Most Relevant</div>
							<div class="results-container">
								<div class="result most-relevant-song">
									<div class="result-img-container">
										<i title="Play Song" class="fa-solid fa-circle-play" onclick=""></i>
										<img src="" loading="lazy" alt="" />
									</div>
									<div class="result-info-container">
										<div class="title"></div>
										<div class="info-type-1"></div>
										<div class="info-type-2"></div>
										<div class="result-type">SONG</div>
									</div>
								</div>
								<div class="result most-relevant-artist">
									<div class="result-img-container">
										<img src="" loading="lazy" alt="" />
									</div>
									<div class="result-info-container">
										<div class="title"></div>
										<div class="info-type-1"></div>
										<div class="info-type-2"></div>
										<div class="result-type">ARTIST</div>
									</div>
								</div>
								<div class="result most-relevant-album">
									<div class="result-img-container">
										<i title="Play Album" class="fa-solid fa-circle-play" onclick=""></i>
										<img src="" loading="lazy" alt="" />
									</div>
									<div class="result-info-container">
										<div class="title"></div>
										<div class="info-type-1"></div>
										<div class="info-type-2"></div>
										<div class="result-type">ALBUM</div>
									</div>
								</div>
							</div>
						</div>
						<div class="secondary-container songs-list-container">
							<div class="title-container">Songs</div>
							<div class="songs-container"></div>
						</div>
						<div class="secondary-container artists-list-container">
							<div class="title-container">Artists</div>
							<div class="artists-container"></div>
						</div>
						<div class="secondary-container albums-list-container">
							<div class="title-container">Albums</div>
							<div class="albums-container"></div>
						</div>
						<div class="no-search-results-container">
							<div>We couldn't find any songs related to your search result. Please try again with different keywords.</div>
						</div>
					</div>
				</div>`;
		const searchFilterButtons = document.querySelectorAll('.search-filters-container ul li');
		for (const searchFilterBtn of searchFilterButtons) {
			searchFilterBtn.addEventListener('click', (e) => {
				for (const searchFilterBtn of searchFilterButtons) {
					searchFilterBtn.classList.remove('active');
				}
				(e.target as HTMLElement).classList.add('active');
			});
		}
		const searchBar = document.getElementById('searchBar') as HTMLInputElement;
		const mostRelevantResultsContainer = document.querySelector(
			'.most-relevant-results-container'
		) as HTMLElement;
		const songResultsListContainer = document.querySelector(
			'.search-results-container .songs-list-container'
		) as HTMLElement;
		const artistResultsListContainer = document.querySelector(
			'.search-results-container .artists-list-container'
		) as HTMLElement;
		const AlbumResultsListContainer = document.querySelector(
			'.search-results-container .albums-list-container'
		) as HTMLElement;
		const mostRelevantSong = document.querySelector('.result.most-relevant-song') as HTMLElement;
		const mostRelevantArtist = document.querySelector(
			'.result.most-relevant-artist'
		) as HTMLElement;
		const mostRelevantAlbum = document.querySelector(
			'.result.most-relevant-album'
		) as HTMLElement;
		const mostRelevantResults = document.querySelector(
			'.most-relevant-results-container .results-container'
		) as HTMLElement;
		const songResultsList = document.querySelector(
			'.search-results-container .songs-list-container .songs-container'
		) as HTMLElement;
		const artistResultsList = document.querySelector(
			'.search-results-container .artists-list-container .artists-container'
		) as HTMLElement;
		const albumResultsList = document.querySelector(
			'.search-results-container .albums-list-container .albums-container'
		) as HTMLElement;
		const noResultsContainer = document.querySelector(
			'.no-search-results-container'
		) as HTMLElement;
		searchBar.addEventListener('keypress', (e) => e.stopPropagation());
		searchBar.addEventListener('input', (e) => {
			const value = (e.target as HTMLInputElement).value.trim();
			if (value !== '') {
				window.api.search('all', value).then((result: Data) => {
					// console.log(result);
					if (mostRelevantResultsContainer && songResultsListContainer) {
						if (
							result.songs.length > 0 ||
							result.albums.length > 0 ||
							result.artists.length > 0
						) {
							noResultsContainer.classList.remove('active');
							mostRelevantResultsContainer.classList.add('active');
							if (result.songs.length > 0) {
								mostRelevantSong.classList.add('active');
								const firstResult = result.songs[0];
								mostRelevantSong.dataset.songId = firstResult.songId;
								(
									document.querySelector(
										'.most-relevant-song .result-img-container i'
									) as HTMLElement
								).setAttribute('onclick', `getAudioData('${firstResult.songId}')`);
								(
									document.querySelector(
										'.most-relevant-song .result-img-container img'
									) as HTMLImageElement
								).src = firstResult.artworkPath;
								(
									document.querySelector(
										'.most-relevant-song .result-info-container .title'
									) as HTMLElement
								).innerText = firstResult.title;
								(
									document.querySelector(
										'.most-relevant-song .result-info-container .info-type-1'
									) as HTMLElement
								).innerText = firstResult.artists.join(', ');
								(
									document.querySelector(
										'.most-relevant-song .result-info-container .info-type-2'
									) as HTMLElement
								).innerText = calculateTime(firstResult.duration);
							} else mostRelevantSong.classList.remove('active');

							if (result.artists.length > 0) {
								mostRelevantArtist.classList.add('active');
								const firstResult = result.artists[0];
								mostRelevantArtist.dataset.artistId = firstResult.artistId;
								(
									document.querySelector(
										'.most-relevant-artist .result-img-container img'
									) as HTMLImageElement
								).src = firstResult.artworkPath || 'images/artist_covers/dixie.jfif';
								(
									document.querySelector(
										'.most-relevant-artist .result-info-container .title'
									) as HTMLElement
								).innerText = firstResult.name;
								// (
								// 	document.querySelector(
								// 		'.most-relevant-artist .result-info-container .info-type-1'
								// 	) as HTMLElement
								// ).innerText = firstResult.songs[0].title;
							} else mostRelevantArtist.classList.remove('active');

							if (result.albums.length > 0) {
								mostRelevantAlbum.classList.add('active');
								const firstResult = result.albums[0];
								mostRelevantSong.dataset.albumId = firstResult.albumId;

								(
									document.querySelector(
										'.most-relevant-album .result-img-container img'
									) as HTMLImageElement
								).src = firstResult.artworkPath || 'images/song_cover_default.png';
								(
									document.querySelector(
										'.most-relevant-album .result-info-container .title'
									) as HTMLElement
								).innerText = firstResult.title;
								(
									document.querySelector(
										'.most-relevant-album .result-info-container .info-type-1'
									) as HTMLElement
								).innerText = `${firstResult.year}` || 'year unknown';
							} else mostRelevantAlbum.classList.remove('active');
						} else {
							mostRelevantResultsContainer.classList.remove('active');
							songResultsListContainer.classList.remove('active');
							artistResultsListContainer.classList.remove('active');
							noResultsContainer.classList.add('active');
						}
						if (result.songs.length > 0) {
							songResultsListContainer.classList.add('active');
							songResultsList.innerHTML = result.songs
								.filter((val, index) => {
									if (index < 5) return val;
								})
								.map((songData) => {
									return `
									<div class="song ${songData.songId}" data-song-id="${songData.songId}">
										<div class="song-cover-and-play-btn-container" data-song-id="${songData.songId}">
											<div class="play-btn-container" data-song-id="${songData.songId}">
												<i class="fa-solid fa-circle-play" data-song-id="${songData.songId}" onclick="getAudioData('${
										songData.songId
									}')"></i>
											</div>
											<div class="song-cover-container" data-song-id="${songData.songId}">
												<img src="${songData.artworkPath}" loading="lazy" alt=""  data-song-id="${songData.songId}"/>
											</div>
										</div>
											<div class="song-info-container" data-song-id="${songData.songId}">
												<div class="song-title" title="${songData.title}" data-song-id="${songData.songId}">${
										songData.title
									}</div>
												<div class="song-artists" title="${songData.artists.join(', ')}" data-song-id="${
										songData.songId
									}">${songData.artists.join(', ')}</div>
												<div class="song-duration" title="${
													songData.duration
														? calculateTime(songData.duration)
														: `unknown duration`
												}" data-song-id="${songData.songId}">${
										songData.duration ? calculateTime(songData.duration) : `-- : --`
									}</div>
											</div>
									</div>`;
								})
								.join('');
						} else songResultsListContainer.classList.remove('active');

						if (result.artists.length > 0) {
							artistResultsListContainer.classList.add('active');
							artistResultsList.innerHTML = result.artists
								.map((artist, index) => {
									if (index < 4) {
										return `
									<div class="artist" data-artist-id="${artist.artistId}">
										<div class="artist-img-container">
											<img src="images/artist_covers/selena-gomez.jfif" loading="lazy">
										</div>
										<div class="artist-info-container">
											<div class="name-container" title="${artist.name}">${artist.name}</div>
										</div>
									</div>`;
									}
								})
								.join('');
						} else artistResultsListContainer.classList.remove('active');

						if (result.albums.length > 0) {
							AlbumResultsListContainer.classList.add('active');
							albumResultsList.innerHTML = result.albums
								.map((album, index) => {
									if (index < 4) {
										return `
								<div class="album" data-album-id="${album.albumId}">
									<div class="album-cover-and-play-btn-container">
										<i class="fa-solid fa-circle-play"></i>
										<div class="album-cover-container">
											<img src="images/artist_covers/cher-lloyd.jfif" alt="" loading="lazy">
										</div>
									</div>
									<div class="album-info-container">
										<div class="album-title" title="${album.title}">${album.title}</div>
										<div class="album-artists" title="${album.artists.join(', ')}">${album.artists.join(', ')}</div>
									</div>
								</div>`;
									}
								})
								.join('');
						} else AlbumResultsListContainer.classList.remove('active');
						showContextMenu();
					}
				});
			} else noResultsContainer.classList.remove('active');
		});
	}
};

const showContextMenu = () => {
	if (contextMenu) {
		const songs = document.querySelectorAll('.song') as NodeListOf<HTMLElement>;
		const viewportHeight = window.innerHeight;
		const viewportWidth = window.innerWidth;
		const menuHeight = contextMenu.clientHeight;
		const menuWidth = contextMenu.clientWidth;
		for (const song of songs) {
			song.addEventListener('contextmenu', (e) => {
				console.log(e);
				contextMenuElement = e.target as HTMLElement;
				contextMenu.classList.add('visible');
				if (e.pageX + menuWidth > viewportWidth)
					contextMenu.style.left = `${e.pageX - menuHeight}px`;
				else contextMenu.style.left = `${e.pageX}px`;
				if (e.pageY + menuHeight > viewportHeight)
					contextMenu.style.top = `${e.pageY - menuHeight}px`;
				else contextMenu.style.top = `${e.pageY}px`;
			});
		}
	}
};

const showLyricsTab = async () => {
	if (currentSongTitle && currentSongArtists && bodyContainer) {
		clearPreviousActives('.lyrics-btn');
		const songTitle = currentSongTitle.innerText;
		const songArtists = currentSongArtists.innerText;
		for (const link of mainLinks) {
			link.classList.remove('active');
		}
		bodyContainer.innerHTML = `
				<div class="main-container lyrics-container"></div>`;
		const lyricsContainer = document.querySelector('.lyrics-container');
		if (songTitle && songArtists && lyricsContainer) {
			await window.api.getSongLyrics(songTitle, songArtists).then(
				(lyrics: Lyrics | undefined) => {
					console.log(lyrics);
					if (lyrics && lyrics.lyrics) {
						lyricsContainer.innerHTML = `${lyrics.lyrics
							.split('\n')
							.map((lyrics: string) => {
								return `<div class="lyrics-line">${lyrics}</div>`;
							})
							.join('')}
					<div class="source-name">Lyrics provided by ${lyrics.source.name} using SongLyrics.</div>`;
					} else
						lyricsContainer.innerHTML = `<div class="no-lyrics-container">We couldn't find any lyrics for your song.</div>`;
				},
				(err: Error) => console.log(err)
			);
		}
	}
};
// ! TAKE PREQUATIONS TO REMOVE AudioData FROM RENDERER BECAUSE OF HIGH RAM USAGE.
let audioData: SongData[] = [];

const queue: Queue = {
	currentSongIndex: null,
	queue: [],
};

window.api.getUserData().then((data: UserData) => {
	console.log('userdata ', data);
	if (audio) {
		if (data.theme.isDarkMode) {
			document.body.classList.add('dark-mode');
			document.querySelector('.change-theme-btn i')?.classList.remove('fa-moon');
			document.querySelector('.change-theme-btn i')?.classList.add('fa-sun');
		} else {
			document.body.classList.remove('dark-mode');
			document.querySelector('.change-theme-btn i')?.classList.add('fa-moon');
			document.querySelector('.change-theme-btn i')?.classList.remove('fa-sun');
		}
		if (data.volume.isMuted) {
			document.querySelector('.volume-btn i')?.classList.remove('fa-volume-high');
			document.querySelector('.volume-btn i')?.classList.add('fa-volume-xmark');
		}
		audio.muted = data.volume.isMuted;
		audio.volume = data.volume.value / 100;
		if (volumeSlider) {
			volumeSlider.value = data.volume.value.toString();
			showRangeProgress('volume', data.volume.value, parseInt(volumeSlider.max));
			if (data.currentSong.songId) getAudioData(data.currentSong.songId, false, false);
		}
		audio.currentTime = data.currentSong.stoppedPosition;
		showRangeProgress('audio', data.currentSong.stoppedPosition, audio.duration);
	}
});

const showRangeProgress = (sliderType: string, divider: number, divisor: number) => {
	if (audio && seekBarSlider && volumeSlider) {
		if (sliderType === 'audio') {
			seekBarSlider.style.setProperty('--seek-before-width', (divider / divisor) * 100 + '%');
		}
		if (sliderType === 'volume') {
			volumeSlider.style.setProperty('--volume-before-width', (divider / divisor) * 100 + '%');
		}
	} else console.log("sliders or audio elements couldn't be found.");
};

for (const link of mainLinks) {
	link.addEventListener('click', (e) => {
		mainLinks.forEach((x) => x.classList.remove('active'));
		if (e.target) (e.target as HTMLOListElement).classList.add('active');
		if (audioData.length > 0) {
			if (link.classList.contains('songs')) {
				showSongsList(audioData);
			}
			if (link.classList.contains('home')) {
				showHomePage(audioData);
			}
			if (link.classList.contains('search')) {
				showSearchPage();
			}
		}
	});
}

window.api.checkForSongs().then((res: SongData[]) => {
	if (res && res.length > 0) {
		audioData = res.sort((a, b) => {
			if (
				new Date(a.createdDate as string).getTime() >
				new Date(b.createdDate as string).getTime()
			) {
				return -1;
			} else return 1;
		});
		// console.log(audioData);
		showHomePage(audioData);
		createQueue(res);
	} else {
		if (bodyContainer) {
			bodyContainer.innerHTML = `<div class="no-songs-container">
					<img src="images/empty-folder.png" alt="" />
					<span>We couldn't find any songs in your system.</span>
					<button id="add-new-song-folder"><i class="fa-solid fa-plus"></i> Add Folder</button>
				</div>`;
			document.getElementById('add-new-song-folder')?.addEventListener('click', async () => {
				await window.api.addMusicFolder().then(
					(result: SongData[]) => {
						console.log(result);
						if (Array.isArray(result) && result.length > 0) {
							audioData = result.sort((a, b) => {
								if (
									new Date(a.createdDate as string).getTime() >
									new Date(b.createdDate as string).getTime()
								) {
									return -1;
								} else return 1;
							});
							showHomePage(result);
							createQueue(result);
						}
					},
					(err: Error) => console.log(err)
				);
			});
		}
	}
});

const getAudioData = (songId: string, startPlay = true, startFromBeginning = true) => {
	window.api.getSong(songId).then(
		(songData: AudioData | undefined) => {
			if (songData) {
				// console.log(songData);
				const { title, artists, path, artwork } = songData;
				if (audio) {
					audio.src = path;
					const songs = document.querySelectorAll(`.playing`);
					for (const song of songs) {
						song?.classList.remove('playing');
					}
					const songPlayButtons = document.querySelectorAll(
						`.song.playing .song-cover-and-play-btn-container .play-btn-container i`
					);
					for (const songPlayBtn of songPlayButtons) {
						songPlayBtn?.classList.add('fa-circle-play');
						songPlayBtn?.classList.remove('fa-circle-pause');
					}
					audio.dataset['songId'] = songId;
					if (startFromBeginning && seekBarSlider) {
						audio.currentTime = 0;
						seekBarSlider.value = '0';
					}
					queue.queue.forEach((song, index) => {
						if (song.songId === songId) {
							queue.currentSongIndex = index;
						}
					});
					if (startPlay) audio.play();
				}
				if (currentSongCoverContainer) {
					if (songData.artworkPath) {
						currentSongCoverContainer.innerHTML = `<img src="${
							songData.artworkPath || 'images/song_cover_default.png'
						}" loading="lazy">`;
					} else {
						currentSongCoverContainer.innerHTML = `<img src="images/song_cover_default.png" loading="lazy">`;
					}
				}
				if (currentSongTitle) {
					currentSongTitle.innerText = title;
					currentSongTitle.setAttribute('title', title);
				}
				if (currentSongArtists) {
					if (Array.isArray(artists)) {
						currentSongArtists.innerText = artists.join(', ');
						currentSongArtists.setAttribute('title', artists.join(', '));
					} else currentSongArtists.innerText = artists;
				}
				if ('mediaSession' in navigator) {
					navigator.mediaSession.metadata = new MediaMetadata({
						title: title,
						artist: Array.isArray(artists) ? artists.join(', ') : artists,
						album: songData.album || 'Unknown Album',
						artwork: [
							{
								src: `data:;base64,${artwork}`,
								sizes: '300x300',
								type: 'image/png',
							},
							// More sizes, like 192x192, 256x256, 384x384, and 512x512
						],
					});
					navigator.mediaSession.setActionHandler('pause', () => {
						audio?.pause();
					});
					navigator.mediaSession.setActionHandler('play', () => {
						audio?.play();
					});
					navigator.mediaSession.setActionHandler('previoustrack', () => {
						if (skipbackBtn) skipbackBtn.click();
					});
					navigator.mediaSession.setActionHandler(`nexttrack`, () => {
						if (skipForwardBtn) skipForwardBtn.click();
					});
				} else console.log("Your device doesn't support MediaSession.");
				if (songData.isAFavorite) {
					document.querySelector('.like-btn i')?.classList.remove('fa-regular');
					document.querySelector('.like-btn i')?.classList.add('fa-solid', 'liked');
				} else {
					document.querySelector('.like-btn i')?.classList.add('fa-regular');
					document.querySelector('.like-btn i')?.classList.remove('fa-solid', 'liked');
				}
				audio?.dispatchEvent(songChange);
			} else console.log('Invalid song data', songData);
		},
		(err: Error) => console.log(err)
	);
	window.api.saveUserData('currentSong.songId', songId);
};

appCloseBtn?.addEventListener('click', () => window.api.closeApp());
appMinimizeBtn?.addEventListener('click', () => window.api.minimizeApp());
appMaximizeBtn?.addEventListener('click', () => window.api.toggleMaximizeApp());
document.querySelector('.play-pause-btn i')?.addEventListener('click', () => {
	if (audio) {
		// if (audio.paused && audio.currentTime > 0 && !audio.ended) audio.play();
		if (audio.paused) audio.play();
		else audio.pause();
		if (audio.ended) audio?.play();
	}
});

likeBtn?.addEventListener('click', async () => {
	const songId = audio?.dataset.songId;
	if (songId) {
		if (document.querySelector('.like-btn i')?.classList.contains('fa-regular')) {
			await window.api.toggleLikeSong(songId, true).then((res: toggleLikeSongReturnValue) => {
				if (res.success) {
					document.querySelector('.like-btn i')?.classList.remove('fa-regular');
					document.querySelector('.like-btn i')?.classList.add('fa-solid', 'liked');
					console.log('liked successfully');
				} else console.log(res.error);
			});
		} else {
			await window.api.toggleLikeSong(songId, false).then((res: toggleLikeSongReturnValue) => {
				if (res.success) {
					document.querySelector('.like-btn i')?.classList.add('fa-regular');
					document.querySelector('.like-btn i')?.classList.remove('fa-solid', 'liked');
					console.log('disliked successfully');
				} else console.log(res.error);
			});
		}
	}
});
document.querySelector('.volume-btn i')?.addEventListener('click', () => {
	if (document.querySelector('.volume-btn i')?.classList.contains('fa-volume-high')) {
		document.querySelector('.volume-btn i')?.classList.remove('fa-volume-high');
		document.querySelector('.volume-btn i')?.classList.add('fa-volume-xmark');
	} else {
		document.querySelector('.volume-btn i')?.classList.add('fa-volume-high');
		document.querySelector('.volume-btn i')?.classList.remove('fa-volume-xmark');
	}
});
document.querySelector('.change-theme-btn i')?.addEventListener('click', () => {
	if (document.body.classList.contains('dark-mode')) {
		document.querySelector('.change-theme-btn i')?.classList.add('fa-moon');
		document.querySelector('.change-theme-btn i')?.classList.remove('fa-sun');
		document.body.classList.remove('dark-mode');
		window.api.saveUserData('theme.isDarkMode', 'false');
	} else {
		document.querySelector('.change-theme-btn i')?.classList.remove('fa-moon');
		document.querySelector('.change-theme-btn i')?.classList.add('fa-sun');
		document.body.classList.add('dark-mode');
		window.api.saveUserData('theme.isDarkMode', 'true');
	}
});
//! SOME FONTS ARE NOT LOADING !!!
repeatBtn?.addEventListener('click', () => {
	if (repeatBtn.classList.contains('active')) {
	}
});

if (audio && seekBarSlider) {
	if (audio?.readyState > 0) {
		(document.querySelector('.full-song-duration') as HTMLElement).innerText = calculateTime(
			audio?.duration || 0
		);
		seekBarSlider.max = `${Math.floor(audio?.duration)}`;
	} else {
		audio?.addEventListener('loadedmetadata', () => {
			(document.querySelector('.full-song-duration') as HTMLElement).innerText = calculateTime(
				audio?.duration
			);
			seekBarSlider.max = `${Math.floor(audio?.duration)}`;
		});
		audio?.addEventListener('timeupdate', () => {
			showRangeProgress('audio', Math.floor(audio.currentTime), audio.duration);
			seekBarSlider.value = Math.floor(audio.currentTime).toString();
			(document.querySelector('.current-song-duration') as HTMLElement).innerText =
				calculateTime(audio.currentTime);
		});
	}
	audio.addEventListener('play', () => {
		if (document.querySelector('.play-pause-btn i')?.classList.contains('fa-circle-play')) {
			document.querySelector('.play-pause-btn i')?.classList.remove('fa-circle-play');
			document.querySelector('.play-pause-btn i')?.classList.add('fa-circle-pause');
		}
		const songs = document.querySelectorAll(`.${audio.dataset.songId}`);
		for (const song of songs) {
			song?.classList.add('playing');
		}
		const songPlayButtons = document.querySelectorAll(
			`.song.playing .song-cover-and-play-btn-container .play-btn-container i`
		);
		for (const songPlayBtn of songPlayButtons) {
			songPlayBtn?.classList.remove('fa-circle-play');
			songPlayBtn?.classList.add('fa-circle-pause');
		}
	});
	audio.addEventListener('pause', () => {
		if (document.querySelector('.play-pause-btn i')?.classList.contains('fa-circle-pause')) {
			document.querySelector('.play-pause-btn i')?.classList.add('fa-circle-play');
			document.querySelector('.play-pause-btn i')?.classList.remove('fa-circle-pause');
			audio?.pause();
		}
		window.api.sendSongPosition(audio.currentTime);
		const songs = document.querySelectorAll(`.${audio.dataset.songId}`);
		for (const song of songs) {
			song?.classList.remove('playing');
		}
		const songPlayButtons = document.querySelectorAll(
			`.song.playing .song-cover-and-play-btn-container .play-btn-container i`
		);
		for (const songPlayBtn of songPlayButtons) {
			songPlayBtn?.classList.remove('fa-circle-pause');
			songPlayBtn?.classList.add('fa-circle-play');
		}
	});
	audio.addEventListener('ended', () => {
		if (options.repeat) {
			audio.currentTime = 0;
			audio.play();
		} else {
			// audio.dispatchEvent(songChange);
			const songs = document.querySelectorAll(`.${audio.dataset.songId}`);
			const songPlayButtons = document.querySelectorAll(
				`.song.playing .song-cover-and-play-btn-container .play-btn-container i`
			);
			for (const song of songs) {
				song?.classList.remove('playing');
			}
			for (const songPlayBtn of songPlayButtons) {
				songPlayBtn?.classList.remove('fa-circle-pause');
				songPlayBtn?.classList.add('fa-circle-play');
			}
			console.log(queue);
			if (skipForwardBtn) skipForwardBtn.click();
		}
	});
	document.addEventListener('keypress', (e) => {
		e.preventDefault();
		if (e.code === 'Space') {
			if (audio.paused) {
				audio.play();
			} else audio.pause();
		}
	});
}

const songChange = new CustomEvent('songChange', {
	detail: {},
	bubbles: true,
	cancelable: true,
	composed: false,
});

seekBarSlider?.addEventListener('input', (e) => {
	if (audio && document.querySelector('.current-song-duration')) {
		showRangeProgress('audio', Math.floor(audio.currentTime), audio.duration);
		(document.querySelector('.current-song-duration') as HTMLElement).innerText = calculateTime(
			parseInt(seekBarSlider.value)
		);
		audio.currentTime = parseInt(seekBarSlider.value);
	}
});

document.querySelector('.volume-btn')?.addEventListener('click', async () => {
	if (audio) {
		if (audio?.muted) {
			audio.muted = false;
			window.api.saveUserData('volume.isMuted', false);
		} else {
			audio.muted = true;
			window.api.saveUserData('volume.isMuted', true);
		}
	}
});

if (volumeSlider) {
	volumeSlider.addEventListener('change', (e) =>
		window.api.saveUserData('volume.value', (e.target as HTMLInputElement).value)
	);

	volumeSlider.addEventListener('input', (e) => {
		const value = (e.target as HTMLInputElement).value;
		if (audio) {
			audio.volume = parseInt(value) / 100;
			showRangeProgress('volume', parseInt(volumeSlider.value), parseInt(volumeSlider.max));
		}
	});
} else console.log("volume slider couldn't be found.");

skipbackBtn?.addEventListener('click', () => {
	if (audio) {
		if (audio.currentTime > 5) audio.currentTime = 0;
		else {
			if (queue.currentSongIndex !== null) {
				if (queue.currentSongIndex === 0) queue.currentSongIndex = queue.queue.length - 1;
				else queue.currentSongIndex--;
			} else queue.currentSongIndex = 0;
			const songData = queue.queue[queue.currentSongIndex];
			getAudioData(songData.songId, true);
			// audio.dispatchEvent(songChange);
		}
	}
});

skipForwardBtn?.addEventListener('click', () => {
	if (audio) {
		if (options.repeat) {
			audio.currentTime = 0;
		} else {
			if (queue.currentSongIndex !== null) {
				if (queue.queue.length - 1 === queue.currentSongIndex) queue.currentSongIndex = 0;
				else queue.currentSongIndex++;
			} else queue.currentSongIndex = 0;
			const songData = queue.queue[queue.currentSongIndex];
			getAudioData(songData.songId, true);
			// audio.dispatchEvent(songChange);
		}
	}
});

const createQueue = (songsData: SongData[]) => {
	queue.queue = songsData.map((songData) => {
		return {
			title: songData.title,
			artists: songData.artists,
			artworkPath: songData.artworkPath,
			duration: songData.duration || 0,
			path: songData.path,
			songId: songData.songId,
		};
	});
	// console.log(queue);
};

if (queueBtn) {
	queueBtn.addEventListener('click', (e) => {
		if (queueBtn.classList.contains('active')) {
			(document.querySelector('.home') as HTMLElement).click();
			queueBtn.classList.remove('active');
			for (const mainLink of mainLinks) {
				(mainLink as HTMLElement).classList.remove('active');
			}
		} else {
			queueBtn.classList.add('active');
			showCurrentQueue(queue);
		}
	});
}

if (repeatBtn) {
	repeatBtn.addEventListener('click', (e) => {
		if (options.repeat) {
			options.repeat = false;
			repeatBtn.classList.remove('active');
		} else {
			options.repeat = true;
			repeatBtn.classList.add('active');
		}
	});
}

if (lyricsBtn && audio) {
	lyricsBtn.addEventListener('click', () => {
		if (lyricsBtn.classList.contains('active')) {
			lyricsBtn.classList.remove('active');
			showHomePage(audioData);
			audio.removeEventListener('songChange', showLyricsTab);
		} else {
			lyricsBtn.classList.add('active');
			showLyricsTab();
			audio.addEventListener('songChange', () => {
				console.log('song changed');
				showLyricsTab();
			});
		}
	});
}

window.api.getSongPosition(async () => {
	if (audio) {
		await window.api.sendSongPosition(audio.currentTime);
	}
});

const shuffleQueue = (queue: any[]) => queue.sort(() => 0.5 - Math.random());

if (shuffleBtn) {
	shuffleBtn.addEventListener('click', () => {
		if (shuffleBtn.classList.contains('active')) {
			shuffleBtn.classList.remove('active');
			queue.queue = audioData;
		} else {
			// console.log(queue.queue);
			console.log('queue shuffled', `currentSongIndex : `, queue.currentSongIndex);
			queue.queue = shuffleQueue(queue.queue);
			shuffleBtn.classList.add('active');
		}
	});
}

const clearPreviousActives = (classToAddActive = '') => {
	const pageClasses = [
		'.home',
		'.search',
		'.songs',
		'.artists',
		'.albums',
		'.queue-btn',
		'.lyrics-btn',
	];
	pageClasses.forEach((pageClass) => {
		if (document.querySelector(pageClass)) {
			document.querySelector(pageClass)?.classList.remove();
		}
	});
	if (classToAddActive) document.querySelector(classToAddActive)?.classList.add('active');
	if (audio && classToAddActive !== '.lyrics-btn')
		audio.removeEventListener('songChange', showLyricsTab);
};

let contextMenuElement: HTMLElement;

if (contextMenu) {
	window.addEventListener('click', () => {
		contextMenu.classList.remove('visible');
	});

	contextMenu.addEventListener('click', (e) => e.stopPropagation());

	const menuItems = contextMenu.children;
	for (const menuItem of menuItems) {
		menuItem.addEventListener('click', (e) => {
			console.log(e);
			console.log(contextMenuElement);
			contextMenu.classList.remove('visible');
			const target = e.target as HTMLElement | null;
			if (target) {
				if (target.classList.contains('option-open-devtools')) window.api.openDevtools();
				if (
					contextMenuElement &&
					target.classList.contains('option-play-now') &&
					contextMenuElement.dataset.songId
				)
					getAudioData(contextMenuElement.dataset.songId, true, true);
				if (
					contextMenuElement &&
					target.classList.contains('option-play-next') &&
					contextMenuElement.dataset.songId
				) {
					let selectedSongData: QueuedSong = queue.queue.filter(
						(song) => song.songId === contextMenuElement.dataset.songId
					)[0];
					const newQueue = queue.queue.filter(
						(song) => song.songId !== contextMenuElement.dataset.songId
					);
					newQueue.splice(
						queue.queue.length - 1 !== queue.currentSongIndex
							? queue.currentSongIndex
								? queue.currentSongIndex + 1
								: 0
							: 0,
						0,
						selectedSongData
					);
					queue.queue = newQueue;
				}
			}
		});
	}
}

window.api.addNewSong((e: unknown, songs: SongData[]) => {
	console.log('new songs added ', songs);
	if (songs && songs.length > 0) {
		songs.forEach((song) => {
			audioData.unshift(song);
		});
	}
});
