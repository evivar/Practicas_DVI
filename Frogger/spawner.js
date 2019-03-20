var Spawner = function (objectPrototype) {

    // Para clonar usar -> Object.Create

    var firstLaneTime = 5000;
    var secondLaneTime = 3000;
    var thirdLaneTime = 6000;
    var fourthLaneTime = 7000;
    var fifthLaneTime = 6000;

    var firstWaterTime = 3000;
    var secondWaterTime = 4000;
    var thirdWaterTime = 4000;
    var fourthWaterTime = 2000;
    var fifthWaterTime = 3000;

    this.add = function(){
        Object.Create(this.objectPrototype);
    }

}

