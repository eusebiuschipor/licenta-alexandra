(function() {
  var app = angular.module('Blog', []);

  app.service('GetAllBlogs', ['$http', '$window', function ($http, $window) {
    var blogsList = null,
        responsePromise = null;

    this.get = function(callback, limit, offset) {
      blogsList = new Array();
      var dataObject = {
        organizationId: $window.sessionStorage['organizationId'],
        limit: limit || 99999,
        offset: offset || 0
      };

      responsePromise = $http.post(Global.getOrganizationBlogs, dataObject, {});
      responsePromise.success(function(data, status, headers, config) {
        blogsList = new Array();
        for (var i = 0; i < data.length; i++) {
          var blog = new Object();
					blog.nr = i + 1;
					blog.id = data[i]['Blog']['id'];
					blog.title = data[i]['Blog']['title'];
					blogsList.push(blog);
        }
        callback();
      });
      responsePromise.error(function(data, status, headers, config) {
        console.log('error');
      });
    };

    this.getBlogsList = function() {
      return blogsList;
    };
  }]);

  app.controller('BlogsListController', ['$scope', '$http', '$window', '$location', 'GetAllBlogs', 'Form', 'GrayBox', 'PopupMessage', function($scope, $http, $window, $location, GetAllBlogs, Form, GrayBox, PopupMessage) {
    var blogs = new Array(),
        offset = 0,
        newBlogsList = null,
        self = this;

    this.callbackGetBlogsList = function() {
      newBlogsList = null;

      if (blogs.length == 0) {
        blogs = GetAllBlogs.getBlogsList();
      } else {
        newBlogsList = GetAllBlogs.getBlogsList();

        for (var i = 0; i < newBlogsList.length; i++) {
          blogs.push(newBlogsList[i]);
        }
      }
    };

    this.getBlogsList = function() {
      return blogs;
    };

    this.deleteBlog = function(blogId) {
      var dataObject = {
        id: ActionVariable.itemToBeDeleted
      };

      Form.sendDataToServer(Global.deleteBlog, dataObject);
    };

    this.showDeleteBlogPopup = function(blogId, blogTitle) {
      PopupMessage.showDeletePopup(blogId, 'Are you sure that you want to delete the blog ' + blogTitle + '?', 'delete-blog');
    };

    this.goEditBlog = function(id) {
      $location.path('edit-blog/' + id);
    };

    this.goBlogDescription = function(id) {
      $location.path('blog/' + id);
    }

    this.showGrayBox = GrayBox.show;

    $window.onscroll = function() {
      if (($(window).scrollTop() + $(window).height() >= $(document).height() - 10) && $location.path() == Global.showBlogsRoute) {
        GetAllBlogs.get(self.callbackGetBlogsList, Global.infiniteScrollLimit, offset += Global.infiniteScrollLimit);
      }
    };

    GetAllBlogs.get(this.callbackGetBlogsList, Global.infiniteScrollLimit, offset);
  }]);

  app.controller('AddBlogArticleController', ['$scope', '$http', '$window', '$location', '$routeParams', '$window', 'PopupMessage', function($scope, $http, $window, $location, $routeParams, $window, PopupMessage) {
    var self = this,
        dataObject = null,
        responsePromise = null,
        blogId = $routeParams.blogId;

    this.addBlogArticleForm = {};

    this.submitTheForm = function() {
      dataObject = {
        id: blogId,
        title: self.addBlogArticleForm.title,
        content: self.addBlogArticleForm.content,
        organizationId: sessionStorage.organizationId,
        userId: sessionStorage.peopleId
      };

      responsePromise = $http.post(Global.addBlogArticle, dataObject, {});
      responsePromise.success(function(dataFromServer, status, headers, config) {
        self.addBlogArticleForm = {};
        $location.path('/blogs');
        PopupMessage.showPopupMessage('Success', 'The blog article was added with succes!');
      });
      responsePromise.error(function(data, status, headers, config) {
        console.log('error');
      });
    };

    this.getBlogInformation = function() {
        $http.get(Global.getBlogInformation + blogId)
            .success(function(data, status, headers, config) {
                self.addBlogArticleForm.title = data[0]['blogs']['title'];
                self.addBlogArticleForm.content = data[0]['blogs']['content'];
            })
            .error(function(data, status, headers, config) {
                console.log('error');
            });
    };
  }]);

  app.controller('BlogInformationController', ['$scope', '$http', '$window', '$routeParams', function($scope, $http, $window, $routeParams) {
    var blogId = $routeParams.blogId,
			  self = this,
			  blogInformation = {};

    this.blogContent = null;

		this.getBlogInformation = function() {
      $http.get(Global.getBlogInformation + blogId)
           .success(function(data, status, headers, config) {
             blogInformation.title = data[0]['blogs']['title'];
           })
           .error(function(data, status, headers, config) {
             console.log('error');
           });

     $http.get(Global.getBlogContent + blogId)
          .success(function(data, status, headers, config) {
            data = data.slice(2, data.length - 1);
            $('#document-content').html(data);
          })
          .error(function(data, status, headers, config) {
            console.log('error');
          });
   }

   this.getTitle = function() {
     return blogInformation.title;
   }
 }]);
})();
