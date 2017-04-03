var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var watch = require('gulp-watch');
 
gulp.task('stream', function () {
    // Endless stream mode 
    return watch('./**/**', { ignoreInitial: false })
        .pipe(gulp.dest('build'));
});
 
gulp.task('callback', function () {
    // Callback mode, useful if any plugin in the pipeline depends on the `end`/`flush` event 
    return watch('./**/**', function () {
        gulp.src('./**/**')
            .pipe(gulp.dest('build'));
    });
});

gulp.task('bootstrap', function(){
	console.log(path.join(__dirname));
	
	gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
	.pipe(gulp.dest('./public/stylesheets'));

	gulp.src('./node_modules/bootstrap/dist/fonts/*')
	.pipe(gulp.dest('./public/fonts'));

	gulp.src('./node_modules/bootstrap/dist/js/bootstrap.min.js')
	.pipe(gulp.dest('./public/javascripts'));

});

gulp.task('less', function () {
	return gulp.src('./less/*.less')
	.pipe(less())
	.pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('watch', function(){
	gulp.watch('./**/**');
})

gulp.task('default', ['bootstrap', 'less', 'stream', 'callback']);

