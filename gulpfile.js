var gulp       = require('gulp'), // Подключаем Gulp
	sass         = require('gulp-sass'), //Подключаем Sass пакет,
	browserSync  = require('browser-sync'), // Подключаем Browser Sync
	concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
	uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
	cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
	rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
	del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
	imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
	pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
	cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
	autoprefixer = require('gulp-autoprefixer'), // Подключаем библиотеку для автоматического добавления префиксов
	filter		 = require('gulp-filter'), // Подключаем Filter
	jade		 = require('gulp-jade'); // Подключаем Jade пакет

gulp.task('sass', function(){ // Создаем таск Sass
	return gulp.src('src/sass/**/*.sass') // Берем источник
		.pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
		.pipe(gulp.dest('src/css')) // Выгружаем результата в папку src/css
		.pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
	browserSync({ // Выполняем browserSync
		server: { // Определяем параметры сервера
			baseDir: 'src' // Директория для сервера - src
		},
		notify: false // Отключаем уведомления
	});
});

gulp.task('scripts', function() {
	return gulp.src([ // Берем все необходимые библиотеки
		'src/libs/jquery/dist/jquery.min.js', // Берем jQuery
		])
		.pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest('src/js')); // Выгружаем в папку src/js
});

gulp.task('jade', function() {
    return gulp.src('src/html/**/*.jade')
        .pipe(jade({
        	pretty: true
	    }))
        .pipe(gulp.dest('src')) // указываем gulp куда положить скомпилированные HTML файлы
        .pipe(browserSync.reload({stream: true})); // Обновляем HTML на странице при изменении
});

gulp.task('watch', ['browser-sync', 'scripts'], function() {
	gulp.watch('src/sass/**/*.sass', ['sass']); // Наблюдение за sass файлами в папке sass
	gulp.watch('src/html/**/*.jade', ['jade']); // Наблюдение за Jade файлами в папке html
	gulp.watch('src/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
});

gulp.task('clean', function() {
	return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('build', ['clean', 'sass', 'scripts', 'jade'], function() {

	var buldImg = gulp.src('src/img/**/*') // Переносим изображения в продакшен
	.pipe(gulp.dest('dist/img'));

	var buildCss = gulp.src([ // Переносим библиотеки в продакшен
		'src/css/main.css',
		])
	.pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src('src/js/**/*') // Переносим скрипты в продакшен
	.pipe(gulp.dest('dist/js'));

	var buildHtml = gulp.src('src/*.html') // Переносим HTML в продакшен
	.pipe(gulp.dest('dist'));

});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('default', ['watch']);
