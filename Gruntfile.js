module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
	  	pkg: grunt.file.readJSON('package.json'),
		ngmin: {
		  	controllers: {
			    src: [
			    		'app/app.js',
			    		'app/Global.js',
			    		'app/Translate.js',
			    		'app/Module/Auth.js',
			    		'app/Module/Brand.js',
			    		'app/Module/Country.js',
			    		'app/Module/Delete.js',
			    		'app/Module/Department.js',
			    		'app/Module/Form.js',
			    		'app/Module/Home.js',
			    		'app/Module/Job.js',
			    		'app/Module/Login.js',
			    		'app/Module/Navigation.js',
			    		'app/Module/Organization.js',
			    		'app/Module/People.js',
			    		'app/Module/ChangePassword.js',
			    		'app/Module/Location.js',
			    		'app/Module/WorkTime.js',
			    		'app/Module/WorkPlace.js',
			    		'app/Module/MaritalStatus.js',
			    		'app/Module/Team.js',
			    		'app/Module/Get.js',
			    		'app/Module/Document.js',
			    		'app/Module/Payroll.js',
			    		'app/Module/Holiday.js',
			    		'app/Module/PeopleCategory.js',
			    		'app/Module/Payment.js'
			    	],
			    dest: 'app/Evermanage.js'
		  	}
		}
	});

	grunt.loadNpmTasks('grunt-ngmin');

};