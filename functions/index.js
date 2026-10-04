const { onSchedule } = require('firebase-functions/v2/scheduler');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

initializeApp();

const db = getFirestore();

exports.deleteExpiredChats = onSchedule(
  {
    schedule: 'every day 03:00',
    timeZone: 'Africa/Cairo',
    region: 'europe-west1',
    memory: '256MiB',
  },
  async () => {
    const now = Timestamp.now();
    const snapshot = await db
      .collection('chats')
      .where('expiresAt', '<=', now)
      .limit(100)
      .get();

    if (snapshot.empty) {
      console.log('No expired chats found.');
      return;
    }

    for (const chatDoc of snapshot.docs) {
      await db.recursiveDelete(chatDoc.ref);
      console.log(`Deleted expired chat ${chatDoc.id}`);
    }

    console.log(`Deleted ${snapshot.size} expired chat(s).`);
  }
);
