var
	nodes = [],
	nodesCount = 50,
	canvasSize = 700,
	gridBuilder = document.body.classList.contains('grid-builder'),
	gridBuilderErase = false,
	aStar,
	start_bubble = '#0366d6',
	end_bubble = '#0366d6',
	path_bubble = '#99d6ff',
	side_bubble = '#0366d6',
	path_line = '#0366d6',
	box_color = '#f2f2f2';

function setup() {
	var canvas = createCanvas(canvasSize, canvasSize);
	Node.radius = Math.floor(canvasSize / (nodesCount + 1));
	for (var i = 0; i < nodesCount; i++) {
		if (!nodes[i]) {
			nodes[i] = [];
		}
		for (var j = 0; j < nodesCount; j++) {
			nodes[i][j] = new Node(i, j);
		}
	}
	aStar = new AStar(nodes, nodes[0][0], nodes[nodesCount - 1][nodesCount - 1]);
}

function draw() {
	background(box_color);
	strokeWeight(2);
	stroke('#000000');
	noFill();
	rect(25, 25, 650, 650);
	strokeWeight(Node.radius * .9);
	if (gridBuilder) {
		drawGridBuilder();
	} else {
		drawAlgo();
	}
}

function drawGridBuilder() {
	var xy;
	for (i = 0; i < nodesCount; i++) {
		for (j = 0; j < nodesCount; j++) {
			xy = nodes[i][j].coords();
			if (nodes[i][j].blocked) {
				nodes[i][j].show(color(0, 0, 0));
			}
			if (mouseIsPressed) {
				if (
					Math.abs(mouseX - xy[0]) < 7 &&
					Math.abs(mouseY - xy[1]) < 7
				) {
					nodes[i][j].blocked = !gridBuilderErase;
				}
			}
		}
	}
	aStar.start.show(start_bubble);
	aStar.end.show(end_bubble);
}

function drawAlgo() {
	var i, j, coords, message;
	if (!message) {
		message = aStar.iterate();
	}
	for (i = 0; i < aStar.openSet.length; i++) {
		aStar.openSet[i].show(side_bubble);
	}
	for (i = 0; i < aStar.closedSet.length; i++) {
		aStar.closedSet[i].show(path_bubble);
	}
	for (i = 0; i < nodesCount; i++) {
		for (j = 0; j < nodesCount; j++) {
			if (nodes[i][j].blocked) {
				nodes[i][j].show(color(0, 0, 0));
			}
		}
	}
	aStar.end.show(end_bubble);
	var parent = aStar.currentNode;
	stroke(path_line);
	strokeWeight(Node.radius * .3);
	beginShape();
	while (parent) {
		coords = parent.coords();
		vertex(coords[0], coords[1]);
		parent = parent.parent;
	}
	endShape();
	if (message) {
		noStroke();
		fill('#000000');
		textSize(32);
		textAlign(CENTER);
		text(message, canvasSize / 2, canvasSize + 34);
		noLoop();
	}
}

function switchGridBuilder() {
	gridBuilder = !document.body.classList.contains('grid-builder');
	if (gridBuilder) {
		document.body.classList.add('grid-builder');
		for (var i = 0; i < nodesCount; i++) {
			for (var j = 0; j < nodesCount; j++) {
				nodes[i][j].parent = null;
				nodes[i][j].estimate = null;
				nodes[i][j].fromStart = null;
			}
		}
		aStar = new AStar(nodes, nodes[0][0], nodes[nodesCount - 1][nodesCount - 1]);
	} else {
		document.body.classList.remove('grid-builder');
	}
	loop();
}

function switchDrawErase() {
	gridBuilderErase = !gridBuilderErase;
	if (gridBuilderErase) {
		return alert("Setting Click to erase obstacles now.")
	} else {
		return alert("Clicking will draw obstacles again now.")
	}
}

function exportObstacles() {
	var data = [], fileName;
	for (var i = 0; i < nodesCount; i++) {
		data[i] = [];
		for (var j = 0; j < nodesCount; j++) {
			data[i][j] = nodes[i][j].blocked ? 1 : 0;
		}
	}
	data = JSON.stringify(data);
	fileName = prompt('Save this file as.');
	if (fileName === null) {
		return false
	}
	var a = document.createElement("a");
	var file = new Blob([data], { type: 'text/json' });
	a.href = URL.createObjectURL(file);
	a.download = fileName + '.json';
	a.click();
}

function importObstacles() {
	var data = prompt('Paste the contents from the JSON file.');
	if (data === null) {
		return false
	}
	try {
		data = JSON.parse(data);
	} catch (e) {
		return alert("Invalid data.")
	}
	if (!data || !data.length) {
		return alert("Invalid data.")
	}
	for (var i = 0; i < data.length; i++) {
		if (!data[i] || !data[i].length) {
			return alert('Invalid data.')
		}
		for (var j = 0; j < data[i].length; j++) {
			nodes[i][j].blocked = !!data[i][j];
		}
	}
	alert('Data imported successfully.')
}

function clearObstacles() {
	var numObstacles = 0;
	for (var i = 0; i < nodesCount; i++) {
		for (var j = 0; j < nodesCount; j++) {
			if (nodes[i][j].blocked) numObstacles++;
		}
	}
	if (!numObstacles) {
		return alert('Not able to clear since no obstacles are drawn.');
	}
	for (var i = 0; i < nodesCount; i++) {
		for (var j = 0; j < nodesCount; j++) {
			nodes[i][j].blocked = 0;
		}
	}
	alert('All obstacles cleared.');
}

function randomObstacles() {
	var percentage = prompt('Enter the number of obstacles per 100 nodes (percentage probability of a blocked node).');
	if (percentage === null) {
		return false
	}
	percentage = parseFloat(percentage);
	if (isNaN(percentage)) {
		if (percentage.valueOf.length == 0) {
			alert("No data given.");
		}
		else {
			alert("Invalid data.");
		}
	}
	else if (percentage > 100) {
		return alert("Percentages cannot be greater than 100.");
	}
	for (var i = 0; i < nodesCount; i++) {
		for (var j = 0; j < nodesCount; j++) {
			nodes[i][j].blocked = random() < percentage / 100;
		}
	}
}