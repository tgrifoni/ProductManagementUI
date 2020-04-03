import { Component } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

import { LoaderService } from './shared/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  get isLoading(): boolean {
    return this.loaderService.isLoading;
  }

  constructor(
    private router: Router,
    private loaderService: LoaderService) {
      router.events.subscribe(routerEvent => this.checkRouterEvent(routerEvent));
  }

  private checkRouterEvent(routerEvent: Event) {
    if (routerEvent instanceof NavigationStart) {
      this.loaderService.startedLoading();
    } else if (routerEvent instanceof NavigationEnd ||
        routerEvent instanceof NavigationCancel ||
        routerEvent instanceof NavigationError) {
      this.loaderService.finishedLoading();
    }
  }
}
