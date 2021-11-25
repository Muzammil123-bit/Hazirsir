import SQLite from "react-native-sqlite-storage";
// import Toast_ from "../functions/Toast_";

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "Country_db.db";
const database_version = "1.0";
const database_displayname = "Country Select";
const database_size = 1200000;

export default class DB {
  initDB() {
    let db;
    return new Promise(resolve => {
      //   console.warn("Plugin integrity check ...");
      SQLite.echoTest()
        .then(() => {
          //   console.warn("Integrity check passed ...");
          //   console.warn("Opening database ...");
          SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size
          )
            .then(DB => {
              db = DB;
              //   console.warn("Database OPEN");
              //1st table start
              // db.executeSql("SELECT 1 FROM Categories LIMIT 1")
              //   .then(() => {
              //     //   console.warn("Database is ready ... executing query ...");
              //   })
              //   .catch(error => {
              //     //   console.warn("Received error: ", error);
              //     //   console.warn("Database not yet ready ... populating data");
              //     db.transaction(tx => {
              //       tx.executeSql(
              //         "CREATE TABLE IF NOT EXISTS Categories (OID, Name, Picture, Type)"
              //       );
              //     })
              //       .then(() => {
              //         //   console.warn("Table created successfully");
              //       })
              //       .catch(error => {
              //         //   console.warn(error);
              //       });
              //   });
              // //1st table end

              // //2nd table start
              // db.executeSql("SELECT 1 FROM DB_Version LIMIT 1")
              //   .then(() => {})
              //   .catch(error => {
              //     db.transaction(tx => {
              //       tx.executeSql(
              //         "CREATE TABLE IF NOT EXISTS DB_Version (ID, Version)"
              //       );
              //     })
              //       .then(() => {})
              //       .catch(error => {});
              //   });
              //2nd table end

              resolve(db);
            })
            .catch(error => {
              console.warn(error);
            });
        })
        .catch(error => {
          console.warn("echoTest failed - plugin not functional");
        });
    });
  }

  closeDatabase(db) {
    if (db) {
      //   console.warn("Closing DB");
      db.close()
        .then(status => {
          //   console.warn("Database CLOSED");
        })
        .catch(error => {
          //   console.warn(error);
        });
    } else {
      //   console.warn("Database was not OPENED");
    }
  }

  clearDB = () => {
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(async tx => {
            tx.executeSql("DROP TABLE IF EXISTS Country");
            tx.executeSql("DROP TABLE IF EXISTS State");
            tx.executeSql("DROP TABLE IF EXISTS City");
           

            // tx.executeSql('DROP TABLE IF EXISTS Categories');
            await this.createTable(db);

            resolve();
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  };

  clearOnlyDB = () => {
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(async tx => {
            tx.executeSql("DROP TABLE IF EXISTS Country");
            tx.executeSql("DROP TABLE IF EXISTS State");
            tx.executeSql("DROP TABLE IF EXISTS City");
           
            // tx.executeSql('DROP TABLE IF EXISTS Categories');

            resolve();
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  };

  createTable = db => {
    return new Promise(resolve => {
      // Toast_("Storing");
      //Category Table Start
      db.transaction(tx => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS Country (c_id , value)"
        );
      });



      db.transaction(tx => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS State (c_id , value, country_id)"
        );
      });




      db.transaction(tx => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS City (c_id , value, state_id)"
        );
      });
      //Category Table End


      //Cart Table End

      resolve();
    });
  };
} //end of class
