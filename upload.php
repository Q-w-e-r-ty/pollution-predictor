<?php
$targetDir = "uploads/"; // Directory where uploaded files will be stored
if(isset($_FILES["imageInput"]["name"])){
$targetFile = $targetDir . basename($_FILES["imageInput"]["name"]); // Path to the uploaded file

// Check if file has been uploaded successfully
if (move_uploaded_file($_FILES["imageInput"]["tmp_name"], $targetFile)) {
    echo "The file ". basename( $_FILES["imageInput"]["name"]). " has been uploaded.";
} else {
    echo "Sorry, there was an error uploading your file.";
}
}

?>
