import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loading: boolean;

  get isLoading(): boolean {
    return this.loading;
  }

  startedLoading() {
    window.setTimeout(() => this.loading = true);
  }

  finishedLoading() {
    window.setTimeout(() => this.loading = false);
  }
}
