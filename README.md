# Game

## Classes used:

### Chunk   

 Contains the playable arena. Contains the ground the the sky boundary.

* constructor(scene: THREE.Scene, posx: int, posz: int, side: int)
* draw()
* contains(posx: int, posy: int) => Makes sure the player does not fall out of play area

### Player  

 The player itself. Handles the movements along with current position wrt scene.

* constructor(scene: THREE.Scene, quadtree: QuadTree, chunk: Chunk, posx: int, posz: int) 
* draw()
* forward()  => Accelerates the character in given direction
* backward() => Accelerates the character in given direction
* left()     => Accelerates the character in given direction
* right()    => Accelerates the character in given direction
* move()     => Actually moves the object on the screen + changes position 
* getNearPoints() => Uses spatial quadtree to get nearby points

### Point

 The moving particles which denote the objects to be destroyed.

* constructor(scene: THREE.Scene, qtree: QuadTree, id: int, posx: int, posz: int)
* draw()
* move()    => Moves the point slightly within the parent quadrant

### QuadTree

 The most important class used here, which drastically reduces the time complexity and thereby increases frame rate. 
 This works as a spatial Quad Tree which recursively sub-divides into four quadrants when the number of points in it goes beyond a limit. 

* constructor(scene: THREE.Scene, posx: int, posz: int, side: int)
* contains(point: Point)    => Returns the quadrant if it contains the point else null
* squareContains(posx: int, posz: int, side: int, point: Array[Point])) => Returns a list of points by recursively traversing thr quadrants which overlap with the given rectangle mid points and side. point must be passed with an empty array.
* draw()
* insert(point: Point) => Adds a point to the quadtree and subsequent handling of the quadtree
* remove(point: Point) => Removes a point from the quadtree and subsequent handling of the quadtree