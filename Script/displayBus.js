const sheetGrid = document.getElementById("classes");

document.addEventListener("DOMContentLoaded", function () {

    function alterTable(satisfied){
        fetch(`http://127.0.0.1:3000/postBus`, {
            method: 'POST',
            headers:{'Content-Type': 'application/json',},
            body: JSON.varchar(satisfied),
        })
        .then (response =>{
            if (!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then (updatedInfo =>{
            console.log('class changed: ',updatedInfo);
        })    
        .catch(error => console.error('Error: ', error));
        }


        function createSheet(table2) {
            const sheetDiv = document.createElement("div");
            sheetDiv.classList.add("class-sheet");
            const ID = document.createElement("div");
            ID.setAttribute("class", "ID-class");
            ID.textContent = table2.crn;
            const ID2=table2.ID;
            const className = document.createElement("div");
            className.setAttribute("class", "name-class");
            className.textContent = table2.class_name;

            /*const semester = document.createElement("h4");
            semester.textContent = "Semester: " + table.semester;*/

            const creditHours = document.createElement("div");
            creditHours.setAttribute("class", "credit-class");
            creditHours.textContent = table2.credit_hours;

            //const satisfied = document.createElement("div");
            //satisfied.setAttribute("class", "sat-class");
            //satisfied.textContent = table.satisfied;

            const satButton = document.createElement('button');
            satButton.setAttribute("class", "button1");
            satButton.textContent = " ";
satButton.addEventListener("click", function (e) {
                const satisfiedValue = "1";
                satButton.style.backgroundColor ="orange";
                const crn = table2.crn; // Assuming table3 has the crn property
                alterTable(crn, satisfiedValue); // Pass both crn and satisfiedValue
                alert(crn + " has been satisfied");
            });

            sheetDiv.appendChild(ID);
            sheetDiv.appendChild(className); 
            //sheetDiv.appendChild(semester); 
            sheetDiv.appendChild(creditHours); 
            //sheetDiv.appendChild(satisfied);
            sheetDiv.appendChild(satButton);
            return sheetDiv;

    }
    fetch('http://127.0.0.1:3000/table2') 
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
        .then(tables => {
            tables.forEach((table) => {
                const sheet = createSheet(table);
                sheetGrid.appendChild(sheet);
            });
        })
        .catch(error => console.error('Error:', error));
});