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

//  ============================================================
//          工作 1 建構SASS Compiler
//  ============================================================


const buildSass = function(cb){
    console.log('buildSass');
    gulp.src('./src/styles/index.scss')
        .pipe(gulpSass())
        .pipe(gulp.dest('build/'))
        .pipe(connect.reload());
    cb();
}

const compressImage = async function(cb){
    console.log('compressImage');
    gulp.src('src/images/*')
        .pipe(gulpImagemin())
        .pipe(gulp.dest('build/images'));
    cb();
}

const webFont = async function(cb){
    console.log('webFont');
    gulp.src('./src/fonts/*')
        .pipe(gulp.dest('build/fonts/'));
    cb();
}

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
exports.default = gulp.series(buildSass, compressImage, webFont, CSSSprite, webServer);