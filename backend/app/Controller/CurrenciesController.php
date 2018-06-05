<?php
	class CurrenciesController extends AppController {
		public $components = array('RequestHandler');

		// get all jobs list
    public function index() {
      $queryString = 'SELECT * FROM currencies';

      $currencies = $this->Currency->query($queryString);
      $this->set('currencies', $currencies);
    }

    public function currency($organizationId) {
      $queryString = 'SELECT currencies.id, currencies.currency_name, currencies.currency_html, organizations.food_menu_currency FROM currencies '.
                     'INNER JOIN organizations ON currencies.id = organizations.food_menu_currency '.
                     'WHERE organizations.id = '.$organizationId.'';

      $currency = $this->Currency->query($queryString);
      $this->set('currency', $currency);
    }
	}
?>
