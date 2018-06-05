<?php
	class DepartmentsController extends AppController {
		public $components = array('RequestHandler');

		// get all departments list
		public function index() {
			$departments = $this->Department->find('all');
			$this->set('departments', $departments);
	    }

	    // get organization jobs
		public function getOrganizationDepartments() {
			$queryString = 'SELECT id, name FROM departments '.
						   'WHERE organizationId = '.$this->request->data['organizationId'].' AND availability = "available" '.
						   'LIMIT '.$this->request->data['limit'].' OFFSET '.$this->request->data['offset'].'';

			$departments = $this->Department->query($queryString);
			$this->set('departments', $departments);
	    }

	    // add a new job
	    public function add() {
	    	$organizationDepartments = $this->Department->query('SELECT id FROM departments WHERE organizationId = '.$this->request->data['organizationId'].' AND availability = "available";');
	    	$countOrganizationDepartments = count($organizationDepartments);

	    	$this->Department->create();

	        if ($countOrganizationDepartments >= _Global::$basicAccountMaxDepartments && $this->request->data['accountType'] == _Global::$basicAccount) {
	        	$message = _Global::$mustHavePremiumAccount;
	        } else if ($this->Department->save($this->request->data)) {
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
			$this->Department->create();
	    	$this->request->data['availability'] = 'unavailable';

			if ($this->Department->save($this->request->data)) {
	            $message = _Global::$httpOk;
	        } else {
	            $message = _Global::$httpBadRequest;
	        }

	        $this->set(array(
	            'message' => $message,
	            '_serialize' => array('message')
	        ));
		}

		// public function departmentInformation($id = null) {
		// 	if (!$id) {
	 //            throw new NotFoundException(__('Invalid item'));
	 //        }

	 //        $queryString = 	'SELECT departments.id, departments.name, departments.description, departments.department_head, people.first_name, people.last_name '.
	 //        			   	'FROM departments '.
	 //        				'INNER JOIN people ON departments.department_head = people.id '.
	 //        			   	'WHERE departments.id = '.$id.'';

	 //        $department = $this->Department->query($queryString);

	 //        if (!$department) {
	 //            throw new NotFoundException(__('Invalid item'));
	 //        }

	 //        $this->set('department', $department);
		// }

		// view details about one department
	    public function view($id = null) {
			if (!$id) {
	            throw new NotFoundException(__('Invalid item'));
	        }

	        $queryString = 	'SELECT departments.id, departments.name, departments.description, departments.department_head '.
	        			   	'FROM departments '.
	        			   	'WHERE departments.id = '.$id.'';

	        $department = $this->Department->query($queryString);

	        if (!$department) {
	            throw new NotFoundException(__('Invalid item'));
	        }

	        $this->set('department', $department);
	    }
	}
?>
