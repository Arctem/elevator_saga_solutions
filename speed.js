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
            elevator.delivering = false;

            elevator.on("idle", function() {
                if(this.loadFactor() > 0.75)
                    this.delivering = true;
                else if(this.loadFactor() == 0) {
                    this.delivering = false;
                    this.goingUpIndicator(true);
                    this.goingDownIndicator(true);
                }

                if(anyWaiting(floors) && !this.delivering) {
                    var closest = null;
                    for(var j = 0; j < floors.length; j++) {
                        var floor = floors[j];
                        if((floor.up || floor.down) && floor.claimed == false) {
                            if(closest == null || Math.abs(closest - this.currentFloor()) > Math.abs(floor.floorNum() - this.currentFloor())) {
                                if(closest != null)
                                    floors[closest].claimed = false;
                                floor.claimed = this;
                                closest = floor.floorNum();
                            }
                        }
                    }

                    this.goToFloor(closest);
                } else {
                    this.delivering = true;
                    var closest = null;
                    for(var j = 0; j < this.getPressedFloors().length; j++) {
                        var floor = this.getPressedFloors()[j];
                        if(closest == null || Math.abs(closest - this.currentFloor()) > Math.abs(floor - this.currentFloor())) {
                            closest = floor;
                        }
                    }

                    if(closest > this.currentFloor()) {
                        this.goingUpIndicator(true);
                        this.goingDownIndicator(false);
                    } else {
                        this.goingUpIndicator(false);
                        this.goingDownIndicator(true);
                    }
                    this.goToFloor(closest);
                }

                // if(this.destinationQueue == []) {
                //     this.goToFloor(floor(i / elevators.length * floors.length));
                // }
            });
            elevator.on("stopped_at_floor", function(floorNum) {
                if(floors[floorNum].claimed == this) {
                    floors[floorNum].up = false;
                    floors[floorNum].down = false;
                    floors[floorNum].claimed = false;
                }
            });
            elevator.on("passing_floor", function(floorNum, direction) {
                if(((direction == "up" && floors[floorNum].up) ||
                    (direction == "down" && floors[floorNum].down)) &&
                    this.loadFactor() < 0.5 && floors[floorNum].claimed == null) {
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