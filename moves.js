//This takes advantage of the fact that (as far as I can tell) every person
//either gets on or off at the ground floor

{
    init: function(elevators, floors) {
        for(var i = 0; i < elevators.length; i++) {
            var elevator = elevators[i];

            elevator.on("idle", function() {
                if(this.getPressedFloors().length == 0) {
                    // var closest = null;
                    // for(var j = 0; j < floors.length; j++) {
                    //     var floor = floors[j];
                    //     if((floor.up || floor.down) && floor.claimed == false) {
                    //         if(closest == null || Math.abs(closest - this.currentFloor()) > Math.abs(floor.floorNum() - this.currentFloor())) {
                    //             if(closest != null)
                    //                 floors[closest].claimed = false;
                    //             floor.claimed = this;
                    //             closest = floor.floorNum();
                    //         }
                    //     }
                    // }

                    this.goToFloor(0);
                } else {
                    var closest = null;
                    for(var j = 0; j < this.getPressedFloors().length; j++) {
                        var floor = this.getPressedFloors()[j];
                        if(floor == 0)
                            continue;
                        if(closest == null || Math.abs(closest - this.currentFloor()) > Math.abs(floor - this.currentFloor())) {
                            closest = floor;
                        }
                    }

                    if(closest != null)
                        this.goToFloor(closest);
                    else
                        this.goToFloor(0);
                }
            });
            // elevator.on("stopped_at_floor", function(floorNum) {
            //     if(floors[floorNum].claimed == this) {
            //         floors[floorNum].up = false;
            //         floors[floorNum].down = false;
            //         floors[floorNum].claimed = false;
            //     }
            // });
        }
        
        // for(var i = 0; i < floors.length; i++) {
        //     var floor = floors[i];
        //     floor.up = false;
        //     floor.down = false;
        //     floor.claimed = false;
            
        //     floor.on("up_button_pressed", function() {
        //         this.up = true;
        //     });
        //     floor.on("down_button_pressed", function() {
        //         this.down = true;
        //     });
        // }
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}