# Modern Team evaluation System - Regler

## Prerequisites

1. Prepare a csv file containing course code(four digits of alphabets followed by four digits of numbers) and term code in title (24T3 for 2024 term 3), eg, "ARTS5112_24T3_TeamInfo.csv."
2. Edit the csv file so that it contains validated user information, note that to be able to receive authentication code, access to email address provided in .csv file will be required.\
   **A sample .csv file is provided in the repository, you can edit information contained in the file.**

### Super admin and MongoDB database operation

To login to the staff interface for the **first time**, a super admin account is provided, which already exists in the MongoDB database that is currently being used, since login only requires entering email verification code, email verification code will be sent to the super admin email address: unsw_regler@outlook.com. Password for this email address is Regler@unsw!, please use this address to receive authentication code and login as a super admin. After login, click on the import .csv file button on the top right corner of the page to import information regarding course, groups, tutors and course admins into the system.

### Run with npm run dev

1. Clone repository using `git clone git@github.com:Lilpiggie0522/regler.git` or download the zip file and unzip it.
2. Open a terminal and navigate to the root directory of the project.
3. Install dependencies using `npm install`.
4. Create a file named .env containing environment variables needed (**Environment variables is sent over email**).
5. Run `npm run dev`.
6. Import prepared .CSV file by clicking on the button `import csv`.

### Run in docker container

1. Clone repository using `git clone git@github.com:Lilpiggie0522/regler.git` or download the zip file and unzip it.
2. Open a terminal and navigate to the root directory of the project, make sure you are at the root directory of the project, otherwise, docker build will fail.
3. Create a file named .env containing environment variables needed (**Environment variables is sent over email**).
4. Open docker desktop application on your device.
5. Run `docker build -t regler:latest .` and wait for docker to build the image
6. After docker image is built, run `docker run --env-file .env -p 3000:3000 regler:latest`, a container will start from the regler:latest image with environment variables being passed into the container.

### .CSV file format

To ensure the validity and consistency of the data, the .csv file needs to comply with the following formats:
Title format
Title of the .csv file needs to contain course code and term code, a valid title would be ARTS3900_24T3_group_info”, note that title should only contain only one course code and one term code.

### Data validity

Data should contain following columns with all columns having no empty values except for course_admin and admin_email, list existing course admins (lecturer) using course_admin and admin_email columns until all admins have been listed.
Here is an example that demonstrates the column names and values contained within:

### Column formats

.csv file should contain the following columns: zid, group name, class, mentor, group_id, group_id2, email, mentor_email, course_admin and admin_email. Name of each column can be named using Camel Case or with space in between.
Name: Refers to the name of student
Zid: Refers to the zid of student
Group name: Refers to the group name that the student is in
Class: Refers to the class code that student is in
Mentor: Refers to the name of the mentor which oversees the current team
Group id: Refers to the group id of the team
Group id 2: Refers to a unique identifier for the team
Email: Refers to the student’s email address (This is the email address to login as student)
Mentor email: Refers to mentor’s email address (This is the email address to login as tutor)
Course admin: Refers to the name of the course admin for the current course, can be left empty
Admin email: Refers to the email address of the course admin, can be left empty (This is the email address to login as admin)

**A sample .csv file is included in the GitHub repository for this project, should you have any questions.**

### Service replacement and maintenance

All external services that are involved in this web application are set up using environment variables, for instance, current connection to MongoDB database relies on variable MONGODB_URI specified in the environment variable file, swapping it for a different connection string will change the database this web application is connecting to. All services such as ImageKit, SMTP server and secret used to encrypt and decrypt JWT token can also be replaced similarly.

### Deployed web application on Microsoft Azure

This web application has been deployed to Microsoft Azure using continuous deployment set up on Github actions. To access the deployed web application, navigate to [https://regler.azurewebsites.net](https://regler.azurewebsites.net).
