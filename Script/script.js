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

async function submitKevin(inputString) {
    let selectedSemester = document.getElementById("semester").value;
    let url = 'http://localhost:3000/'+ inputString;
    try {
        if (selectedSemester=="#") {
            alert('Please select a semester before submitting.');
            return;
        }
        // Initial prediction call including the selected semester
        let response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ semester: selectedSemester })
        });
        let predictionData = await response.json();
        let list = formatPredictionList(predictionData);
        alert('First prediction results:\n' + list);

        // Repeated steps abstracted into a function
        selectedSemester = iterateSemester(selectedSemester);
        predictionData = await executeNextSemester(predictionData,selectedSemester,inputString);
        list = formatPredictionList(predictionData);
        alert('Second prediction results:\n' + list);


        selectedSemester = iterateSemester(selectedSemester);
        predictionData = await executeNextSemester(predictionData,selectedSemester,inputString);
        list = formatPredictionList(predictionData);
        alert('Third prediction results:\n' + list);

        console.log('Third prediction results:', predictionData);
        alert('Third prediction completed.');

    } catch (error) {
        console.error('Error making the prediction:', error);
        alert('An error occurred while making the prediction. Please check the console for details.');
    }
}


function formatPredictionList(data) {
    return data.map((course, index) => {
        const score = (course.predictedScore * 100).toFixed(2);
        return `${index + 1}. CRN: ${course.crn}, Match: ${score}%`;
    }).join('\n');
}


async function executeNextSemester(predictionData,selectedSemester,inputString) {
    // Update the semester for the next cycle
    let url = 'http://localhost:3000/executeNextSemester'+ inputString;
    const selectedCourses = predictionData.map(course => course.crn);
    console.log('Semester passed: ',selectedSemester);
    const response = await fetch(/*'http://localhost:3000/executeNextSemester'*/url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ selectedCourses, semester: selectedSemester })
    });
    return await response.json();
}


function displayResults(predictions) {
    const resultsElement = document.getElementById('results');
    resultsElement.textContent = `Predictions: ${predictions}`;
}

function selectOption() {
    selectedSemester = document.getElementById("semester").value;
    console.log("Selected Semester: ", selectedSemester);
}

function iterateSemester(currentSemester) {
    currentSemester = currentSemester.toLowerCase();
    const nextSemesterMap = {
        fall: 'spring',
        spring: 'summer',
        summer: 'fall'
    };
    
    const nextSemester = nextSemesterMap[currentSemester];
        if (!nextSemester) {
            console.error('Unexpected semester value:', currentSemester);
            return null;  // Return null or throw an error as preferred
        }
    console.log('iterated semester: ',nextSemester);
    return nextSemester;
    }