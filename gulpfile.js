// Base gulpfile for Front-End Development
// Working node v14.6.0
// "gulp" basic command

var gulp = require('gulp'),
		path = require('path'),
		del = require('del'),
		browsersync = require('browser-sync').create(),
		sass = require('gulp-sass'),
		sassGlob = require('gulp-sass-glob'),
		autoprefixer = require('autoprefixer'),
		pxtorem = require('postcss-pxtorem'),
		cssnano = require('cssnano'),
		postcss = require("gulp-postcss"),
		emMediaQuery = require("postcss-em-media-query"),
		replace = require('gulp-string-replace'),
		newer = require('gulp-newer'),
		tinypng = require("gulp-tinypng-compress"),
		svgo = require("gulp-svgo"),
		uglify = require('gulp-uglify'),
		include = require('gulp-include'),
		sourcemaps = require("gulp-sourcemaps"),
		inject = require('gulp-inject'),
    purgecss = require('@fullhuman/postcss-purgecss'),
    htmlbeautify = require("gulp-html-beautify"),
    mqpacker = require("css-mqpacker"),
    data = require('gulp-data'),
    jsonMerger = require("json-merger"),
    fs = require('fs-extra'),
    twig = require('gulp-twig'),
    glob = require("glob"),
    plumber = require('gulp-plumber');

// Datestamp for cache bursting
var getStamp = function() {
  var myDate = new Date();
  var myYear = myDate.getFullYear().toString();
  var myMonth = ('0' + (myDate.getMonth() + 1)).slice(-2);
  var myDay = ('0' + myDate.getDate()).slice(-2);
  var mySeconds = myDate.getSeconds().toString();
	var myRandom = Math.floor(Math.random()*100);
  var myFullDate = myYear + myMonth + myDay + mySeconds + myRandom;
  return myFullDate;
};
var cacheBursting = getStamp();

