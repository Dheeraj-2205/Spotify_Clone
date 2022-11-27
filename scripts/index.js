import { left_nav, top_nav, loggedOutBottom } from "../utils/components.js";

const nav_left_container = document.querySelector('#left_nav');
const nav_top_container = document.querySelector('#top_nav');
const nav_bottom_loggedOut = document.querySelector('#page_bottom');

nav_left_container.innerHTML = left_nav();
nav_top_container.innerHTML = top_nav();

let spotify_login_flag = false;
if (!spotify_login_flag) {
  nav_bottom_loggedOut.innerHTML = loggedOutBottom();

}