<?php
	class MaritalStatusController extends AppController {
		public $components = array('RequestHandler');

	    // get organization locations
		public function getMaritalStatus() {
			$queryString = 'SELECT * FROM marital_statuses;';

			$maritalStatus = $this->MaritalStatus->query($queryString);
			$this->set('maritalStatus', $maritalStatus);
	    }
	}
?>