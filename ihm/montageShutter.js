var svgCanvas = {}

var montage_data;

function saveMontage(montage){
  console.log(montage)
  //svgCanvas[montage.name].size(montageSize,montageSize);



  fs.writeFile(montage.src, svgCanvas[montage.name].svg(), function(err) {
    if(err) {
        return console.log(err);
    } else {
        console.log("The file was saved!");
    }
  });
}

function saveMontages(){
  for (var i = 0; i < montages.length; i++) {
    saveMontage(montages[i]);
  }
}

function attachAutomaticSaving(montage){
  console.log(montage)
  svgCanvas[montage.name].touchend(function(){
    saveMontage(montage);
  })
  svgCanvas[montage.name].mouseup(function(){
    saveMontage(montage);
  })
}


//
// MontageShutter
//


montageShutter = new Vue({
  el: '#montageShutter',
  data:{
    div:document.getElementById('montageShutter'),
    montages:remote.getGlobal('montages'),
    down:false,
    style:{
      height : frame.h+'px',
      position : 'absolute',
      top : '0px',
      left : (sizePourcent*frame.w*2)+'px',
      width : (frame.w - sizePourcent*frame.w*3)+'px',
      overflow : 'hidden',
      display:'block'
    },
    styleMontage:{
      height : montageSize+'px',
      width : montageSize+'px',
      margin : montageSize/8.0+'px auto '
    }
  },
  methods:{
    resize:function(){
      this.style.left = (strToFloat(montageStrip.style.width)+strToFloat(montageStrip.style.left))+'px';
      this.style.height = frame.h+'px';
      this.style.width = (strToFloat(libraryStrip.style.left)-(strToFloat(montageStrip.style.width)+strToFloat(montageStrip.style.left))) +'px';

      montageSize = Math.min(frame.h*0.8,(strToFloat(libraryStrip.style.left)-(strToFloat(montageStrip.style.width)+strToFloat(montageStrip.style.left)))*0.8);

      this.styleMontage.height = montageSize+'px';
      this.styleMontage.width = montageSize+'px';

      this.style['padding-left'] = 'auto';
      this.style['padding-right'] = 'auto';

      this.styleMontage.margin = montageSize/8.0+'px auto '+montageSize/8.0+'px auto';

      for (var i = 0; i < montages.length; i++) {
        //svgCanvas[montages[i].name].size(montageSize,montageSize);
        svgCanvas[montages[i].name].each(function(i, children) {
          this.draggable({
            minX:0,
            minY:0,
            maxX:montageSize,
            maxY:montageSize
          });
        },true)
      }

    },
    onWheel:function(e){
      var delta = Math.max(-1, Math.min(1, e.deltaY));
      document.getElementById(e.currentTarget.id).scrollTop += (delta*40); // Multiplied by 40
      document.getElementById("montageStrip").scrollTop += (delta*40); // Multiplied by 40
      var t = document.getElementById(e.currentTarget.id);

      e.preventDefault();
    },
    mouseDown:function(e){
      //DEBUG
      //console.log('montageShutter:mouseDown');
      this.down = true;
    },
    mouseUp:function(e){
      //DEBUG
      //console.log('montageShutter:mouseUp');
      this.down = false;
    },
    mouseMove:function(e){
      //DEBUG
      //console.log('montageShutter:mouseMove');
      if (pressTimer) {
        clearTimeout(pressTimer);
      }
      if (this.down == true) {
        var delta = Math.max(-1, Math.min(1, e.movementY));
        document.getElementById(e.currentTarget.id).scrollTop -= (delta*40); // Multiplied by 40
        document.getElementById("montageStrip").scrollTop += (delta*40); // Multiplied by 40
        var t = document.getElementById(e.currentTarget.id);
        e.preventDefault();
        //DEBUG
        //console.log('montageShutter:mouseMove:true');

      }
    },
    touch:function(e){
      switch (e.type) {
        case "touchstart":
          //DEBUG
          //console.log('montageShutter:touchstart');
          this.down = true;
          break;
        case "touchmove":
          //DEBUG
          //console.log('montageShutter:touchmove');
          if (pressTimer) {
            clearTimeout(pressTimer);
          }
          if (this.down == true) {
            var delta = Math.max(-1, Math.min(1, e.movementY));
            console.log(e.movementY);
            document.getElementById(e.currentTarget.id).scrollTop -= (delta*40); // Multiplied by 40
            var t = document.getElementById(e.currentTarget.id);
            e.preventDefault();
            //DEBUG
            //console.log('montageShutter:touchmove:true');

          }
          break;
        case "touchend":
          //DEBUG
          //console.log('montageShutter:touchend');
          this.down = false;
          break;
      }
    },
    mouseDownPage:function(e){
      this.down = true;
      pressTimer = window.setTimeout(function() { montageShutter.down = false;},200);
    },
    touchPage:function(e){
      if (e.type = 'touchstart') {

        pressTimer = window.setTimeout(function() { montageShutter.down = false;},200);
      }
    },
    dragOverMontage:function(e){
      e.preventDefault();
    },
    dropMontage:function(e){
      var k = -1;
      for (var i = 0; i < montages.length; i++) {
        montages[i].name
        if (e.currentTarget.id == montages[i].name) {
          k=i;
          break;
        }
      }

      if (k >= 0) {
        var rect = e.currentTarget.getBoundingClientRect();

        var data;

        try {
          data = JSON.parse(e.dataTransfer.getData('text'));
        } catch (e) {
          data = montage_data;
        } finally {

        }
        var a = data.height;
        var b = data.width;
        var x = (e.clientX - rect.left) - data.offsetx;
        var y = (e.clientY - rect.top) - data.offsety;
        var img = svgCanvas[montages[k].name].image(data.src,b,a).move(x,y);
        img.draggable({
          minX:0,
          minY:0,
          maxX:montageSize,
          maxY:montageSize
        });
        img.mousedown = montageShutter.mouseDownPage;
        saveMontage(montages[k]);
        //img.touchstart(montageShutter.touchPage);
        console.log("pass in a canvas, src:"+e.dataTransfer.getData('text'));
      }

      console.log("pass in dropImg");
      console.log("target element : "+e.currentTarget.id);

    },
    newMontage:function(name){
      ipcRenderer.send('new_montage',{
        name:name,
        src:path.normalize(remote.getGlobal('montages_path')+'/'+name+'.svg')
      })
    },
    printSVG:function(name){
      console.log(svgCanvas[name].svg());
    }
  }
});

