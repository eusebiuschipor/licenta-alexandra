<?php
	class PostsController extends AppController {
		public $components = array('RequestHandler');

		// get organization posts
		public function getOrganizationPosts() {
			$queryString = 	'SELECT posts.id, posts.content, posts.date, posts.file, posts.likes, people.id, people.photo, people.first_name, people.last_name FROM posts '.
							'INNER JOIN people ON posts.author = people.id '.
						   	'WHERE posts.organizationId = '.$this->request->data['organizationId'].' '.
						   	'LIMIT '.$this->request->data['limit'].' OFFSET '.$this->request->data['offset'].';';

			$posts = $this->Post->query($queryString);
			$this->set('posts', $posts);
	    }

		// add a new post
	    public function add() {
	    	$this->Post->create();

			if ($this->Post->save($this->request->data)) {
	            $message = _Global::$httpOk;
	        } else {
	            $message = _Global::$httpBadRequest;
	        }

	        $this->set(array(
	            'message' => $message,
	            '_serialize' => array('message')
	        ));
	    }

	    // view details about one post
	    public function view($id = null) {
			if (!$id) {
	            throw new NotFoundException(__('Invalid item'));
	        }

	        $queryString = 'SELECT posts.author, posts.content, posts.file, posts.date, people.first_name, people.last_name FROM posts '.
	        			   'INNER JOIN people ON posts.author = people.id '.
	        			   'WHERE posts.id = '.$id.'';

	        $post = $this->Post->query($queryString);

	        if (!$post) {
	            throw new NotFoundException(__('Invalid item'));
	        }

	        $this->set('post', $post);
	    }

	    public function delete() {
			if ($this->Post->delete($this->request->data['id'])) {
	            $message = _Global::$httpOk;
	        } else {
	            $message = _Global::$httpBadRequest;
	        }

			$this->set('message', $message);
		}

		public function like() {
			$queryString = 'SELECT likes FROM posts WHERE id = '.$this->request->data['postId'].'';
			$likes = $this->Post->query($queryString);
			$likesString = $likes[0]['posts']['likes'];
			$newLikesString = $likesString . $this->request->data['userId'] . ',';

			$queryString = 'UPDATE posts SET likes = "'.$newLikesString.'" WHERE id = '.$this->request->data['postId'].'';
			$this->Post->query($queryString);
		}

		public function unlike() {
			$queryString = 'SELECT likes FROM posts WHERE id = '.$this->request->data['postId'].'';
			$likes = $this->Post->query($queryString);
			$likesString = $likes[0]['posts']['likes'];
			$likesArray = explode(',', $likesString);
			$newLikesString = '';

			for ($i = 0, $iLen = count($likesArray); $i < $iLen - 1; $i++) {
				if ($likesArray[$i] != $this->request->data['userId']) {
					$newLikesString = $newLikesString . $likesArray[$i] . ',';
				}
			}

			$queryString = 'UPDATE posts SET likes = "'.$newLikesString.'" WHERE id = '.$this->request->data['postId'].'';
			$this->Post->query($queryString);
		}

		public function dislike() {
			$queryString = 'SELECT dislikes FROM posts WHERE id = '.$this->request->data['postId'].'';
			$dislikes = $this->Post->query($queryString);

			$dislikes .= $this->request->data['userId'] . ' ';

			$queryString = 'UPDATE posts SET likes = '.$dislikes.' WHERE id = '.$this->request->data['postId'].'';
			$this->Post->query($queryString);
		}
	}
?>