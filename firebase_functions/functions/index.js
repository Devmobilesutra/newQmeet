const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { document } = require('firebase-functions/lib/providers/firestore');
const moment = require('moment');
const moment_timezone = require('moment-timezone');

const { now } = require('moment');
// const moment = require('moment')
// const { DataSnapshot } = require('firebase-functions/lib/providers/database');

admin.initializeApp()
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// exports.check = functions.https.onCall((Data, context) => {
//     let ownerId = Data.ownerId
//     return admin.firestore().collection('owner').doc(ownerId).get().then( snapshot => {
//         console.log("availability",snapshot.data().Availablity)
//         console.log("start time",snapshot.data().appointment_start_time)
//         console.log("end time",snapshot.data().appointment_end_time)

//         let AST = snapshot.data().appointment_start_time.toMillis()
//         let AET = snapshot.data().appointment_end_time.toMillis()
//         let availability = snapshot.data().Availablity

//         console.log('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
//         // console.log('data', snapshot.data())
//         console.log("time 2 ",snapshot.data().appointment_end_time )
//         console.log("time 1 ",snapshot.data().appointment_start_time.toMillis() )
//         console.log("time curret ",now() )

//         // console.log("parsed time",Date.parse(AST))
//         if(availability === true) {

//             console.log('A')
//             return {msg : 1}

//         } else {
//             if( AST > now() ) {
//                 const t = moment(snapshot.data().appointment_start_time).format('hh:mm:ss');
//                 console.log('B', t)
//                 return {msg : `Please make an appointment after`}

//             } else if( AET < now() ) {

//                 console.log('c')
//                 return {msg : `online Appointment time has over`}
//             }
//              else {

//                 console.log('D')
//                 return {msg : 1}
//             }
//         }
//     })
//     .catch( err => {
//         return err
//     })
// })

// check function code by sanika
exports.check = functions.https.onCall((Data, context) => {
    let ownerId = Data.ownerId
    return admin.firestore().collection('appointment-count').doc(ownerId).get().then(snapshot => {
        //   console.log("count",snapshot.data().Appointment_numbers)
        let cnt = snapshot.data().Appointment_numbers

        return admin.firestore().collection('owner').doc(ownerId).get().then(snapshot => {

            let AST = moment(((snapshot.data().appointment_start_time.seconds * 1000) + (snapshot.data().appointment_start_time.nanoseconds / 1000000))).format('HH:mm:ss')
            let AET = moment(((snapshot.data().appointment_end_time.seconds * 1000) + (snapshot.data().appointment_end_time.nanoseconds / 1000000))).format('HH:mm:ss')
            let BST = moment(((snapshot.data().buisness_start_time.seconds * 1000) + (snapshot.data().buisness_start_time.nanoseconds / 1000000))).format('HH:mm:ss')
            let b_name = snapshot.data().Buisness_name

            //   let BST = snapshot.data().buisness_start_time.seconds
            let current = new Date()
            console.log("Date current",current)
            current1 = moment_timezone.tz(current, 'Asia/Calcutta').format();
            current = moment(current1).format('HH:mm:ss')

            console.log("App satrt time", typeof (AST), AST)
            console.log("indian timezone for Date current", current1)
            console.log("indian timezone for Date current wityh moment",current)
            console.log('end time', AET)
            let availability = snapshot.data().Availablity

            if (availability === true) {

                if (AST > current) { // condition for before business online appointment time start.
                    console.log(`Please make an appointment after` + AST)
                    return { msg: `Please make an appointment after` + AST, appointment: false }
                }
                else if (AET < current) { //condition for after business online appointment time ends.
                    console.log(`online Appointment time has over.`)
                    return { msg: `online Appointment time has over.`, appointment: false }
                }
                else if (AST <= current && BST >= current) {

                    if (cnt <= 3) {
                        console.log('Thanks for your booking.The place will open at approx ' + BST + ' Plese be available at ' + BST + ' Your appointment number is ' + cnt)
                        return { msg: 'Thanks for your booking.The place will open at approx ' + BST + ' Plese be available at ' + BST + ' Your appointment number is ' + cnt, appointment: true }
                    }
                    else {
                        console.log('Thanks for your booking. The place will open at approx ' + BST + ' Your appointment number is ' + cnt)
                        return { msg: 'Thanks for your booking. The place will open at approx ' + BST + ' Your appointment number is ' + cnt, appointment: true }
                    }

                }
                else if (AST <= current && BST <= current) { //condition for booking between online appoint time start upto business opens.

                    if (cnt === 1) {
                        console.log('There is no one in the queue.Plese be available at host place now.')
                        return { msg: 'There is no one in the queue.Plese be available at host place now.', appointment: true }
                    }
                    else if (cnt === 2) {
                        console.log('Your appointment has been confirmed just after one person.Plese be available at host place now.')
                        return { msg: 'Your appointment has been confirmed just after one person.Plese be available at host place now.', appointment: true }
                    }
                    else if (cnt === 3) {
                        console.log('Your appointment has been confirmed just after two people.Plese be available at host place now.')
                        return { msg: 'Your appointment has been confirmed just after two people.Plese be available at host place now.', appointment: true }
                    }
                    else if (cnt === 4) {
                        console.log('Your appointment has been confirmed just after three people.Plese be available at host place now.')
                        return { msg: 'Your appointment has been confirmed just after three people.Plese be available at host place now.', appointment: true }
                    }
                    else {
                        console.log('Your appointment has been confirmed and Your appointment number is' + cnt)
                        return { msg: 'Your appointment has been confirmed and Your appointment number is ' + cnt, appointment: true }
                    }
                    //business is open
                }
                return { msg: 'You can proceed for appointment' + cnt, appointment: true }
            }
            else {
                console.log('currently online appointment  has stopped by business '+ b_name)
                return { msg: 'currently online appointment  has stopped by business ' + b_name, appointment: false }
            }
        })
            .catch(err => {
                return { err }
            })
    })
        .catch(err => {
            return { err }
        })
})

