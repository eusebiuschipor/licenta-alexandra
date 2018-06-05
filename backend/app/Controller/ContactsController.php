<?php
	class ContactsController extends AppController {
		public $components = array(
								'RequestHandler', 
								'Email', 
								'Session'
							);

		public $helpers = array(
							'Html', 
							'Form'
						);

		public function send() {
			$emailDestination = "schipor.eusebiu@gmail.com";
	    	$this->Contact->create();

			if ($this->Contact->save($this->request->data)) {
				$email = new CakeEmail();
	            $email->from(array($this->request->data["email"]));
	            $email->to($emailDestination);
	            $email->subject('Contact http://evermanage.com');
	            $send = $email->send(
            				"Name: ".$this->request->data["name"]."\n\n".
            				"Subject: ".$this->request->data["subject"]."\n\n".
            				"Email: ".$this->request->data["email"]."\n\n".
            				"Phone: ".$this->request->data["phone"]."\n\n".
            				"Message: ".$this->request->data["message"]
            			);

	            $message = _Global::$httpOk;
	        } else {
	            $message = _Global::$httpBadRequest;
	        }

	        $this->set(array(
	            'message' => $message,
	            '_serialize' => array('message')
	        ));
	    }
	}
?>