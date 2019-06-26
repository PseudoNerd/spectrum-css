/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const gulp = require('gulp');
const fs = require('fs');
const del = require('del');

gulp.task('clean', function() {
  return del('dist/*');
});

gulp.task('build-prepare', function(cb) {
  var dir = 'dist';
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  cb();
});

// Builds a list of unique variables from DNA for each theme and scale.
gulp.task('build-vars', function(cb) {
  let vars = require('./');
  for (let theme in vars.themes) {
    fs.writeFileSync(`dist/spectrum-${theme}.css`, vars.generate(theme, vars.themes[theme]));
  }

  for (let scale in vars.scales) {
    fs.writeFileSync(`dist/spectrum-${scale}.css`, vars.generate(scale, vars.scales[scale]));
  }

  cb();
});

gulp.task('copy-metadata', function() {
  return gulp.src('vars/spectrum-metadata.json')
    .pipe(gulp.dest('dist/'))
});

gulp.task('build',
  gulp.series('clean', 'build-prepare',
    gulp.parallel(
      'build-vars',
      'copy-metadata'
    )
  )
);

gulp.task('default', gulp.series('build'));