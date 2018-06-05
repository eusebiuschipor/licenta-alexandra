<?php
	class CountriesController extends AppController {
		public $components = array('RequestHandler');

		// get available countries
		public function getAvailableCountries() {
			$queryString = 'SELECT * FROM available_countries ';

			$availableCountries = $this->Country->query($queryString);
			$this->set('availableCountries', $availableCountries);
		}

		// get organization countries
		public function getAllCountries($organizationId = null) {
			$queryString = 'SELECT countries.id, countries.countryId, available_countries.id, available_countries.name FROM countries '.
										 'INNER JOIN available_countries ON countries.countryId = available_countries.id '.
							 			 'WHERE organizationId = '.$organizationId.'';

			$countries = $this->Country->query($queryString);
			$this->set('countries', $countries);
		}

		// add a new country
		public function add() {
			$this->Country->create();

			if ($this->Country->save($this->request->data)) {
				$message = _Global::$httpOk;
			} else {
				$message = _Global::$httpBadRequest;
			}

			$this->set(array(
				'message' => $message,
				'_serialize' => array('message')
			));
		}

		// delete country
		public function delete() {
			if ($this->Country->delete($this->request->data['id'])) {
				$message = _Global::$httpOk;
			} else {
				$message = _Global::$httpBadRequest;
			}

			$this->set('message', $message);
		}
	}
?>
