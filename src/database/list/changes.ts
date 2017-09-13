import { fromRef } from '../observable/fromRef';
import { Observable } from 'rxjs/Observable';
import { DatabaseQuery, ChildEvent, SnapshotChange} from '../interfaces';
import 'rxjs/add/operator/scan';
import 'rxjs/add/observable/merge';

// TODO(davideast): check safety of ! operator in scan
export function listChanges<T>(ref: DatabaseQuery, events: ChildEvent[]): Observable<SnapshotChange[]> {
  const childEvent$ = events.map(event => fromRef(ref, event));
  return Observable.merge(...childEvent$)
  .scan((current, change) => {
    const { snapshot, event } = change; 
    switch (change.event) {
      case 'added':
        return [...current, change];
      case 'removed':
        // ! is okay here because only value events produce null results
        return current.filter(x => x.snapshot!.key !== snapshot!.key);
      // default will also remove null results
      default:
        return current;
    }
  }, []);
}