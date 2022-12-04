import { left_nav, top_nav_search, playerBottom } from "../utils/components.js";
import { debounce, millisToMinutesAndSeconds } from "/utils/utilities.js";
import { getAllSearchResults, refreshToken } from "../utils/api_calls.js";

const nav_left_container = document.querySelector('#left_nav');
const nav_top_container = document.querySelector('#top_nav');
const nav_bottom = document.querySelector('#page_bottom');
const filter_all_button = document.querySelector('#filter_all_button');
const filter_songs_button = document.querySelector('#filter_songs_button');
const filter_albums_button = document.querySelector('#filter_albums_button');
const filter_playlists_button = document.querySelector('#filter_playlists_button');
const filter_artists_button = document.querySelector('#filter_artists_button');
const filter_podcasts_button = document.querySelector('#filter_podcasts_button');
const filter_profiles_button = document.querySelector('#filter_profiles_button');
const search_results_section = document.querySelector('#search_results_section');
const search_songs_section = document.querySelector("#search_songs_section");
const songs_body = document.querySelector("#songs_body");
const TOKEN = localStorage.getItem('spotify_token') || '';
let current_filter = "all";
let curr_song = new Audio("");
let songs_array = [];

if (TOKEN.length == 0) {
  refreshToken();
}

nav_left_container.innerHTML = left_nav();
nav_top_container.innerHTML = top_nav_search();
nav_bottom.innerHTML = playerBottom();
const search_bar = document.querySelector('#search_bar');

function removeAllButtonFilter() {
  const selected_filter = document.querySelectorAll('.selected_filter');
  selected_filter.forEach(box => {
    box.classList.remove('selected_filter');
  });
}

