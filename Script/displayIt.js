const sheetGrid = document.getElementById("classes");

document.addEventListener("DOMContentLoaded", function () {

    function alterTable(crn,satisfiedValue){
        const classData = { crn: crn, satisfiedValue: satisfiedValue };
        fetch(`http://127.0.0.1:3000/postit`, {
            method: 'POST',
            headers:{'Content-Type': 'application/json',},
            body: JSON.stringify(classData),
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


        function createSheet(table3) {
            const sheetDiv = document.createElement("div");
            sheetDiv.classList.add("class-sheet");
            const ID = document.createElement("div");
            ID.setAttribute("class", "ID-class");
            ID.textContent = table3.crn;
            const ID2=table3.ID;
            const className = document.createElement("div");
            className.setAttribute("class", "name-class");
            className.textContent = table3.class_name;
        
            const creditHours = document.createElement("div");
            creditHours.setAttribute("class", "credit-class");
            creditHours.textContent = table3.credit_hours;
        
            const satButton = document.createElement('input');
            satButton.type = "checkbox";
            satButton.setAttribute("class", "button1");
            satButton.textContent = " ";

            
            satButton.addEventListener("change", function (e) {

                if(satButton.checked){
                const satisfiedValue = "1";
                satButton.style.accentColor ="orange";
                const crn = table3.crn; // Assuming table3 has the crn property
                alterTable(crn, satisfiedValue); // Pass both crn and satisfiedValue
                }
                else{
                    const satisfiedValue = "0";
                const crn = table3.crn; // Assuming table3 has the crn property
                alterTable(crn, satisfiedValue); // Pass both crn and satisfiedValue

                }
            });

            sheetDiv.appendChild(ID);
            sheetDiv.appendChild(className); 
            sheetDiv.appendChild(creditHours); 
            sheetDiv.appendChild(satButton);
            return sheetDiv;

    }
    fetch('http://127.0.0.1:3000/table3') 
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