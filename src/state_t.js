import DB from "./DB";

const db = new DB();

export default class State_t {
  createTable = () => {
    return new Promise(resolve => {
      //Category Table Start

      db.initDB().then(db => {
        db.transaction(tx => {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS State (c_id , value, country_id)"
          );
        });
      });

      resolve();
    });
  };

  addCategory(prod) {




    return new Promise(resolve => {
      db.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              "INSERT INTO State (c_id, value, country_id)  VALUES (?, ?, ?)",
              [prod.c_id, prod.value, prod.country_id]
            ).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then(result => {
              //   console.warn(result);

              db.closeDatabase(db);
            })
            .catch(err => {
              //   console.warn(err);
            });
        })
        .catch(err => {
          //   console.warn(err);
        });
    });
  }

  listCategory_all() {
    return new Promise(resolve => {
      const products = [];
      db.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql("SELECT * FROM State ", []).then(
              ([tx, results]) => {
                // console.log("Query completed");
                var len = results.rows.length;
                // alert(JSON.stringify(len));
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  //   console.warn(`Prod ID: ${row.OID}, Prod Name: ${row.Name}`);
                  const { c_id, value, country_id} = row;
                  products.push({
                    c_id,
                    value,
                    country_id
                  });
                }
                resolve(products);
              }
            );
          })
            .then(result => {
              db.closeDatabase(db);
            })
            .catch(err => {
              //   console.log(err);
            });
        })
        .catch(err => {
          // console.log(err);
        });
    });
  }





  listCategory(country_idd) {
    return new Promise(resolve => {
      const products = [];
      db.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql("SELECT * FROM State WHERE country_id= ?", [country_idd]).then(
              ([tx, results]) => {
                // console.log("Query completed");
                var len = results.rows.length;
                // alert(JSON.stringify(len));
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  //   console.warn(`Prod ID: ${row.OID}, Prod Name: ${row.Name}`);
                  const { c_id, value, country_id} = row;
                  products.push({
                    c_id,
                    value,
                    country_id
                  });
                }
                resolve(products);
              }
            );
          })
            .then(result => {
              db.closeDatabase(db);
            })
            .catch(err => {
              //   console.log(err);
            });
        })
        .catch(err => {
          // console.log(err);
        });
    });
  }









}
