<?php
	class WorkPlacesController extends AppController {
		public $components = array('RequestHandler');

	    // get organization locations
		public function getOrganizationWorkPlaces() {
			$queryString = 'SELECT * FROM work_places '.
						   			 'WHERE organizationId = '.$this->request->data['organizationId'].'';

			$workPlaces = $this->WorkPlace->query($queryString);
			$this->set('workPlaces', $workPlaces);
	  }

		// add work place
		public function add() {
			$this->WorkPlace->create();

			if ($this->WorkPlace->save($this->request->data)) {
				$message = _Global::$httpOk;
			} else {
				$message = _Global::$httpBadRequest;
			}

			$this->set(array(
				'message' => $message,
				'_serialize' => array('message')
			));
		}

		// view details about one work place
		public function view($id = null) {
			if (!$id) {
				throw new NotFoundException(__('Invalid item'));
			}

			$queryString = 'SELECT work_places.name, work_places.address '.
								 		 'FROM work_places '.
								 	 	 'WHERE id = '.$id.';';

			$workPlace = $this->WorkPlace->query($queryString);

			if (!$workPlace) {
				throw new NotFoundException(__('Invalid item'));
			}

			$this->set('workPlace', $workPlace);
		}

		// delete work place
		public function delete() {
			if ($this->WorkPlace->delete($this->request->data['id'])) {
	    	$message = _Global::$httpOk;
	    } else {
	      $message = _Global::$httpBadRequest;
	    }

			$this->set('message', $message);
		}
	}
?>
