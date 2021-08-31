import { Component } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';

@Component({
  selector: 'app-home',
  template: `
    Hello world!
    {{ firebaseApp.name }}
    <app-upboats></app-upboats>
    <app-auth></app-auth>
    <app-database></app-database>
    <app-firestore></app-firestore>
    <app-messaging></app-messaging>
    <app-storage></app-storage>
    <app-functions></app-functions>
  `,
  styles: [``]
})
export class HomeComponent {
  constructor(public readonly firebaseApp: FirebaseApp) {
    console.log(firebaseApp);
  }
}
