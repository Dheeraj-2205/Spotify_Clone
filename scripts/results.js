import { left_nav, top_nav_search, playerBottom } from "../utils/components.js";
import { debounce, millisToMinutesAndSeconds } from "/utils/utilities.js";
import { getAllSearchResults, refreshToken } from "../utils/api_calls.js";

const nav_top_container = document.querySelector('#top_nav');
nav_top_container.innerHTML = top_nav_search();
const nav_left_container = document.querySelector('#left_nav');
nav_left_container.innerHTML = left_nav();
const nav_bottom = document.querySelector('#page_bottom');
nav_bottom.innerHTML = playerBottom();

// token section
const TOKEN = localStorage.getItem('spotify_token') || '';
if (TOKEN.length == 0) {
  refreshToken();
}

// media player
const progress_bar = document.querySelector('#progress_bar');
const bottom_play_button = document.querySelector('#bottom_play_button');
const previous_button = document.querySelector("#previous_button");
const next_button = document.querySelector('#next_button');
let curr_song = new Audio("");
let songs_array = [];
let curr_song_index = 0;

curr_song.ontimeupdate = () => {
  let curr_time = curr_song.currentTime;
  if (Math.floor(curr_time) < 10) {
    curr_song_time.textContent = "0:0" + Math.floor(curr_time);
  } else {
    curr_song_time.textContent = "0:" + Math.floor(curr_time);
  }
  let percent = (curr_time / 30) * 100;
  progress_bar.style.right = `${100 - percent}%`;
}

function updateMusic(index) {
  curr_song_index = index;
  playing_img.src = songs_array[index].album.images[2].url;
  player_song_name.textContent = songs_array[index].name;
  player_artist_name.textContent = songs_array[index].artists[0].name;
  curr_song.src = songs_array[index].preview_url;

  bottom_play_button.innerHTML = `<svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16">
  <path
            d="M2.7 1a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7H2.7zm8 0a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-2.6z">
            </path>
        </svg>`;
}

bottom_play_button.onclick = () => {
  if (curr_song.paused) {
    bottom_play_button.innerHTML = `<svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16">
          <path
            d="M2.7 1a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7H2.7zm8 0a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-2.6z">
          </path>
        </svg>`;
    curr_song.play();
  } else {
    bottom_play_button.innerHTML = `<svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16">
          <path d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z">
          </path>
        </svg>`;
    curr_song.pause();
  }
}

next_button.onclick = () => {
  if (curr_song_index < songs_array.length) {
    updateMusic(++curr_song_index);
    curr_song.play();
  }
}

previous_button.onclick = () => {
  if (curr_song_index > 0) {
    updateMusic(--curr_song_index);
    curr_song.play();
  }
}

// display section
const search_results_section = document.querySelector('#search_results_section');
const search_songs_section = document.querySelector("#search_songs_section");
const songs_body = document.querySelector("#songs_body");
const search_albums_section = document.querySelector("#search_albums_section");
const search_playlists_section = document.querySelector("#search_playlists_section");
const search_artists_section = document.querySelector("#search_artists_section");

