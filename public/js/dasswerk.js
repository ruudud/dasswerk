(function() {

  var COLOURS = [ '#E3EB64', '#A7EBCA', '#FFFFFF', '#D8EBA7', '#868E80' ];
  var radius = 0;

  var sketch = Sketch.create({

    container: document.getElementById( 'container' ),
    autoclear: false,

    setup: function() {
      //
    },

    update: function() {
      radius = 2 + abs( sin( this.millis * 0.003 ) * 20 );
    },

    // Event handlers
    keydown: function() {
      if ( this.keys.C ) this.clear();
    },

    // Mouse & touch events are merged, so handling touch events by default
    // and powering sketches using the touches array is recommended for easy
    // scalability. If you only need to handle the mouse / desktop browsers,
    // use the 0th touch element and you get wider device support for free.
    touchmove: function() {
      for ( var i = this.touches.length - 1, touch; i >= 0; i-- ) {
        touch = this.touches[i];

        this.lineCap = 'round';
        this.lineJoin = 'round';
        this.fillStyle = this.strokeStyle = COLOURS[ i % COLOURS.length ];
        this.lineWidth = radius;

        this.beginPath();
        this.moveTo( touch.ox, touch.oy );
        this.lineTo( touch.x, touch.y );
        this.stroke();
      }
    }
  });

  var clear = function() {
    sketch.clear();
  };

  var saveImage = function() {
    var imageData = sketch.canvas.toDataURL();

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/drawings', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
      console.log(this.responseText);
    };
    xhr.onerror = function() {
      console.error("Booo", arguments);
    };
    xhr.send(imageData);

    sketch.clear();
  };

  var $doneBtn = document.getElementById('done');
  $doneBtn.addEventListener('click', saveImage, false);

  var $clrBtn = document.getElementById('clear');
  $clrBtn.addEventListener('click', clear, false);

})();
