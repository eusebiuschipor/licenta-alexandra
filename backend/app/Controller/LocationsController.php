<?php
	class LocationsController extends AppController {
		public $components = array('RequestHandler');

	    // get organization locations
		public function getOrganizationLocations() {
			$queryString = 'SELECT * FROM locations '.
						   'WHERE organizationId = '.$this->request->data['organizationId'].'';

			$locations = $this->Location->query($queryString);
			$this->set('locations', $locations);
	  }

		// add a new team
		public function add() {
			$this->Location->create();

			if ($this->Location->save($this->request->data)) {
				$message = _Global::$httpOk;
			} else {
				$message = _Global::$httpBadRequest;
			}

			$this->set(array(
				'message' => $message,
				'_serialize' => array('message')
			));
		}

		public function delete() {
			if ($this->Location->delete($this->request->data['id'])) {
				$message = _Global::$httpOk;
			} else {
				$message = _Global::$httpBadRequest;
			}

			$this->set('message', $message);
		}

		// view details about one location
		public function view($id = null) {
				if (!$id) {
						throw new NotFoundException(__('Invalid item'));
				}

				$queryString = 'SELECT name '.
								 			 'FROM locations '.
								 		 	 'WHERE id = '.$id.'';

				$location = $this->Location->query($queryString);

				if (!$location) {
						throw new NotFoundException(__('Invalid item'));
				}

				$this->set('location', $location);
		}
	}
?>
