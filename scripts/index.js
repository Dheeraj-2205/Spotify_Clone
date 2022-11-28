import { left_nav, top_nav, loggedOutBottom, getPlaylists, displayPlaylist } from "../utils/components.js";

if (!localStorage.getItem('spotify_login_flag')) {
  localStorage.setItem('spotify_login_flag', 'false');
}

let spotify_login_flag = localStorage.getItem('spotify_login_flag');
const nav_left_container = document.querySelector('#left_nav');
const nav_top_container = document.querySelector('#top_nav');
const nav_bottom_loggedOut = document.querySelector('#page_bottom');
const playlist_one = document.querySelector('#playlist_one');
const playlist_two = document.querySelector('#playlist_two');
const playlist_three = document.querySelector('#playlist_three');
const playlist_four = document.querySelector('#playlist_four');

const bottom_player = () => {
  if (spotify_login_flag == 'false') {
    nav_bottom_loggedOut.innerHTML = loggedOutBottom();
  } else {
    
  }
}

const show_playlist = async (container, type) => {
  let data = await getPlaylists(type);
  displayPlaylist(data, container);
}

onload = () => {
  nav_left_container.innerHTML = left_nav();
  nav_top_container.innerHTML = top_nav();
  bottom_player();
  show_playlist(playlist_one, "default");
  show_playlist(playlist_two, "focus");
  show_playlist(playlist_three, "mood");
  show_playlist(playlist_four, "popular_new");
}