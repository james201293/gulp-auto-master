//  套件定義
//  在package.json內引用的套件
//  npm install gulp --global

//  gulp / yarn run gulp


const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const gulpCleanCss = require('gulp-clean-css');
const gulpImagemin = require('gulp-imagemin');
//server
const connect = require('gulp-connect');

const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');

//  ============================================================
//          工作 1 建構SASS Compiler
//  ============================================================
const paths={
	html:{
		src:'./*.html',
	},
	styles:{
		src:'./src/styles/index.scss',
		watch:'./src/styles/**/*.scss',
		dest:'build/css'
	},
	images:{
		src:'src/images/*',
		dest:'build/images'
	},
	webfonts:{
		src:'./src/fonts/*',
		dest:'build/font'
	},
}
//const buildAssets= gulp.series(buildHtml,buildScript,buildSass,gulp.parallel(compressImage,webFont));
//const buildVenders= gulp.series(venderJS,gulp.parallel(venderCSS,venderImage));

const buildSass = function(cb){
    console.log('buildSass');
    gulp.src('./src/styles/**/*.scss')
        .pipe(gulpSass())
        .pipe(gulp.dest('build/css'))
        .pipe(connect.reload());
    cb();
}


const compressAppJs = function(cb){
    console.log('compressAppJs');
    gulp.src('./src/app/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
        .pipe(connect.reload());
    cb();
}
// **抓所有子資料夾 
const compressVenderJs = function(cb){
    console.log('compressVenderJs');
    gulp.src('./src/vender/**/*.js')
        .pipe(concat('all.js'))
        //.pipe(uglify())
        .pipe(rename(function(path) {
            path.basename = "venders";
            path.basename += ".min";
            path.extname = ".js";
        }))
        .pipe(gulp.dest('build/js'))
        .pipe(connect.reload());
    cb();
}

const compressVenderCss = function(cb){
    console.log('compressCss');
    gulp.src('./src/vender/**/*.css')
        .pipe(concat('all.css'))
        //.pipe(uglify())
        .pipe(rename(function(path) {
            path.basename = "venders";
            path.basename += ".min";
            path.extname = ".css";
        }))
        .pipe(gulp.dest('build/css'))
        .pipe(connect.reload());
    cb();
}

//不變
const compressImage = async function(cb){
    console.log('compressImage');
    gulp.src('src/images/*')
        .pipe(gulpImagemin())
        .pipe(gulp.dest('build/images'))
        .pipe(connect.reload());
    cb();
}

//不變
const webFont = async function(cb){
    console.log('webFont');
    gulp.src('./src/fonts/*')
        .pipe(gulp.dest('build/fonts/'));
    cb();
}

//不變
const CSSSprite = async function(cb){
    console.log('CSSSprite');
    gulp.src('src/sprite/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css'
    }))
        .pipe(gulp.dest('build'));
    cb();
}



const webServer = async function(){
    console.log('reload');
    connect.server( {
        livereload:true
    });
}



/*
 events: 'add', 'addDir', 'change', 'unlink', 'unlinkDir', 'ready', 'error', 'all
 */


gulp.watch('src/**/*.scss', { events: 'all' }, function(cb){
    console.log('change SASS');
    buildSass(cb);
    cb();
});

gulp.watch('src/images/*', { events: 'all' }, function(cb){
    console.log('compressImage');
    compressImage(cb);
    cb();
});

gulp.watch('./src/fonts/*', { events: 'all' }, function(cb){
    console.log('webFont');
    webFont(cb);
    cb();
});

gulp.watch('src/sprite/*.png', { events: 'all' }, function(cb){
    console.log('CSSSprite');
    CSSSprite(cb);
    cb();
});

//exports.default = buildSass;
exports.default = gulp.series(buildSass, compressAppJs, compressVenderJs, compressVenderCss, compressImage, webFont, CSSSprite, webServer);