var gulp = require('gulp'),
    rimraf = require('gulp-rimraf'),
    inlineNg2Styles = require('gulp-inline-ng2-styles'),
    ts = require('gulp-typescript'),
    merge = require('merge2'),
    inlineNg2Template = require('gulp-inline-ng2-template'),
    tslint = require("gulp-tslint");

//build index file
function buildIndex() {
    var tsProject = ts.createProject('tsconfig.json', { declaration: true });

    tsResult = gulp.src(['./index.ts'])
        .pipe(tslint({
            formatter: "prose"
        }))
        .pipe(tslint.report({
            summarizeFailureOutput: true,
            configuration: "./tslint.json"
        }))
        .pipe(tsProject());

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done. 
        tsResult.dts.pipe(gulp.dest('./')),
        tsResult.js.pipe(gulp.dest('./'))
    ]);
}

//build components by folders
function buildComponent(componentPath, subPath) {
    return function () {
        var baseSrcPath = "./src" + (subPath || ''), baseLibPath = "./lib" + (subPath || '');

        var tsProject = ts.createProject('tsconfig.json', { declaration: true });

        if (componentPath) {
            baseSrcPath += "/" + (componentPath || '');
            baseLibPath += "/" + (componentPath || '');
        }

        tsResult = gulp.src([baseSrcPath + '/*.ts', '!' + baseSrcPath + '/*.spec.ts'])
            .pipe(tslint({
                formatter: "prose"
            }))
            .pipe(tslint.report({
                summarizeFailureOutput: true,
                configuration: "./tslint.json"
            }))
            .pipe(inlineNg2Template({ base: baseSrcPath }))
            .pipe(inlineNg2Styles({ base: baseSrcPath }))
            .pipe(tsProject());

        return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done. 
            tsResult.dts.pipe(gulp.dest(baseLibPath)),
            tsResult.js.pipe(gulp.dest(baseLibPath))
        ]);
    }
}

gulp.task('buildAGroupFor', buildComponent('aGroupFor'));

gulp.task("buildRoot", ['buildAGroupFor'], buildComponent());

gulp.task('buildIndex', ['buildRoot'], buildIndex)

gulp.task('cleanLib', function () {
    return gulp.src('./lib')
        .pipe(rimraf());
});

gulp.task('build', ['buildIndex']);