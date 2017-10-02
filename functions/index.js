
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const nodemailer = require('nodemailer');
var cors = require('cors');
const secureCompare = require('secure-compare');

// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);

const mailTransport = nodemailer.createTransport(
  `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

const APP_NAME = 'The Ride Share';

//admin.initializeApp(functions.config().firebase);
// var firebaseConfig = functions.config().firebase;
// firebaseConfig.databaseAuthVariableOverride = {
//   uid: 'fbcfunction',
// };

var firebaseConfig = Object.assign({}, functions.config().firebase, {
  databaseAuthVariableOverride: {
    uid: 'some-uid',

  }
});

admin.initializeApp(firebaseConfig);


function sendWelcomeEmail(email, displayName, token) {
  const mailOptions = {
    from: '"The Ride Share" <sboblrcarpool@gmail.com>',
    to: email
  };

  // The user unsubscribed to the newsletter.
  mailOptions.subject = `Welcome to ${APP_NAME}!`;
  mailOptions.text = `Hey ${displayName}!, Welcome to ${APP_NAME}. Your token is ${token}, Please enter the token in the portal to verify the account.`;
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('New welcome email sent to:', email);
  });
}

exports.prepareVerificationMail = functions.database.ref('/users/{uid}/shellMailId')
  .onWrite(event => {
    console.log('event', event);
    console.log('event data', event.data);
    console.log('event data val', event.data.val());
    if (event.data && event.data.val() != null) {
      return event.data.adminRef.parent.once('value').then(function (snapshot) {
        console.log('snapval is the user id', snapshot.key);
        var userId = snapshot.key;
        //console.log('this is the userId', userId);
        return userId;
      }).then(function (userId) {
        console.log('this should be user id', userId);

        return admin.database().ref().child('userTokens').child(userId).child('token').once('value')
          .then(function (token) {
            console.log('this is the token', token);
            var displayName = event.data.val().toString();
            if (displayName.indexOf('@') > -1) {
              displayName = displayName.substring(0, displayName.indexOf('@'));
            }
            console.log('displayName', displayName);
            return sendWelcomeEmail(event.data.val(), displayName, token.val());
          }).catch(function (error) {
            console.log('error in reading the user token', error);
            return;
          });

      }).catch(function (error) {
        console.log('error in getting user key', error);
        return;
      });
    } else {
      return;
    }
  });

exports.setTheToken = functions.database.ref('/users/{uid}/personalEmail')
  .onWrite(event => {

    console.log('event data val', event.data.val());
    console.log(typeof event.data.val());
    if (event.data.val() != null) {
      //
      return event.data.adminRef.parent.once('value').then(function (snapshot) {
        console.log('snapval is the user id', snapshot.key);
        var userId = snapshot.key;
        //console.log('this is the userId', userId);
        return userId;
      }).then(function (userId) {
        console.log('this should be user id', userId);
        var token = parseInt(Math.random() * 100000);
        console.log('this is the token', token);
        return admin.database().ref().child('userTokens').child(userId).child('token').set(token).then(function (success) {

          console.log('success token set');
        }).catch(function (error) {
          console.log('Error token not set', error);
        });
      }).catch(function (error) {
        console.log('Error token not set', error);
      });
      //TOKEN PREVIOUSLY DOESNT EXIST THEN CREATE AND ASSIGN

    }
    else {
      console.log('personal email field value not present');
      return;
    }
  });


exports.removeActiveRequests = functions.https.onRequest((req, res) => {
  const key = req.query.key;

  // Exit if the keys don't match
  if (!secureCompare(key, functions.config().cron.key)) {
    console.log('The key provided in the request does not match the key set in the environment. Check that', key,
      'matches the cron.key attribute in `firebase env:get`');
    res.status(403).send('Security key does not match. Make sure your "key" URL query parameter matches the ' +
      'cron.key environment variable.');
    return;
  }

  console.log('delete all the active requests here');
  var userSeatsToUpdate = [];
  var firebaseRef = admin.database().ref().child('requests');

  return firebaseRef.once('value').then(function (snapshot) {
    snapshot.forEach(function (child) {
      if (userSeatsToUpdate.indexOf(child.val().requestedTo) < 0) {
        userSeatsToUpdate.push(child.val().requestedTo);
      }
    });
    return userSeatsToUpdate;
  }).then(function (success) {
    var promises = success.map(function (key) {
      return admin.database().ref().child('users').child(key).once("value");
    });

    return Promise.all(promises);
  }).then(function (snapshots) {
    var updates = {};
    snapshots.forEach(function (snapshot) {
      updates[snapshot.key + "/remainingSeats"] = snapshot.val().capacity;
    });
    return updates;

  }).then(function (listToUpdate) {
    var ref = admin.database().ref().child('users');
    return ref.update(listToUpdate);
  }).then(function (success) {
    console.log('success', success);
    //Add logic to move active requests to past requests, may for analytics    
    return firebaseRef.remove()    
  }).then(function(sucess) {
    console.log('active requests deleted', success);
    res.status(200).send('All requests are deleted');
  }).fcatch(function (error) {
    console.log('error:nightlyJob:', error);
    res.status(400).send('error', error);
  });

});



// CORS and Cloud Functions export logic
exports.verifyToken = functions.https.onRequest((req, res) => {
  var corsFn = cors();
  corsFn(req, res, function () {
    verifyTheUserToken(req, res);

  });
});


function verifyTheUserToken(req, res) {

  console.log('in verify token');
  if (req.method === 'PUT') {
    res.status(403).send('Forbidden!');
  }

  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>');
    res.status(403).send('Unauthorized');
  }



  const firebaseToken = req.headers.authorization.split('Bearer ')[1];
  const userId = req.body.uid;
  const receievedToken = req.body.token;

  return admin.auth().verifyIdToken(firebaseToken).then(decodedFirebaseToken => {
    console.log('ID Token correctly decoded', decodedFirebaseToken);
    console.log('req', req.body);
    return 'sucess';

  }).then(function (receivedValues) {

    return admin.database().ref().child('userTokens').child(userId).child('token').once('value');

  }).then(function (snapshot) {

    console.log('this is the snap', snapshot);
    if (!snapshot.val()) {
      return Promise.reject('token is not set ');
    }

    console.log('snapshot.val(): ', snapshot.val(), 'receievedToken :', receievedToken);
    if (snapshot.val() != receievedToken) {
      return Promise.reject('token doesnt match');
    }

    return 'verified';

  }).then(function (sucess) {

    return admin.database().ref().child('users').child(userId).child('isVerified').set(true);

  }).then(function (sucess) {
    //DO A REDIRECT
    console.log('success in setting verified to true');
    res.send();
  }).catch(function (error) {
    //DECIDE WHAT YOU WANT TO DO
    console.log('Error', error);
    return admin.database().ref().child('users').child(userId).child('isVerified').set(false).then(function (success) {
      console.log('Setting verified to false');
      res.send();
    }).catch(function (error) {
      //DECIDE WHAT YOU WANT TO DO
      console.log('Error in setting false', error);
      res.send();
    });

  });

}


exports.handleRequestsForCarpooling = functions.database.ref('/requests/{uid}/')
  .onWrite(event => {

    console.log('new val', event.data.val());
    console.log('old val', event.data.previous.val());

    var rootRef = event.data.adminRef.root.child("users");

    if (event.data.val() !== null) {
      if (event.data.previous.val() !== null) {
        let firebaseRef = rootRef.child(event.data.previous.val().requestedTo).child('remainingSeats');

        firebaseRef.transaction(function (remainingSeats) {
          console.log('remainingSeats11111', remainingSeats);
          return remainingSeats + 1;
        }).then(function (success) {

          console.log('sucss', success);
        }).catch(function (error) {
          console.warn('error', error);
        });
      }
      let firebaseRef = rootRef.child(event.data.val().requestedTo).child('remainingSeats');
      firebaseRef.transaction(function (remainingSeats) {
        console.log('remainingSeats', remainingSeats);
        return remainingSeats - 1;
      }).then(function (success) {

        console.log('req', success);
      }).catch(function (error) {
        console.warn('error', error);
      });
    } else {
      console.log('no data');

    }

  });


exports.setRemainingSeatsOnCapacityChange = functions.database.ref('/users/{uid}/capacity')
  .onWrite(event => {

    if (event.data.previous.val() == event.data.val())
      return;

    var userId = '';

    if (event.data && event.data.val() != null) {
      return event.data.adminRef.parent.once('value').then(function (snapshot) {
        console.log('snapval is the user id', snapshot.key);
        userId = snapshot.key;
        console.log('userid', userId);
        return userId;
      }).then(function (userId) {
        return admin.database().ref().child('requests').orderByChild("requestedTo").equalTo(userId).once('value');

      }).then(function (snapshot) {

        if (snapshot.val())
          return Object.keys(snapshot.val()).length;
        else
          return 0;
      }).then(function (activeRequest) {
        var userRef = admin.database().ref().child("users").child(userId);
        console.log('this is the capacity', event.data.val());
        console.log('this is the activeRequest', activeRequest);
        var remainingSeats = event.data.val() - activeRequest;
        return userRef.update({
          remainingSeats: remainingSeats,
        });
      }).then(function (success) {
        console.log('success');
      }).catch(function (error) {
        console.error('error:', error);

      });
    }
  });
