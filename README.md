## Lighthouse scores

[![Lighthouse score: 85/100](https://lighthouse-badge.appspot.com/?score=100&category=PWA)](https://github.com/ebidel/lighthouse-badge)
[![Lighthouse score: 98/100](https://lighthouse-badge.appspot.com/?score=98&category=Perf)](https://github.com/ebidel/lighthouse-badge)
[![Lighthouse score: 100/100](https://lighthouse-badge.appspot.com/?score=100&category=A11y)](https://github.com/ebidel/lighthouse-badge)

# About

The motivation for building this app is the current traffic condition of Bengaluru.

Most of the People travel alone in their vehicle, even though people want to travel together they wouldnt know who stays near their route.

There are already ride sharing platforms but most of them are open for public, so the safety and security question is still open, if the app is private we need to pay money making it private.
And for every ride we need to pay money, which doesnt make any sense.

Being nth car pool app, it should solve the fundamental problem of connecting people together and it should be free for the employees to use.
Thats exactly what it does, just suggests people going near your destination.

This app is built on Firebase and follows serverless architechture.
The running costs are almost nil. Which is major difference between this and other apps.

The app is running in my company since April 2017 without spending a penny on hosting and other services.

Follow the below steps for installing the app, Or email I can help you in installation.

# Demo
https://the-ride-share.firebaseapp.com


# Firebase and its config

1. Go to https://firebase.google.com/
2. Sign in
3. Click "Get Started"
4. Click "Add Project"
5. Give a project name, click save
6. From project home page go "Authentication" , click "Set up sign in method" and enable "Google"
7. On the firebase project page, click on "Hosting" and click on get Started"
8. Follow the instructions Install the firebase tools (Node and npm have to be installed)
9. Type "firebase init" to initialise the app.
10. Do the config as per the below image

![](installation/init.PNG)

# Installation of the app

1. Clone the repo to a seperate directory
2. Copy all the files except .firebaserc file
3. Copy and replace all the existing files
4. Go back to firebase project page and click "Add Firebase to your web app"
5. Replace the contents firebaseConfig.js with your app cofig
```
//REPLACE THE CONFIG WITH YOUR CONFIG
var config = {
    apiKey: "AIzaSyA9BvgAK00Af1lXWBiXbjQ1afKrm0oV3Cg",
    authDomain: "the-ride-share.firebaseapp.com",
    databaseURL: "https://the-ride-share.firebaseio.com",
    projectId: "the-ride-share",
    storageBucket: "the-ride-share.appspot.com",
    messagingSenderId: "4721624756"
};
firebase.initializeApp(config);

```
6. Create one more gmail account, this will help sending the verification emails
7. Type in credentials for newly created gmail account<br/>
``` firebase functions:config:set gmail.email="" gmail.password="" ```
8. We need to set these things for nodemailer to send emails, other wise google will block the login
9. Remove captcha https://g.co/allowaccess <br/>
	https://www.google.com/settings/security/lesssecureapps	 <br/>
    https://accounts.google.com/b/0/displayunlockcaptcha <br/>

10. Replace "gmail.com" in  with your company domain  <br/>
    line 22 in "database.rules.json" <br/> 
    line 137 in app.js <br/>
    line no 131 of index.html,<br/>
    this makes sure your app stays private to your company.
11. Set your city's geocode at line 386 and office geocode at line 568 in ``` mydetails.js ```
12. cd to functions directory and do type ``` npm install ```, this will install necessary npm modules
13. Add API keys for google maps, Visit for further instruction https://developers.google.com/maps/documentation/javascript/
14. In command line type "firebase deploy" and hit enter
15. After successful deploy, copy the hosting url and open in browser


Now you have private carpool app for you company
For any question and clarification please email me.

# Day to day operations
* Delete the existing requests on a nightly basis
    - Why? Whenever a person requests for a ride, the app reduces the capacity of car of the person who is offering ride
    - We cannot track the completion of the ride currently, hence we cannot reset the capacity after the ride completion, hence every night we need to reset the capacity

## Set up a cron job to trigger the http endpoint
* The `http` method is in `functions` folder in `index.js` i.e. `removeActiveRequests`
* We create and set a key to securely trigger this, 
```
npm install -g crypto
node -e "console.log(require('crypto').randomBytes(20).toString('hex'))"

firebase functions:config:set cron.key="<GENERATED_KEY>"
firebase functions:config:get cron.key
```
* The url will be
 ```
 https://us-central1-<PROJECT-ID>.cloudfunctions.net/removeActiveRequests?key=<YOUR_KEY>
 ```
* we will use <https://cron-job.org/en/> to set up the nightly trigger, because its 
free
* Open and sign up for `cron-job.org`, put the above url, and set to frequency to everyday 23.30 Hrs

# Developer docs
# To be updated
# App design 

# Database structure

![](installation/dbstructure.PNG)