// exports.checkAvailability = functions.https.onCall(( data, context ) => {
//     // let ownerId = data.data().ownerId
//     let ownerId = '9921965570'
//     let availability
//     return admin.firestore().collection('owner').doc(ownerId).then( snapshot => {
//         availability = snapshot.Availability
//         console.log(availability)
//         return snapshot
//     })
//     .catch( err => {
//         return err
//     })
// })


// exports.deleteAppointment = functions.https.onCall( (data, context) => {
//     console.log(data.id)
//     const deleted_item = admin.firestore().collection('appointment').doc(data.id).delete().then(() => {
//         console.log('data deleted succesfully');
//         return 'data deleted succesfully'
//     })
//     .catch( err => {
//         console.log('problem ocured while deleteing data, try once again :' + err);
//         return 'problem ocured while deleteing data, try once again'
//     })
// })
// exports.ownerCollection = functions.firestore.document(`owner/{ownerId}`).onCreate( (data, context) => {
//   console.log("data in owner collection ",data.data())
//   const onCreateownerId = data.id;
//    console.log(data.id)
//   admin.firestore().collection('appointment-count').doc(onCreateownerId).set({
//     ownerId: onCreateownerId,
//     Appointment_numbers: 1
//   })
// })

// exports.appointmentDelete = functions.firestore.document(`appointment/{appointment}`).onDelete( async (data, context) => {
//     // console.log(data)
//     let id = data.data().ownerId
//     console.log("owner cha id",id)
//     // console.log(data.data().ownerId)
//     // console.log(data.exists)
//     let appointment_no = data.data().Appointment_No
//     console.log("deleted appointment_no ",appointment_no)

//     let list_length
//     let snapshot = await admin.firestore().collection('appointment').where('ownerId', '==', id).get();
//         // console.log('snapshot', snapshot.size)
//         snapshot.forEach(element => {
//             // console.log("appointment list" , element.id)
//             if(element.data().Appointment_No > appointment_no ) {
//                 let new_appointment = element.data().Appointment_No - 1
//                 admin.firestore().collection('appointment').doc(element.id).update({
//                     Appointment_No: new_appointment
//                 })
//             }
//         });
//         list_length = snapshot.size + 1
//         return admin.firestore().collection('appointment-count').doc(id).update({
//             Appointment_numbers: list_length
//         })
//         // return list_length
// })


// exports.count = functions.firestore.document(`appointment/{appointmentId}`).onCreate(async (data, context) => {
//   // admin.firestore().collection()
//   console.log(data.data())
//   let value = data.data().ownerId
//   console.log(typeof(data.data().ownerId))
//   console.log("ownerIDDDDDD", data.data().ownerId)
//   await admin.firestore().collection('appointment').where('ownerId', '==', data.data().ownerId).get().then(sap => {
//     console.log(sap.size)
//     // return sap.size
//     return admin.firestore().collection('appointment-count').doc(value).set({
//       Appointment_numbers: sap.size + 1,
//       ownerId: value
//     })
//     // return sap.size
//   })
//     .catch(err => { return err })
// })

