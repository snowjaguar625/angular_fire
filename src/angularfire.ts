/// <reference path="../typings/main.d.ts" />

import {OpaqueToken, provide} from 'angular2/core';
import * as Firebase from 'firebase';

export const DEFAULT_FIREBASE = new OpaqueToken('DEFAULT_FIREBASE');
export const DEFAULT_FIREBASE_REF = new OpaqueToken('DEFAULT_FIREBASE_REF')

export const FIREBASE_PROVIDERS:any[] = [
  provide(DEFAULT_FIREBASE_REF, {
    useFactory: (url:string) => new Firebase(url),
    deps: [DEFAULT_FIREBASE]})
];

export {FirebaseList, FirebaseListConfig} from './providers/firebase_list';
export {FirebaseObservable} from './utils/firebase_observable';

// Helps Angular-CLI automatically add providers
export default {
  providers: FIREBASE_PROVIDERS
}
