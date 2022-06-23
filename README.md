# RV-041WebUI/Python

## Project requires Python 2.7

### Install instructions on ubuntu:

1. Install essential for pip

`sudo apt-get install python-pip python-dev build-essential`

2. Install virtualenv

`sudo pip install --upgrade virtualenv`

3. Create virtualenv

`virtualenv ~/venv/<Your venv name>`

4. Install posgresql

`sudo apt-get install postgresql postgresql-contrib`

5. Configure posgres db

```
sudo -u postgres psql
>>>CREATE USER admin WITH ENCRYPTED PASSWORD "12345678";
>>>CREATE DATABASE easyrest OWNER admin;
```

Or
in /etc/postgresql/9.x/main/pg_hba.conf add lines to the bottom of the file:

```
local   <dbname>    <usrname>                                    peer
host    <dbname>   <usrname>            127.0.0.1        md5 (edited)
```

and then restart postqresql service

`sudo service postgresql restart`

6. Install pip packeges inside virtual env

`(venv) pip install -e ".[testing]"`

7. Initialize db(with example data):

`(venv) initialize_easyrest_db --fill development.ini`

Drop and create empty database

`(venv) initialize_easyrest_db --reset development.ini`

Drop derivative models from Base

`(venv) initialize_easyrest_db --drop development.ini`

Reset and fill database

`(venv) initialize_easyrest_db --reset --fill development.ini`

```
--drop - Drop derivative models from Base
--fill - Create tables with test data (without create empty tables)
--reset - Drop and create empty database
```

8. Run tests

`(venv) pytest`

9. Run project

`(venv) pserve --reload development.ini`

#### For convinience you can add aliases below (to your .bash_aliases):

```
alias envoff=`deactivate`
alias envon=`source ~/venv/<Your venv name>/bin/activate`
```

# Alias to run pyramid and node serve in single comand

To run this you also need to specify your venv path in scripts/pyramidrun.sh and
node version to use in scripts/noderun.sh (if you don't use nvm delete this line)

```
alias reston='gnome-terminal --tab -e "$(pwd)/scripts/pyramidrun.sh" --tab -e "$(pwd)/scripts/noderun.sh"'
```

### Deploying via Docker

1. Install git, docker and docker-compose

[Install Docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

[Install Docker Compose](https://docs.docker.com/compose/install/)

 `sudo apt-get install git`
 
 `sudo apt-get install docker`
 
 `sudo apt-get install docker-compose`

2. install npm
 `sudo apt-get install npm`

3. install pip
 `sudo apt-get install python3-pip`

4. clone the repository
 `git clone git clone https://katemalash@bitbucket.org/katemalash/easyrest.git`

frontend

1. navigate to frontend

2. `npm install`

backend

1. navigate to project folder

2. `pip3 install --no-cache-dir -e ".[testing]"`
3. install SQLAlchemy:
 `pip install SQLAlchemy==1.3.24`

running project

`sudo docker-compose up`

filling db

`docker-compose run backend initialize_easyrest_db --fill development.ini`




Services links:

[Frontend](http://127.0.0.1:8880)
[Backend](http://127.0.0.1:8881)
[Adminer](http://127.0.0.1:8882)


---

## Install instructions on windows:

1. Make sure that you have python version 2.7

`python --version`

> After installation Python append paths to python.exe (i.e. C:\Python27) and path to directory Scripts (i.e. C:\Python27\Scripts) in the PATH environment variable.

2. If you are using Python 2 >=2.7.9 downloaded from python.org just make sure to upgrade pip:

`python -m pip install -U pip`

3. Install virtualenv

`pip install virtualenv`

4. Create virtualenv

`virtualenv %VENV%`

6. Activate virtualenv

`%VENV%\Scripts\activate`

7. Upgrade packaging tools in the virtual environment

`(%VENV%) pip install --upgrade pip setuptools`

8. Install pip packeges inside virtual env

`(%VENV%) pip install -e ".[testing]"`

9. Install posgresql and create database

10. Initialize db

`(%VENV%) initialize_easyrest_db --fill development.ini`

Drop and create empty database

`(%VENV%) initialize_easyrest_db --reset development.ini`

Drop derivative models from Base

`(%VENV%) initialize_easyrest_db --drop development.ini`

Reset and fill database

`(%VENV%) initialize_easyrest_db --reset --fill development.ini`

```
--drop - Drop derivative models from Base
--fill - Create tables with test data (without create empty tables)
--reset - Drop and create empty database
```

11. Run tests

`(%VENV%) pytest`

12. Run project

`pserve development.ini`

13. Navigate to frontend

`cd frontend`

14. Install Node.js

15. `npm install`

16. `npm start`
