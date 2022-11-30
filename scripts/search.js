import {refreshToken} from "../utils/api_calls.js";
import {left_nav, top_nav, loggedOutBottom, top_nav_login, playerBottom} from "../utils/components.js";

const nav_left_container = document.querySelector('#left_nav');
const nav_top_container = document.querySelector('#top_nav');
// const background = document.querySelectorAll('.background_color')[0];
const nav_bottom = document.querySelector('#page_bottom');

const searchBar = document.getElementById("searchBar");


nav_left_container.innerHTML = left_nav();
nav_top_container.innerHTML = top_nav_login();
nav_bottom.innerHTML = playerBottom();

    const user_pop = document.querySelectorAll('.user_pop')[0];
    const user_options = document.querySelector('#user_options');

    user_pop.onclick = () => {
      let val = user_options.style.visibility;
      if (val == "hidden") {
        user_options.style.visibility = "visible";
      } else {
        user_options.style.visibility = "hidden";
      }
    }

// refreshToken();

let searchFunc =()=>{
    let query = searchBar.value;
    localStorage.setItem("spotify_search_query", query);
    // console.log(query);
    location = "resultPage.html";
};

let debounce =(callBack, delay) =>{
    let debounceTimer;

    return function(){
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(callBack, delay);
    }
};

let openCateg = (e) =>{
    // console.log(e);
    localStorage.setItem("catID", e);
    location = "category.html";
};

let categories = document.querySelectorAll(".categories-container");

// for(var i=0; i<categories.length; i++){
//     // console.log(categories[i].id);
//     var category = categories[i];
//     categories[i].addEventListener("click", ()=>{
//         console.log(category.id);
        
//     });
// }

categories.forEach(e=>{
    e.onclick = () =>{
        openCateg(e.id);
    }
});

searchBar.onkeyup = debounce(searchFunc, 1000);