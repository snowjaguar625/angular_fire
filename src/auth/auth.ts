import { Inject, Injectable, NgZone, Optional, PLATFORM_ID } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, observeOn, shareReplay, switchMap } from 'rxjs/operators';
import {
  FIREBASE_APP_NAME,
  FIREBASE_OPTIONS,
  FirebaseAppConfig,
  FirebaseOptions,
  ɵAngularFireSchedulers,
  ɵfirebaseAppFactory,
  ɵkeepUnstableUntilFirstFactory,
  ɵlazySDKProxy,
  ɵPromiseProxy
} from '@angular/fire';
import { auth, User } from 'firebase/app';

export interface AngularFireAuth extends ɵPromiseProxy<auth.Auth> {}

@Injectable({
  providedIn: 'any'
})
export class AngularFireAuth {

  /**
   * Observable of authentication state; as of Firebase 4.0 this is only triggered via sign-in/out
   */
  public readonly authState: Observable<User|null>;

  /**
   * Observable of the currently signed-in user's JWT token used to identify the user to a Firebase service (or null).
   */
  public readonly idToken: Observable<string|null>;

  /**
   * Observable of the currently signed-in user (or null).
   */
  public readonly user: Observable<User|null>;

  /**
   * Observable of the currently signed-in user's IdTokenResult object which contains the ID token JWT string and other
   * helper properties for getting different data associated with the token as well as all the decoded payload claims
   * (or null).
   */
  public readonly idTokenResult: Observable<auth.IdTokenResult|null>;

  constructor(
    @Inject(FIREBASE_OPTIONS) options: FirebaseOptions,
    @Optional() @Inject(FIREBASE_APP_NAME) nameOrConfig: string|FirebaseAppConfig|null|undefined,
    // tslint:disable-next-line:ban-types
    @Inject(PLATFORM_ID) platformId: Object,
    zone: NgZone
  ) {
    const schedulers = new ɵAngularFireSchedulers(zone);
    const keepUnstableUntilFirst = ɵkeepUnstableUntilFirstFactory(schedulers, platformId);

    const auth = of(undefined).pipe(
      observeOn(schedulers.outsideAngular),
      switchMap(() => zone.runOutsideAngular(() => import('firebase/auth'))),
      map(() => ɵfirebaseAppFactory(options, zone, nameOrConfig)),
      map(app => app.auth()),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.authState = auth.pipe(
      observeOn(schedulers.outsideAngular),
      switchMap(auth => new Observable<User|null>(auth.onAuthStateChanged.bind(auth))),
      keepUnstableUntilFirst
    );

    this.user = auth.pipe(
      observeOn(schedulers.outsideAngular),
      switchMap(auth => new Observable<User|null>(auth.onIdTokenChanged.bind(auth))),
      keepUnstableUntilFirst
    );

    this.idToken = this.user.pipe(
      switchMap(user => user ? from(user.getIdToken()) : of(null))
    );

    this.idTokenResult = this.user.pipe(
      switchMap(user => user ? from(user.getIdTokenResult()) : of(null))
    );

    return ɵlazySDKProxy(this, auth, zone);

  }

}
