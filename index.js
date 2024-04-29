const errorLabel = document.querySelector("label[for='error-msg']")
const latInp = document.querySelector("#latitude")
const lonInp = document.querySelector("#longitude")
const airQuality = document.querySelector("h2[id='air-quality']")
const airQualityStat = document.querySelector("div[id='air-quality-status']")
const componentsEle = document.querySelectorAll(".component-val")
const dragArea = document.querySelector('.drag-area');
const dragText = document.querySelector('.header');
const appId = "240d79027708e3b4191be8ec041cd7b1" 
const link = "https://api.openweathermap.org/data/2.5/air_pollution"
const root = document.querySelector('.root')
const img_upload = document.getElementById("imageInput");
let button = document.querySelector('.button');
let input = document.querySelector('input');


let file;

button.addEventListener('click', () => {
  console.log("yoooo");
  event.preventDefault();
  input.click();
  const uploadMessage = document.getElementById('upload-message');
  uploadMessage.innerText = '';
  const file = input.files[0];

  if (file) { 
    handleFileSelect(event);
  } else {
    uploadMessage.innerText = 'Please select a file before uploading.';
  }
});

input.addEventListener('change', function() {
  file = this.files[0];
  handleFileSelect(event);
});

dragArea.addEventListener('dragover', (event) =>{
  event.preventDefault();
  dragText.textContent = 'Release to upload';
  dragArea.classList.add('active');
});

dragArea.addEventListener('dragleave',() => {
  dragText.textContent = 'Drag & Drop';
  dragArea.classList.remove('active');
  // console.log('file left the drag area');
});

dragArea.addEventListener('drop', (event) =>{
  event.preventDefault();
  file = event.dataTransfer.files[0];
   dragArea.classList.add('active');
   displayFile();
   uploadFile(file);

});

function displayFile(){
  let fileType = file.type;
  let validExtensions = ['image/jpeg', 'image/jpg','image/png'];

  if(validExtensions.includes(fileType)) {
    let fileReader = new FileReader();

    fileReader.onload = () => {
      let fileURL = fileReader.result;
      let imgTag = `<img src="${fileURL}" alt="">`;
      dragArea.innerHTML = imgTag;

    };
    fileReader.readAsDataURL(file);
  } else {
    alert('this file is not an image');
    dragArea.classList.remove('active');
  }
};


const hideLocationInput = () => {
  document.querySelector('.location-container').style.display = 'none';
};

const setInitialUIState = () => {
  hideLocationInput();
};

const delhiCoordinates = [
  { latitude: 28.7041, longitude: 77.1025 }, // Delhi - India Gate
  { latitude: 28.6139, longitude: 77.2090 }, // Delhi - Red Fort
];

const chennaiCoordinates = [
  //{ latitude: 13.0827, longitude: 80.2707 }, // Chennai - Marina Beach
  //{ latitude: 13.0827, longitude: 80.2707 }, // Chennai - Kapaleeshwarar Temple
  { latitude: 12.8421, longitude: 80.1544 }, // Chennai - Vit chennai
];


const bangaloreCoordinates = [
  { latitude: 12.9716, longitude: 77.5946 }, // Bangalore - Vidhana Soudha
  { latitude: 12.9791, longitude: 77.5913 }, // Bangalore - Lalbagh Botanical Garden
];

const mumbaiCoordinates = [
  { latitude: 19.0760, longitude: 72.8777 }, // Mumbai - Gateway of India
  { latitude: 18.9220, longitude: 72.8347 }, // Mumbai - Marine Drive
];

function handleFileSelect(event) {
  const file = event.target.files[0]; // Get the selected file from the event
  displayFile();
}

const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('imageInput', file);

  fetch('upload.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.text())
  .then(message => {
    const uploadMessage = document.getElementById('upload-message');
    uploadMessage.innerText = message;
  })
  .catch(error => {
    console.error('Error uploading file:', error);
  });
};

// Function to handle file input change event
const handleFileInputChange = (event) => {
  console.log("handleFileInputChange");
  const uploadMessage = document.getElementById('upload-message');
  uploadMessage.innerText = '';
  const file = event.target.files[0]; 
  displayFile();
};

input.addEventListener('change', handleFileInputChange);

document.querySelector('form').addEventListener('submit', (event) => {
  console.log("document.querySelector");
  event.preventDefault(); 
  const file = input.files[0]; 
  uploadFile(file); // Uploading the file
});


