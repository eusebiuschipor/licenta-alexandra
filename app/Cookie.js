function Cookie() { };

Cookie.setCookie = function(name, value, miliseconds) {
	var date = new Date();
	date.setTime(date.getTime() + (miliseconds * 1000));
	var expires = '; expires=' + date.toGMTString();
	document.cookie = name + '=' + value + expires + '; path=/';
}

Cookie.readCookie = function(name) {
	name += '=';
	for (var ca = document.cookie.split(/;\s*/), i = ca.length - 1; i >= 0; i--) {
		if (!ca[i].indexOf(name)) {
			return ca[i].replace(name, '');
		}
	}
}