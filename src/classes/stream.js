class STREAM {

  constructor (_root) {

    this.root = _root;

    this.streamLabel = '';

    this.id = '';
    this.location = null;
    this.lastUpdate = Date.now();

    //tmp
    this.data = '';
    this.dataset = [];

    let d = new DATASET();
    this.dataset.push(d);
  }

  //#############################################
  //##                 HELPER                  ##
  //#############################################

  generateSeed () {

   var seed = "";
   var trytes = "ABCDEFGHIJKLMNOPQRSTUVWXYZ9";

   for (var i = 0; i < 81; i++)
     seed += trytes.charAt(Math.floor(Math.random() * trytes.length));

   return seed;
  }

}

module.exports = STREAM;
