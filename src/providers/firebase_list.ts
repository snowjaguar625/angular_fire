import {Provider} from 'angular2/core';
import {DEFAULT_FIREBASE} from '../angularfire';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';

interface FirebaseListConfig {
  token?:any;
  path?: string;
  query?: Array<Array<any>>;
}

export function FirebaseList (config?:FirebaseListConfig):Provider {
  return new Provider(config.token || FirebaseList, {
    useFactory: (url:string) => {
      return Observable.create((obs:Observer<any[]>) => {
        var arr:any[] = [];
        var firebaseRef = new Firebase(config.path);
        firebaseRef.on('child_added', (child:any) => {
          arr.push(child);
          obs.next(arr);
        });
        firebaseRef.on('child_moved', (child:any, prevKey:any) => {
          arr = arr.reduce((accumulator:any[], val:any, i:number) => {
            if (!prevKey && i==0) {
              accumulator.push(child);
            } else if(val.key() === prevKey) {
              accumulator.push(val);
              accumulator.push(child);
            } else if (val.key() !== child.key()) {
              accumulator.push(val);
            }
            return accumulator;
          }, []);
          obs.next(arr);
        });
      });
    },
    deps: [DEFAULT_FIREBASE]
  })
}