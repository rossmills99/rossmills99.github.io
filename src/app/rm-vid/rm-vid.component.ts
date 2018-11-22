import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

export interface IVidDescription {
  video: HTMLVideoElement,
  effect: (any) => any,
  title: string
}

@Component({
  selector: 'app-rm-vid',
  templateUrl: './rm-vid.component.html',
  styleUrls: ['./rm-vid.component.css']
})
export class RmVidComponent implements OnInit {

  @Input() vid: IVidDescription;
  @ViewChild('canvas') canvas: ElementRef;

  constructor() { }

  ngOnInit() {
    var w = this.vid.video.clientWidth;
    var h = this.vid.video.clientHeight;
    var canvas = <HTMLCanvasElement>this.canvas.nativeElement;
    var vid = this.vid;
    
    canvas.width = w;
    canvas.height = h;

    var bcanvas = document.createElement('canvas');
    bcanvas.width = w;
    bcanvas.height = h

    var context: CanvasRenderingContext2D = canvas.getContext('2d');
    var bcontext: CanvasRenderingContext2D = bcanvas.getContext('2d');

    function draw(video, context: CanvasRenderingContext2D, bcontext: CanvasRenderingContext2D, w, h) {
      if(video.paused || video.ended) {
        console.log("video paused/ended");
        return false;
      }
      bcontext.drawImage(video, 0, 0, w, h);

      var idata = bcontext.getImageData(0, 0, w, h);
      context.putImageData(vid.effect(idata), 0, 0);

      setTimeout(draw, 200, video, context, bcontext, w, h);
    }
    
    var video = vid.video;
    video.addEventListener('play', function() {
      draw(video, context, bcontext, w, h);	
    });
  }
}
