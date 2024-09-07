# UniLink 

This project was done with [Flask](https://flask.palletsprojects.com/en/2.2.x/?highlight=s)

Flask version: 2.2.2

# Team members

- Nada Mohamed
- Alessia Rubini

# Database configuration and application start

- Go to `cd backend` folder 
- Verify to have mysql port 3306 not blinded, and to have docker in run status
- Run `docker-compose build`, to build all images
- Run `docker-compose up`, to start docker containers

# Running tests
- Go to `cd backend` folder 
- Verify to have mysql port 3306 not blinded, and to have docker in run status
- Run `docker-compose build`, to build all images
- You can run `docker-compose up`, to start docker containers
- In a new terminal run:
  - `docker exec -it backend_web /bin/sh`
  - `coverage run -m pytest /code/tests -v && coverage report > /code/tests/coverage.txt`

# Generate documentation
- Go to `cd backend/docs` folder
- Run `make html`

# Database Backup

Go to "backup_db" folder `cd backend/backup_db`
- After the docker containers start, you can import the dataset backup running `.\import_db.ps1` in a new powerShell terminal.
- If you have collect new records, you can restore the backup file running `.\export_db.ps1` in a new powerShell terminal.

