<?php 
	$servername = "localhost";
	$username = "schipor_admin";
	$password = "md97jnnj79dmvareza";
	$dbname = "schipor_qa_synyzapo";

	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	} 

	$date = date('Y-m-d H:i:s');

	$sql = "INSERT INTO payments (date)
	VALUES ('2015-10-09')";

	if ($conn->query($sql) === TRUE) {
	    echo "New record created successfully";
	} else {
	    echo "Error: " . $sql . "<br>" . $conn->error;
	}

	$conn->close();
?>