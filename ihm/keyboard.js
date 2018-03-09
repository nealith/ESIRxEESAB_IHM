keys = [
  {
    letter:'0',
    label:'key0'
  },
  {
    letter:'1',
    label:'key1'
  },
  {
    letter:'2',
    label:'key2'
  },
  {
    letter:'3',
    label:'key3'
  },
  {
    letter:'4',
    label:'key4'
  },
  {
    letter:'5',
    label:'key5'
  },
  {
    letter:'6',
    label:'key6'
  },
  {
    letter:'7',
    label:'key7'
  },
  {
    letter:'8',
    label:'key8'
  },
  {
    letter:'9',
    label:'key9'
  },
  //
  {
    letter:'a',
    label:'keyA'
  },
  {
    letter:'z',
    label:'keyZ'
  },
  {
    letter:'e',
    label:'keyE'
  },
  {
    letter:'r',
    label:'keyR'
  },
  {
    letter:'t',
    label:'keyT'
  },
  {
    letter:'y',
    label:'keyY'
  },
  {
    letter:'u',
    label:'keyU'
  },
  {
    letter:'i',
    label:'keyI'
  },
  {
    letter:'o',
    label:'keyO'
  },
  {
    letter:'p',
    label:'keyP'
  },
  //
  {
    letter:'q',
    label:'keyQ'
  },
  {
    letter:'s',
    label:'keyS'
  },
  {
    letter:'d',
    label:'keyD'
  },
  {
    letter:'f',
    label:'keyF'
  },
  {
    letter:'g',
    label:'keyG'
  },
  {
    letter:'h',
    label:'keyH'
  },
  {
    letter:'j',
    label:'keyJ'
  },
  {
    letter:'k',
    label:'keyK'
  },
  {
    letter:'l',
    label:'keyL'
  },
  {
    letter:'m',
    label:'keyM'
  },
  //
  {
    letter:'w',
    label:'keyW'
  },
  {
    letter:'x',
    label:'keyX'
  },
  {
    letter:'c',
    label:'keyC'
  },
  {
    letter:'b',
    label:'keyB'
  },
  {
    letter:'n',
    label:'keyN'
  },
  {
    letter:',',
    label:'keyComma',
    toUpper:'?'
  },
  {
    letter:';',
    label:'keySemicolon',
    toUpper:'.'
  },
  {
    letter:String.fromCharCode(8657),
    label:'keyShift'
  },
  {
    letter:'OK',
    label:'keyOK',
    toUpper:'OK'
  },
]

keyboard = new Vue({
  el: '#keyboard',
  data:{
    down:false,
    keys:keys,
    toUpper:false,
    keySize: sizePourcent*frame.w,
    keyMargin: sizePourcent*frame.w*0.1,
    keyBoardSizeX: sizePourcent*frame.w*10+sizePourcent*frame.w*0.1*20+4,
    keyBoardSizeY: sizePourcent*frame.w*4+sizePourcent*frame.w*0.1*8+4,
    style:{
      width:sizePourcent*frame.w*10+sizePourcent*frame.w*0.1*20+4+'px',
      height:sizePourcent*frame.w*4+sizePourcent*frame.w*0.1*8+4+'px',
      display:'none',
      position:'absolute',
      right:'0px',
      bottom:'0px',
    },
    styleKey:{
      height:sizePourcent*frame.w+'px',
      width:sizePourcent*frame.w+'px',
      margin:sizePourcent*frame.w*0.1+'px',
      float:'left'
    }
  },
  methods:{
    resize:function(){
      this.keySize = sizePourcent*frame.w;
      this.keyMargin = sizePourcent*frame.w*0.1;
      this.keyBoardSizeX = this.keySize*10+this.keyMargin*20+4;
      this.keyBoardSizeY = this.keySize*4+this.keyMargin*8+4;

      this.style.width = this.keyBoardSizeX+'px';
      this.style.height = this.keyBoardSizeY+'px';

      this.styleKey.width = this.keySize+'px';
      this.styleKey.height = this.keySize+'px';
      this.styleKey.margin = this.keyMargin+'px';
    },
    ontoggle:function(){
      if (this.style.display == 'none') {
        this.style.display = 'block';
      } else {
        this.style.display = 'none';
      }
    },
    oncapslock:function(){
      if (this.toUpper) {
        this.toUpper = false;
        for (var i = 0; i < keys.length; i++) {
          keys[i]
          if (keys[i]['toUpper'] != undefined) {
            tmp = keys[i].toUpper;
            keys[i].toUpper = keys[i].letter;
            keys[i].letter = tmp;
          } else {
            keys[i].letter = keys[i].letter.toLowerCase()
          }
        }
      } else {
        this.toUpper = true;
        for (var i = 0; i < keys.length; i++) {
          keys[i]
          if (keys[i]['toUpper'] != undefined) {
            tmp = keys[i].toUpper;
            keys[i].toUpper = keys[i].letter;
            keys[i].letter = tmp;
          } else {
            keys[i].letter = keys[i].letter.toUpperCase()
          }
        }
      }
    },
    onclick:function(e){
      if (e.currentTarget.id != "keyShift") {
        var key = null;
        for (var i = 0; i < keys.length; i++) {
          if(keys[i].label == e.currentTarget.id){
            key = keys[i];
            break;
          }
        }
        var event;
        if (key.label != "keyOK") {
          event = new KeyboardEvent('keypress',{
            key:key.letter.charCodeAt(0)
          });
        } else {
          event = new KeyboardEvent('keypress',{
            key:9166
          });
        }
        window.dispatchEvent(event);

      } else {
        this.oncapslock();
      }
    },
    mouseDown:function(e){
      //DEBUG
      //console.log('keyboard:mouseDown');
      this.down = true;
    },
    mouseUp:function(e){
      //DEBUG
      //console.log('keyboard:mouseUp');
      this.down = false;
    },
    mouseMove:function(e){
      //DEBUG
      //console.log('keyboard:mouseMove');
      if (this.down == true) {

        var right  = (strToFloat(this.style.right) - e.movementX);
        var bottom  = (strToFloat(this.style.bottom) - e.movementY);
        if (right >= 0 && right+this.keyBoardSizeX < frame.w && bottom >= 0 && bottom + this.keyBoardSizeY < frame.h ) {
          this.style.right = right + 'px';
          this.style.bottom = bottom + 'px';
        }

      }
    },
    touch:function(e){
      switch (e.type) {
        case "touchstart":
          //DEBUG
          //console.log('keyboard:touchstart');
          this.down = true;
          break;
        case "touchmove":
          //DEBUG
          //console.log('keyboard:touchmove');
          if (this.down == true) {
            var right  = (strToFloat(this.style.right) - e.movementX);
            var bottom  = (strToFloat(this.style.bottom) - e.movementY);

            if (right >= 0 && right+this.keyBoardSizeX < frame.w && bottom >= 0 && bottom + this.keyBoardSizeY < frame.h ) {
              this.style.right = right + 'px';
              this.style.bottom = bottom + 'px';
            }
            //DEBUG
            //console.log('keyboard:touchmove:true');

          }
          break;
        case "touchend":
          //DEBUG
          //console.log('keyboard:touchend');
          this.down = false;
          break;
      }
    }

  }
});

keyboard.style['z-index'] = 10;

//// Test

window.addEventListener('keypress',function(e){
  console.log(String.fromCharCode(e.key));
});
