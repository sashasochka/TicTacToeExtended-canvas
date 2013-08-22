
var stage = new Kinetic.Stage({
  container: 'container',
  width: 578,
  height: 200
});

var layer = new Kinetic.Layer();

var redLine = new Kinetic.Line({
  points: [73, 70, 340, 23, 450, 60, 500, 20],
  stroke: 'red',
  strokeWidth: 15,
  lineCap: 'round',
  lineJoin: 'round'
});

// dashed line
var greenLine = new Kinetic.Line({
  points: [73, 70, 340, 23, 450, 60, 500, 20],
  stroke: 'green',
  strokeWidth: 2,
  lineJoin: 'round',

/*
   * line segments with a length of 33px
   * with a gap of 10px
   */

  dashArray: [33, 10]
});

// complex dashed and dotted line
var blueLine = new Kinetic.Line({
  points: [73, 70, 340, 23, 450, 60, 500, 20],
  stroke: 'blue',
  strokeWidth: 10,
  lineCap: 'round',
  lineJoin: 'round',

/*
   * line segments with a length of 29px with a gap
   * of 20px followed by a line segment of 0.001px (a dot)
   * followed by a gap of 20px
   */

  dashArray: [29, 20, 0.001, 20]
});


/*
* since each line has the same point array, we can
* adjust the position of each one using the
* move() method
*/

redLine.move(0, 5);
greenLine.move(0, 55);
blueLine.move(0, 105);

layer.add(redLine);
layer.add(greenLine);
layer.add(blueLine);
stage.add(layer);