function enableMusicPlayer(item, item_index) {
  const progress_bar = document.querySelector('#progress_bar');
  const bottom_play_button = document.querySelector('#bottom_play_button');
  const previous_button = document.querySelector("#previous_button");
  const next_button = document.querySelector('#next_button');
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

  function playMusic(index) {
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
  try {
    const play_button = document.querySelector('#play_button');
    play_button.onclick = () => {
      playMusic(0);
      curr_song.play();
    }
  } catch { }

  bottom_play_button.onclick = () => {
    try {
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
    } catch (error) { }
  }

  next_button.onclick = () => {
    if (curr_song_index < songs_array.length) {
      playMusic(++curr_song_index);
      curr_song.play();
    }
  }

  previous_button.onclick = () => {
    if (curr_song_index > 0) {
      playMusic(--curr_song_index);
      curr_song.play();
    }
  }
  try {
    const songs_tab = document.querySelectorAll('.song_container');
    songs_tab.forEach((element, index) => {
      element.onclick = () => {
        playMusic(index);
        curr_song.play();
      }
    });
  } catch { }

  try {
    item.onclick = () => {
      curr_song_index = item_index;
      playMusic(item_index);
      curr_song.play();
    }
  } catch { }

}

const searchFunction = async (callBack, filter) => {
  try {
    let query = search_bar.value;
    let data = [];
    if (filter == "all") {
      data = await getAllSearchResults(query, ["track", "artist", "album"], 10, TOKEN);
    } else if (filter == "songs") {
      data = await getAllSearchResults(query, ["track"], 20, TOKEN);
      data = data.tracks.items;
    } else if (filter == "albums") {
      data = await getAllSearchResults(query, ["album"], 20, TOKEN);
      data = data.albums.items;
    } else if (filter == "playlists") {
      data = await getAllSearchResults(query, ["playlist"], 20, TOKEN);
      data = data.playlists.items;
    } else if (filter == "artists") {
      data = await getAllSearchResults(query, ["artist"], 20, TOKEN);
      data = data.artists.items;
    }
    callBack(data);
  } catch (error) {
    refreshToken();
  }
}

const createAlbums = async (data) => {
  let all_albums = ``;
  data.forEach((element, index) => {
    all_albums += `
          <div class="album_tab">
            <div class="album_avatar_container"> 
              <img src="${element.images[1].url}"> 
              <div class="play_button_album">
                <svg role="img" height="28" width="28" aria-hidden="true" viewBox="0 0 24 24">
                <path 
                  d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z">
                </path>
              </svg>
            </div>
            </div>
            <div class="album_name_container">
              <p>${element.name}</p>
            </div>
            <div class="faint_white">${element.release_date.split('-')[0]} . ${element.artists[0].name}</div>
          </div>
        `;
  });
  return all_albums;
}

const createPlaylists = async (data) => {
  let all_playlists = ``;
  data.forEach((element, index) => {
    all_playlists += `
          <div class="album_tab">
            <div class="album_avatar_container"> 
              <img src="${element.images[0].url}"> 
              <div class="play_button_album">
                <svg role="img" height="28" width="28" aria-hidden="true" viewBox="0 0 24 24">
                <path 
                  d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z">
                </path>
              </svg>
            </div>
            </div>
            <div class="album_name_container">
              <p>${element.name}</p>
            </div>
            <div class="faint_white">${element.description}</div>
          </div>
        `;
  });
  return all_playlists;
}

const createArtists = async (data) => {
  let all_artists = ``;
  data.forEach((element, index) => {
    if (element.images.length > 0) {
      all_artists += `
          <div class="artist_tab">
            <div class="artist_avatar_container">
              <img src="${element.images[1].url}">
              <div class="play_button_artist">
                <svg role="img" height="28" width="28" aria-hidden="true" viewBox="0 0 24 24">
                  <path 
                    d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z">
                  </path>
                </svg>
              </div>
            </div>
            <div class="artist_name_container">
              <p>${element.name}</p>
            </div>
            <div class="faint_white">Artist</div>
          </div>
        `;
    }
  });
  return all_artists;
}

const displayAllResults = async (data) => {
  songs_array = data.tracks.items;
  search_results_section.innerHTML = null;
  search_songs_section.style.display = "none";
  let all_songs = ``;
  for (let i = 0; i < 5; i++) {
    let element = data.tracks.items[i];
    all_songs += `
        <div class="song_container">
          <div class="song_info">
            <div class="song_image_container"> <img src="${element.album.images[2].url}"> </div>
            <div class="song_desc">
              <div class="song_name">${element.name}</div>
              <div class="faint_white">${element.artists[0].name}</div>
            </div>
          </div>
          <div class="song_duration">
            <span class="faint_white">${millisToMinutesAndSeconds(element.duration_ms)}</span>
          </div>
        </div>
      `;
  }

  let all_albums = await createAlbums(data.albums.items);
  let all_artists = await createArtists(data.artists.items);

  /*

  const all_result_top = document.createElement("div");
  const all_result_top_left = document.createElement("div");
  const all_result_top_right = document.createElement("div");
  const top_song_container = document.createElement("div");
  const top_play_button = document.createElement("div");
  
  all_result_top_left.innerHTML = `<div class="result_header">Top result</div>`;
  top_song_container.innerHTML = `
  <div class="top_song_image_container">
    <img src="${data.tracks.items[0].album.images[0].url}">
  </div>
  <div class="top_song_name">
    <span>${data.tracks.items[0].name}</span>
  </div>
  <div class="top_song_artist">
    <span class="faint_white">${data.tracks.items[0].artists[0].name}</span>
    <div class="result_type">SONG</div>
  </div>
  `;
  top_play_button.innerHTML = `
  <svg role="img" height="28" width="28" aria-hidden="true" viewBox="0 0 24 24">
    <path
      d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z">
    </path>
  </svg>
  `;

  all_result_top.setAttribute("class", "all_result_top");
  all_result_top_left.setAttribute("class", "all_result_top_left");
  all_result_top_right.setAttribute("class", "all_result_top_right");
  top_song_container.setAttribute("class", "top_song_container");
  top_play_button.setAttribute("class", "play_button");

  top_song_container.append(top_play_button);
  all_result_top_left.append(top_song_container);
  all_result_top.append(all_result_top_left, all_result_top_right);
  */

  let result = `
      <div class="all_result_top">
        <div class="all_result_top_left">
          <div class="result_header">Top result</div>
          <div class="top_song_container">
            <div class="top_song_image_container">
              <img src="${data.tracks.items[0].album.images[0].url}">
            </div>
            <div class="top_song_name">
              <span>${data.tracks.items[0].name}</span>
            </div>
            <div class="top_song_artist">
              <span class="faint_white">${data.tracks.items[0].artists[0].name}</span>
              <div class="result_type">SONG</div>
            </div>
            <div class="play_button" id="play_button">
              <svg role="img" height="28" width="28" aria-hidden="true" viewBox="0 0 24 24">
                <path
                  d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z">
                </path>
              </svg>
            </div>
          </div>
        </div>
        <div class="all_result_top_right">
          <div class="result_header">Songs</div>
          <div class="all_songs_container">${all_songs}</div>
        </div>
      </div>
      <div class="all_result_album_container">
        <div class="result_header">Albums</div>
        <div class="album_container">${all_albums}</div>
      </div>
      <div class="all_result_artist_container">
        <div class="result_header">Artists</div>
        <div class="artist_container">${all_artists}</div>
      </div>
    `;
  search_results_section.innerHTML = result;
  enableMusicPlayer();
}

const displaySongResult = (data) => {
  search_results_section.innerHTML = null;
  search_songs_section.style.display = "block";
  songs_body.innerHTML = null;
  songs_array = data;
  data.forEach((element, index) => {
    let tr = document.createElement('tr');
    tr.innerHTML = `
            <td>
                <span>${index + 1}</span>
            </td>
            <td>
                <div class="title_container">
                    <div class="song_avatar_container">
                        <img src="${element.album.images[2].url}">
                    </div>
                    <div class="song_description">
                        <div class="song_name">
                        <span>${element.name}</span>
                        </div>
                        <div class="song_artist">
                        <span>${element.artists[0].name}</span>
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <div class="song_album">
                <span>${element.album.name}</span>
                </div>
            </td>
            <td>
                <span>${millisToMinutesAndSeconds(element.duration_ms)}</span>
            </td>
        `;
    songs_body.append(tr);
    enableMusicPlayer(tr, index);
  });
}

const displayAlbumResult = async (data) => {
  search_results_section.innerHTML = null;
  search_songs_section.style.display = "none";
  songs_body.innerHTML = null;
  let album_container = document.createElement("div");
  album_container.setAttribute("class", "album_container");
  let all_albums = await createAlbums(data);
  album_container.innerHTML = all_albums;
  search_results_section.append(album_container);
}

const displayPlaylistResult = async (data) => {
  search_results_section.innerHTML = null;
  search_songs_section.style.display = "none";
  songs_body.innerHTML = null;
  let album_container = document.createElement("div");
  album_container.setAttribute("class", "album_container");
  let all_albums = await createPlaylists(data);
  album_container.innerHTML = all_albums;
  search_results_section.append(album_container);
}

const displayArtistResult = async (data) => {
  search_results_section.innerHTML = null;
  search_songs_section.style.display = "none";
  songs_body.innerHTML = null;
  let album_container = document.createElement("div");
  album_container.setAttribute("class", "artist_container");
  let all_albums = await createArtists(data);
  album_container.innerHTML = all_albums;
  search_results_section.append(album_container);
}

let current_display = displayAllResults;
search_bar.onkeyup = debounce(() => { searchFunction(current_display, current_filter) }, 500);
search_bar.value = localStorage.getItem('spotify_search_query');
searchFunction(displayAllResults, "all");

const user_pop = document.querySelectorAll('.user_pop')[0];
const username = document.querySelectorAll('.user_name');

user_pop.onclick = () => {
  let val = user_options.style.visibility;
  if (val == "hidden") {
    user_options.style.visibility = "visible";
  } else {
    user_options.style.visibility = "hidden";
  }
}
username.forEach(element => {
  element.textContent = localStorage.getItem('spotify_current_user');
});

filter_all_button.onclick = () => {
  current_display = displayAllResults;
  current_filter = "all";
  removeAllButtonFilter();
  filter_all_button.setAttribute("class", "selected_filter");
  searchFunction(current_display, current_filter);
}

filter_songs_button.onclick = () => {
  current_display = displaySongResult;
  current_filter = "songs";
  removeAllButtonFilter();
  filter_songs_button.setAttribute("class", "selected_filter");
  searchFunction(current_display, current_filter);
}

filter_albums_button.onclick = () => {
  current_display = displayAlbumResult;
  current_filter = "albums";
  removeAllButtonFilter();
  filter_albums_button.setAttribute("class", "selected_filter");
  searchFunction(current_display, current_filter);
}

filter_playlists_button.onclick = () => {
  current_display = displayPlaylistResult;
  current_filter = "playlists";
  removeAllButtonFilter();
  filter_playlists_button.setAttribute("class", "selected_filter");
  searchFunction(current_display, current_filter);
}

filter_artists_button.onclick = () => {
  current_filter = "artists"
  removeAllButtonFilter();
  filter_artists_button.setAttribute("class", "selected_filter");
  searchFunction(displayArtistResult, current_filter);
}

filter_podcasts_button.onclick = () => {
  removeAllButtonFilter();
  filter_podcasts_button.setAttribute("class", "selected_filter");
}

filter_profiles_button.onclick = () => {
  removeAllButtonFilter();
  filter_profiles_button.setAttribute("class", "selected_filter");
}