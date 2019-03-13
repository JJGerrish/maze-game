<?php

    $currentDir = getcwd();
    $uploadDirectory = "/uploads/";

    $errors = []; // Store all foreseen and unforseen errors here

    $fileExtensions = ['json']; // Get all the file extensions

    $fileName = preg_replace("/[^A-Z0-9._-]/i", "_", $_FILES['file']['name']);
    $fileSize = $_FILES['file']['size'];
    $fileTmpName = $_FILES['file']['tmp_name'];
    $fileType = $_FILES['file']['type'];
    $fileExtension = strtolower(end(explode('.',$fileName)));

    $uploadPath = $currentDir . $uploadDirectory . $fileName;


        if (! in_array($fileExtension, $fileExtensions)) {
            $errors[] = "This file extension is not allowed. Please upload a JSON file";
        }

        if ($fileSize > 100000) {
            $errors[] = "This file is more than 100KB. Sorry, it has to be less than or equal to 100KB";
        }

        if (empty($errors)) {
            $didUpload = move_uploaded_file($fileTmpName, $uploadPath);

            if ($didUpload) {
                echo basename($fileName);
            } else {
                echo "An error occurred somewhere. Try again.";
            }
        } else {
            foreach ($errors as $error) {
                echo $error . "These are the errors" . "\n";
            }
        }

?>