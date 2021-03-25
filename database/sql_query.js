async function sqlQuery(connection, query, data) {
    return new Promise((resolve, reject) => {
        connection.query(query, data, (err, rows) => {
            if (err) {
                throw "Query was unsuccesful";
            }
            else {
                resolve(rows);
            }
        })
    })
}

module.exports = sqlQuery;