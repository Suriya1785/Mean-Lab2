
# Cricket Leagues app using (Express Generator - Server functions)
#### Author : Suriya N Rajamani

## Purpose: 
It creates the servel level functions to support operation for cricket leagues app such as user login & authentication, registration and list the current leagues using Express Generator. It is pre-requisite for lab-3(i.e. to server the webpage).  

## Server URL and its functions:
- Root URL    : http://localhost:3000/index (Return index hbs)
- leagues URL : http://localhost:3000/leagues/data (Return list of leagues and display it in browser)
- Register URL: http://localhost:3000/users/register (User registration / Validate through postman collection folder)
- Login URL    : http://localhost:3000/users/login (user login / Validate through postman collection folder)

## Server setup and start
This assumes that the user has Node.js installed globally on their machine. Download the project from git and follow the below step. Ignore if express-generator is already installed at global level.

## Install Module
```
$ npm install express-generator -g
```

## Generate the App
```
$ cd GIT_DOWNLOADED AND EXTRACTED PROJ DIRECTORY (ex:C:\.\Mean-Lab2)

   install dependencies:
     $ cd MeanLab2 && npm install

   run the app:
     $ DEBUG=MeanLab2:* npm start


$ cd MeanLab2
$ npm install
npm notice created a lockfile as package-lock.json. You should commit this file.
added 83 packages in 5.319s

$ npm start
```

### Launch App
Load [http://localhost:3000/](http://localhost:3000/index) in your browser


## Useful link(s)
* [Express Generator](https://expressjs.com/en/starter/generator.html)

## Reporting issues
Use [Github Issues section for this repository](https://github.com/Suriya1785/Mean-Lab2/Issues) to report any issues with the notes.

Examples of the kind of issues that may need reporting:
+ Typos
+ Code samples not working as described
+ Broken or moved links
+ Etc.

# Credits
- content provided by [icc](https://www.icc-cricket.com/about/)
