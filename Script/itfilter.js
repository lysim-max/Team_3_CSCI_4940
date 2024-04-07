async function filterClasses() {
    try {
        // Make a GET request to execute the query and retrieve data
        const response = await fetch('http://localhost:3000/executeQuery');
        const rows = await response.json(); // Assuming the response contains JSON data

        // Filter classes based on prerequisites
        const filteredClasses = rows.filter(function(course) {
            // Logic to check if prerequisites are satisfied
            // Replace this logic with your actual implementation
            return course.prerequisitesSatisfied;
        });

        // Convert filtered data to CSV format
        const csvData = filteredClasses.map(course => `${course.class_name},${course.crn},${course.credit_hours},${course.satisfied}`).join('\n');

        // Download the CSV file
        downloadCSV('filtered_classes.csv', csvData);

        console.log('Filtered classes exported to filtered_classes.csv');
    } catch (error) {
        console.error('Error filtering classes:', error);
    }
}

function downloadCSV(filename, data) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
}

// Call the filterClasses function
filterClasses();
