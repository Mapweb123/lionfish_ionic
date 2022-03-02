import { Injectable } from '@angular/core';
import { HttpParams } from "@angular/common/http";
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Config } from './config';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {
    public newMessage:any;
    public response:any;
  
    constructor(private http: HttpClient, private config: Config) { }
  
  	private handleError<T> (operation = 'operation', result?: T) {
	  return (error: any): Observable<T> => {
	    //alert(error);
		//alert(JSON.stringify(error));
	    // TODO: send the error to remote logging infrastructure
	    console.error(error); // log to console instead
	    // Let the app keep running by returning an empty result.
	    return of(result as T);
	  };
	}

	postItem(endPoint, data = {}){
		var params = new HttpParams();
		for (var key in data) { if('object' !== typeof(data[key])) params = params.set(key, data[key]) }
		params = params.set('lang', this.config.lang);
		params = params.set('action', endPoint);
		const url = this.config.url + endPoint;
		return this.http.post(url, params, this.config.options).pipe(
		    tap(_ => {}),
		    catchError(this.handleError(endPoint))
		);
	}

	ajaxCall(endPoint, data = {}){
		var params = new HttpParams();
		for (var key in data) { if('object' !== typeof(data[key])) params = params.set(key, data[key]) }
		params = params.set('action', endPoint);
		const url = this.config.url + endPoint;
		return this.http.post(url, params, this.config.options).pipe(
		    tap(_ => {}),
		    catchError(this.handleError(endPoint))
		);
	}

	getExternalData(url, data = {}){
		var params = new HttpParams();
		for (var key in data) { if('object' !== typeof(data[key])) params = params.set(key, data[key]) }
		return this.http.post(url, params, this.config.options);
	}
}