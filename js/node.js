function Node( i, j, blocked ) {
	this.i = i;
	this.j = j;
	this.blocked = blocked;
	this.parent = null;
	this.estimate = null;
	this.fromStart = null;
}

Node.radius = 25;
Node.offset = 25;

Node.prototype.coords = function ( clr ) {
	return [
		( this.i + .5 ) * Node.radius + Node.offset,
		( this.j + .5 ) * Node.radius + Node.offset
	];
};

Node.prototype.show = function ( clr ) {
	var
		xy = this.coords();
	if ( clr ) {
		stroke( clr );
	}
	point( xy[0], xy[1] );
};