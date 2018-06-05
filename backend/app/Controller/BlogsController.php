<?php
	class BlogsController extends AppController {
		public $components = array('RequestHandler');

		// add a new blog
	  public function add() {
	  	$this->Blog->create();

      if ($this->Blog->save($this->request->data)) {
	    	$message = _Global::$httpOk;
	    } else {
	      $message = _Global::$httpBadRequest;
	    }

	  	$this->set(array(
	    	'message' => $message,
	      '_serialize' => array('message')
	    ));
	  }

		// get all blogs list
		public function index() {
			$blogs = $this->Blog->find('all');
			$this->set('blogs', $blogs);
	  }

		// view details about one blog
		public function view($id = null) {
			if (!$id) {
				throw new NotFoundException(__('Invalid item'));
			}

		 	$queryString = 'SELECT title, content FROM blogs '.
								 		 'WHERE blogs.id = '.$id.'';

	 		$blog = $this->Blog->query($queryString);

			if (!$blog) {
				throw new NotFoundException(__('Invalid item'));
			}

			$this->set('blog', $blog);
		}

		// get blog content
		public function getBlogContent($id = null) {
			if (!$id) {
				throw new NotFoundException(__('Invalid item'));
			}

			$queryString = 'SELECT content FROM blogs '.
								 		 'WHERE id = '.$id.'';

			$content = $this->Blog->query($queryString);

			if (!$content) {
				throw new NotFoundException(__('Invalid item'));
			}

			$this->set('content', $content[0]['blogs']['content']);
		}

		public function delete() {
			if ($this->Blog->delete($this->request->data['id'])) {
				$message = _Global::$httpOk;
			} else {
				$message = _Global::$httpBadRequest;
			}

			$this->set('message', $message);
		}
	}
?>
