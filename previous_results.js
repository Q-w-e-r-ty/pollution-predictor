// previous_results.js

document.addEventListener('DOMContentLoaded', function () {
    fetchPreviousResults();
});

function fetchPreviousResults() {
    fetch('api.php?type=previous_results')
        .then(response => response.json())
        .then(data => {
            const apiValuesTable = document.getElementById('apiValuesTable');
            const airQualityDataTable = document.getElementById('airQualityDataTable');

            // Clear previous table content
            apiValuesTable.innerHTML = '';
            airQualityDataTable.innerHTML = '';

            // Populate API Values table
            data.apiValues.forEach(row => {
                const tr = document.createElement('tr');
                Object.values(row).forEach(value => {
                    const td = document.createElement('td');
                    td.textContent = value;
                    tr.appendChild(td);
                });
                apiValuesTable.appendChild(tr);
            });

            // Populate Air Quality Data table
            data.airQualityData.forEach(row => {
                const tr = document.createElement('tr');
                Object.values(row).forEach(value => {
                    const td = document.createElement('td');
                    td.textContent = value;
                    tr.appendChild(td);
                });
                airQualityDataTable.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Error fetching previous results:', error);
        });
}
