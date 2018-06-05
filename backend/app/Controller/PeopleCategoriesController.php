<?php
	class PeopleCategoriesController extends AppController {
		public $components = array('RequestHandler');

		// get all categories
		public function index() {
			$queryString = 'SELECT id, title, description FROM people_categories '.
						   'WHERE organizationId = '.$this->request->data['organizationId'].' '.
						   'LIMIT '.$this->request->data['limit'].' OFFSET '.$this->request->data['offset'].';';

			$peopleCategories = $this->PeopleCategory->query($queryString);
			$this->set('peopleCategories', $peopleCategories);
	    }

	    // add a new category
	    public function add() {
	    	$organizationPeopleCategories = $this->PeopleCategory->query('SELECT id FROM people_categories WHERE organizationId = '.$this->request->data['organizationId'].';');
	    	$countOrganizationPeopleCategories = count($organizationPeopleCategories);

	    	$this->PeopleCategory->create();

			if ($countOrganizationPeopleCategories >= _Global::$basicAccountMaxPeopleCategories && $this->request->data['accountType'] == _Global::$basicAccount) {
	    		$message = _Global::$mustHavePremiumAccount;
	    	} else if ($this->PeopleCategory->save($this->request->data)) {
	            $message = _Global::$httpOk;
	        } else {
	            $message = _Global::$httpBadRequest;
	        }

	        $this->set(array(
	            'message' => $message,
	            '_serialize' => array('message')
	        ));
	    }

	    // view details about one people category
	    public function view($id = null) {
			if (!$id) {
	            throw new NotFoundException(__('Invalid item'));
	        }

	        $queryString = 	'SELECT * FROM people_categories WHERE id = '.$id.' ';

	        $peopleCategory = $this->PeopleCategory->query($queryString);

	        if (!$peopleCategory) {
	            throw new NotFoundException(__('Invalid item'));
	        }

	        $this->set('peopleCategory', $peopleCategory);
	    }

	    // delete a specific people category
	    public function delete() {
			if ($this->PeopleCategory->delete($this->request->data['id'])) {
	            $message = _Global::$httpOk;
	        } else {
	            $message = _Global::$httpBadRequest;
	        }

			$this->set('message', $message);
		}
	}
?>