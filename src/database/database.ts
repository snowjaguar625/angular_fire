import { Injectable } from '@angular/core';
import { database } from 'firebase/app';
import 'firebase/database';
import { FirebaseApp } from 'angularfire2';
import { PathReference, DatabaseQuery, DatabaseReference, DatabaseSnapshot, ChildEvent, ListenEvent, SnapshotChange, QueryFn, ListReference } from './interfaces';
import { getRef } from './utils';
import { createListReference } from './list/create-reference';

@Injectable()
export class AngularFireDatabase {
  database: database.Database;

  constructor(public app: FirebaseApp) {
    this.database = app.database();
  }

  list<T>(pathOrRef: PathReference, queryFn?: QueryFn): ListReference<T> {
    const ref = getRef(this.app, pathOrRef);
    let query: DatabaseQuery = ref;
    if(queryFn) {
      query = queryFn(ref);
    }
    return createListReference<T>(query);
  }

  object<T>(pathOrRef: PathReference) {

  }

}

