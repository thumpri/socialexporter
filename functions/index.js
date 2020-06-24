const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

const {Firestore} = require('@google-cloud/firestore');


exports.followerOnCreate = functions.firestore.document('followers/{followerId}').onCreate(async (snap, context) => {
	try {

		// console.log(snap.id);
		const data = snap.data()

		if (data.referrer) {
			// console.log(snap.id, data.referrer);
			return db.doc('/followers/'+data.referrer).update({ referralCount: Firestore.FieldValue.increment(1) })
		}

	} catch (error) {
		console.error(error.message || error)
	}
})
