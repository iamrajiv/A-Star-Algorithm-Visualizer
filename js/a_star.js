/**
 * AStar constructor
 * @param {array} nodes
 * @param {Node} start
 * @param {Node} end
 * @constructor
 */
function AStar( nodes, start, end ) {
	this.nodes = nodes;
	this.start = start;
	this.end = end;

	this.start.fromStart = 0;
	this.start.estimate = this.estimateToEnd( this.start );

	this.openSet = [ start ];
	this.closedSet = [];
	this.currentNode = {};
}

/**
 * Get Neighbours
 * @param {Node} node
 */
AStar.prototype.nodeNeighbours = function ( node ) {
	var
		offsets = [- 1, 0, 1],
		neighbours = [],
		i, j;

	offsets.map( function ( x ) {
		offsets.map( function ( y ) {
			// Make sure both i and j are not 0 which will point to self ;)
			if ( x || y ) {
				i = node.i + x;
				j = node.j + y;
				if ( this.nodes[i] && this.nodes[i][j] ) {
					neighbours.push( this.nodes[i][j] );
				}
			}
		} );
	} );

	return neighbours;
};

/**
 * Get Node Cost estimate
 * @param {Node} node
 */
AStar.prototype.estimateToEnd = function ( node ) {
	return this.distanceBetween( node, this.end );
};

AStar.prototype.currentNeighbours = function () {
	return this.nodeNeighbours( this.currentNode );
};

AStar.prototype.distanceBetween = function ( n1, n2 ) {
	var
		a = n1.i - n2.i,
		b = n1.j - n2.j;
	return Math.sqrt( a * a + b * b );
};

/**
 * Sets current closest node
 */
AStar.prototype.getNodeToProcess = function () {
	var
		closest = Infinity,
		closestI, dist, node, currentNode;
	for ( var i = this.openSet.length - 1; i > -1; i-- ) {
		node = this.openSet[i];
		if ( ! node.blocked ) {
			dist = node.estimate;
			if ( dist < closest ) {
				closest = dist;
				closestI = i;
			}
		} else {
			this.openSet.splice( i, 1 );
		}
	}
	currentNode = this.openSet[closestI];

	if ( currentNode ) {
		this.closedSet.push( currentNode );
		this.openSet.splice( closestI, 1 );
	}
	return currentNode;
};

AStar.prototype.processNodes = function () {
	var currentNode = this.getNodeToProcess();

	if ( ! currentNode ) return;

	this.currentNode = currentNode;

	var
		neighbours = this.currentNeighbours(),
		node, tentativeShortestPath, indexInOpen;
	for ( var i = neighbours.length - 1; i > -1; i-- ) {
		node = neighbours[i];
		if ( -1 < this.closedSet.indexOf( node ) ) {
			// Node checked, continue
			continue;
		}

		tentativeShortestPath = this.currentNode.fromStart + this.distanceBetween( this.currentNode, node );
		indexInOpen = this.openSet.indexOf( node );
		
		if ( 0 > indexInOpen ) {
			this.openSet.push( node );
		} else if ( tentativeShortestPath > this.openSet[ indexInOpen ].fromStart ) {
			continue;
		}
		
		node.fromStart = tentativeShortestPath;
		node.estimate = node.fromStart + this.estimateToEnd( node );
		node.parent = this.currentNode;
	}
};

AStar.prototype.iterate = function () {
	if ( this.currentNode === this.end ) {
		// Success
		return 'Done';
	} else if ( this.openSet.length ) {
		// Process
		this.processNodes();
	} else {
		// No Solution
		return 'No Solution';
	}
};
