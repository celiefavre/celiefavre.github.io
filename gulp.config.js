/**
 * Created by ndevaux on 17/06/15.
 */
module.exports = function() {
    var config = {
        // css
        sass: [
            './_sass/**/*.scss'
        ],
        // all js to vet
        alljs: [
            './src/**/*.js',
            './*.js'
        ],
        css: './css'
    };
    return config;
};