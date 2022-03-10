import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Platform } from '@ionic/angular';
import { SeoService } from './utils/seo/seo.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HistoryHelperService } from './utils/history-helper.service';

import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NetworkService, ConnectionStatus } from './services/network.service';
import { OfflineManagerService } from './services/offline-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [
    './side-menu/styles/side-menu.scss',
    './side-menu/styles/side-menu.shell.scss',
    './side-menu/styles/side-menu.responsive.scss'
  ]
})
export class AppComponent {
  appPages = [
    {
      title: 'Categories',
      url: '/app/categories',
      ionicIcon: 'list-outline'
    },
    {
      title: 'Profile',
      url: '/app/user',
      ionicIcon: 'person-outline'
    },
    {
      title: 'Contact Card',
      url: '/contact-card',
      customIcon: './assets/custom-icons/side-menu/contact-card.svg'
    },
    {
      title: 'Notifications',
      url: '/app/notifications',
      ionicIcon: 'notifications-outline'
    }
  ];
  accountPages = [
    {
      title: 'Log In',
      url: '/auth/login',
      ionicIcon: 'log-in-outline'
    },
    {
      title: 'Sign Up',
      url: '/auth/signup',
      ionicIcon: 'person-add-outline'
    },
    {
      title: 'Tutorial',
      url: '/walkthrough',
      ionicIcon: 'school-outline'
    },
    {
      title: 'Getting Started',
      url: '/getting-started',
      ionicIcon: 'rocket-outline'
    },
    {
      title: '404 page',
      url: '/page-not-found',
      ionicIcon: 'alert-circle-outline'
    }
  ];

  textDir = 'ltr';
  
  isSyncing : boolean = false;	
  
  // Inject HistoryHelperService in the app.components.ts so its available app-wide
  constructor(
    private platform: Platform,
	private splashScreen: SplashScreen,
    public translate: TranslateService,
    public historyHelper: HistoryHelperService,
    private seoService: SeoService,
	private router: Router,
	private _location: Location,
	private offlinemanager: OfflineManagerService,
	private networkService: NetworkService
  ) {
    this.initializeApp();
    this.setLanguage();
  }

  async initializeApp() {
    try {
     /*await SplashScreen.hide();*/
	 this.splashScreen.hide();
	 this.checkFornetworkAndOfflineManager();
    } catch (err) {
     console.log('This is normal in a browser', err);
    }
  }
  
  checkFornetworkAndOfflineManager() {
  	setTimeout(() => {
	  this.networkService.appIsOnline$.subscribe(online => {
		console.log("--online--");
		console.log(online);
		if (online) {
			localStorage.setItem('is_network_available', "yes");
			if(localStorage.getItem('user_user_id') == '' || localStorage.getItem('user_user_id') == null || localStorage.getItem('user_user_id') == 'null')
			{
				this.router.navigate(['/']);
			} else {
				if(this.networkService.isOfflinePageShown) {
					this.networkService.isOfflinePageShown = false;
					this.router.navigate(['/tabs/tab1']);
				}
				// call functions or methods that need to execute when app goes online (such as sync() etc)
				if(!this.isSyncing) {
					setTimeout(() => {
						this.isSyncing = true;
						this.offlinemanager.syncWithServer();
					},2000);
				}
			}
		} else {
			localStorage.setItem('is_network_available', "no");
			if(localStorage.getItem('user_user_id') == '' || localStorage.getItem('user_user_id') == null || localStorage.getItem('user_user_id') == 'null')
			{
				this.router.navigate(['/']);
			} else {
				// call functions on network offline, such as showOfflinepage()
				this.networkService.isOfflinePageShown = true;
				this.isSyncing = false;
				this.networkService.showOfflinepage();
			}
		}
	  })
	},5000); 
  }

  setLanguage() {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('en');

    // this is to determine the text direction depending on the selected language
    // for the purpose of this example we determine that only arabic and hebrew are RTL.
    // this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    //   this.textDir = (event.lang === 'ar' || event.lang === 'iw') ? 'rtl' : 'ltr';
    // });
  }

}
