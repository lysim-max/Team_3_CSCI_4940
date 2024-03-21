const sheetGrid = document.getElementById("classes");

document.addEventListener("DOMContentLoaded", function () {

    function addToCart(satisfied){
        fetch(`http://127.0.0.1:3000/satisfied`, {
            method: 'POST',
            headers:{'Content-Type': 'application/json',},
            body: JSON.stringify(satisfied),
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


function createSheet(table) {
    const sheetDiv = document.createElement("div");
    sheetDiv.classList.add("class-sheet");

    const ID = document.createElement("h2");
        ID.src = table.ID;

    const className = document.createElement("h3");
        className.src = table.class_name;

    const semester = document.createElement("h4");
        semester.src= table.semester;

    const creditHours = document.createElement("h5");
        creditHours.src = table.credit_hours;

    const satisfied =document.createElement("h2");
        satisfied.src = table.satisfied;
    const satButton = document.createElement('button')
        satButton.setAttribute("class", "button1")

classTaken.addEventListener("click", function (e) {
            const satisfied = 1;
            const className = table.class_name;
            
            addToCart(satisfied);
            alert(className+" has been satisfied")
        });
        sheetDiv.appendChild(ID);
        sheetDiv.appendChild(className); 
        sheetDiv.appendChild(semester); 
        sheetDiv.appendChild(creditHours); 
        sheetDiv.appendChild(satisfied);     

        return sheetDiv;

    }
    fetch('http://127.0.0.1:3000/table') 
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

