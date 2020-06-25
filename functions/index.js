const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

const { Firestore } = require('@google-cloud/firestore');


exports.followerOnCreate = functions.firestore.document('followers/{followerId}').onCreate(async (snap, context) => {
	try {

		// console.log(snap.id)
		const data = snap.data()

		if (data.referrer) {
			// console.log(snap.id, data.referrer)
			return db.doc('/followers/' + data.referrer).update({ referralCount: Firestore.FieldValue.increment(1) })
		}

	} catch (error) {
		console.error(error.message || error)
	}
})


module.exports.userLeaderboard = functions.https.onCall(async (data, context) => {
	try {

		if (!data.uid) throw 'No user id provided'

		let snapshot = await db.collection('followers').where('uid', '==', data.uid).orderBy('referralCount', 'desc').limit(10).get()
		let followers = snapshot.docs.map(doc => ({ ...doc.data(), _id: doc.id }))

		let followersData = followers.map(f => {
			let result = {
				followerId: f._id,
				referralCount: f.referralCount,
			}
			if (context.auth && (context.auth.uid == data.uid)) {
				result.followerEmail = f.followerEmail
			}
			return result
		})

		return followersData

	} catch (error) {
		console.error(error.message || error)
	}
})
