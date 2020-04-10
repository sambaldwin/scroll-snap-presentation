var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync").create();
var concat = require("gulp-concat");
let cleanCSS = require("gulp-clean-css");
var gulp = require("gulp");
var nunjucksRender = require("gulp-nunjucks-render");
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");

gulp.task("browserSync", function () {
  browserSync.init({
    server: "./dist/",
    ghostMode: false,
  });
});

gulp.task("fonts", function () {
  return gulp
    .src(["./src/fonts/**/*", "!./src/fonts/.gitkeep"])
    .pipe(gulp.dest("./dist/fonts/"));
});

gulp.task("js", function () {
  return gulp
    .src("./src/js/scripts.js")
    .pipe(concat("scripts.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./dist/"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

gulp.task("nunjucks", function () {
  return gulp
    .src([
      "./src/njk/**/*.njk",
      "!./src/njk/**/_*.njk",
      "!./src/njk/**/_*/**/*.njk",
    ])
    .pipe(
      nunjucksRender({
        path: ["./src/njk/"],
        ext: ".html",
      })
    )
    .pipe(gulp.dest("./dist/"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

gulp.task("sass", function () {
  return gulp
    .src(["./src/css/**/main.scss"])
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(concat("main.css"))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./dist/"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

gulp.task("default", gulp.series(["fonts", "js", "nunjucks", "sass"]));

gulp.task(
  "watch",
  gulp.parallel(["default", "browserSync"], function () {
    gulp.watch("./src/js/**/*.js", gulp.parallel("js"));
    gulp.watch("./src/njk/**/*.njk", gulp.parallel("nunjucks"));
    gulp.watch("./src/css/**/*.scss", gulp.parallel("sass"));
  })
);
