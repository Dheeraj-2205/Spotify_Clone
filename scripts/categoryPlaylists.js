import { left_nav, top_nav, loggedOutBottom, top_nav_login, playerBottom } from "../utils/components.js"
import { refreshToken, getPlaylists, getCategoryPlaylists } from "../utils/api_calls.js";

const catID = localStorage.getItem("catID");
const TOKEN = localStorage.getItem('spotify_token') || '';

const nav_left_container = document.querySelector('#left_nav');
const nav_top_container = document.querySelector('#top_nav');
// const background = document.querySelectorAll('.background_color')[0];
const nav_bottom = document.querySelector('#page_bottom');
const playlist_one = document.getElementById('playlist_one');
const playlist_two = document.getElementById('playlist_two');
const playlist_three = document.getElementById('playlist_three');


nav_left_container.innerHTML = left_nav();
nav_top_container.innerHTML = top_nav_login();
nav_bottom.innerHTML = playerBottom();


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

    image.src = element.images[0].url;
    title.textContent = element.name;
    description.textContent = element.description;
    play_btn.innerHTML = `<svg role="img" height="24" width="24" aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z">
      </path>
    </svg>`;

    playlist_tab.setAttribute('class', 'playlist_tab');
    image_contaier.setAttribute('class', 'mini_background_container');
    desc_container.setAttribute('class', 'short_desc_container');

    playlist_tab.onclick = () => {
      localStorage.setItem("spotify_curr_playlist", JSON.stringify({name:element.name, id:element.id, desc:element.description, image:element.images[0].url}));
      location = "playlist.html";
    }

    desc_container.append(title, description);
    image_contaier.append(image, play_btn);
    playlist_tab.append(image_contaier, desc_container);
    parent.append(playlist_tab);
  });


}

let showCategoryPlaylists = async () => {


  try {
    let data = await getCategoryPlaylists(catID, 0, 7, TOKEN);
    let data2 = await getCategoryPlaylists(catID, 10, 7, TOKEN);
    let data3 = await getCategoryPlaylists(catID, 20, 7, TOKEN);
    // let data = await res.json();

    // console.log(data);
    displayPlaylist(data, playlist_one);
    displayPlaylist(data2, playlist_two);
    displayPlaylist(data3, playlist_three);
  }
  catch (error) {
    // refreshToken();
  }
};



let showCategoryName = async () => {
  let res = await fetch(`https://api.spotify.com/v1/browse/categories/${catID}`, {
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    }
  })
  let data = await res.json();
  let heading = document.getElementById('catName');
  heading.innerText = data.name;
  // console.log(data.name);

  let h1 = document.getElementById('first-subHeader');
  let h2 = document.getElementById('second-subHeader');
  let h3 = document.getElementById('third-subHeader');

  h1.innerHTML = `Popular ${data.name} Playlists`;
  h2.innerHTML = `Popular ${data.name} Hits`;
  h3.innerHTML = `${data.name} Pop`;

};

showCategoryName();
showCategoryPlaylists();

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