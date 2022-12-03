let users=JSON.parse(localStorage.getItem("spotify_users"))||[];

let emailb=false;
let email_confirmb=false;
let passwordb=false;
let profileb=false;



let saveData=()=>{
    let email=document.getElementById("email_mobile_number").value;
    let email_confirm=document.getElementById("confirm_email_mobile_number").value;
    let profile_name=document.getElementById("profile_name").value;
    let password=document.getElementById("password").value;
    let year=document.getElementById("year").value;
    let day=document.getElementById("day").value;
    let month=document.getElementById("month").value;
    let gender = document.querySelector("input[type='radio'][name=gender]:checked").value;

    let obj={
        email: email,
        profile_name: profile_name,
        password: password,
        year: year,
        day: day,
        month: month,
        gender: gender
    }
    users.push(obj);
    localStorage.setItem("spotify_users",JSON.stringify(users));
    window.location.href="/pages/login.html";
}

let validateEmail=(email)=>{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

let verifyemailnumber=()=>{
    let email=document.getElementById("email_mobile_number").value;

        if(email == "") {
          document.getElementById("message").innerHTML = "**Fill the Email address please!";
          return false;
        }
        if(!validateEmail(email)){
          document.getElementById("message").innerHTML = "**Fill valid Email address please!";
        }
        else{
          document.getElementById("message").innerHTML = "";
            emailb=true;
        }

  }

let confirmMail=()=>{
    let email=document.getElementById("email_mobile_number").value;
    let email_confirm=document.getElementById("confirm_email_mobile_number").value;
    if(email!=email_confirm){
        document.getElementById("message2").innerHTML = "Email is not matching!";
    }
    else{
        document.getElementById("message2").innerHTML = "";
        email_confirmb=true;
    }
}

let verifypasswordpattern=()=>{
    var setpassword=document.getElementById("password").value;
    if(setpassword.length<8) {
          document.getElementById("passintructions").innerHTML = "**Your password should contains atleast 8 characters";
          return false;
      }
      else{
        document.getElementById("passintructions").innerHTML = "";
        passwordb=true;
      }
  }  

let checkprofilename=()=>{
    let profile_name=document.getElementById("profile_name").value;
    if(profile_name == "") {
        document.getElementById("profile_message").innerHTML = "**Please enter profile name";
        return false;
      }
      else{
        document.getElementById("profile_message").innerHTML ="";
        profileb=true;
      }
}

let validateAndSave=()=>{
    if(emailb&&email_confirmb&&profileb&&passwordb ){
        saveData();
    }
    else{
        document.getElementById("signupbtndiv").innerText="Please check form again!"
        
    }
}



//document.getElementById("signupPageBtn").addEventListener("click", validateAndSave);