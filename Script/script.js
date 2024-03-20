/*Javascript page for logging in and selecting degree pages*/
function loginFunc(){
    var user= document.getElementById("username").value;
    var pass= document.getElementById("password").value;
    if(user=="AdminDemo" && pass=="Demopass123!"){
        window.location.assign("degree_selection.html");
        alert("Login Successful");

    }
    else{
        alert("Invalid Login");
        return;
    }

} 
var degreeMenu = document.getElementById('degree');
    degreeMenu.onchange = function(){
var userOption = this.options[this.selectedIndex];
    if (userOption.value != "nothing")
    {
    window.open(userOption.value, "Choose a degree Computer Science Information Technology Business", "");
    }

}
