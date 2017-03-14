var gulp = require('gulp');

gulp.task('bootstrap', function(){
	console.log('bootstrap');
	gulp.src('./node_modules/bootstrap/**/*')
	.pipe(gulp.dest('./bootstrap'));
});