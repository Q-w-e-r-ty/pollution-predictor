<?php
// Database connection
$servername = "127.0.0.1";
$username = "diya";
$password = "diya";
$database = "aqi";

$conn = mysqli_connect($servername, $username, $password, $database);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Handle POST request to save data and upload image
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Extract data from POST request
    $location = $_POST["location"];
    $dataType = $_POST["dataType"];
    $so2 = $_POST["so2"];
    $o3 = $_POST["o3"];
    $no2 = $_POST["no2"];
    $pm2_5 = $_POST["pm2_5"];
    $co = $_POST["co"];
    $pm10 = $_POST["pm10"];

    // Handle data insertion based on $dataType
    if ($dataType === 'predicted') {
        // Handle predicted data
        // Example: INSERT INTO air_quality_data (location, ...) VALUES ('$location', ...);
        $sql = "INSERT INTO air_quality_data (location, co, no2, o3, so2, pm2_5, pm10) VALUES ('$location', '$co', '$no2', '$o3', '$so2', '$pm2_5', '$pm10')";
    } else if($dataType == 'api') {
        // Handle API data
        // Example: INSERT INTO api_values (location, ...) VALUES ('$location', ...);
        $sql = "INSERT INTO api_values (location, co, no2, o3, so2, pm2_5, pm10) VALUES ('$location', '$co', '$no2', '$o3', '$so2', '$pm2_5', '$pm10')";
    } else{
        echo "error!";
    }

    if (mysqli_query($conn, $sql)) {
        echo "Data saved successfully!";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }
}
if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['type']) && $_GET['type'] === 'previous_results') {
    // Fetch last 5 records from API Values table
    $apiValuesQuery = "SELECT * FROM api_values ORDER BY id DESC LIMIT 5";
    $apiValuesResult = mysqli_query($conn, $apiValuesQuery);
    $apiValues = mysqli_fetch_all($apiValuesResult, MYSQLI_ASSOC);

    // Fetch last 5 records from Air Quality Data table
    $airQualityQuery = "SELECT * FROM air_quality_data ORDER BY id DESC LIMIT 5";
    $airQualityResult = mysqli_query($conn, $airQualityQuery);
    $airQualityData = mysqli_fetch_all($airQualityResult, MYSQLI_ASSOC);

    // Prepare response data
    $response = [
        'apiValues' => $apiValues,
        'airQualityData' => $airQualityData
    ];

    // Send JSON response
    header('Content-Type: application/json');
    echo json_encode($response);
}

// Close connection
mysqli_close($conn);
?>
