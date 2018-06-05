<?php
	class JobsController extends AppController {
		public $components = array('RequestHandler');

		// get all jobs list
		public function index() {
			$jobs = $this->Job->find('all');
			$this->set("jobs", $jobs);
	    }

	    // get organization jobs
		public function getOrganizationJobs() {
				$queryString = 'SELECT jobs.id, jobs.title, departments.name, departments.availability FROM jobs '.
										   'INNER JOIN departments ON jobs.department = departments.id '.
										   'WHERE jobs.organizationId = '.$this->request->data['organizationId'].' AND jobs.availability = "available" '.
										   'LIMIT '.$this->request->data['limit'].' OFFSET '.$this->request->data['offset'].'';

				$jobs = $this->Job->query($queryString);
				$this->set('jobs', $jobs);
	  }

	    // add a new job
	    public function add() {
	    	$this->Job->create();

			if ($this->Job->save($this->request->data)) {
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
	    	$this->Job->create();
	    	$this->request->data['availability'] = 'unavailable';

			if ($this->Job->save($this->request->data)) {
	            $message = _Global::$httpOk;
	        } else {
	            $message = _Global::$httpBadRequest;
	        }

	        $this->set(array(
	            'message' => $message,
	            '_serialize' => array('message')
	        ));
	    }

		// view details about one job
	    public function view($id = null) {
			if (!$id) {
	            throw new NotFoundException(__('Invalid item'));
	        }

	        $queryString = 'SELECT jobs.id, jobs.title, jobs.department, departments.name '.
	        			   'FROM jobs '.
	        			   'INNER JOIN departments ON jobs.department = departments.id '.
	        			   'WHERE jobs.id = '.$id.'';

	        $job = $this->Job->query($queryString);

	        if (!$job) {
	            throw new NotFoundException(__('Invalid item'));
	        }

	        $this->set('job', $job);
	    }
	}
?>
