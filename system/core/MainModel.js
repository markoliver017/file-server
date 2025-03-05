const {connection, Mysql, bcrypt} = require('../../application/configurations/database');
const { Form_Validation } = require('../utilities/Autoload_Helper');

class Admin_Model {

    static query = undefined;
    static query_time = undefined;

    constructor() {
        this.form_validation = Form_Validation;
        this.Mysql = Mysql;
        this.bcrypt = bcrypt;
    }

    /* get all table row result*/
    async getQuery(query) {
        let start = new Date();
        return new Promise((resolve, reject) => {
            connection.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    Admin_Model.query = query;
                    Admin_Model.query_time = Date.now() - start;
                    resolve(results);
                }
            });
        });
    }

    /* get one row result*/
    async getQueryRow(query) {
        let start = new Date();
        return new Promise((resolve, reject) => {
            connection.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    Admin_Model.query = query;
                    Admin_Model.query_time = Date.now() - start;
                    resolve(results[0]);
                }
            });
        });
    }

    /* update and delete */
    setQuery(query) {
        let start = new Date();
        return new Promise((resolve, reject) => {
            connection.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    Admin_Model.query = query;
                    Admin_Model.query_time = Date.now() - start;
                    resolve(results);
                }
            });
        });
    }
}

module.exports = {
    Admin_Model: Admin_Model
};