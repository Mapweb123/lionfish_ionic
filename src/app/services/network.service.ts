/*
  Authors : Mapweb (Ashwin Khandave)
  Website : https://mapwebtechnologies.com/
  App Name : Lionfish app
  Created : 25-Feb-2022
*/

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx'
import { BehaviorSubject, Observable, fromEvent, merge, of, from } from 'rxjs';
import { ToastController, Platform } from '@ionic/angular';
import { map } from 'rxjs/operators';


export enum ConnectionStatus {
  Online,
  Offline
}

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);
  public appIsOnline$: Observable<boolean>;
  public isOfflinePageShown: any;
  constructor(private network: Network, private toastController: ToastController, private plt: Platform,private router: Router) {
    this.plt.ready().then(() => {
      this.initConnectivityMonitoring();
      //this.initializeNetworkEvents();
      //let status =  this.network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
      //console.log("--status1--"+status);
      //this.status.next(status);
    });
  }
  
  private initConnectivityMonitoring() {

    if (!window || !navigator || !('onLine' in navigator)) return;

    this.appIsOnline$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    ).pipe(map(() => navigator.onLine))

  }
  
  public showOfflinepage() {
    this.router.navigate(['/nonetwork']);
  }

  public initializeNetworkEvents() { 
 
    this.network.onDisconnect().subscribe(() => { 
      if (this.status.getValue() === ConnectionStatus.Online) {
        console.log('WE ARE OFFLINE');
        this.updateNetworkStatus(ConnectionStatus.Offline);
      }
    });
 
    this.network.onConnect().subscribe(() => { 
      if (this.status.getValue() === ConnectionStatus.Offline) {
        console.log('WE ARE ONLINE');
        this.updateNetworkStatus(ConnectionStatus.Online);
      }
    });
  }
 
  private async updateNetworkStatus(status: ConnectionStatus) {
    this.status.next(status);
 
    let connection = status == ConnectionStatus.Offline ? 'Offline' : 'Online';
    let toast = this.toastController.create({
      message: `You are now ${connection}`,
      duration: 3000,
      position: 'bottom'
    });
    toast.then(toast => toast.present());
  }
 
  public onNetworkChange(): Observable<ConnectionStatus> { 
    return this.status.asObservable();
  }
 
  public getCurrentNetworkStatus(): ConnectionStatus { 
    return this.status.getValue();
  }
}