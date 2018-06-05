<?php
	function insert($connection, $sql) {
		if ($connection->query($sql) === TRUE) {
			echo "New record created successfully";
		} else {
			echo "Error: " . $sql . "<br>" . $connection->error;
		}
	}

	$accountTypeId = null;

	// Informations for database connection
	$serverName = 'localhost';
	$username = 'schipor_admin';
	$password = 'md97jnnj79dmvareza';
	$dbName = 'schipor_qa_synyzapo';

	// Informations received from PayPal
	$itemName = $_POST['item_name'];
	$itemNumber = (string)$_POST['item_number'];
	$paymentStatus = $_POST['payment_status'];
	$paymentAmount = $_POST['mc_gross'];
	$paymentCurrency = $_POST['mc_currency'];
	$txnId = $_POST['txn_id'];
	$receiverEmail = $_POST['receiver_email'];
	$payerEmail = $_POST['payer_email'];

	// Create connection
	$connection = new mysqli($serverName, $username, $password, $dbName);

	// Check connection
	if ($connection->connect_error) {
		die("Connection failed: " . $connection->connect_error);
	} 

	// SQL for payments
	$sql = "INSERT INTO payments (item_name, item_number, payment_status, payment_ammount, payment_currency, txn_id, receiver_email, payer_email, date) VALUES ('".$itemName."', '".$itemNumber."', '".$paymentStatus."', '".$paymentAmount."', '".$paymentCurrency."', '".$txnId."', '".$receiverEmail."', '".$payerEmail."', now())";

	// Insert data in payments
	insert($connection, $sql);

	$itemNameComponents = explode(' ', $itemName);
	$monthsAccout 		= $itemNameComponents[3];

	$now = new DateTime('now');

	$currentMonth 		= date('m');
	$currentYear		= date('y');
	$currentDay 		= date('d');

	$endPremiumMonth 	= $currentMonth + $monthsAccout;
	$endPremiumYear		= $currentYear;
	$endPremiumDay		= $currentDay;

	if ($monthsAccout == 12) {
		$endPremiumMonth = 1;
		$endPremiumYear += 1;
	} else if ($endPremiumMonth > 12) {
		$endPremiumYear += 1;
		$endPremiumMonth -= 12;
	}

	// Get account type id:
	if (strpos($itemName, 'Basic') !== false) {
		$accountTypeId = 1;
	} else if (strpos($itemName, 'Premium 1') !== false) {
		$accountTypeId = 2;
	}

	$sql = "UPDATE organizations SET account_type = '".$itemName."', premium_start_date = '".$currentYear."-".$currentMonth."-".$currentDay."', premium_end_date = '".$endPremiumYear."-".$endPremiumMonth."-".$endPremiumDay."', account_type_id = ".$accountTypeId." WHERE email = '".$payerEmail."';";

	insert($connection, $sql);

	$connection->close();
?>