var gulp = require('gulp');

gulp.task('bootstrap', function(){
	gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css');
	.pipe(gulp.dest('./public/stylesheets'));

	gulp.src('./node_modules/bootstrap/dist/fonts/*');
	.pipe(gulp.dest('./public/fonts'));

	gulp.src('./node_modules/bootstrap/dist/js/bootstrap.min.js');
	.pipe(gulp.dest('./public/javascripts'));
});
