/*
  Authors : Mapweb (Ashwin Khandave)
  Website : https://mapwebtechnologies.com/
  App Name : Lionfish app
  Created : 25-Feb-2022
*/
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { ApiService } from '../api.service';


@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {

  private dbInstance: SQLiteObject;
  readonly db_name: string   = "lionfish_app.db";
  readonly db_table: string  = "tbl_catch";
  readonly db_table1: string = "tbl_catch_trapper";
  CATCHS: Array <any> ;
  is_inserted:any;  
  constructor(public api: ApiService,private platform: Platform,private sqlite: SQLite) { 
    this.createDatabaseConn();
  }

  // Create SQLite database 
  createDatabaseConn() {
    this.platform.ready().then(() => {
      //console.log(this.sqlite);
      this.sqlite.create({
        name: this.db_name,
        location: 'default'
      }).then((sqLite: SQLiteObject) => {
        this.dbInstance = sqLite;
        sqLite.executeSql(`
            CREATE TABLE IF NOT EXISTS ${this.db_table} (
              id INTEGER PRIMARY KEY,
              user_id INTEGER, 
              catch_count varchar(255),
              small_size varchar(255),
              large_size varchar(255),
			  small_size_cm varchar(255),
              large_size_cm varchar(255),
              fishing_pic text,
              date_added varchar(255),
              bottom_time varchar(255),
              average_depth varchar(255),
              dive_city varchar(255),
              fishing_for varchar(255),
              comment text,
              dive_day_time varchar(255),
              bottom_type varchar(255),
              region varchar(255),
              country varchar(255),
              county varchar(255),
              state varchar(255),
			  wholsale_lbs varchar(255),
			  wholsale_kg varchar(255),
              isSynced varchar(5),
              time_added varchar(255)
            )`, [])
          .then((res) => {
             console.log(JSON.stringify(res));
             this.createTrapperTable();
          })
          .catch((error) => alert(JSON.stringify(error)));
      }).catch((error) => alert(JSON.stringify(error)));
    });
  }

  public createTrapperTable() {
    this.dbInstance.executeSql(`
        CREATE TABLE IF NOT EXISTS ${this.db_table1} (
          id INTEGER PRIMARY KEY,
          user_id INTEGER, 
          catch_count varchar(255),
          date_added varchar(255),
          dive_city varchar(255),
          region varchar(255),
          country varchar(255),
          county varchar(255),
          state varchar(255),
          average_depth varchar(255),
          bottom_type varchar(255),
          proximity_to_reef varchar(255),
          soak_time_day varchar(255),
          soak_time_hours varchar(255),
          bycatch_total varchar(255),
          bycatch_species varchar(255),
          fishing_pic text,
          shared_note text,
          comment text,
          isSynced varchar(5),
          time_added varchar(255)
        )`, [])
      .then((res) => {
        console.log(JSON.stringify(res));
      })
      .catch((error) => alert(JSON.stringify(error)));
  }

  public addCatch(fields) {
    var user_id        = fields.user_id;
    var catch_count    = fields.catch_count;
    var small_size     = fields.smallest_one;
    var large_size     = fields.largest_one;
	var small_size_cm     = fields.smallest_one_cm;
    var large_size_cm     = fields.largest_one_cm;
    var fishing_pic    = fields.catch_pic;
    var date_added     = fields.catch_date;
    //var bottom_time    = fields.bottom_time_hh+":"+fields.bottom_time_mm;
	var bottom_time    = fields.bottom_time_mm;
    var average_depth  = fields.average_depth;
    var dive_city      = fields.dive_city;
    var fishing_for    = fields.opt_reason;
    var comment        = fields.catch_note;
    var dive_day_time  = fields.opt_dive_day_time;
    var bottom_type    = fields.bottom_type;
    var region         = fields.div_sel_region;
    var country        = fields.div_sel_country;
    var county         = fields.div_sel_country;
    var state          = fields.div_state;
	var wholsaleLbs		= fields.wholsale_lbs;
	var wholsaleKg		= fields.wholsale_kg;
	
    var isSynced       = 0;
    var tmp_date_Obj   = new Date();       
    var time_added     = tmp_date_Obj.getTime();
    return this.dbInstance.executeSql(`
      INSERT INTO ${this.db_table} (user_id, catch_count, small_size, large_size, small_size_cm, large_size_cm, fishing_pic, date_added, bottom_time, average_depth, dive_city, fishing_for, comment, dive_day_time, bottom_type, region, country, county, state, wholsale_lbs, wholsale_kg, isSynced, time_added) VALUES ('${user_id}', '${catch_count}', '${small_size}', '${large_size}', '${small_size_cm}', '${large_size_cm}', '${fishing_pic}', '${date_added}', '${bottom_time}', '${average_depth}', '${dive_city}', '${fishing_for}', '${comment}', '${dive_day_time}', '${bottom_type}', '${region}', '${country}', '${county}', '${state}', '${wholsaleLbs}', '${wholsaleKg}', '${isSynced}', '${time_added}')`, [])
    .then(() => {
      this.is_inserted = true;
      return this.is_inserted;
      //alert("Success");
    }, (e) => {
      this.is_inserted = false;
      return this.is_inserted;
      //alert(JSON.stringify(e.err));
    });
  }
  
  public addCatchTrapper(fields) {
    var user_id           = fields.user_id;
    var catch_count       = fields.catch_count;
    var date_added        = fields.catch_date;
    var dive_city         = fields.dive_city;
    var region            = fields.div_sel_region;
    var country           = fields.div_sel_country;
    var county            = fields.div_sel_country;
    var state             = fields.div_state;
    var average_depth     = fields.average_depth;
    var bottom_type       = fields.bottom_type;
    var proximity_to_reef = fields.proximity_to_reef;  
    var soak_time_day     = fields.soak_time_day; 
    var soak_time_hours   = fields.soak_time_hours; 
    var bycatch_total     = fields.bycatch_total;
    var bycatch_species   = fields.bycatch_species;
    var fishing_pic       = fields.catch_pic;
    var shared_note       = fields.shared_note;
	var wholsale_lbs       = fields.wholsale_lbs;
	var wholsale_kg       = fields.wholsale_kg;
    var comment           = fields.private_note;
    var isSynced          = 0;
    var tmp_date_Obj      = new Date();       
    var time_added        = tmp_date_Obj.getTime();
    return this.dbInstance.executeSql(`
      INSERT INTO ${this.db_table1} (user_id, catch_count, date_added, dive_city, region, country, county, state, average_depth, bottom_type, proximity_to_reef, soak_time_day, soak_time_hours, bycatch_total, bycatch_species, fishing_pic, shared_note, wholsale_lbs, wholsale_kg, comment, isSynced, time_added) VALUES ('${user_id}', '${catch_count}', '${date_added}', '${dive_city}', '${region}', '${country}', '${county}', '${state}', '${average_depth}', '${bottom_type}', '${proximity_to_reef}', '${soak_time_day}', '${soak_time_hours}', '${bycatch_total}', '${bycatch_species}', '${fishing_pic}', '${shared_note}', '${wholsale_lbs}', '${wholsale_kg}', '${comment}', '${isSynced}', '${time_added}')`, [])
    .then(() => {
      this.is_inserted = true;
      return this.is_inserted;
      //alert("Success");
    }, (e) => {
      this.is_inserted = false;
      return this.is_inserted;
      //alert(JSON.stringify(e.err));
    });
  }

  getAllCatchs() {
    return this.dbInstance.executeSql(`SELECT * FROM ${this.db_table} WHERE isSynced = 0`, []).then((res) => {
      this.CATCHS = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          this.CATCHS.push(res.rows.item(i));
        }
      }
      return this.CATCHS;
    },(e) => {
      alert(JSON.stringify(e));
    });
  }

  getAllCatchTrappers() {
    return this.dbInstance.executeSql(`SELECT * FROM ${this.db_table1} WHERE isSynced = 0`, []).then((res) => {
      this.CATCHS  = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          this.CATCHS.push(res.rows.item(i));
        }
      }
      return this.CATCHS;
    },(e) => {
      alert(JSON.stringify(e));
    });
  }

  getMyOfflineCatchList() {
    if(localStorage.getItem('user_account_type') == 'trapper') {
        return this.getAllCatchTrappers();
    } else {
        return this.getAllCatchs();
    }
  }

  public syncWithServer() { 
    if(localStorage.getItem('user_account_type') == 'trapper') { 
        this.syncToServerAllCatchTrappers();
    } else {
        this.syncToServerAllCatchs();
    }
    setTimeout(() => {
      this.deleteAllSyncedRecords();
    },10000);
  }

  public syncToServerAllCatchs() { 
     this.getAllCatchs().then((res:any) => {
      if (res.length > 0) {
        for (var i = 0; i < res.length; i++) {
            res[i].action = "add_offline_catch";
            this.api.postItem('add_offline_catch', res[i]).subscribe((resp:any) => { 
              if(resp.data) {
                var id = resp.data[0];
                if(parseInt(id) > 0) {
                  this.updateCatchTbl(id);
                }
              }
            }, err => {
              console.log(err);
            });
        }
      }
     });
  }

  public syncToServerAllCatchTrappers() {
    this.getAllCatchTrappers().then((res:any) => {
      if (res.length > 0) {
        for (var i = 0; i < res.length; i++) {
            res[i].action = "add_offline_catch_trapper";
            this.api.postItem('add_offline_catch_trapper', res[i]).subscribe((resp:any) => { 
              if(resp.data) {
                var id = resp.data[0];
                if(parseInt(id) > 0) {
                  this.updateCatchTrapperTbl(id);
                }
              }
            }, err => {
              console.log(err);
            });
        }
      }
     });
  }

  public updateCatchTbl(id) {
    let sql = `UPDATE ${this.db_table} SET isSynced = ? WHERE id = ?`;
    let data = [1, id];
    return this.dbInstance.executeSql(sql, data).catch((e) => console.error(e));
  }

  public updateCatchTrapperTbl(id) {
    let sql = `UPDATE ${this.db_table1} SET isSynced = ? WHERE id = ?`;
    let data = [1, id];
    return this.dbInstance.executeSql(sql, data).catch((e) => console.error(e));
  }

  public deleteAllSyncedRecords() {
    if(localStorage.getItem('user_account_type') == 'trapper') {  
        this.deleteAllSyncedCatchTrappers();
    } else {
        this.deleteAllSyncedCatchs();
    }
  }

  public deleteAllSyncedCatchs() {
    let sql  = `SELECT * FROM ${this.db_table} WHERE isSynced = ?`;
    let data = [1];
    this.dbInstance.executeSql(sql,data).then((res) => {
      if (res.rows.length > 0) {
        let dsql  = `DELETE FROM ${this.db_table} WHERE isSynced = ?`;
        let ddata = [1];
        this.dbInstance.executeSql(dsql, ddata).catch((e) => console.error(e));
      }
    });
  }

  public deleteAllSyncedCatchTrappers() {
    let sql  = `SELECT * FROM ${this.db_table1} WHERE isSynced = ?`;
    let data = [1];
    this.dbInstance.executeSql(sql,data).then((res) => {
      if (res.rows.length > 0) {
        let dsql  = `DELETE FROM ${this.db_table1} WHERE isSynced = ?`;
        let ddata = [1];
        this.dbInstance.executeSql(dsql, ddata).catch((e) => console.error(e));
      }
    });
  }
}