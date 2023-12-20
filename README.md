# WebAppProj

This repository contains the codebase for my university final year project.

## Project Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (Download and install)
- [Visual Studio](https://visualstudio.microsoft.com/) (Download and install)

### Steps
1. Clone/download the project from GitHub.
2. Open the solution file in Visual Studio (File > Open).
3. Navigate to the `WebAppProj` folder in Command Prompt or PowerShell.
4. Run the command `npm install` to install project dependencies. (Note: Ensure Node.js is installed correctly and try running as administrator if any issues occur.)

### Configuration
- Update the valid issuer and valid audience in `appsettings.json` to match the localhost port number on your machine.

## Database Setup

### Prerequisites
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- [SQL Server Management Studio](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)

### Steps
1. Restore the database from the `.bak` file located in the `Database > Backup` folder.
   - Follow [these instructions](https://campus.barracuda.com/product/backup/doc/15892599/how-to-restore-a-microsoft-sql-database-to-a-point-in-time/) for assistance.
2. Obtain the connection string and replace the existing string in `appsettings.json` in Visual Studio.
   - Ensure the general format of the new connection string matches the old one.

## Launching/Running the Project

1. Build the solution in Visual Studio (Build > Build Solution).
2. Run the project (Debug > Start without debugging).
   - Debugging is optional but might take longer to launch.

## User Credentials

### Trainers
- **Username:** joe@joe.com
- **Password:** joepassword

### Trainees
- **Username:** jim@jim.com
- **Password:** jimpassword

You can also register a new user, but existing users have associated groups, quizzes, and results.

## User Features

### Trainers can:
- Create a group.
- Add and remove trainees to and from that group.
- Create quizzes for trainees in that group.
- View a list of quizzes they have created and view them individually.
- View trainee results by quiz.
- Export results to CSV file.

### Trainees can:
- Complete quizzes available to them and view their results.
- View a list of uncompleted quizzes available to them that they can complete.
- View a list of completed quizzes and their score for each quiz.

### Both Users can:
- Adjust accessibility settings, such as the high contrast theme.

## Explanation of Code and Project Structure

### ClientApp
- The frontend application.

### Controllers
- Backend controllers.

### Tables
- Database tables.

### Stored Procedures
- Database stored procedures.

### User Defined Data
- Additional user-defined data.

## License

This project is licensed under the [MIT License](LICENSE). See the [LICENSE](LICENSE) file for details.
