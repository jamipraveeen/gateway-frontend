import gulp from "gulp";
import project from "../aurelia.json";

export default function copy() {
    return gulp.src(project.copy.src, project.copy.options)
        .pipe(gulp.dest(project.copy.dest));
};
