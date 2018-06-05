(function() {
    var app = angular.module('Post', []);

    app.service('PostService', ['$http', '$window', 'Form', 'Http', function ($http, $window, Form, Http) {
        var dataObject = null;

        this.like = function(postId) {
            dataObject = {
                postId: postId,
                userId: $window.sessionStorage['peopleId']
            };

            Http.post(Global.likePost, dataObject);
        };

        this.dislike = function(postId) {
            dataObject = {
                postId: postId,
                userId: $window.sessionStorage['peopleId']
            };

            Http.post(Global.dislikePost, dataObject);
        };

        this.unlike = function(postId) {
            dataObject = {
                postId: postId,
                userId: $window.sessionStorage['peopleId']
            };

            Http.post(Global.unlikePost, dataObject);
        };
    }]);

    app.service('GetAllPosts', ['$http', '$window', 'Form', function ($http, $window, Form) {
        var postsList = null,
            responsePromise = null,
            self = this;

        this.postLiked = function(userId, likesArray) {
            var liked = false;

            for (var i = 0; i < likesArray.length && !liked; i++) {
                if (userId == likesArray[i]) {
                    liked = true;
                }
            }

            return liked;
        }

        this.get = function(callback, limit, offset) {
            var post = null,
                likesString = null,
                likesArray = null,
                dataObject = {
                    organizationId: $window.sessionStorage['organizationId'],
                    limit: limit || 99999,
                    offset: offset || 0
                };

            responsePromise = $http.post(Global.getOrganizationPosts, dataObject, {});
            responsePromise.success(function(data, status, headers, config) {
                postsList = new Array();

                for (var i = 0; i < data.length; i++) {
                    var post = new Object();
                    post.id = data[i]['posts']['id'];
                    post.authorFirstName = data[i]['people']['first_name'];
                    post.authorLastName = data[i]['people']['last_name'];
                    post.authorPhoto = data[i]['people']['photo'] != '' ? data[i]['people']['photo'] : Global.peopleDefaultImageName;
                    post.content = data[i]['posts']['content'];
                    post.date = data[i]['posts']['date'];
                    post.file = data[i]['posts']['file'];
                    post.authorId = data[i]['people']['id'];
                    post.haveImage = Form.isImage(data[i]['posts']['file']);
                    post.haveAttachement = Form.isAttachement(data[i]['posts']['file']);
                    post.displayContent = 'display-content';

                    likesString = data[i]['posts']['likes'];
                    likesArray = likesString.split(',');
                    post.likesNumber = likesArray.length - 1;
                    post.likedByThisUser = self.postLiked($window.sessionStorage['peopleId'], likesArray);

                    if (!post.haveAttachement) {
                        post.displayContent = 'not-display-content';
                    }

                    postsList.push(post);
                }

                callback();
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        this.getPostsList = function() {
            return postsList;
        }
    }]);

    app.controller('AddPostController', ['$scope', '$http', '$window', '$location', '$routeParams', '$window', '$route', 'Form', 'Auth', function($scope, $http, $window, $location, $routeParams, $window, $route, Form, Auth) {
        var self = this,
            dataObject = null,
            responsePromise = null,
            postId = $routeParams.postId,
            fileForUpload = null;

        this.addPostForm = {};

        $scope.haveImage = false;
        $scope.haveAttachement = false;
        $scope.postImageSrc = Global.postImageSrc;
        $scope.postFile = null;

        this.submitTheForm = function() {
            fileForUpload = Form.uploadPhoto(self.addPostForm.file, Global.uploadPostFile, new Date().getTime()) || $scope.postFile;

            dataObject = {
                id: postId,
                author: $window.sessionStorage['peopleId'],
                content: self.addPostForm.content,
                file: fileForUpload || '',
                organizationId: $window.sessionStorage['organizationId']
            };

            responsePromise = $http.post(Global.addPost, dataObject, {});
            responsePromise.success(function(dataFromServer, status, headers, config) {
                $route.reload();
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        this.getPostInformation = function() {
            $http.get(Global.getPostInformation + postId)
                .success(function(data, status, headers, config) {
                    self.addPostForm.content = data[0]['posts']['content'];
                    $scope.postFile = data[0]['posts']['file'];
                    $scope.haveImage = Form.isImage(data[0]['posts']['file']);
                    $scope.haveAttachement = Form.isAttachement(data[0]['posts']['file']);
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }

        this.deleteImageAndAttachement = function() {
            $scope.haveImage = false;
            $scope.haveAttachement = false;
            $scope.postFile = null;
        }

        this.isLoggedInAsOrganization = Auth.isLoggedInAsOrganization;
    }]);

    app.controller('PostsListController', ['$scope', '$http', '$window', '$location', 'GetAllPosts', 'Form', 'PostService', 'Http', 'PopupMessage', 'GrayBox', 'Auth', function($scope, $http, $window, $location, GetAllPosts, Form, PostService, Http, PopupMessage, GrayBox, Auth) {
        var posts = new Array(),
            offset = 0,
            self = this,
            newPostsList = null;

        $scope.authorImageSrc = Global.peopleImageSrc;
        $scope.postImageSrc = Global.postImageSrc;
        $scope.peopleId = $window.sessionStorage['peopleId'];
        $scope.postsLoaded = false;

        this.getPostsList = function() {
            return posts;
        }

        this.callbackGetPostsList = function() {
            newPostsList = null;

            if (posts.length == 0) {
                posts = GetAllPosts.getPostsList();
            } else {
                newPostsList = GetAllPosts.getPostsList();

                for (var i = 0; i < newPostsList.length; i++) {
                    posts.push(newPostsList[i]);
                }
            }

            $scope.postsLoaded = true;
        }

        this.deletePost = function(postId) {
            dataObject = {
                id: postId
            }

            Form.sendDataToServer(Global.deletePost, dataObject);
        }

        this.like = function(postId) {
            // add like in backend
            PostService.like(postId);

            // update the likes number for this post in front-end
            for (var i = 0, iLen = posts.length; i < iLen; i++) {
                if (posts[i].id == postId) {
                    posts[i].likesNumber++;
                    posts[i].likedByThisUser = true;
                }
            }
        }

        this.unlike = function(postId) {
            // remove like in backend
            PostService.unlike(postId);

            // update the likes number for this post in front-end
            for (var i = 0, iLen = posts.length; i < iLen; i++) {
                if (posts[i].id == postId) {
                    posts[i].likesNumber--;
                    posts[i].likedByThisUser = false;
                }
            }
        }

        this.dislike = function(postId) {
            PostService.dislike(postId);
        }

        this.getPeopleWhoLikedThisPost = function(postId) {
            $http.get(Global.getPeopleWhoLikedAPost + postId)
                .success(function(data, status, headers, config) {
                    var popupContent = '',
                        peopleRow = null;

                    for (var i = 0, iLen = data.length; i < iLen; i++) {
                        peopleRow = '<a href="' + Global.peopleDescription + data[i]['id'] + '">' +
                                        '<div class="people-row">' +
                                            '<div class="image">' +
                                                '<img src="' + Global.peopleImageSrc + (data[i]['photo'] != '' ? data[i]['photo'] : Global.peopleDefaultImageName) + '" class="popup-people-image" />' +
                                            '</div>' +
                                            '<div>' + data[i]['first_name'] + ' ' + data[i]['last_name'] + '</div>' +
                                        '</div>' +
                                    '</a>';

                        popupContent += peopleRow;
                    }

                    PopupMessage.showPopupMessage(data.length + ' likes', popupContent);
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }

        this.showGrayBox = GrayBox.show;
        this.isLoggedInAsOrganization = Auth.isLoggedInAsOrganization;

        $window.onscroll = function() {
            if (($(window).scrollTop() + $(window).height() >= $(document).height() - 10) && $location.path() == Global.showPostsRoute) {
                GetAllPosts.get(self.callbackGetPostsList, Global.infiniteScrollLimit, offset += Global.infiniteScrollLimit);
            }
        }

        GetAllPosts.get(this.callbackGetPostsList, Global.infiniteScrollLimit, offset);
    }]);

    app.controller('PostDescription', ['$scope', '$http', '$window', '$location', '$routeParams', 'Form', 'PostService', function($scope, $http, $window, $location, $routeParams, Form, PostService) {
        var postId = $routeParams.postId,
            fileExtension = null;

        $scope.postImageSrc = Global.postImageSrc;
        $scope.postInformation = {};
        $scope.haveImage = false;
        $scope.haveAttachement = false;
        $scope.contentClass = 'post-description-content';

        this.getPostInformation = function() {
            $http.get(Global.getPostInformation + postId)
                .success(function(data, status, headers, config) {
                    $scope.postInformation.firstName = data[0]['people']['first_name'];
                    $scope.postInformation.lastName = data[0]['people']['last_name'];
                    $scope.postInformation.content = data[0]['posts']['content'];
                    $scope.postInformation.date = data[0]['posts']['date'];
                    $scope.postInformation.file = data[0]['posts']['file'];

                    $scope.haveImage = Form.isImage($scope.postInformation.file);
                    $scope.haveAttachement = Form.isAttachement($scope.postInformation.file);

                    if (!$scope.haveImage && !$scope.haveAttachement) {
                        $scope.contentClass += ' content-without-file';
                    }
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }

        this.like = function(postId) {
            PostService.like(postId);
        };

        this.unlike = function(postId) {
            PostService.unlike(postId);
        };

        this.dislike = function(postId) {
            PostService.dislike(postId);
        };
    }]);
})();