ipcRenderer.on('sync_montages', (event, arg) => {
  montages = remote.getGlobal('montages');
  montageShutter.montages = montages;
  montageStrip.montages = montages;
});

ipcRenderer.on('new_montage_added', (event, arg) => {
  montages = remote.getGlobal('montages');
  montageShutter.montages = montages;
  montageStrip.montages = montages;
  window.setTimeout(function() {
    console.log(montageSize);
    console.log(arg.name)
    svgCanvas[arg.name] = SVG(arg.name).size(montageSize,montageSize);
    attachAutomaticSaving(arg);
    saveMontage(arg);
  },200);
});

function loadMontage(montage){
  fs.readFile(montage.src, {encoding: 'utf-8'}, function(err,data) {
    if(err) {
      return console.log(err);
    } else {
      console.log(montage.name);

      var parser = new DOMParser();
      var doc = parser.parseFromString(data, "image/svg+xml");
      var root = doc.getElementsByTagName('svg')[0];
      var ratio = montageSize/root.width.baseVal.value;
      root.width = montageSize;
      root.height = montageSize;

      console.log(ratio);

      var images = doc.getElementsByTagName('image');

      svgCanvas[montage.name] = SVG(montage.name).size(montageSize,montageSize);

      for (var i = 0; i < images.length; i++) {
        //console.log(images[i]);
        var width = images[i].width.baseVal.value*ratio;
        var height = images[i].height.baseVal.value*ratio;
        var x = images[i].x.baseVal.value*ratio;
        var y = images[i].y.baseVal.value*ratio;
        //console.log(images[i]);
        console.log(x,y)
        var img = svgCanvas[montage.name].image(images[i]['href'].baseVal, width, height).move(x,y);
      }

      var XMLS = new XMLSerializer();
      data = XMLS.serializeToString(doc);

      //svgCanvas[montage.name] = SVG(arg.name).size(montageSize,montageSize);
      //svgCanvas[montage.name].svg(data);
      svgCanvas[montage.name].each(function(i, children) {
        this.draggable({
          minX:0,
          minY:0,
          maxX:montageSize,
          maxY:montageSize
        });
      },true)
      attachAutomaticSaving(montage);
    }
  });
}

for (var i = 0; i < montages.length; i++) {
  loadMontage(montages[i]);

}

montageShutter.style['padding-left'] = 'auto';
montageShutter.style['padding-right'] = 'auto';
montageShutter.style['white-space'] = 'nowrap';
