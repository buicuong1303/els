# $MONGODB_BIN_DIR/mongo admin --host 127.0.0.1 --port $MONGODB_PORT_NUMBER -u root -p $MONGODB_ROOT_PASSWORD << EOF
#     db.createUser({ user: "mongodb" , pwd: "mongodb", roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]})
#     db.getSiblingDB('els');
#     use els
#     db.test.insert({"description":"just for show database on management tools"})
#     EOF

set -e

mongo <<EOF
use $MONGO_INITDB_DATABASE

db.createUser({
  user: '$MONGO_INITDB_USER',
  pwd: '$MONGO_INITDB_PWD',
  roles: [{
    role: 'readWrite',
    db: '$MONGO_INITDB_DATABASE'
  }]
})
EOF
