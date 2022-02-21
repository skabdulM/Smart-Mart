// import { HttpHeaders, HttpClient } from '@angular/common/http';
// import { global } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs';
function _window() : any {
  return window;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  get nativeWindow() : any {
    return _window();
 }
}
