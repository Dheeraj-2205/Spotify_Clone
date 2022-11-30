let openCateg = (e) =>{
    // event.preventDefault();
    // let categoryId = event.target.parentElement.parentElement.id;
    // console.log(event.target);
        console.log(e);
    localStorage.setItem("catID", e);

}

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

