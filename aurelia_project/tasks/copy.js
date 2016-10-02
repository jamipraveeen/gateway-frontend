import gulp from "gulp";
import project from "../aurelia.json";

function copyModules() {
    return gulp.src(project.copy.modules.src, project.copy.modules.options)
        .pipe(gulp.dest(project.copy.modules.dest));
}

function copySrc() {
    return gulp.src(project.copy.src.src, project.copy.src.options)
        .pipe(gulp.dest(project.copy.src.dest))
}

export default gulp.series(
    copyModules,
    copySrc
);
