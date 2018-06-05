<?php
	class HolidaysController extends AppController {
		public $components = array('RequestHandler');

		public function getAvailableHolidayDays($id) {
			if (!$id) {
	            throw new NotFoundException(__('Invalid item'));
	        }

	        $queryString = 'SELECT people.available_holiday_days FROM people WHERE id = '.$id.'';
	    
	        $availableHolidayDays = $this->Holiday->query($queryString);

	        $this->set(array(
	            'availableHolidayDays' => $availableHolidayDays,
	            '_serialize' => array('availableHolidayDays')
	        ));
		}

		// add a new holiday
	    public function add() {
	    	$this->Holiday->create();

	    	$queryString = 'UPDATE people SET available_holiday_days = '.$this->request->data['remainingHolidayDays'].' WHERE id = '.$this->request->data['people_id'].'';
	    
	        $this->Holiday->query($queryString);

			if ($this->Holiday->save($this->request->data)) {
	            $message = _Global::$httpOk;
	        } else {
	            $message = _Global::$httpBadRequest;
	        }

	        $this->set(array(
	            'message' => $message,
	            '_serialize' => array('message')
	        ));
	    }

	    public function peoplePlannedHolidays($id = null) {
	    	if (!$id) {
	            throw new NotFoundException(__('Invalid item'));
	        }

	        $queryString = 'SELECT holidays.start_date, holidays.end_date, holidays.days, holidays.status FROM holidays WHERE holidays.start_date >= "'.date('Y-m-d').'"';
	    
	        $holidays = $this->Holiday->query($queryString);

	        $this->set(array(
	            'holidays' => $holidays,
	            '_serialize' => array('holidays')
	        ));
	    }

	    public function holidaysHistory($id = null) {
	    	if (!$id) {
	            throw new NotFoundException(__('Invalid item'));
	        }

	        $queryString = 	'SELECT holidays.start_date, holidays.end_date, holidays.days, holidays.status FROM holidays WHERE holidays.start_date < "'.date('Y-m-d').'" '.
	    					'LIMIT '.$_GET['limit'].' OFFSET '.$_GET['offset'].';';

	        $holidays = $this->Holiday->query($queryString);

	        $this->set(array(
	            'holidays' => $holidays,
	            '_serialize' => array('holidays')
	        ));
	    }

	    public function getUnseenHolidays($id = null) {
	    	if (!$id) {
	            throw new NotFoundException(__('Invalid item'));
	        }

	        $queryString = 	'SELECT holidays.id, holidays.start_date, holidays.end_date, holidays.days, holidays.status, people.first_name, people.last_name FROM holidays '.
	        			   	'INNER JOIN people ON holidays.people_id = people.id '.
	        				'WHERE holidays.organizationId = '.$id.' AND holidays.status = 0 '.
	        				'LIMIT '.$_GET['limit'].' OFFSET '.$_GET['offset'].';';
	    
	        $unseenHolidays = $this->Holiday->query($queryString);

	        $this->set(array(
	            'unseenHolidays' => $unseenHolidays,
	            '_serialize' => array('unseenHolidays')
	        ));
	    }

	    public function acceptHoliday() {
	    	$queryString = 	'UPDATE holidays SET status = 2 WHERE id = '.$this->request->data['id'].'';

	        if ($this->Holiday->query($queryString)) {
	            $message = _Global::$httpOk;
	        } else {
	            $message = _Global::$httpBadRequest;
	        }

	        $this->set('message', $message);
	    }

	    public function rejectHoliday() {
	    	$queryString = 	'UPDATE holidays SET status = 1 WHERE id = '.$this->request->data['id'].'';

	        if ($this->Holiday->query($queryString)) {
	            $message = _Global::$httpOk;
	        } else {
	            $message = _Global::$httpBadRequest;
	        }

	        $this->set('message', $message);
	    }
	}
?>