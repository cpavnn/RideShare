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

##Demo
https://the-ride-share.firebaseapp.com


##Firebase and its config

1. Go to https://firebase.google.com/
2. Sign in
3. Click "Get Started"
4. Click "Add Project"
5. Give a project name, click save
6. From project home page go "Authentication" , click "Set up sign in method" and enable "Google"
7. On the firebase project page, click on "Hosting" and click on get Started"
8. Follow the instructions Install the firebase tools 
9. Type "firebase init" to initialise the app.
10. Do the config as per the below image

![](installation/init.PNG)

##Installation of the app

1. Clone the repo to a seperate directory
2. Copy all the files except .firebaserc file
3. Copy and replace all the existing files
4. Go back to firebase project page and click "Add Firebase to your web app"
5. Copy just the config variable, DO NOT COPY firebase.js script
6. Replace line # 730 to 738 in index.html
7. Replace line # 846 to 853 in mydetails.html
8. Replace line # 673 to 680 in requestride.html
9. Create one more gmail account, this will help sending the verification emails
10. Type in credentials for newly created gmail account:firebase functions:config:set gmail.email="" gmail.password=""
11. We need to set these things for nodemailer to send emails, other wise google will block the login
12. remove captcha https://g.co/allowaccess <br/>
	https://www.google.com/settings/security/lesssecureapps	 <br/>
    https://accounts.google.com/b/0/displayunlockcaptcha <br/>
13. In requestride.js replace line no 550  with the authDomain available in in config variable.
14. In mydetails.js replace line no 1477  with the authDomain available in in config variable.
15. Replace "gmail.com" in  with your company domain in "database.rules.json" line 22 and line 137 in app.js and line no 131 of index.html, this makes sure your app stays private to your company.
16. Add API keys for google maps, Visit for further instruction https://developers.google.com/maps/documentation/javascript/
17. In command line type "firebase deploy" and hit enter
18. After successful deploy, copy the hosting url and open in browser


Now you have private carpool app for you company
For any question and clarification please email me.