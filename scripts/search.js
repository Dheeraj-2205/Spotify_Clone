import { left_nav, top_nav, loggedOutBottom, top_nav_search, playerBottom } from "../utils/components.js";
import { debounce } from "../utils/utilities.js";

const nav_left_container = document.querySelector('#left_nav');
const nav_top_container = document.querySelector('#top_nav');
// const background = document.querySelectorAll('.background_color')[0];
const nav_bottom = document.querySelector('#page_bottom');
let login_flag = JSON.parse(localStorage.getItem('spotify_login_flag'));

if (!login_flag) {
    location = "/";
}

nav_left_container.innerHTML = left_nav();
nav_top_container.innerHTML = top_nav_search();
nav_bottom.innerHTML = playerBottom();

const user_pop = document.querySelectorAll('.user_pop')[0];
const user_options = document.querySelector('#user_options');
const logout_button = document.querySelector('#logout_btn');
const searchBar = document.getElementById("search_bar");

user_pop.onclick = () => {
    let val = user_options.style.visibility;
    if (val == "hidden") {
        user_options.style.visibility = "visible";
    } else {
        user_options.style.visibility = "hidden";
    }
}

logout_button.onclick = () => {
    localStorage.setItem('spotify_login_flag', JSON.stringify(false));
    location.reload();
}

let searchFunc = () => {
    let query = searchBar.value;
    localStorage.setItem("spotify_search_query", query);
    location = "results.html";
};

let openCateg = (e) => {
    // console.log(e);
    localStorage.setItem("catID", e);
    location = "categoryPlaylists.html";
};

let categories = document.querySelectorAll(".categories-container");

// for(var i=0; i<categories.length; i++){
//     // console.log(categories[i].id);
//     var category = categories[i];
//     categories[i].addEventListener("click", ()=>{
//         console.log(category.id);

//     });
// }


categories.forEach(e => {
    e.onclick = () => {
        //console.log(e);
        openCateg(e.id);
    }
});

searchBar.onkeyup = debounce(searchFunc, 600);

const username = document.querySelectorAll('.user_name');

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