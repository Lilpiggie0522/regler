# Modern Team evaluation System - ContriBalance

## Prerequisites
1. Prepare a csv file containing course code and term code in title, eg, "COMP3900_24T3_TeamInfo.csv."
2. Edit the csv file so that it contains validated user information, note that to be able to receive authentication code, access to email address provided in .csv file will be required.\
**A sample .csv file is provided in the repository, you can edit information contained in the file.**

### Run with npm run dev
1. Clone repository using ```git@github.com:unsw-cse-comp99-3900/capstone-project-2024-t3-3900h18acowhorse.git``` or download cowhorse3900.zip and unzip it.
2. Open a terminal and navigate to the root directory of the project.
3. Install dependencies using ```npm install```.
4. Create a file named .env containing environment variables needed (**Environment variables is sent over email**).
5. Run ```npm run dev```.
6. Login via staff login page using email yu.t.chen@unsw.edu.au.
7. Import prepared .CSV file by clicking on the button ```import csv```.

### Run in docker container
1. Clone repository using ```git@github.com:unsw-cse-comp99-3900/capstone-project-2024-t3-3900h18acowhorse.git``` or download cowhorse3900.zip and unzip it.
2. Open a terminal and navigate to the root directory of the project, make sure you are at the root directory of the project, otherwise, docker build will fail.
3. Create a file named .env containing environment variables needed (**Environment variables is sent over email**).
4. Open docker desktop application on your device.
5. Run ```docker build -t cowhorse3900:latest .``` and wait for docker to build the image
6. After docker image is built, run ```docker run --env-file .env -p 3000:3000 cowhorse3900:latest```, a container will start from the cowhorse3900:latest image with environment variables being passed into the container.
