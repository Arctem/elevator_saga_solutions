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
                    for(var j = 0; j < this.getPressedFloors().length; j++) {
                        this.goToFloor(this.getPressedFloors()[j]);
                        if(floors[j].claimed == false) {
                            floors[j].claimed = this;
                        }
                    }
                } else if(anyWaiting(floors.slice(1))) {
                    for(var j = floors.length - 1; j > 0; j--) {
                        if((floors[j].down || floors[j].up) && floors[j].claimed == false) {
                            floors[j].claimed = this;
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
                for(var j = 0; j < this.getPressedFloors().length; j++) {
                    var num = this.getPressedFloors()[j];
                    if(this.destinationQueue.indexOf(num) == -1) {
                        this.goToFloor(num);
                    }
                }
            });
            elevator.on("passing_floor", function(floorNum, direction) {
                if(((direction == "up" && floors[floorNum].up) ||
                    (direction == "down" && floors[floorNum].down)) &&
                    this.loadFactor() < 0.5 && floors[floorNum].claimed == false) {
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
