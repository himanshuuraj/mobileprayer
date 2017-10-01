import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Camera } from '@ionic-native/camera';
import { Contacts } from '@ionic-native/contacts';
import { Prayercircle } from '../pages/prayercircle/prayercircle';
import { PrayerRequestPage } from '../pages/prayer-request/prayer-request';
import { TermsAndConditionsPage } from '../pages/terms-and-conditions/terms-and-conditions';
import { HomeScreenPage } from '../pages/home-screen/home-screen';
import { RequestWaiting } from '../pages/request-waiting/request-waiting';
import { Whoispraying } from '../pages/whoispraying/whoispraying';
import { Keyboard } from '@ionic-native/Keyboard';
import { SwingModule } from 'angular2-swing';
import { Test } from '../pages/test/test';
import { Newtest } from '../pages/newtest/newtest';
import { Invitation } from '../pages/invitation/invitation';
import { SampleModalPage } from '../pages/sample-modal/sample-modal';
import { Auth } from '../pages/auth/auth';
import { Badge } from "@ionic-native/badge";
import { DailyInspiration } from "../pages/daily-inspiration/daily-inspiration";
import { Tithe } from "../pages/tithe/tithe";
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { Device } from '@ionic-native/device';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Prayercircle,
    PrayerRequestPage,
    TermsAndConditionsPage,
    HomeScreenPage,
    RequestWaiting,
    Whoispraying,
    Test,
    Newtest,
    Invitation,
    SampleModalPage,
    Auth,
    DailyInspiration,
    Tithe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    SwingModule,
    IonicModule.forRoot(MyApp,{scrollAssist : false,autoFocusAssist : false})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Prayercircle,
    PrayerRequestPage,
    TermsAndConditionsPage,
    HomeScreenPage,
    RequestWaiting,
    Whoispraying,
    Test,
    Newtest,
    Invitation,
    SampleModalPage,
    Auth,
    DailyInspiration,
    Tithe
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Contacts,
    Keyboard,
    Badge,
    InAppPurchase,
    Device,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
