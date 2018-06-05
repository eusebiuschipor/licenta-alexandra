<?php
	class OrganizationsController extends AppController {
		public $components = array('RequestHandler');

		// add a new organization
	  public function register() {
		    $this->Organization->create();
				$this->request->data['password'] = md5($this->request->data['password']);

				// check if the email is not already registered for a people
				$queryString = 'SELECT email FROM people ' .
											 'WHERE email = "' . $this->request->data['email'] . '"';

				$peopleEmail = $this->Organization->query($queryString);
				$peopleEmailExists = count($peopleEmail);

				// check if the email is not already registered for a organization
				$organizationEmailExists = array(
						array('Organization.email' => $this->request->data['email'])
				);

				// check if the name for the organization is not already registered
				$organizationNameExists = array(
						array('Organization.name' => $this->request->data['name'])
				);

			 if ($this->Organization->hasAny($organizationEmailExists) || $peopleEmailExists) {
			      $message = _Global::$emailAdressUsed;
			 } else if ($this->Organization->hasAny($organizationNameExists)) {
				 		$message = _Global::$organizationNameUsed;
			 } else {
			      if ($this->Organization->save($this->request->data)) {
		            $message = _Global::$httpOk;
		        } else {
		            $message = _Global::$httpBadRequest;
		        }
			 }

	     $this->set(array(
	        'message' => $message,
	        '_serialize' => array('message')
	     ));
	  }

    // update the food menu currency
  	public function updateFoodMenuCurrency() {
  	   $this->Organization->create();

  		 if ($this->Organization->save($this->request->data)) {
  		     $message = _Global::$httpOk;
  		 } else {
  		     $message = _Global::$httpBadRequest;
  		 }

  	   $this->set(array(
  	      'message' => $message,
  	      '_serialize' => array('message')
  	   ));
  	}

	  public function userRevertToBasicAccount() {
	     $organizationId = $this->request->data['organizationId'];

	     $this->Organization->query('UPDATE organizations SET account_type = "'._Global::$basicAccount.'" WHERE id="'.$organizationId.'";');
		}

	  public function revertToBasicAccount() {
	     $email = $this->request->data['email'];

		   $this->Organization->query('UPDATE organizations SET account_type = "'._Global::$basicAccount.'" WHERE email="'.$email.'";');
		}

	  public function login() {
	    	$email = $this->request->data['email'];
	    	$password = md5($this->request->data['password']);

			  $conditions = array(
    		    'Organization.email' => $email,
    			  'Organization.password' => $password
			  );

			  if ($this->Organization->hasAny($conditions)) {
				      $organizationId = $this->Organization->query('SELECT id FROM organizations WHERE email="'.$email.'";');
				      $accountType = $this->Organization->query('SELECT account_type FROM organizations WHERE email="'.$email.'";');
				      $premiumEndDate = $this->Organization->query('SELECT premium_end_date FROM organizations WHERE email="'.$email.'";');

				      $message = array(
					           'token' => _Global::$token,
					           'organizationId' => $organizationId,
					           'accountType' => $accountType,
					           'premiumEndDate' => $premiumEndDate
				      );
			  } else {
				      $message = _Global::$httpUnauthorized;
			  }

			  $this->set(compact('message'));
		}

		public function changePassword() {
			   $email = $this->request->data['email'];
	    	 $oldPassword = md5($this->request->data['oldPassword']);
	    	 $conditions = null;
	    	 $saveObject = array();
	    	 $message = null;
	    	 $saveObject['password'] = md5($this->request->data['newPassword']);
    		 $saveObject['id'] = $this->request->data['organizationId'];

	    	 $conditions = array(
    		     'Organization.email' => $email,
    			   'Organization.password' => $oldPassword
			   );

			   if ($this->Organization->hasAny($conditions)) {
	    	     if ($this->Organization->save($saveObject)) {
	            	$message = _Global::$httpOk;
		         } else {
		            $message = _Global::$httpBadRequest;
		         }
	    	 } else {
	    		   $message = _Global::$httpUnauthorized;
	    	 }

	    	 $this->set(array(
	            'message' => $message,
	            '_serialize' => array('message')
	       ));
		 }
	}
?>
