import { Database as FirebaseDatabase } from 'firebase/database';
import { ÉµgetAllInstancesOf } from '@angular/fire';
import { from, timer } from 'rxjs';
import { concatMap, distinct } from 'rxjs/operators';

// see notes in core/firebase.app.module.ts for why we're building the class like this
// tslint:disable-next-line:no-empty-interface
export interface Database extends FirebaseDatabase {}

export class Database {
  constructor(database: FirebaseDatabase) {
    return database;
  }
}

export const DATABASE_PROVIDER_NAME = 'database';

// tslint:disable-next-line:no-empty-interface
export interface DatabaseInstances extends Array<FirebaseDatabase> {}

export class DatabaseInstances {
  constructor() {
    return ÉµgetAllInstancesOf<FirebaseDatabase>(DATABASE_PROVIDER_NAME);
  }
}

export const databaseInstance$ = timer(0, 300).pipe(
  concatMap(() => from(ÉµgetAllInstancesOf<FirebaseDatabase>(DATABASE_PROVIDER_NAME))),
  distinct(),
);
