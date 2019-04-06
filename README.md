# WebAppProj
This is the repository for my university final year project. 

Project setup:
Download node.js
Download visual studio
Extract/un zip the .zip folder to a location of your choice. (Or just clone/download the project via GitHub.)
(Note: Only the “” folder is necessary for now, the “” and “” folders will be needed for later steps.)
From within Visual Studio, open the solution file. (File, open).
Double click the solution file to load the project?
Next, in windows explorer navigate to the “” folder where you should see the following:
Next, navigate to this location in Command Prompt or PowerShell, and type “npm install”. This command may take some time to complete. If this doesn’t work or you receive any errors, try running Command Prompt or PowerShell as administrator or ensure that node.js was downloaded correctly. If this doesn’t solve the problem, Google the error (Sorry).
Ensure that valid issuer and valid audience within “appsettings.json” match the localhost port number on your machine.

Database setup:
Download sql server
Download sql server management studio
https://campus.barracuda.com/product/backup/doc/15892599/how-to-restore-a-microsoft-sql-database-to-a-point-in-time/
Restore from “”.bak file in the database > backup folder.
Get connection string and replace the existing string in “appsettings.json” in visual studio. Ensure that the general format of the new connection string matches the old one.

Launching/running the project:
Assuming the previous steps have been completed you should now be ready to build and run the application.
From within Visual Studio, build the solution (Build < Build Solution). Once built, then run the project (Debug < Start without debugging). You can debug if you want, it will just take longer to launch and isn’t necessary for this stage.

User credentials:
There are two types of users, Trainers and Trainees.
Trainer:
Username: joe@joe.com
Password: joepassword

Trainee:
Username: jim@jim.com
Password: jimpassword

You can also register a new user, however the existing users have existing groups, quizzes and results.

Trainers are able to:
•	Create a group.
•	Add and remove trainees to and from that group.
•	Create quizzes for trainees in that group.
•	View a list of quizzes they have created and view them individually.
•	View trainee results by quiz.
•	Export results to CSV file.

Trainees are able to:
•	Complete quizzes available to them and view their results.
•	View a list of uncompleted quizzes available to them that they can complete.
•	View a list of completed quizzes and their score for that quiz.

Both users are able to:
•	Adjust accessibility settings such as the high contrast theme.


Explanation of code and project structure.
ClientApp
Controllers

Tables
StoredProcedures
UserDefinedData.
