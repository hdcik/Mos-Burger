function submitNow() {
    
    const newUseerName  =  document.getElementById("login_username").value;
    const newPassworld  =  document.getElementById("login_password").value;

const userName = "Admin";
const passWorld ="1234";

    

if (newUseerName === userName && newPassworld === passWorld) {
    alert("Suuccess");
    window.location.href='product__details.html';
}else{
    alert("Wrong Username Or Passworld");
    
}

}