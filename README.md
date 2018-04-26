# HMLVaraus frontend
This repository contains a single page web application for berth reservations for city of Hämeenlinna.

## Technologies
HMLVaraus frontend is mainly built with Backbone and Marionette Javascript frameworks. Backbone + Marionette gives the structure for the JS application. Also following libraries have been used:
* jQuery
* Underscore
* Backbone-radio
* Json2
* Bootstrap
* Moment
* Bootstrap-datepicker
* Bootbox
* Leaflet
* Require

## Building
This repository also contains build.py Python script which uses RequireJS's minifying tool to minify JS and CSS files and combine each to a single file. After that the script changes stylesheet and JS urls in index.html to correspond filenames of  previously created files. Filenames are md5 hashes of the file content to bust the browser cache after updates. The script also copies all other static files to "frontend-built" repository folder. The script excepts built repos directory to be located one directory above this repository. Script is only Python 2 compatible and it required NodeJS to minify and combine JS and CSS files.
