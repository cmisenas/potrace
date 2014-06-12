POTRACE
=======

Potrace is an algorithm to convert bitmap image to vector. This implementation is written in JS and uses node.js and HTML5 canvas.

This is a **WORK IN PROGRESS**.

Steps
* [x] Find all vertices in the image 
* [x] Find all paths from the vertices
* [x] Determine which vertices in a path is straight
* [ ] Calculate the optimal polygon by assigning penalties for each possible one
* [ ] Smooth corners by calculating the bezier curves
* [x] Create SVG elements (path) for each straight line path generated
