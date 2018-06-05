<?php
	class TeamsController extends AppController {
		public $components = array('RequestHandler');

	    // get organization teams
		public function getOrganizationTeams() {
			$queryString = 'SELECT teams.id, teams.name, teams.description, teams.manager, people.first_name, people.last_name FROM teams '.
						   'INNER JOIN people ON teams.manager = people.id '.
						   'WHERE teams.organizationId = '.$this->request->data['organizationId'].' '.
						   'LIMIT '.$this->request->data['limit'].' OFFSET '.$this->request->data['offset'].';';

			$teams = $this->Team->query($queryString);
			$this->set('teams', $teams);
	    }

	    // add a new team
	    public function add() {
	    	$organizationTeams = $this->Team->query('SELECT id FROM teams WHERE organizationId = '.$this->request->data['organizationId'].';');
	    	$countOrganizationTeams = count($organizationTeams);

	    	$this->Team->create();


			if ($countOrganizationTeams >= _Global::$basicAccountMaxTeams && $this->request->data['accountType'] == _Global::$basicAccount) {
	    		$message = _Global::$mustHavePremiumAccount;
	    	} else if ($this->Team->save($this->request->data)) {
	            $message = _Global::$httpOk;
	        } else {
	            $message = _Global::$httpBadRequest;
	        }

	        $this->set(array(
	            'message' => $message,
	            '_serialize' => array('message')
	        ));
	    }

	    // view details about one team
	    public function view($id = null) {
			if (!$id) {
	            throw new NotFoundException(__('Invalid item'));
	        }

	        $queryString = 'SELECT name, description, manager '.
	        			   'FROM teams '.
	        			   'WHERE id = '.$id.'';

	        $team = $this->Team->query($queryString);

	        if (!$team) {
	            throw new NotFoundException(__('Invalid item'));
	        }

	        $this->set('team', $team);
	    }

	    public function delete() {
			if ($this->Team->delete($this->request->data['id'])) {
	            $message = _Global::$httpOk;
	        } else {
	            $message = _Global::$httpBadRequest;
	        }

			$this->set('message', $message);
		}
	}
?>
