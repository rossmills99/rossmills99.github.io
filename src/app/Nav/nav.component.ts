import { Component, OnInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
})
export class NavComponent implements OnInit {

  getClass(path: string) {
    return this.location.path() == path;
  }

  constructor(private location: Location) { }

  ngOnInit() {
  }

}