//BrowserSync
function browserSync(done) {
  browsersync.init({
		server: {
			baseDir: './build'
		},
		notify: {
			styles: {
				top: '0',
				right: '0',
				bottom: 'auto',
				left: 'auto',
				margin: '0px',
				padding: '10px',
				position: 'fixed',
				fontSize: '16px',
				zIndex: '9999',
				borderRadius: '0px',
				color: 'white',
				textAlign: 'center',
				display: 'block',
				backgroundColor: 'rgba(60, 197, 31, 0.5)'
			}
		}//,
		//tunnel: true
  });
  done();
};
//BrowserSyncReload
function browserSyncReload(done) {
  browsersync.stream();
  done();
}
//CSS
function css() {
	return gulp
		.src('./src/scss/styles.scss')
		.pipe(sassGlob())
		//.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(
			postcss([
				emMediaQuery({
					precision: 3
				}),
				autoprefixer({
					overrideBrowserslist: [
						"last 1 versions",
						"not ie > 0",
						"not ie_mob > 0"
					]
				}),
				//cssnano(),
				/*purgecss({
          content: ['build/!(index)*.html', 'build/js/*.js', 'node_modules/bootstrap/dist/js/bootstrap.bundle.js']
				}),*/
				pxtorem({
					rootValue: 16,
					propList: ['*'],
					selectorBlackList: [/^body$/]
				}),
        mqpacker({
          sort: true
        })
			])
		)
		//.pipe(sourcemaps.write("."))
		.pipe(gulp.dest('./build/css'))
		.pipe(browsersync.stream());
};
//CSS print
function cssPrint() {
	return gulp
		.src('./src/scss/prints.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(
			postcss([
				cssnano()
			])
		)
		.pipe(gulp.dest('./build/css'));
};
//Scripts
function scripts() {
	return gulp
		.src('src/js/scripts.js').on('error', console.log)
		.pipe(include())
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest('build/js'))
		.pipe(browsersync.stream());
};
//Twig templates
function twigTemplates() {
  initMergeDataJson();
  return gulp.src(['src/layouts/*.twig'])
  .pipe(plumber({
    handleError: function (err) {
      console.log(err);
      this.emit('end');
    }
  }))
    .pipe(data(function () {
      return JSON.parse(fs.readFileSync("src/data.json"))
  }))
    .pipe(twig({
      namespaces: {
        "components": "src/components",
        "images": "build/images/ico"
      }
    }))
    .on('error', function (err) {
      process.stderr.write(err.message + '\n');
      this.emit('end');
    })
  .pipe(gulp.dest("./build"));
};
//JSON
function initMergeDataJson() {
  var jsonFiles = glob.sync("src/components/**/*.json");
  jsonFiles.concat("src/data.json");
	for (const file of jsonFiles) {
		let stats = fs.statSync(file);
		if (stats["size"] === 0) {
			jsonFiles.splice(jsonFiles.indexOf(file), 1);
		}
	}
	var dataJson = jsonMerger.mergeFiles(jsonFiles);
	fs.writeFileSync("src/data.json", JSON.stringify(dataJson, null, 2));
}
//Index inject
function indexInject() {
	return gulp
		.src('src/layouts/index.html')
	  .pipe(inject(
	    gulp.src(['build/*.html', '!build/index.html'], { read: false }), {
	      transform: function (filepath) {
					filepathFilter = filepath.replace('/build/', '');
	        if (filepathFilter.slice(-5) === '.html') {
	          return '<li class="list-group-item"><a class="btn btn-link" href="' + filepathFilter + '">' + filepathFilter + '</a></li>';
	        }
	        // Use the default transform as fallback:
	        return inject.transform.apply(inject.transform, arguments);
	      }
	    }
	  ))
	  .pipe(gulp.dest('build/'));
};
//CSS versions
function cssVersions() {
	cacheBursting = getStamp();
	return gulp
		.src(["./src/components/base/base.twig"])
		.pipe(replace(/styles.css\?v=([0-9]*)/g, 'styles.css?v=' + cacheBursting))
		.pipe(replace(/prints.css\?v=([0-9]*)/g, 'prints.css?v=' + cacheBursting))
    .pipe(gulp.dest('./src/components/base/'));
};
//JS versions
function jsVersions() {
	cacheBursting = getStamp();
	return gulp
		.src(["./src/components/base/base.twig"])
    	.pipe(replace(/scripts.js\?v=([0-9]*)/g, 'scripts.js?v=' + cacheBursting))
    	.pipe(gulp.dest('./src/components/base/'));
};
//tinyPNG
function tinyPngImages() {
	return gulp
		.src("src/images/**/*.{png,jpg}")
		.pipe(newer("build/images"))
		.pipe(tinypng("TxfNGcX16DhFDBxds3lgjhSQ5TChHWw9"))
    .pipe(gulp.dest("build/images"));
};
function tinyPngImagesFavicon() {
	return gulp
		.src("src/favicon/*.{png,jpg}")
		.pipe(newer("build/favicon"))
		.pipe(tinypng("TxfNGcX16DhFDBxds3lgjhSQ5TChHWw9"))
    .pipe(gulp.dest("build/favicon"));
};
//SVG
function svgMin() {
	return gulp
		.src("src/images/**/*.svg")
		.pipe(newer("build/images"))
		.pipe(
			svgo({
				plugins: [{
						removeViewBox: false
					},
					{
						cleanupNumericValues: {
							floatPrecision: 2
						}
					}
				]
			})
		)
    .pipe(gulp.dest("build/images/"));
};
function svgMinFavicon() {
	return gulp
		.src("src/favicon/*.svg")
		.pipe(newer("build/favicon"))
		.pipe(
			svgo({
				plugins: [{
						removeViewBox: false
					},
					{
						cleanupNumericValues: {
							floatPrecision: 2
						}
					}
				]
			})
		)
    .pipe(gulp.dest("build/favicon/"));
};
//Favicons other files
function faviconsFiles() {
	return gulp
		.src(["src/favicon/*", "!src/favicon/*.{png,jpg,svg}"])
    .pipe(gulp.dest('build/favicon/'));
};
//Copy fonts
function copyFonts() {
	return gulp
		.src('src/fonts/**')
    .pipe(gulp.dest('build/fonts/'));
};
//HTML beauty
function htmlBeauty() {
	var options = {
		max_preserve_newlines: 1,
		indentSize: 2,
		indent_with_tabs: true,
	};
	return gulp.src('build/' + '*.html')
		.pipe(htmlbeautify(options))
		.pipe(gulp.dest('build/'))
		.pipe(browsersync.stream());
}
//Watch files
function watchFiles() {
  gulp.watch(['src/scss/**/*.scss', 'src/components/**/*.scss'], gulp.series(css, cssVersions, cssPrint));
	gulp.watch(['src/js/**/*.js', 'src/components/**/*.js'], gulp.series(scripts, jsVersions, css, cssVersions));
	gulp.watch(['src/layouts/*.twig', 'src/components/**/*.{twig,json}'], gulp.series(twigTemplates, htmlBeauty, css, cssVersions));
	gulp.watch(['src/layouts/*.twig'], indexInject);
	gulp.watch(
    ['build/css/*.css', 'build/*.html', 'build/js/*.js'],
    gulp.series(browserSyncReload)
  );
  gulp.watch('src/images/**/*.{png,jpg}', gulp.series(tinyPngImages)).on('unlink', function (filepath) {
    var filePathFromSrc = path.relative(path.resolve('src/images'), filepath);
    var destFilePath = path.resolve('build/images', filePathFromSrc);
	  del.sync(destFilePath);
  });
	gulp.watch('src/images/**/*.svg', svgMin).on('unlink', function (filepath) {
    var filePathFromSrc = path.relative(path.resolve('src/images'), filepath);
    var destFilePath = path.resolve('build/images', filePathFromSrc);
		del.sync(destFilePath);
  });
  gulp.watch('src/favicon/*.{png,jpg}', tinyPngImagesFavicon).on('unlink', function (filepath) {
    var filePathFromSrc = path.relative(path.resolve('src/favicon'), filepath);
    var destFilePath = path.resolve('build/favicon', filePathFromSrc);
		del.sync(destFilePath);
  });
  gulp.watch(["src/favicon/*", "!src/favicon/*.{png,jpg,svg}"], faviconsFiles).on('unlink', function (filepath) {
    var filePathFromSrc = path.relative(path.resolve('src/favicon'), filepath);
    var destFilePath = path.resolve('build/favicon', filePathFromSrc);
		del.sync(destFilePath);
  });
  gulp.watch('src/favicon/*.svg', svgMinFavicon).on('unlink', function (filepath) {
    var filePathFromSrc = path.relative(path.resolve('src/favicon'), filepath);
    var destFilePath = path.resolve('build/favicon', filePathFromSrc);
		del.sync(destFilePath);
  });
	gulp.watch('src/fonts/**', copyFonts).on('unlink', function (filepath) {
    var filePathFromSrc = path.relative(path.resolve('src/fonts'), filepath);
    var destFilePath = path.resolve('build/fonts', filePathFromSrc);
		del.sync(destFilePath);
  });
};
//Clean build
function clean() {
	return del('build/**', {force:true});
}
//Tasks
gulp.task(
  'default',
  gulp.series(
    gulp.parallel(
      gulp.series(
        css, cssVersions, cssPrint
      ),
      gulp.series(
        scripts, jsVersions
      ),
      gulp.series(
        twigTemplates, htmlBeauty, indexInject
      )
    ),
    gulp.parallel(
      watchFiles, browserSync
    )
  )
);
gulp.task(
  'build',
  gulp.series(
		clean,
    gulp.parallel(
      gulp.series(
        css, cssPrint
      ),
      gulp.series(
        scripts
      ),
      gulp.series(
        twigTemplates, htmlBeauty, indexInject
      )
    ),
		tinyPngImages, svgMin, tinyPngImagesFavicon, faviconsFiles, svgMinFavicon, copyFonts
  )
);
gulp.task(
  'build-svg',
  gulp.series(
		svgMin
  )
);
