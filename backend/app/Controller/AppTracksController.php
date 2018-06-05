<?php
	class AppTracksController extends AppController {
		public $components = array('RequestHandler');

		// show app tracks
		public function index() {
			$queryString = 	'SELECT * FROM app_tracks '.
							'LIMIT '.$_GET['limit'].' OFFSET '.$_GET['offset'].';';

			$appTracks = $this->AppTrack->query($queryString);
			$this->set('appTracks', $appTracks);
	    }

	    // add new track
	    public function track() {
	    	$this->AppTrack->create();

			if ($this->AppTrack->save($this->request->data)) {
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