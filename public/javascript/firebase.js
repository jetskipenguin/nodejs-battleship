const db = require('./db');
const firebase = require("firebase-admin");
const { getAuth, signInAnonymously, verifyBeforeUpdateEmail} = require('firebase/auth');
const dbRef = db.fb;

async function createPlayer( nickname ) {

    let initAuth = new Promise((resolve, reject) => {
        const auth = getAuth();
        signInAnonymously(auth)
            .then(() => {
                // TODO: theres a chance two players can have the same ID
                uid = idGen(10);
                let playerRef = dbRef.ref(`players/${player.uid}`);
                playerRef.set({
                    nickname: nickname,
                    id: uid
                })
                playerRef.onDisconnect().remove();
                resolve();
            })
            .catch((error) => {
                console.log('FIREBASE ERROR CODE: ' + error.code)
                console.log(error.message)
                reject();
            })
    })
    await initAuth;
}


module.exports = {createPlayer}