const displayAllResults = (data) => {
  let tracks = [], albums = [], artists = [];
  for (let obj in data) {
    if (obj == "tracks") {
      tracks = [...data[obj].items];
    } else if (obj == "albums") {
      albums = [...data[obj].items];
    } else if (obj == "artists") {
      artists = [...data[obj].items];
    }
  }
  tracks.splice(7, 13);
  albums.splice(7, 13);
  artists.splice(7, 13);

  search_results_section.innerHTML = null;

  // search top section
  const all_result_top = document.createElement("div");

  const all_result_top_left = document.createElement("div");
  const result_header_left = document.createElement("div");
  const top_song_container = document.createElement("div");
  const top_song_image_container = document.createElement("div");
  const top_song_name = document.createElement("div");
  const top_song_artist = document.createElement("div");
  const top_play_button = document.createElement("div");

  result_header_left.textContent = "Top result";
  top_song_image_container.innerHTML = `<img src="${data.tracks.items[0].album.images[0].url}">`;
  top_song_name.innerHTML = `<span>${data.tracks.items[0].name}</span>`;
  top_song_artist.innerHTML = `<span class="faint_white">${data.tracks.items[0].artists[0].name}</span><div class="result_type">SONG</div>`;
  top_play_button.innerHTML = `<svg role="img" height="28" width="28" aria-hidden="true" viewBox="0 0 24 24"><path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"></path></svg>`;

  all_result_top_left.setAttribute("class", "all_result_top_left");
  result_header_left.setAttribute("class", "result_header");
  top_song_container.setAttribute("class", "top_song_container");
  top_song_image_container.setAttribute("class", "top_song_image_container");
  top_song_name.setAttribute("class", "top_song_name");
  top_song_artist.setAttribute("class", "top_song_artist");
  top_play_button.setAttribute("class", "play_button");

  top_play_button.onclick = () => {
    updateMusic(0);
    curr_song.play();
  }

  top_song_container.append(top_song_image_container, top_song_name, top_song_artist, top_play_button);
  all_result_top_left.append(result_header_left, top_song_container);

  const all_result_top_right = document.createElement("div");
  const result_header_right = document.createElement("div");
  const all_songs_container = document.createElement("div");

  result_header_right.textContent = "Top Songs";

  result_header_right.setAttribute("class", "result_header")
  tracks.forEach((element, index) => {
    const song_container = document.createElement("div");
    const song_info = document.createElement("div");
    const song_image_container = document.createElement("div");
    const song_desc = document.createElement("div");
    const song_duration = document.createElement("div");

    song_image_container.innerHTML = `<img src="${element.album.images[2].url}">`;
    song_desc.innerHTML = `<div class="song_name">${element.name}</div><div class="faint_white">${element.artists[0].name}</div>`;
    song_duration.innerHTML = `<span class="faint_white">${millisToMinutesAndSeconds(element.duration_ms)}</span>`;

    song_container.setAttribute("class", "song_container");
    song_info.setAttribute("class", "song_info");
    song_image_container.setAttribute("class", "song_image_container");
    song_desc.setAttribute("class", "song_desc");
    song_duration.setAttribute("class", "song_duration");

    song_info.append(song_image_container, song_desc);
    song_container.append(song_info, song_duration);

    song_container.onclick = () => {
      updateMusic(index);
      curr_song.play();
    }

    all_songs_container.append(song_container);
  });
  all_result_top_right.setAttribute("class", "all_result_top_right");
  all_result_top_right.append(result_header_right, all_songs_container);

  all_result_top.setAttribute("class", "all_result_top");
  all_result_top.append(all_result_top_left, all_result_top_right);
  search_results_section.append(all_result_top);

  // album section
  const all_result_album_container = document.createElement("div");
  const result_header_album = document.createElement("div");
  const album_container = document.createElement("div");

  result_header_album.textContent = "Albums";

  all_result_album_container.setAttribute("class", "all_result_album_container");
  result_header_album.setAttribute("class", "result_header");
  album_container.setAttribute("class", "album_container");

  albums.forEach((element, index) => {
    const album_tab = document.createElement("div");
    const album_avatar_container = document.createElement("div");
    const album_name_container = document.createElement("div");
    const album_desc = document.createElement("div");

    album_avatar_container.innerHTML = `<img src="${element.images[1].url}"><div class="play_button_album"><svg role="img" height="28" width="28" aria-hidden="true" viewBox="0 0 24 24"><path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"></path>
  </svg>`;
    album_name_container.innerHTML = `<p>${element.name}</p>`;
    album_desc.textContent = `${element.release_date.split('-')[0]} . ${element.artists[0].name}`;

    album_tab.setAttribute("class", "album_tab");
    album_avatar_container.setAttribute("class", "album_avatar_container");
    album_name_container.setAttribute("class", "album_name_container");
    album_desc.setAttribute("class", "faint_white");

    album_tab.append(album_avatar_container, album_name_container, album_desc);

    album_tab.onclick = () => {
      localStorage.setItem("spotify_current_album", JSON.stringify({ name: element.name, id: element.id, img: element.images[0].url, desc: element.artists[0].name }));
      location = "album.html";
    };

    album_container.append(album_tab);
  });

  all_result_album_container.append(result_header_album, album_container);
  search_results_section.append(all_result_album_container);

  // artist section
  const all_result_artist_container = document.createElement("div");
  const result_header_artist = document.createElement("div");
  const artist_container = document.createElement("div");

  result_header_artist.textContent = "Artists";

  all_result_artist_container.setAttribute("class", "all_result_artist_container");
  result_header_artist.setAttribute("class", "result_header");
  artist_container.setAttribute("class", "artist_container");

  artists.forEach((element, index) => {
    const artist_tab = document.createElement("div");

    const artist_avatar_container = document.createElement("div");
    const artist_name_container = document.createElement("div");
    const artist_desc = document.createElement("div");

    artist_avatar_container.innerHTML = `<img src="${element.images[1].url}"><div class="play_button_artist"><svg role="img" height="28" width="28" aria-hidden="true" viewBox="0 0 24 24"><path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z">
    </path></svg></div>`;
    artist_name_container.innerHTML = `<p>${element.name}</p>`;
    artist_desc.textContent = "Artists";

    artist_tab.setAttribute("class", "artist_tab");
    artist_avatar_container.setAttribute("class", "artist_avatar_container");
    artist_name_container.setAttribute("class", "artist_name_container");
    artist_desc.setAttribute("class", "faint_white");

    artist_tab.append(artist_avatar_container, artist_name_container, artist_desc);

    artist_container.append(artist_tab);
  });

  all_result_artist_container.append(result_header_artist, artist_container);
  search_results_section.append(all_result_artist_container);
};

