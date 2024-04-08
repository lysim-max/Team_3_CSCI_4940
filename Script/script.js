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
function loadScript(url) {
    return new Promise((resolve, reject) => {
        var script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

/*function submitKevin() {
    alert("Please wait while we process your results...");

    // Make a GET request to the filterClasses endpoint
    fetch('http://localhost:3000/filterClasses')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Initiate file download by creating a link element
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'filtered_classes.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            console.log('File download initiated successfully');
        })
        .catch(error => {
            console.error('Error initiating file download:', error);
            alert('Error initiating file download. Please try again later.');
        });
}*/
function submitKevin() {
    alert("Please wait while we process your results...");

    // Make a POST request to trigger processing of filtered classes
    fetch('http://localhost:3000/filterClasses', {
        method: 'POST'
        // Optionally, you can include headers or a body if needed
    })
    .then(() => {
        // Optional: You can log a message once the request is sent
        console.log('Request to process filtered classes sent.');
    })
    .catch(error => {
        console.error('Error sending request:', error);
        alert('Error sending request to process filtered classes. Please try again later.');
    });
}