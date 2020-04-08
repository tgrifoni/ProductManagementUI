import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private _isLoading: boolean;

  get isLoading(): boolean {
    return this._isLoading;
  }

  startedLoading() {
    window.setTimeout(() => this._isLoading = true);
  }

  finishedLoading() {
    window.setTimeout(() => this._isLoading = false);
  }
}
