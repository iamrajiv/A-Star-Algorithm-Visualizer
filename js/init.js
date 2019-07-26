var
	nodes = [],
	nodesCount = 50,
	canvasSize = 700,
	gridBuilder = document.body.classList.contains( 'grid-builder' ),
	gridBuilderErase = false,
	aStar, bgclr,
	start_bubble = '#ff0066', end_bubble = '#ff0066', 
	path_line = '#ff0066', path_bubble = '#55ff00', side_bubble = '#0099ff',
    rect_color = '#f2f2f2';

function setup() {

	var
		canvas = createCanvas( canvasSize, canvasSize );
	// Node props
	Node.radius = Math.floor( canvasSize/( nodesCount + 1 ) );

	for ( var i = 0; i < nodesCount; i ++ ) {
		if ( ! nodes[i] ) {
			nodes[i] = [];
		}
		for ( var j = 0; j < nodesCount; j ++ ) {
			nodes[i][j] = new Node( i, j );
		}
	}

	aStar = new AStar( nodes, nodes[0][0], nodes[nodesCount - 1][nodesCount - 1] );
}

function draw() {
	background( rect_color);
	strokeWeight( 2 );
	stroke( '#000000' );
	noFill();
	rect( 25, 25, 650, 650 );

	strokeWeight( Node.radius * .9 );

	if ( gridBuilder ) {
		drawGridBuilder();
	} else {
		drawAlgo();
	}
}

function drawGridBuilder() {
	var xy;
	for ( i = 0; i < nodesCount; i ++ ) {
		for ( j = 0; j < nodesCount; j ++ ) {
			xy = nodes[i][j].coords();
			if ( nodes[i][j].blocked ) {
				nodes[i][j].show( color( 0, 0, 0 ) );
			}
			if ( mouseIsPressed ) {
				if (
					Math.abs( mouseX - xy[0] ) < 7 &&
					Math.abs( mouseY - xy[1] ) < 7
				) {
					nodes[i][j].blocked = ! gridBuilderErase;
				}

			}
		}
	}

	aStar.start.show( start_bubble );
	aStar.end.show( end_bubble );

}

function drawAlgo() {
	// Do the algo suff
	var i, j, coords, message;

	if ( ! message ) {
		message = aStar.iterate();
	}

	for ( i = 0; i < aStar.openSet.length; i ++ ) {
		aStar.openSet[i].show( side_bubble );
	}

	for ( i = 0; i < aStar.closedSet.length; i ++ ) {
		aStar.closedSet[i].show( path_bubble );
	}

	for ( i = 0; i < nodesCount; i ++ ) {
		for ( j = 0; j < nodesCount; j ++ ) {
			if ( nodes[i][j].blocked ) {
				nodes[i][j].show( color( 0, 0, 0 ) );
			}
		}
	}

	aStar.end.show( end_bubble );

	var parent = aStar.currentNode;
	stroke( path_line );
	strokeWeight( Node.radius * .3 );
	beginShape();
	while ( parent ) {
//		parent.show( bgClr );
		coords = parent.coords();
		vertex( coords[0], coords[1] );
		parent = parent.parent;
	}

	endShape();

	if ( message ) {
		noStroke();
		fill( '#000000' );
		textSize( 32 );
		textAlign( CENTER );
		text( message, canvasSize/2, canvasSize + 34 );
		noLoop();
	}

}

function switchGridBuilder() {
	gridBuilder = ! document.body.classList.contains( 'grid-builder' );

	if ( gridBuilder ) {
		document.body.classList.add( 'grid-builder' );
		// Reset nodes
		for ( var i = 0; i < nodesCount; i ++ ) {
			for ( var j = 0; j < nodesCount; j ++ ) {
				nodes[i][j].parent = null;
				nodes[i][j].estimate = null;
				nodes[i][j].fromStart = null;
			}
		}
		// Reset aStar object
		aStar = new AStar( nodes, nodes[0][0], nodes[nodesCount - 1][nodesCount - 1] );
	} else {
		document.body.classList.remove( 'grid-builder' );
	}
	loop(); // Run loop
}

