import {Provider} from 'angular2/core';
import {DEFAULT_FIREBASE} from '../angularfire';
import {Observer} from 'rxjs/Observer';
import {FirebaseObservable} from '../utils/firebase_observable';
import {absolutePathResolver} from '../utils/absolute_path_resolver';

export interface FirebaseListConfig {
  token?:any;
  path?: string;
}

export function FirebaseList (config?:FirebaseListConfig|string):Provider {
  var normalConfig = normalizeConfig(config);
  return new Provider(normalConfig.token, {
    useFactory: (defaultFirebase:string) => FirebaseListFactory(absolutePathResolver(defaultFirebase, normalConfig.path)),
    deps: [DEFAULT_FIREBASE]
  })
}

export function FirebaseListFactory (absoluteUrl:string): FirebaseObservable<any> {
  return new FirebaseObservable((obs:Observer<any[]>) => {
    var arr:any[] = [];
    this._ref = new Firebase(absoluteUrl);

    this._ref.on('child_added', (child:any) => {
      obs.next(arr = onChildAdded(arr, child));
    });

    this._ref.on('child_moved', (child:any, prevKey:any) => {
      obs.next(arr = onChildMoved(arr, child, prevKey));
    });
  });
}

export function normalizeConfig(config?:FirebaseListConfig|string):FirebaseListConfig {
  switch (typeof config) {
    case 'string':
      // If string, it's just the path of the collection.
      // The path automatically becomes the injectable token
      let strConf:string = <string>config;
      return {
        token: strConf,
        path: strConf
      };
    case 'object':
      let conf:FirebaseListConfig = config;
      let token:any;
      if (conf.token) {
        token = conf.token;
      } else if (conf.path) {
        token = conf.path;
      } else {
        token = FirebaseList;
      }
      return {
        token: token,
        path: conf.path
      };
    default:
      // Presumably no config info provided, default to root
      return {
        token: FirebaseList,
        path: ''
      }
  }
}

export function onChildAdded(arr:any[], child:any): any[] {
  var newArray = arr.slice();
  newArray.push(child);
  return newArray;
}

export function onChildMoved(arr:any[], child:any, prevKey:string): any[] {
  return arr.reduce((accumulator:any[], val:any, i:number) => {
    if (!prevKey && i==0) {
      accumulator.push(child);
      accumulator.push(val);
    } else if(val.key() === prevKey) {
      accumulator.push(val);
      accumulator.push(child);
    } else if (val.key() !== child.key()) {
      accumulator.push(val);
    }
    return accumulator;
  }, []);
}