const displaySongResult = (data) => {
  let tracks = data.tracks.items;
  songs_body.innerHTML = null;
  tracks.forEach((element, index) => {
    const tr = document.createElement("tr");
    const index_td = document.createElement("td");
    const title_td = document.createElement("td");
    const album_td = document.createElement("td");
    const duration_td = document.createElement("td");

    index_td.innerHTML = `<span>${index + 1}</span>`;
    title_td.innerHTML = `<div class="title_container"><div class="song_avatar_container"><img src="${element.album.images[2].url}"></div><div class="song_description"><div class="song_name"><span>${element.name}</span></div><div class="song_artist"><span>${element.artists[0].name}</span></div></div></div>`;
    album_td.innerHTML = `<div class="song_album"><span>${element.album.name}</span></div>`;
    duration_td.innerHTML = `<span>${millisToMinutesAndSeconds(element.duration_ms)}</span>`;

    title_td.onclick = () => {
      updateMusic(index);
      curr_song.play();
    }

    tr.append(index_td, title_td, album_td, duration_td);
    songs_body.append(tr);
  });
};

const displayAlbumResult = (data) => {
  let albums = data.albums.items;
  search_albums_section.innerHTML = null;
  const album_container = document.createElement("div");
  album_container.setAttribute("class", "album_container");

  albums.forEach((element, index) => {
    const album_tab = document.createElement("div");
    const album_avatar_container = document.createElement("div");
    const album_name_container = document.createElement("div");
    const album_desc = document.createElement("div");

    album_avatar_container.innerHTML = `<img src="${element.images[1].url}"><div class="play_button_album"><svg role="img" height="28" width="28" aria-hidden="true" viewBox="0 0 24 24"><path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"></path>
  </svg>`;
    album_name_container.innerHTML = `<p>${element.name}</p>`;
    album_desc.textContent = `${element.release_date.split('-')[0]} . ${element.artists[0].name}`;

    album_tab.setAttribute("class", "album_tab");
    album_avatar_container.setAttribute("class", "album_avatar_container");
    album_name_container.setAttribute("class", "album_name_container");
    album_desc.setAttribute("class", "faint_white");

    album_tab.append(album_avatar_container, album_name_container, album_desc);

    album_tab.onclick = () => {
      localStorage.setItem("spotify_current_album", JSON.stringify({ name: element.name, id: element.id, img: element.images[0].url, desc: element.artists[0].name }));
      location = "album.html";
    };

    album_container.append(album_tab);
  });
  search_albums_section.append(album_container);
};

const displayPlaylistResult = (data) => {
  let playlists = data.playlists.items;
  search_playlists_section.innerHTML = null;
  const playlist_container = document.createElement("div");
  playlist_container.setAttribute("class", "album_container");

  playlists.forEach((element, index) => {
    const playlist_tab = document.createElement("div");
    const playlist_avatar_container = document.createElement("div");
    const playlist_name_container = document.createElement("div");
    const playlist_desc = document.createElement("div");

    playlist_avatar_container.innerHTML = `<img src="${element.images[0].url}"><div class="play_button_album"><svg role="img" height="28" width="28" aria-hidden="true" viewBox="0 0 24 24"><path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"></path>
  </svg>`;
    playlist_name_container.innerHTML = `<p>${element.name}</p>`;
    playlist_desc.textContent = `${element.description}`;

    playlist_tab.setAttribute("class", "album_tab");
    playlist_avatar_container.setAttribute("class", "album_avatar_container");
    playlist_name_container.setAttribute("class", "album_name_container");
    playlist_desc.setAttribute("class", "faint_white");

    playlist_tab.append(playlist_avatar_container, playlist_name_container, playlist_desc);

    playlist_tab.onclick = () => {
      localStorage.setItem("spotify_curr_playlist", JSON.stringify({name:element.name, id:element.id, desc:element.description, image:element.images[0].url}));
      location = "playlist.html";
    };

    playlist_container.append(playlist_tab);
  });

  search_playlists_section.append(playlist_container);
}

