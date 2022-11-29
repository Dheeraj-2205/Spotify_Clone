import { left_nav, top_nav, loggedOutBottom, getPlaylists } from "../utils/components.js";

if (!localStorage.getItem('spotify_login_flag')) {
  localStorage.setItem('spotify_login_flag', JSON.stringify(false));
}

let spotify_login_flag = JSON.parse(localStorage.getItem('spotify_login_flag'));
const nav_left_container = document.querySelector('#left_nav');
const nav_top_container = document.querySelector('#top_nav');
const nav_bottom_loggedOut = document.querySelector('#page_bottom');
const playlist_one = document.querySelector('#playlist_one');
const playlist_two = document.querySelector('#playlist_two');
const playlist_three = document.querySelector('#playlist_three');
const playlist_four = document.querySelector('#playlist_four');

const signupChecks = () => {
  if (!spotify_login_flag) {
    nav_bottom_loggedOut.innerHTML = loggedOutBottom();
    nav_top_container.innerHTML = top_nav();

    let login_btn = document.querySelectorAll('.login_btn');
    let signup_btn = document.querySelectorAll('.signup_btn');

    login_btn.forEach(ele => {
      ele.onclick = () => {
        location = './pages/login.html';
      }
    });

    signup_btn.forEach(ele => {
      ele.onclick = () => {
        location = './pages/signup.html';
      }
    });
  } else {
    
  }
}

const showLoginPop = (background) => {
  const login_pop = document.querySelector('#login_pop');
  const playlist_background = document.querySelector('#playlist_background');
  const close_btn = document.querySelector('#close_btn');

  login_pop.style.display = "flex";
  playlist_background.src = background;

  document.addEventListener("click", (evt) => {
    let pos = evt.path[0];
    if (pos == login_pop) {
      login_pop.style.display = "none";
    }
  });

  close_btn.onclick = () => {
    login_pop.style.display = "none";
  }
}

const openPlayList = (obj) => {
  if (spotify_login_flag) {
    localStorage.setItem('spotify_curr_playlist', obj.id);
    location = 'playlist.html';
  } else {
    showLoginPop(obj.background);
  }
}

const displayPlaylist = (data, parent) => {
  parent.innerHTML = null;
  data.forEach(element => {
    const playlist_tab = document.createElement('div');
    const image_contaier = document.createElement('div');
    const desc_container = document.createElement('div');
    const image = document.createElement('img');
    const play_btn = document.createElement('button');
    const title = document.createElement('p');
    const description = document.createElement('p');

    image.src = element.background;
    title.textContent = element.title;
    description.textContent = element.description;
    play_btn.innerHTML = `<svg role="img" height="24" width="24" aria-hidden="true" viewBox="0 0 24 24">
    <path
      d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z">
    </path>
  </svg>`;

    playlist_tab.setAttribute('class','playlist_tab');
    image_contaier.setAttribute('class', 'mini_background_container');
    desc_container.setAttribute('class', 'short_desc_container');

    playlist_tab.onclick = () => {
      openPlayList({"id": element.id, "background": element.background});
    }

    desc_container.append(title, description);
    image_contaier.append(image, play_btn);
    playlist_tab.append(image_contaier, desc_container);
    parent.append(playlist_tab);
  });
}

const show_playlist = async (container, type, limit) => {
  let data = await getPlaylists(type, limit);
  displayPlaylist(data, container);
}

onload = () => {
  nav_left_container.innerHTML = left_nav();
  signupChecks();
  show_playlist(playlist_one, "default", 7);
  show_playlist(playlist_two, "focus", 7);
  show_playlist(playlist_three, "mood", 7);
  show_playlist(playlist_four, "popular_new", 7);
}