function switchDrawErase() {
	gridBuilderErase = ! gridBuilderErase;
	if ( gridBuilderErase ) {
		return alert( "Setting changed, click to erase obstacles now." )
	} else {
		return alert( "Okay, clicking will add obstacles again now." )
	}
}

function exportObstacles() {
	var data = [], fileName;

	for ( var i = 0; i < nodesCount; i ++ ) {
		data[i] = [];
		for ( var j = 0; j < nodesCount; j ++ ) {
			data[i][j] = nodes[i][j].blocked ? 1 : 0;
		}
	}

	data = JSON.stringify( data );

	fileName = prompt( 'What would you like to save this file as ?', 'Name' );


	if ( fileName === null ) {
		return alert( 'Okay, obstacles data will not be exported.' )
	}

	var a = document.createElement("a");
	var file = new Blob([data], {type: 'text/json'});
	a.href = URL.createObjectURL(file);
	a.download = fileName + '.json';
	a.click();
}

function importObstacles() {
	var data = prompt( 'Please paste in the contents from export file (JSON format).' );

	if ( data === null ) {
		return alert( 'Okay, nothing will be imported.' )
	}

	try {
		data = JSON.parse( data );
	} catch (e) {
		return alert( "Woah, can't understand this data. Are you sure this is copied and pasted from an exported file ?" )
	}

	if ( ! data || ! data.length ) {
		return alert( "This data seems to represent something which can't be understand." )
	}

	for ( var i = 0; i < data.length; i ++ ) {
		if ( ! data[i] || ! data[i].length ) {
			return alert( 'Sorry, can\'t understand this data.' )
		}
		for ( var j = 0; j < data[i].length; j ++ ) {
			nodes[i][j].blocked = !! data[i][j];
		}
	}

	alert( 'Understood the data, let\'s see if it can be solved.' )
}

function clearObstacles() {
	var numObstacles = 0;
	for ( var i = 0; i < nodesCount; i ++ ) {
		for ( var j = 0; j < nodesCount; j ++ ) {
			if ( nodes[i][j].blocked ) numObstacles++;
		}
	}

	if ( ! numObstacles ) {
		return alert( 'Hmm, not sure can\'t see any obstacles drawn.' );
	}

	if ( ! confirm( 'Are you sure you want me to remove all obstacles ?' ) ) {
		return alert( 'Okay, leaving everything as is.' );
	}
	for ( var i = 0; i < nodesCount; i ++ ) {
		for ( var j = 0; j < nodesCount; j ++ ) {
			nodes[i][j].blocked = 0;
		}
	}
	alert( 'All obstacles cleared.' );
}

function randomObstacles() {
	var percentage  = prompt( 'How many obstacles should be there per 100 nodes (percentage probability of a blocked node) ?' );

	if ( percentage === null ) {
		return alert( "Okay, will keep obstacles as is." );
	}

	percentage = parseFloat( percentage );

	if ( isNaN( percentage )  ) {
		percentage = 25;
		alert( "Oops, couldn't quite understand. Gonna use 25% for now." );
	} else if ( percentage > 100 ) {
		alert( "Are you sure, you know how percentage and probability work ? It can't be over 100." );
	} else if ( percentage > 90 ) {
		alert( "Hmm, this is going to be unsolvable. Maybe you want to draw path instead of draw obstacles." );
	} else if ( percentage > 70 ) {
		alert( "This one is probably going to be unsolvable. Let's try if you want to though." );
	} else if ( percentage > 45 ) {
		alert( "Woah, this one seems a bit difficult. Let's try this" );
	} else if ( percentage > 25 ) {
		alert( "Woah, this one looks good. Let's try this" );
	} else {
		alert( 'Okay, that\'s looks easy.' )
	}

	for ( var i = 0; i < nodesCount; i ++ ) {
		for ( var j = 0; j < nodesCount; j ++ ) {
			nodes[i][j].blocked = random() < percentage / 100;
		}
	}
}