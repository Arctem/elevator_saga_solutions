{
    init: function(elevators, floors) {
        function anyWaiting(floors) {
            for(var i = 0; i < floors.length; i++) {
                if(floors[i].up || floors[i].down)
                    return true;
            }
            return false;
        }


        for(var i = 0; i < elevators.length; i++) {
            var elevator = elevators[i];
            //elevator.delivering = false;

            elevator.on("idle", function() {
                if(this.currentFloor() == 0 && this.getPressedFloors().length > 0) {
                    var pressed = this.getPressedFloors();
                    pressed.sort();
                    for(var j = 0; j < pressed.length; j++) {
                        this.goToFloor(pressed[j]);
                    }
                    if(floors[0].claimed == false) {
                        floors[0].claimed = this;
                        console.log("Claimed " + j);
                    }
                } else if(anyWaiting(floors.slice(1))) {
                    for(var j = floors.length - 1; j > 0; j--) {
                        if((floors[j].down || floors[j].up) && floors[j].claimed == false) {
                            floors[j].claimed = this;
                            console.log("Claimed " + j);
                            this.goToFloor(j);
                            break;
                        }
                    }
                }

                if(this.destinationQueue.length == 0) {
                    this.goToFloor(0);
                }
            });
            elevator.on("stopped_at_floor", function(floorNum) {
                floors[floorNum].up = false;
                floors[floorNum].down = false;

                if(floors[floorNum].claimed == this) {
                    floors[floorNum].claimed = false;
                }

                //Check for any unqueued pressed floors
                var pressed = this.getPressedFloors();
                pressed.sort();
                for(var j = 0; j < pressed.length; j++) {
                    var num = pressed[j];
                    if(this.destinationQueue.indexOf(num) == -1) {
                        this.goToFloor(num);
                    }
                }

                if(this.destinationQueue.length != 0) {
                    if(floors[this.destinationQueue[0]].claimed == false) {
                        floors[this.destinationQueue[0]].claimed = this;
                        console.log("Claimed " + j);
                    }
                }
            });
            elevator.on("passing_floor", function(floorNum, direction) {
                if((((direction == "up" && floors[floorNum].up) ||
                    (direction == "down" && floors[floorNum].down)) &&
                    this.loadFactor() < 0.75 && floors[floorNum].claimed == false) ||
                    this.destinationQueue.indexOf(floorNum) != -1) {

                    while(this.destinationQueue.indexOf(floorNum) != -1) {
                        this.destinationQueue.splice(this.destinationQueue.indexOf(floorNum), 1)
                    }
                    this.checkDestinationQueue();
                    this.goToFloor(floorNum, true);
                }
            });
        }

        for(var i = 0; i < floors.length; i++) {
            var floor = floors[i];
            floor.up = false;
            floor.down = false;
            floor.claimed = false;

            floor.on("up_button_pressed", function() {
                this.up = true;
            });
            floor.on("down_button_pressed", function() {
                this.down = true;
            });
        }
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
