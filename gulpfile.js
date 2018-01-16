var watchify = require("watchify");
var browserify = require("browserify");
var gulp = require("gulp");
var del = require("del");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var log = require("gulplog");
var sourcemaps = require("gulp-sourcemaps");
var assign = require("lodash.assign");

var swig = require("gulp-swig");
var frontMatter = require("gulp-front-matter");

var sass = require("gulp-sass");
var browserSync = require("browser-sync");
const server = browserSync.create(); // TODO: Disable for production build

// add custom browserify options here
var customOpts = {
  entries: ["./app/js/index.js"],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));
b.on("log", log.info); // output build logs to terminal

// add transformations here
// i.e. b.transform(coffeeify);

gulp.task("clean", function(done) {
  return del(["dist"], done());
});

// Compile swig templates
gulp.task("compile-page", function() {
  return gulp
    .src("./app/**/*.html")
    .pipe(frontMatter({ property: "data" }))
    .pipe(swig({ defaults: { cache: false } }))
    .pipe(gulp.dest("./dist"));
});

// Build css from Sass
gulp.task("sass", function() {
  return gulp
    .src("./app/sass/**/*.scss")
    .pipe(sass.sync().on("error", sass.logError))
    .pipe(gulp.dest("./dist/css"));
});

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: "./dist"
    }
  });
  done();
}

gulp.task("js", bundle); // so you can run `gulp js` to build the file

function bundle() {
  return (
    b
      .bundle()
      // log errors if they happen
      .on("error", log.error.bind(log, "Browserify Error"))
      .pipe(source("bundle.js"))
      // optional, remove if you don't need to buffer file contents
      .pipe(buffer())
      // optional, remove if you dont want sourcemaps
      .pipe(sourcemaps.init({ loadMaps: true })) // loads map from browserify file
      // Add transformation tasks to the pipeline here.
      .pipe(sourcemaps.write("./")) // writes .map file
      .pipe(gulp.dest("./dist"))
  );
}

gulp.task("compile-static", gulp.series("clean", "js", "sass", "compile-page"));

gulp.task("watch-js", function() {
  return gulp.watch("app/js/**/*.js", gulp.series("js", reload));
});

gulp.task("watch-sass", function() {
  return gulp.watch("app/sass/**/*.scss", gulp.series("sass", reload));
});

gulp.task("watch-page", function() {
  return gulp.watch("app/**/*.html", gulp.series("compile-page", reload));
});

gulp.task("watch", gulp.parallel("watch-page", "watch-sass", "watch-js"));

gulp.task("default", gulp.series("compile-static"));

gulp.task("develop", gulp.series("clean", "compile-static", serve, "watch"));
