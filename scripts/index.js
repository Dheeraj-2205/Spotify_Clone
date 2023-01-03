import {
  left_nav,
  top_nav,
  loggedOutBottom,
  top_nav_login,
  playerBottom,
} from "../utils/components.js";
import { refreshToken, getPlaylists } from "../utils/api_calls.js";

let spotify_login_flag = JSON.parse(localStorage.getItem("spotify_login_flag"));
const nav_left_container = document.querySelector("#left_nav");
const nav_top_container = document.querySelector("#top_nav");
const background = document.querySelectorAll(".background_color")[0];
const nav_bottom = document.querySelector("#page_bottom");
const playlist_one = document.querySelector("#playlist_one");
const playlist_two = document.querySelector("#playlist_two");
const playlist_three = document.querySelector("#playlist_three");
const playlist_four = document.querySelector("#playlist_four");
const TOKEN = localStorage.getItem("spotify_token") || "";

if (TOKEN.length == 0) {
  refreshToken();
}

const signupChecks = () => {
  if (!spotify_login_flag) {
    background.setAttribute("class", "background_color gradientOne");

    nav_top_container.style.backgroundColor = "black";
    nav_top_container.innerHTML = top_nav();
    nav_bottom.innerHTML = loggedOutBottom();

    let login_btn = document.querySelectorAll(".login_btn");
    let signup_btn = document.querySelectorAll(".signup_btn");

    login_btn.forEach((ele) => {
      ele.onclick = () => {
        location = "./pages/login.html";
      };
    });

    signup_btn.forEach((ele) => {
      ele.onclick = () => {
        location = "./pages/signup.html";
      };
    });
  } else {
    background.setAttribute("class", "background_color gradientTwo");
    nav_top_container.innerHTML = top_nav_login();
    nav_bottom.innerHTML = playerBottom();

    const user_pop = document.querySelectorAll(".user_pop")[0];
    const user_options = document.querySelector("#user_options");
    const logout_button = document.querySelector("#logout_btn");
    const username = document.querySelectorAll(".user_name");
    const back_button = document.querySelector("#back_button");
    const forward_button = document.querySelector("#forward_button");

    try {
      forward_button.onclick = () => {
        history.forward();
      };
      back_button.onclick = () => {
        history.back();
      };
    } catch {}

    username.forEach((element) => {
      element.textContent = localStorage.getItem("spotify_current_user");
    });

    user_pop.onclick = () => {
      let val = user_options.style.visibility;
      if (val == "hidden") {
        user_options.style.visibility = "visible";
      } else {
        user_options.style.visibility = "hidden";
      }
    };

    logout_button.onclick = () => {
      localStorage.setItem("spotify_login_flag", JSON.stringify(false));
      location.reload();
    };
  }
};

const showLoginPop = (background) => {
  const login_pop = document.querySelector("#login_pop");
  const playlist_background = document.querySelector("#playlist_background");
  const close_btn = document.querySelector("#close_btn");

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
  };
};

const openPlayList = (obj) => {
  if (spotify_login_flag) {
    localStorage.setItem(
      "spotify_curr_playlist",
      JSON.stringify({
        name: obj.name,
        id: obj.id,
        desc: obj.description,
        image: obj.images[0].url,
      })
    );
    location = "/pages/playlist.html";
  } else {
    showLoginPop(obj.images[0].url);
  }
};

const displayPlaylist = (data, parent) => {
  parent.innerHTML = null;
  data.forEach((element) => {
    const playlist_tab = document.createElement("div");
    const image_contaier = document.createElement("div");
    const desc_container = document.createElement("div");
    const image = document.createElement("img");
    const play_btn = document.createElement("button");
    const title = document.createElement("p");
    const description = document.createElement("p");

    image.src = element.images[0].url;
    title.textContent = element.name;
    description.textContent = element.description;
    play_btn.innerHTML = `<svg role="img" height="24" width="24" aria-hidden="true" viewBox="0 0 24 24">
    <path
      d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z">
    </path>
  </svg>`;

    playlist_tab.setAttribute("class", "playlist_tab");
    image_contaier.setAttribute("class", "mini_background_container");
    desc_container.setAttribute("class", "short_desc_container");

    playlist_tab.onclick = () => {
      openPlayList(element);
    };

    desc_container.append(title, description);
    image_contaier.append(image, play_btn);
    playlist_tab.append(image_contaier, desc_container);
    parent.append(playlist_tab);
  });
};

const show_playlist = async (container, category, limit) => {
  try {
    let data = await getPlaylists(category, limit, TOKEN);
    displayPlaylist(data, container);
  } catch (error) {
    refreshToken();
  }
};

onload = () => {
  if (!localStorage.getItem("spotify_login_flag")) {
    localStorage.setItem("spotify_login_flag", JSON.stringify(false));
  }
  nav_left_container.innerHTML = left_nav();
  signupChecks();
  show_playlist(playlist_one, "toplists", 7);
  show_playlist(playlist_two, "0JQ5DAqbMKFCbimwdOYlsl", 7);
  show_playlist(playlist_three, "0JQ5DAqbMKFzHmL4tf05da", 7);
  show_playlist(playlist_four, "0JQ5DAqbMKFHCxg5H5PtqW", 7);
};
