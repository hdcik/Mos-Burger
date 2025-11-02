function submitNow() {
    let userNameAdd = document.getElementById("loginUsername").value;
    let passwordAdd = document.getElementById("loginPassword").value;

    const defaltUserName = "Admin";
    const defaltPassword = "123456";
    
    if (defaltUserName==userNameAdd && defaltPassword==passwordAdd) {
        alert("Succes")
        window.location.href='productDetails.html';
        
    }else{
        alert("Wrong Input enter againg ")

    }
}