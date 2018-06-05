<?php
	class _Global {

		// user token
		public static $token = '1q3E$x';

		// HTTP status codes
		public static $httpUnauthorized = 401;
		public static $httpOk = 200;
		public static $httpBadRequest = 400;
		public static $incorrectPassword = 001;
		public static $mustHavePremiumAccount = 002;
		public static $emailAdressUsed = 3;
		public static $organizationNameUsed = 4;

		// Account types
		public static $basicAccount = 'Basic';
		public static $basicAccountMaxPeople = 20;
		public static $basicAccountMaxDepartments = 5;
		public static $basicAccountMaxBrands = 2;
		public static $basicAccountMaxTeams = 5;
		public static $basicAccountMaxDocuments = 30;
		public static $basicAccountMaxPeopleCategories = 5;
		public static $basicAccountMaxPayrolls = 5;
	}
?>