const displayArtistResult = (data) => {
  let artists = data.artists.items;
  search_artists_section.innerHTML = null;
  const artist_container = document.createElement("div");
  artist_container.setAttribute("class", "artist_container");

  artists.forEach((element, index) => {
    const artist_tab = document.createElement("div");

    const artist_avatar_container = document.createElement("div");
    const artist_name_container = document.createElement("div");
    const artist_desc = document.createElement("div");

    artist_avatar_container.innerHTML = `<img src="${element.images[1].url}"><div class="play_button_artist"><svg role="img" height="28" width="28" aria-hidden="true" viewBox="0 0 24 24"><path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z">
    </path></svg></div>`;
    artist_name_container.innerHTML = `<p>${element.name}</p>`;
    artist_desc.textContent = "Artists";

    artist_tab.setAttribute("class", "artist_tab");
    artist_avatar_container.setAttribute("class", "artist_avatar_container");
    artist_name_container.setAttribute("class", "artist_name_container");
    artist_desc.setAttribute("class", "faint_white");

    artist_tab.append(artist_avatar_container, artist_name_container, artist_desc);

    artist_container.append(artist_tab);
  });

  search_artists_section.append(artist_container);
};


// search section
const searchFunction = async () => {
  try {
    let query = search_bar.value;
    let data = await getAllSearchResults(query, ["track", "album", "playlist", "artist"], 20, TOKEN);
    songs_array = data.tracks.items;
    displayAllResults(data);
    displaySongResult(data);
    displayAlbumResult(data);
    displayPlaylistResult(data);
    displayArtistResult(data);
    localStorage.setItem("spotify_search_query", query);
    document.title = query;
  } catch (error) {
    refreshToken();
  }
}

// filter section
const filter_all_button = document.querySelector('#filter_all_button');
const filter_songs_button = document.querySelector('#filter_songs_button');
const filter_albums_button = document.querySelector('#filter_albums_button');
const filter_playlists_button = document.querySelector('#filter_playlists_button');
const filter_artists_button = document.querySelector('#filter_artists_button');
const filter_podcasts_button = document.querySelector('#filter_podcasts_button');
const filter_profiles_button = document.querySelector('#filter_profiles_button');
let selected_filter = document.querySelectorAll('.selected_filter');

function removeAllButtonFilter() {
  let selected_filter = document.querySelectorAll('.selected_filter');
  selected_filter.forEach(box => {
    box.classList.remove('selected_filter');
  });
}

filter_all_button.onclick = () => {
  removeAllButtonFilter();
  filter_all_button.setAttribute("class", "selected_filter");
  search_results_section.style.display = "block";
  search_songs_section.style.display = "none";
  search_albums_section.style.display = "none";
  search_playlists_section.style.display = "none";
  search_artists_section.style.display = "none"
}

filter_songs_button.onclick = () => {
  removeAllButtonFilter();
  filter_songs_button.setAttribute("class", "selected_filter");
  search_songs_section.style.display = "block";
  search_results_section.style.display = "none";
  search_albums_section.style.display = "none";
  search_playlists_section.style.display = "none";
  search_artists_section.style.display = "none"
}

filter_albums_button.onclick = () => {
  removeAllButtonFilter();
  filter_albums_button.setAttribute("class", "selected_filter");
  search_albums_section.style.display = "block";
  search_songs_section.style.display = "none";
  search_results_section.style.display = "none";
  search_playlists_section.style.display = "none";
  search_artists_section.style.display = "none"
}

filter_playlists_button.onclick = () => {
  removeAllButtonFilter();
  filter_playlists_button.setAttribute("class", "selected_filter");
  search_playlists_section.style.display = "block";
  search_albums_section.style.display = "none";
  search_songs_section.style.display = "none";
  search_results_section.style.display = "none";
  search_artists_section.style.display = "none"
}

filter_artists_button.onclick = () => {
  removeAllButtonFilter();
  filter_artists_button.setAttribute("class", "selected_filter");
  search_artists_section.style.display = "block"
  search_playlists_section.style.display = "none";
  search_albums_section.style.display = "none";
  search_songs_section.style.display = "none";
  search_results_section.style.display = "none";
}

filter_podcasts_button.onclick = () => {
  removeAllButtonFilter();
  filter_podcasts_button.setAttribute("class", "selected_filter");
}

filter_profiles_button.onclick = () => {
  removeAllButtonFilter();
  filter_profiles_button.setAttribute("class", "selected_filter");
}

// debounce
const search_bar = document.querySelector('#search_bar');
search_bar.onkeyup = debounce(searchFunction, 300);

// onload
onload = () => {
  search_bar.value = localStorage.getItem("spotify_search_query")
  searchFunction();
}

// forward and back buttons
const back_button = document.querySelector("#back_button");
const forward_button = document.querySelector("#forward_button");

try {
  forward_button.onclick = () => {
    history.forward();
  }
  back_button.onclick = () => {
    history.back();
  }
} catch { }