//---------------------------------------------- changes by sir for Count ----------------------------------------
// exports.count = functions.firestore.document(`appointment/{appointmentId}`).onCreate(async (data, context) => {
//   // admin.firestore().collection()
//   console.log(data.data())
//   let value = data.data().ownerId
//   console.log(typeof(data.data().ownerId))
//   console.log("ownerIDDDDDD", data.data().ownerId)
//   await admin.firestore().collection('appointment-count').doc(data.data().ownerId).get().then(sap => {
//     console.log(sap.data().Appointment_numbers)
//     // return sap.size
//     return admin.firestore().collection('appointment-count').doc(value).set({
//       Appointment_numbers: sap.data().Appointment_numbers + 1,
//       ownerId: value
//     })
//     // return sap.size
//   })
//     .catch(err => { return err })
// })

// exports.online_appointment = functions.https.onCall(async (data, context) => {
//   console.log(
//     'ownerId' + data.ownerId,
//     'userId' + data.userId,
//     'user_number' + data.user_number,
//     'userName' + data.userName,
//     'userId' + data.userId,
//     'owner_token' + data.owner_token,
//     'user_token' + data.user_token
//   )
//   await admin.firestore().collection('appointment-count').where('ownerId', '==', data.ownerId).get().then(snap => {
//     console.log(snap)
//     let app_number
//     snap.forEach(r => {
//       console.log(r);
//       console.log(r.data().Appointment_numbers)
//       app_number = r.data().Appointment_numbers
//     })
//     return admin.firestore().collection('appointment').add({
//       ownerId: data.ownerId,
//       timestamp: new Date(),
//       userId: data.userId,
//       user_mobileNo: data.user_number,
//       user_name: data.userName,
//       Appointment_No: app_number,
//       owner_token: data.owner_token,
//       user_token: data.user_token
//     })
//   })
//     .catch(err => {
//       return `appointment-count err ${err}`
//     })
// })

// exports.offline_appointment = functions.https.onCall(async (data, context) => {
//   console.log(
//     'ownerId ' + data.ownerId,
//     'user_number ' + data.user_number,
//     'userName ' + data.userName,
//     // 'owner_token ' + data.owner_token
//   )

//   await admin.firestore().collection('user').add({ // adding user to user collection
//     imageurl: null,
//     mobile_no: data.user_number,
//     name: data.userName,
//     user_token: null
//   }).then(async s => {

//     console.log('start to enter into appoinment-count')
//     // picking appointment count from appointment-count collection
//     const snap = await admin.firestore().collection('appointment-count').where('ownerId', '==', data.ownerId).get();
//       console.log(snap)
//       let app_number
//       snap.forEach(r => {
//         console.log(r);
//         console.log(r.data().Appointment_numbers)
//         app_number = r.data().Appointment_numbers
//       })
//       return admin.firestore().collection('appointment').add({ // adding appointment to appointment table
//         ownerId: data.ownerId,
//         timestamp: new Date(),
//         userId: s.id,
//         user_mobileNo: data.user_number,
//         user_name: data.userName,
//         Appointment_No: app_number,
//         owner_token: null,
//         user_token: null
//       })
//   })
//   .catch( err => {
//     return `adding user ${err}`
//   })

// })


// Check fuction code y sanika
// exports.check = functions.https.onCall(async (Data, context) => {
//     let ownerId = Data.ownerId
//     console.log(ownerId)
//     // const snapshot = await admin.firestore().collection('appointment-count').doc(ownerId).get().then(snapshot => {?
//     const snapshot = await admin.firestore().collection('appointment-count').doc(ownerId).get()
//     //   console.log("count",snapshot.data().Appointment_numbers)
//     let cnt = snapshot.data().Appointment_numbers

//     console.log(cnt)
//     return admin.firestore()
//         .collection('owner')
//         .doc(ownerId)
//         .get()
//         .then(
//             snapshot => {

//                 console.log("availability", snapshot.data().Availablity)
//                 console.log("start time", snapshot.data().appointment_start_time)
//                 console.log("name", snapshot.data().Buisness_name)

//                 // console.log("toDate")

