import DB from "./DB";

const db = new DB();

export default class S_category {
  createTable = () => {
    return new Promise(resolve => {
      //Category Table Start

      db.initDB().then(db => {
        db.transaction(tx => {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS Country (c_id , value)"
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
              "INSERT INTO Country (c_id, value)  VALUES (?, ?)",
              [prod.c_id, prod.value]
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

  listCategory() {
    return new Promise(resolve => {
      const products = [];
      db.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql("SELECT * FROM Country", []).then(
              ([tx, results]) => {
                // console.log("Query completed");
                
                var len = results.rows.length;
               
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  //   console.warn(`Prod ID: ${row.OID}, Prod Name: ${row.Name}`);
                  const { c_id, value} = row;
                  products.push({
                    c_id,
                    value
                  });
                }

                // alert(JSON.stringify(products));
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
