<?php
$python_executable = '"d:/Padhai/SEM-6/ML Project/.conda/python.exe"';
$python_script = '"d:/Padhai/SEM-6/ML Project/predictors/json_generator.py"';
if (isset($_POST['city'])) {
    // Get the selected city from the POST data
    $selectedCity = $_POST['city'];
    $command = "{$python_executable} {$python_script} " . escapeshellarg($selectedCity) . " 2>&1";
    $output = shell_exec($command);
    //$output = "hello";
    if ($output === null) {
        // If there was an error executing the script, display an error message
        echo "Error executing script.";
    } else {
        // Display the output of the script
        echo $output;
    }
} else {
    echo "error";
}
?>

