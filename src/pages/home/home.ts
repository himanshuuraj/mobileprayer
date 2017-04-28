import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//import { Contacts } from '@ionic-native';
import {Prayercircle} from '../prayercircle/prayercircle';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  aboutPage = Prayercircle;
  constructor(public navCtrl: NavController) {
    //console.log(Contacts);
    //this.aboutPage = prayercircle;
  }

  openFilters(){
    this.navCtrl.setRoot(this.aboutPage);
  }
}
