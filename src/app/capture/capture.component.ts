import { Component, OnInit, ViewChild } from '@angular/core';
import { IVidDescription } from '../rm-vid/rm-vid.component';
let done = false;

// The whole thing's a bit slow
function convolve(neighbourhood: number[], matrix: number[]) {
  if(neighbourhood.length !== matrix.length * 4) {
    throw 'neighbourhood must be matrix length * 4';
  }
  const offset = 0;
  const newVal = { r: offset, g: offset, b: offset, a: offset };
  const l = matrix.length;

  const kernalSum = matrix.reduce((a,b) => a += b);

  // Divide by zero though...
  const normalisedKernel = matrix.map(element => element / Math.max(Math.abs(kernalSum), .1);

  for(let i = 0; i < l; i += 1) {
    var cidx = i * 4; // component index
    var rgbVals = [neighbourhood[cidx], neighbourhood[cidx+1], neighbourhood[cidx+2]];

    // Could possibly do this for greyscale edge detection?
    var avg = rgbVals.reduce((a,b) => a += b) / rgbVals.length;
    var avgVal = avg * matrix[matrix.length - i - 1];

    rgbVals = rgbVals.map(v => v * normalisedKernel[matrix.length - i - 1]);
    newVal.r += rgbVals[0];
    newVal.g += rgbVals[1];
    newVal.b += rgbVals[2];
    newVal.a += neighbourhood[cidx+3]; // leave alpha channel untouched
  }
  if(!done) {
    console.log('convolve', neighbourhood, matrix);
    console.log('newVal', newVal);
    console.log('normal kernel', normalisedKernel);
  }
  done = true;
  return newVal;
}

function getPixelComponents(data, i) {
  return [data[i], data[i+1], data[i+2], data[i+3]];
}

function getEffects(video) {
  return {
    edgeDetect: function(idata: ImageData) {
      var data = idata.data;
      var limit = data.length - 4;

      var contextWidth = idata.width;
      var trueWidth = contextWidth * 4;

      const matrix = [
        -1, 0, -1,
        0, 4, 0,
        -1, 0, -1
      ];

      for(let i = 0; i < limit; i += 4) {
        let neighbourhood = [
            Math.max(0, i - trueWidth - 4),
            Math.max(0, i - trueWidth),
            Math.max(0, i - trueWidth + 4),
            Math.max(0, i - 4),
            i,
            (i + 4) % data.length,
            (i + trueWidth - 4) % data.length,
            (i + trueWidth) % data.length,
            (i + trueWidth + 4) % data.length
          ]
          .map(idx => getPixelComponents(data, idx))
          .reduce((a, b) => a.concat(b));

        let newVal = convolve(neighbourhood, matrix);
        data[i] = Math.min(255, Math.max(0, newVal.r));
        data[i+1] = Math.min(255, Math.max(0, newVal.g));
        data[i+2] = Math.min(255, Math.max(0, newVal.b));
      }
      return new ImageData(data, idata.width);
    },
    grey: function(idata) {
      var data = idata.data;
      var limit = data.length - 4;

      while(limit -= 4) {
        var greyAvg = data[limit] + data[limit + 1] * 3 + data[limit + 2] * 4 >>> 3;
        data[limit]= greyAvg;
        data[limit + 1] = greyAvg;
        data[limit + 2] = greyAvg;    		
      }
      return new ImageData(data, idata.width);
    },
    red: function (idata) {
      var data = idata.data;
      var limit = data.length - 4;

      while(limit -= 4) {
        data[limit] += 100;
        data[limit+1] -= 30;
        data[limit+2] -= 30;
      }

      return new ImageData(data, idata.width);
    },	    
    green: function (idata) {
      var data = idata.data;
      var limit = data.length - 4;

      while(limit -= 4) {
        data[limit] -= 30;
        data[limit+1] += 100;
        data[limit+2] -= 30;
      }
      
      return new ImageData(data, idata.width);
    },
    blue: function (idata) {
      var data = idata.data;
      var limit = data.length - 4;

      while(limit -= 4) {
        data[limit] -= 30;
        data[limit+1] -= 30;
        data[limit+2] += 100;
      }

      return new ImageData(data, idata.width);
    },
    mirror: function (idata) {
      var data = idata.data;
      var limit = data.length;
      var contextWidth = idata.width;
      var trueWidth = contextWidth * 4;
      var halfRow = Math.floor(trueWidth / 2);
      var numRows = limit / trueWidth;
      for(var row = 0; row < numRows; row++) {
        for(var i = 0; i < halfRow; i += 4) {
          var offset = row * trueWidth;
          var r = data[offset + i];
          var g = data[offset + i + 1];
          var b = data[offset + i + 2];
          var o = data[offset + i + 3];

          var rightPos = offset + trueWidth - i - 4;
          var swapR = data[rightPos];
          var swapG = data[rightPos + 1];
          var swapB = data[rightPos + 2];
          var swapO = data[rightPos + 3];

          data[offset+i] = swapR;
          data[offset+i+1] = swapG;
          data[offset+i+2] = swapB;
          data[offset+i+3] = swapO;

          data[rightPos] = r;
          data[rightPos + 1] = g;
          data[rightPos + 2] = b;
          data[rightPos + 3] = o;
        }
      }
      return new ImageData(data, idata.width);
    }, 
    splitMirror: function (idata) {
      var data = idata.data;
      var limit = data.length;
      var contextWidth = idata.width;
      var trueWidth = contextWidth * 4;
      var halfRow = Math.floor(trueWidth / 2);
      var numRows = limit / trueWidth;
      for(var row = 0; row < numRows; row++) {
        for(var i = 0; i < halfRow; i += 4) {
          var offset = row * trueWidth;
          var r = data[offset + i];
          var g = data[offset + i + 1];
          var b = data[offset + i + 2];
          var o = data[offset + i + 3];

          var rightPos = offset + trueWidth - i - 4;
          var swapR = data[rightPos];
          var swapG = data[rightPos + 1];
          var swapB = data[rightPos + 2];
          var swapO = data[rightPos + 3];

          data[offset+i] = swapR;
          data[offset+i+1] = swapG;
          data[offset+i+2] = swapB;
          data[offset+i+3] = swapO;
        }
      }
      return new ImageData(data, idata.width);
    },
    darkEdges: function (idata) {
      var data = idata.data;
      var limit = data.length;
      var trueWidth = idata.width * 4;
      var rows = limit / trueWidth;
      var middleRow = rows / 2;
      var middleWidth = trueWidth / 2;

      for(var row = 0; row < rows; row++) {
        var offset = row * trueWidth;
        for(var i = 0; i < trueWidth; i += 4) {
          var it = offset + i;
          var inc = -(Math.abs(middleRow - row) / middleRow) * 80;
          inc = inc + -(Math.abs(middleWidth - i) / middleWidth) * 80;

          data[it] = (data[it] + inc);
          data[it + 1] = data[it + 1] + inc;
          data[it + 2] = data[it + 2] + inc;
        }
      }
      return new ImageData(data, idata.width);
    },
    slices: (function () {
      var variance = 0;
      return function (idata) {
        variance = (variance + 5) % video.offsetWidth +1;

        var numSlices = 40;

        var data = idata.data;
        var trueWidth = idata.width * 4;
        var limit = data.length;
        var rows = limit / trueWidth;
        var rowsPerSlice = Math.ceil(rows / numSlices);
        var sliceLen = rowsPerSlice * trueWidth;

        var shift = variance ? variance : 5;
        var shiftAmount = shift * 4;

        for(var sliceStart = 0; sliceStart < limit; sliceStart += sliceLen) {
          // Used to determine slice shift direction
          shiftAmount = -shiftAmount;
          if(sliceStart % trueWidth != 0) throw { Woofter: "woo" }
          for(var rowStart = 0; rowStart < sliceLen; rowStart += trueWidth) {

            if(rowStart % trueWidth != 0) throw { Woofter: "woo" }
          var hold = [];
            for(var i = 0; i < trueWidth; i += 4) {
              var idx = sliceStart + rowStart + i;
              var swapOffset = i + shiftAmount < 0 ? 
                trueWidth + (i + shiftAmount) : 
                ( i + shiftAmount) % trueWidth;
          
              var swapIdx = sliceStart + rowStart + swapOffset;

              hold[i] = data[swapIdx];
              hold[i + 1] = data[swapIdx + 1];
              hold[i + 2] = data[swapIdx + 2];
              hold[i + 3] = data[swapIdx + 3];
            }
            for(var j = 0; j < hold.length; j += 4) {
              var idx2 = sliceStart + rowStart + j;
              data[idx2] = hold[j];
              data[idx2 + 1] = hold[j + 1];
              data[idx2 + 2] = hold[j + 2];
              data[idx2 + 3] = hold[j + 3];
            }
          }
        }

        return new ImageData(data, idata.width);
      }
    })()
  };
} // end getEffects

function getVids (video, effects): IVidDescription[] {
  console.log('getting vids', video);
    return [
      {
        video: video,
        effect: effects.edgeDetect,
        title: "Edge detect"
      },
      // {
      //   video: video,
      //   effect: effects.splitMirror,
      //   title: "Mirror Split"
      // },
      // {
      //   video: video,
      //   effect: effects.grey,
      //   title: "Greyscale"
      // },
      // {
      //   video: video,
      //   effect: effects.red,
      //   title: "Redness"
      // },
      // {
      //   video: video,
      //   effect: effects.blue,
      //   title: "Blueness"
      // },
      // {
      //   video: video,
      //   effect: effects.green,
      //   title: "Greenness"
      // },
      // {
      //   video: video,
      //   effect: effects.darkEdges,
      //   title: "Diamond"
      // },
      // {
      //   video: video,
      //   effect: effects.slices,
      //   title: "Slices"
      // },
      // {
      //   video: video,
      //   effect: effects.mirror,
      //   title: "Mirror"
      // }
    ];
} // end getVids

@Component({
  selector: 'app-capture',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.css']
})
export class CaptureComponent implements OnInit {

  private stream: MediaStream;
  private vids: IVidDescription[] = [];
  private playing: boolean = false;
  
  @ViewChild('myVideo') video;

  constructor() {
    
  }

  play() {
    const video = this.video.nativeElement as HTMLVideoElement;
    console.log('getEffects', typeof(getEffects));
    this.playing = true;
    navigator.mediaDevices.getUserMedia(
      { // Options
        video: true, 
        audio: false
      }).then((localMediaStream) => { // Success
        this.stream = localMediaStream;
        video.src = URL.createObjectURL(this.stream);
        video.addEventListener('canplay', () => {
          let effects = getEffects(video);
          this.vids = getVids(video, effects);
          video.play();
        });
      }).catch(function(err) { // Failure
        console.error('getUserMedia failed', err);
        alert('getUserMedia failed');
      });
  }
  
  stop() {
    this.stream.getTracks().forEach(track => track.stop());
  }
  
  ngOnInit() {
    
  }
}