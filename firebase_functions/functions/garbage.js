const functions = require('firebase-functions');
const admin = require('firebase-admin');
// const { DataSnapshot } = require('firebase-functions/lib/providers/database');

admin.initializeApp()
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.count = functions.https.onRequest((request, response) => {
  admin.firestore().collection('appointment').where('ownerId', '==', '9623126675').onSnapshot( data => {
    console.log(data)
  })
})
// exports.addAppointment = functions.https.onCall((data, context) => {
//     let dataContainer = []
//     const count = admin.firestore()
//     .collection('appointment')
//     .where('ownerId', '==', data.ownerId)
//     .get()
//     .then( snap => {

//         // pushing data into an array
//         snap.forEach( e => {
//             dataContainer.push(e.data())
//         })
//         console.log(dataContainer.length)
//         let number = dataContainer.length + 1 // incrementing count by 1 to set appintment number for an user
//         return admin.firestore()
//         .collection('appointment')
//         .add({
//             ownerId : data.ownerId,
//             timestamp: new Date(),
//             userId : data.userId,
//             user_mobileNo: data.user_number,
//             user_name: data.userName,
//             Appointment_No: number,   
//             owner_token: data.owner_token,
//             user_token: data.user_token
//         })
//         // .then( snap => {
//         //     console.log('user added successfully :', snap)
//         //     // response.status(200).send('user added succefully')
//         // })
//         // .catch( err => {
//         //     // response.status(500).send(err)
//         //     // return console.log('problem with setting an appointment : ', err)
//         // })
//     })
//     .catch(error => {
//         response.status(500).send(error)
//     })
//     // response.send(" total length of data is : ", dataContainer.length)
//     // return null
// })

// exports.getAppointment_List = functions.https.oncall((data, context) => {

//     const ownerId1 = data.ownerId
//     let dataContainer = []
//         return admin.firestore()
//         .collection('appointment')
//         .where('ownerId', '==', ownerId1 )
//         .get()
//         .orderBy("Appointment_No")
//         .then( snap => { 
//             snap.forEach(element => {
//                 dataContainer.push(element.data())
//             });
//             console.log(dataContainer)
//             return dataContainer
//         })
//         .catch((err) => {
//             // response.status(500).send(err)
//             console.log(err)
//             return err
//         })
// })

// exports.getAppointment_List = functions.https.onCall((data, context) => {
//     // ...
//     // const ownerId1 = '9921965570'
//     const ownerId1 = data.ownerId
//     let dataContainer = []
//     return admin.firestore()
//         .collection('appointment')
//         .where('ownerId', '==', ownerId1)
//         .get()
//         // .orderBy("Appointment_No")
//         .then(snap => {
//             snap.forEach(element => {
//                 dataContainer.push(element.data())
//             });
//             console.log(dataContainer)
//             return dataContainer
//         })
//         .catch((err) => {
//             // response.status(500).send(err)
//             console.log(err)
//             return err
//         })
// });

// exports.onSet_Appointment = functions.firestore.document('appointment/{appointmentId}').onCreate(async (snap, context) => {
//     const user_token = snap.user_token
//     const owner_token = snap.owner_token

//     console.log(snap);
//     console.log(user_token)
//     console.log(owner_token)

//     if(user_token && owner_token ){
//         await admin.messaging().sendMulticast({
//             tokens: [
//               /* ... */
//               'd2gpBHFAQbGBUm6TIdI-uh:APA91bGYF64TN1_lNN-KBxEAoVSQ5V3j2YccMfkuEqd6sOHm3lxr9s55QMv-7WgxFUV_9T2JzWrjoju6hgzPQzarXFINz65HpathJNwr9JLYL7KAjhCFT4kKIHATP9tBKCM0y0gMEu17',
//               'd2gpBHFAQbGBUm6TIdI-uh:APA91bGYF64TN1_lNN-KBxEAoVSQ5V3j2YccMfkuEqd6sOHm3lxr9s55QMv-7WgxFUV_9T2JzWrjoju6hgzPQzarXFINz65HpathJNwr9JLYL7KAjhCFT4kKIHATP9tBKCM0y0gMEu17'
//             ], // ['token_1', 'token_2', ...]
//             notification: {
//               title: 'Basic Notification',
//               body: 'This is a basic notification sent from the server!',
//               imageUrl: 'https://my-cdn.com/app-logo.png',
//             },
//           }).then(s => {
//               return true;
//           }).catch(() => {
//               return false;
//           });
//     } else {
//         await admin.messaging().sendMulticast({
//             tokens: [
//               /* ... */
//               'd2gpBHFAQbGBUm6TIdI-uh:APA91bGYF64TN1_lNN-KBxEAoVSQ5V3j2YccMfkuEqd6sOHm3lxr9s55QMv-7WgxFUV_9T2JzWrjoju6hgzPQzarXFINz65HpathJNwr9JLYL7KAjhCFT4kKIHATP9tBKCM0y0gMEu17'
//             ], // ['token_1', 'token_2', ...]
//             notification: {
//               title: 'Basic Notification',
//               body: 'This is a basic notification sent from the server!',
//               imageUrl: 'https://my-cdn.com/app-logo.png',
//             },
//           }).then(s => {
//             return true;
//         }).catch(() => {
//             return false;
//         });
//     }
// })