//                 let start = snapshot.data().appointment_start_time.seconds
//                 let s_time = ((start * 1000) + (start / 1000000))
//                 console.log("end time", snapshot.data().appointment_end_time)
//                 let end = snapshot.data().appointment_end_time.seconds
//                 let e_time = ((end * 1000) + (end / 1000000))
//                 console.log("b_start time", snapshot.data().buisness_start_time)
//                 let buisness = snapshot.data().buisness_start_time.seconds
//                 let b_time = ((buisness * 1000) + (buisness / 1000000))
//                 console.log("b_end time", snapshot.data().buisness_end_time)

//                 let AST = moment(s_time).format('HH:mm:ss')
//                 // console.log("ishwar's timew", moment(Date(snapshot.data().appointment_start_time.seconds * 1000 + snapshot.data().appointment_start_time.nanoseconds/1000000)).format('hh:mm:ss a'))
//                 console.log("converted in seconds", typeof (AST), AST)
//                 console.log(b_time)

//                 let AET = moment(e_time).format('HH:mm:ss')
//                 let BST = moment(b_time).format('HH:mm:ss')

//                 console.log(AET)
//                 console.log(BST)
//                 console.log('after date',new Date((snapshot.data().buisness_start_time.seconds * 1000) + (snapshot.data().buisness_start_time.nanoseconds/1000000)).format('hh:mm:ss a'))
//                 let b_name = snapshot.data().Buisness_name
//                 let current = new Date();
//                 console.log('before ',current)
//                 current = moment(current).format('HH:mm:ss')
//                 console.log('moment conversion',current)
//                 console.log('timezone conversion',moment().tz(current, 'Asia/Culcutta').format())
//                 let availability = snapshot.data().Availablity

//                 if (availability === true) { // checkig whether appoitmet started or ot

//                     if (AST > current) { // condition for before business online appointment time start.
//                         //  console.log('B', AST)
//                         console.log(`Please make an appointment after` + AST)
//                         return { msg: `Please make an appointment after`, appointment: false }

//                     }
//                     else if (AET < current) { //condition for after business online appointment time ends.
//                         console.log(`online Appointment time has over.`)
//                         return { msg: `online Appointment time has over.`, appointment: false }
//                     }
//                     else if (AST <= current && BST >= current) {

//                         if (cnt <= 3) {
//                             console.log('Thanks for your booking.The place will open at approx' + BST + ' Please be available at' + BST + 'Your appointment number is' + cnt)
//                             return { msg1: 'Thanks for your booking.The place will open at approx', msg2: ' Please be available at time. Your appointment number is' + cnt, appointment: true }
//                         }
//                         else {
//                             console.log('Thanks for your booking. The place will open at approx' + BST + 'Your appointment number is' + cnt)
//                             return { msg1: 'Thanks for your booking. The place will open at approx',msg2: 'Your appointment number is' + cnt, appointment: true }
//                         }

//                     }
//                     else if (AST <= current && BST <= current) { //condition for booking between online appoint time start upto business opens.

//                         if (cnt === 1) {
//                             console.log('There is no one in the queue. Please be available at host place now.')
//                             return { msg: 'There is no one in the queue. Please be available at host place now.', appointment: true }
//                         }
//                         else if (cnt === 2) {
//                             console.log('Your appointment has been confirmed just after one person. Please be available at host place now.')
//                             return { msg: 'Your appointment has been confirmed just after one person. Please be available at host place now.', appointment: true }
//                         }
//                         else if (cnt === 3) {
//                             console.log('Your appointment has been confirmed just after two people. Please be available at host place now.')
//                             return { msg: 'Your appointment has been confirmed just after two people.Please be available at host place now.', appointment: true }
//                         }
//                         else if (cnt === 4) {
//                             console.log('Your appointment has been confirmed just after three people. Please be available at host place now.')
//                             return { msg: 'Your appointment has been confirmed just after three people. Please be available at host place now.', appointment: true }
//                         }
//                         else {

//                             console.log('Your appointment has been confirmed and Your appointment number is' + cnt)
//                             return { msg: 'Your appointment has been confirmed and Your appointment number is' + cnt, appointment: true }
//                         }
//                         //business is open
//                     }

//                     return { msg: 1, appointment: true }
//                 }
//                 else { // if availaility is false
//                     console.log('currently online appointment  has stopped by business' + ' ' + b_name)
//                     return { msg: 'currently online appointment has stopped by business' + ' ' + b_name, appointment: false }
//                 }
//             })
//         .catch(err => {
//             return { msg: err }
//         })
// })
