$CONTAINER_NAME = "backend_db"

# find docker container id starting from its name
$CONTAINER_ID = docker ps -qf "name=$CONTAINER_NAME"

$DATABASE_NAME = "unilink"
$BACKUP_FILE = "backup.sql"

# export data
docker exec -i $CONTAINER_ID /usr/bin/mysqldump -u root --password=root $DATABASE_NAME > $BACKUP_FILE
