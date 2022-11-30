let openCateg = (e) =>{
    // event.preventDefault();
    // let categoryId = event.target.parentElement.parentElement.id;
    // console.log(event.target);
    console.log(e.target.id);
    // localStorage.setItem("catID", categoryId);

}

let categories = document.querySelectorAll(".categories-container");

for(var i=0; i<categories.length; i++){
    categories[i].addEventListener("click", openCateg);
}