const submitLocation = async() => {
  const selectedLocation = document.getElementById("location").value;

  try{
    if (selectedLocation === "Delhi") {
      const delhiCoords = delhiCoordinates[Math.floor(Math.random() * delhiCoordinates.length)];
      onPositionGathered(delhiCoords.latitude, delhiCoords.longitude, selectedLocation)
        .then(airData => {
          logValues('api', airData); 
        })
        .catch(error => {
          console.error(error);
        });
    } else if (selectedLocation === "Bangalore") {
      const bangaloreCoords = bangaloreCoordinates[Math.floor(Math.random() * bangaloreCoordinates.length)];
      onPositionGathered(bangaloreCoords.latitude, bangaloreCoords.longitude, selectedLocation)
        .then(airData => {
          logValues('api', airData); 
        })
        .catch(error => {
          console.error(error);
        });
    } else if (selectedLocation === "Chennai") {
      const chennaiCoords = chennaiCoordinates[Math.floor(Math.random() * chennaiCoordinates.length)];
      onPositionGathered(chennaiCoords.latitude, chennaiCoords.longitude, selectedLocation)
        .then(airData => {
          logValues('api', airData); 
        })
        .catch(error => {
          console.error(error);
        });
    } else if (selectedLocation === "Mumbai") {
      const mumbaiCoords = mumbaiCoordinates[Math.floor(Math.random() * mumbaiCoordinates.length)];
      onPositionGathered(mumbaiCoords.latitude, mumbaiCoords.longitude, selectedLocation)
        .then(airData => {
          logValues('api', airData); 
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      alert("Please select a valid location.");
    }
  } catch (error) {
    console.error(error);
    alert("Error fetching air quality data. Please try again.");
  }

  executeSerially();
};

async function executeSerially() {
  try {
    await submitForm(); // Wait for form submission to complete
    await updatePredictedValuesTable(); // Wait for updating predicted values table to complete
  } catch (error) {
    console.error(error); // Log any errors that occur during execution
    alert("An error occurred."); // Show an alert for user notification
  }
}
const logValues = (dataType,data) => {
  console.log(data)
  const location = document.getElementById("location").value;
  let apiUrl = 'api.php';
  if (dataType === 'predicted') {
    apiUrl += '?type=predicted';
  }

  const formData = new FormData();
  formData.append("location", location);
  formData.append("dataType", dataType);
  if (dataType === 'api') {
    for (const key in data.list[0].components) {
      console.log(key, ":", data.list[0].components[key]);
      formData.append(key, data.list[0].components[key]);
    }
  } else if (dataType === 'predicted') {
    for (const key in data) {
      formData.append(key, data[key]);
    }
  }

  fetch(apiUrl, {
      method: 'POST',
      body: formData
  })
  .then(response => response.text())
  .then(airData => {
      console.log(airData); 
  })
  .catch(error => {
      console.error('Error:', error);
  });
};

function showPreviousResults() {
  window.open('new.html', '_blank');
}



const onPositionGatherError = e => {
  root.innerHTML = e.message;
  errorLabel.innerText = e.message;
  window.alert(e.message)
};

const onPositionGathered = async (latitude, longitude, locationName) => {
  try {
    const airData = await getAirQuality(latitude, longitude);
    setValuesOfAir(airData);
    setComponentsOfAir(airData);
    hideLocationInput();
    console.log(`Air quality data for ${locationName} fetched successfully.`);
    return airData;
  } catch (error) {
    onPositionGatherError({ message: "Error fetching air quality data. Please try again." });
    console.error(error);
  }
};

const getAirQuality = async (lat, lon) => {
  try {
    const response = await fetch(`${link}?lat=${lat}&lon=${lon}&appid=${appId}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch air quality data.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch air quality data.");
  }
};


function setValuesOfAir(airData) {
  const aqi = airData.list[0].main.aqi;
  let airStat = "", color = "";

  switch (aqi) {
    case 1:
      airStat = "Good (0-50)";
      color = "rgb(19, 201, 28)";
      break;
    case 2:
      airStat = "Fair (51-100)";
      color = "rgb(15, 134, 25)";
      break;
    case 3:
      airStat = "Moderate (101-150)";
      color = "rgb(201, 204, 13)";
      break;
    case 4:
      airStat = "Poor (151-200)";
      color = "rgb(204, 83, 13)";
      break;
    case 5:
      airStat = "Very Poor (201-300)";
      color = "rgb(204, 13, 13)";
      break;
    default:
      airStat = "Unknown";
  }

  //airQualityStat.innerText = `AQI ${aqi}: ${airStat}`;
  airQualityStat.style.color = color;
};

const setComponentsOfAir = airData => {
  let components = { ...airData.list[0].components };

  componentsEle.forEach(ele => {
    const componentName = ele.getAttribute('data-comp');
    ele.innerText = components[componentName] + " μg/m³";
  });
};

function submitForm() {
  return new Promise((resolve, reject) => {
    var selectedCity = document.getElementById('location').value;
  
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'process_form.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          // Handle the response from the server (if needed)
          console.log(xhr.responseText);
          resolve(); // Resolve the promise if the request is successful
        } else {
          reject('Failed to submit form'); // Reject the promise if the request fails
        }
      }
    };
    xhr.send('city=' + selectedCity);
    console.log(selectedCity);
  });
}

const fetchLatestPredictedValues = async () => {
  try {
    console.log("idhar bhi")
    const response = await fetch('predicted_vall/data.json');
    if (!response.ok) {
      throw new Error('Failed to fetch predicted values.');
    }
    const data = await response.json();
    //console.log(data)
    return data;
  } catch (error) {
    console.error(error);
  }
};


const updatePredictedValuesTable = async () => {
  const predictedValuesTable = document.querySelector('.prediction-table');
  try {
    const predictedValuesData = await fetchLatestPredictedValues();
    predictedValuesTable.querySelectorAll('tr').forEach(row => {
      const componentNameCell = row.querySelector('.component-names');
      const valueCell = row.querySelector('.component-val1');
      if (componentNameCell && valueCell) {
        const componentName = componentNameCell.innerText.trim();
        const dataComp = valueCell.getAttribute('data-comp');
        if (dataComp && predictedValuesData[dataComp] !== undefined) {
          valueCell.innerText = predictedValuesData[dataComp] + " μg/m³";
        }
      }
    });
  logValues("predicted",predictedValuesData);
  } catch (error) {
    console.error(error);
    alert("Failed to fetch predicted values.");
  }
};

setInitialUIState(); 
