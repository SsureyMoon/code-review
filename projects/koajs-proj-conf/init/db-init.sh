arangosh \
    --server.endpoint=$ARANGO_SERVER_ENDPOINT \
    --server.password=$ARANGO_ROOT_PASSWORD \
    --javascript.execute-string \
'
const username='\"$DB_USERNAME\"';
const passwd='\"$DB_PASSWORD\"';
const dbname='\"$DB_NAME\"';

const createUser = (username, passwd, dbname, userDao) => {
    if(userDao.all().map(obj=>obj.user).indexOf(username) < 0){
        userDao.save(username, passwd)
        userDao.grantDatabase(username, dbname);
    }
    userDao.grantDatabase(username, dbname);
}

var users = require("@arangodb/users");

if (db._databases().indexOf(dbname) < 0){
    db._createDatabase(dbname)
    createUser(username, passwd, dbname, users);
} else {
    createUser(username, passwd, dbname, users);
}
'
