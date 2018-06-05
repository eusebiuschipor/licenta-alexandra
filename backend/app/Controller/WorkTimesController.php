<?php
	class WorkTimesController extends AppController {
		public $components = array('RequestHandler');

	    // get organization locations
		public function getOrganizationWorkTimes() {
			$queryString = 'SELECT * FROM work_times '.
						   			 'WHERE organizationId = '.$this->request->data['organizationId'].'';

			$workTimes = $this->WorkTime->query($queryString);
			$this->set('workTimes', $workTimes);
	  }

		// add work time
		public function add() {
			$this->WorkTime->create();

			if ($this->WorkTime->save($this->request->data)) {
				$message = _Global::$httpOk;
			} else {
				$message = _Global::$httpBadRequest;
			}

			$this->set(array(
				'message' => $message,
				'_serialize' => array('message')
			));
		}

		// delete work time
		public function delete() {
			if ($this->WorkTime->delete($this->request->data['id'])) {
	    	$message = _Global::$httpOk;
	    } else {
	      $message = _Global::$httpBadRequest;
	    }

			$this->set('message', $message);
		}

		// view details about one work time
		public function view($id = null) {
			if (!$id) {
				throw new NotFoundException(__('Invalid item'));
			}

			$queryString = 'SELECT work_times.name, work_times.interval '.
								 		 'FROM work_times '.
								 	 	 'WHERE id = '.$id.';';

			$workTime = $this->WorkTime->query($queryString);

			if (!$workTime) {
				throw new NotFoundException(__('Invalid item'));
			}

			$this->set('workTime', $workTime);
		}
	}
?>
