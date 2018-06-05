<?php
	class FoodMenusController extends AppController {
		public $components = array('RequestHandler');

			// get today food menu
			public function today() {
				$queryString = 'SELECT id, menu, price '.
											 'FROM food_menus '.
											 'WHERE date = "'.date("Y-m-d").'"';

				$todayFoodMenu = $this->FoodMenu->query($queryString);

				$this->set('todayFoodMenu', $todayFoodMenu);
		 }

	   // add a new food menu
	   public function add() {
	    	$this->FoodMenu->create();

				if ($this->FoodMenu->save($this->request->data)) {
		    	$message = _Global::$httpOk;
        } else {
      		$message = _Global::$httpBadRequest;
        }

        $this->set(array(
        	'message' => $message,
          '_serialize' => array('message')
        ));
		}

		// view details about one specific food menu
		public function view($id = null) {
				if (!$id) {
						throw new NotFoundException(__('Invalid item'));
				}

				$queryString = 'SELECT * FROM food_menus '.
								 			 'WHERE id = '.$id.'';

				$foodMenu = $this->FoodMenu->query($queryString);

				if (!$foodMenu) {
						throw new NotFoundException(__('Invalid item'));
				}

				$this->set('foodMenu', $foodMenu);
		}

		public function delete() {
			if ($this->FoodMenu->delete($this->request->data['id'])) {
	    	$message = _Global::$httpOk;
	    } else {
	    	$message = _Global::$httpBadRequest;
	    }

			$this->set('message', $message);
		}
	}
?>
