 let dbPromised = idb.open("liga-inggris-kev", 1, upgradeDB => {
     if (!upgradeDB.objectStoreNames.contains("fav_teams")) {
         let TeamObjectStore = upgradeDB.createObjectStore("fav_teams", {
             keyPath: "id",
             autoIncrement: true
         });
         TeamObjectStore.createIndex("name", "name", {
             unique: false
         });
         TeamObjectStore.createIndex("id", "id", {
            unique: true
        });
     }

     if (!upgradeDB.objectStoreNames.contains("teams_cache")) {
        let TeamObjectStore = upgradeDB.createObjectStore("teams_cache", {
            keyPath: "id",
            autoIncrement: true
        });
        TeamObjectStore.createIndex("name", "name", {
            unique: false
        });
        TeamObjectStore.createIndex("id", "id", {
           unique: true
       });
    }
});

function saveTeamsCaches(teams) {
    
    getTeamsCachesById(teams.id).then(res => {

        if (res === undefined) {
            dbPromised.then(function (db){
                let tx = db.transaction("teams_cache", "readwrite");
                let store = tx.objectStore("teams_cache");
        
                store.add(teams);
        
                return tx.complete;
            }).then(function(){
                console.log("simpan teams")
            }).catch(function(){
                console.error("error teams not saved");
            });
        }
    })
    
}

function getTeamsCachesById(id){
    
    return new Promise(function(resolve, reject){
        dbPromised.then(function(db){
            let tx = db.transaction("teams_cache", "readonly");
            let store = tx.objectStore("teams_cache");

            return store.get(id);
        }).then(function(data){
            resolve(data);
        }).then(function(error){
            reject(error);
        })
    })
}

function saveTeamToIDB(team){
    dbPromised.then(function (db){
        let tx = db.transaction("fav_teams", "readwrite");
        let store = tx.objectStore("fav_teams");

        store.add(team);

        return tx.complete;
    }).then((data)=>{
        showNotification("Simpan")
        M.toast({html: 'Berhasil menambahkan team Favorite'})
        setTimeout(() => {
            window.location.reload()
        }, 800);
    }).catch((err)=>{
        console.log(err)
        console.error("My Fav is failed to saved");
    });
}

function getAll(){
    return new Promise(function(resolve, reject){
        dbPromised.then(function(db){
            let tx = db.transaction("fav_teams", "readonly");
            let store = tx.objectStore("fav_teams");

            return store.getAll();
        }).then(function(data){
            resolve(data);
        }).catch(function(error){
            reject(error);
        })
    });
}

function getById(id){
    return new Promise(function(resolve, reject){
        dbPromised.then(function(db){
            let tx = db.transaction("fav_teams", "readonly");
            let store = tx.objectStore("fav_teams");

            return store.get(id);
        }).then(function(data){
            
            resolve(data);
        }).then(function(error){
            reject(error);
        })
    })
}

function deleteTeamById(id){
    dbPromised.then(function(db){
        let tx = db.transaction("fav_teams", "readwrite");
        let store = tx.objectStore("fav_teams");
        store.delete(id);

        return tx.complete;
    }).then(function(){
        showNotification("Hapus")
        console.log("Data deleted");
        setTimeout(() => {
            window.location.reload()
        }, 800);
    })
}