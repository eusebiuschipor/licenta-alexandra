<?php
    if (isset($_FILES['file'])) {
        $targetDir = "../assets/posts/files/";
        $targetFile = $targetDir . $_POST['timestamp'] . basename($_FILES["file"]["name"]);

        move_uploaded_file($_FILES['file']['tmp_name'], $targetFile); 
    }   
?> 