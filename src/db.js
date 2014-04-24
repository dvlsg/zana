/*
 * @license
 * Copyright (C) 2014 Dave Lesage
 * License: MIT
 * See license.txt for full license text.
 */
(function(w, undefined) {
    var z = w.util || {};

    /**
        TODO
    */
    var db = {};
    var _database;
    var _dbType;

    db.build = function(schema) {
        z.check.isObject(schema);
        z.check.isArray(schema.Tables);
        var orderedTables = schema.Tables.orderBy("x => x.TableName");
        for (var i = 0; i < orderedTables.length; i++) {
            var table = orderedTables[i];
            db.makeTable(table);
        }
    };

    db.makeTable = function(table) {
        z.check.isObject(table);
        z.check.isString(table.TableName);
        z.check.isArray(table.PrimaryKeys);
        z.check.isArray(table.ForeignKeys);
        var tableBuilder = [];
        var columnBuilder = [];
        var keyBuilder = [];
        var refKeyBuilder = [];
        var primaryKeyBuilder = [];
        var foreignKeyBuilder = [];
        var keyDefinition;
        var tableDefinition;
        var columnDefinition;
        var primaryKeyDefinition;
        var foreignKeyDefinition;
        switch(_dbType) {
            case "sqlite": 
                // root table
                tableBuilder.push("CREATE TABLE IF NOT EXISTS " + table.TableName + " (");

                // handle columns
                for (var i = 0; i < table.Columns.length; i++) {
                    var column = table.Columns[i];
                    var columnType = db.types[column.DataType][_dbType];
                    columnType = (
                        columnType.length 
                            ? columnType.type + "(" + columnType.length + ")" 
                            : columnType.type
                    );
                    if (i === 0) {
                        columnBuilder.push("    " + column.ColumnName + " " + columnType + (column.IsNullable ? "" : " NOT NULL"));
                    }
                    else {
                        columnBuilder.push(column.ColumnName + " " + columnType + (column.IsNullable ? "" : " NOT NULL"));
                    }
                }
                columnDefinition = columnBuilder.join("\n    , ");
                tableBuilder.push(columnDefinition);

                // handle primary keys
                primaryKeyBuilder.push("    , PRIMARY KEY (");
                for (var i = 0; i < table.PrimaryKeys.length; i++) {
                    var primaryKey = table.PrimaryKeys[i].ColumnName;
                    keyBuilder.push(primaryKey);
                }
                primaryKeyBuilder.push(keyBuilder.join(", "));
                primaryKeyBuilder.push(")");
                primaryKeyDefinition = primaryKeyBuilder.join("");
                tableBuilder.push(primaryKeyDefinition);

                // TODO: Resolve composite foreign key issues

                // // handle foreign keys
                // keybuilder = [];
                // foreignKeyBuilder.push("    , FOREIGN KEY (");
                // var refTableName;
                // for (var i = 0; i < table.ForeignKeys.length; i++) {
                //     var fk = table.ForeignKeys[i];
                //     keyBuilder.push(fk.ColumnName);
                //     refKeyBuilder.push(fk.ReferencedColumnName);
                //     refTableName = fk.ReferencedTableName;
                // }
                // foreignKeyBuilder.push(keyBuilder.join(", "));
                // foreignKeyBuilder.push(") REFERENCES " + refTableName + "(");
                // foreignKeyBuilder.push(refKeyBuilder.join(", "));
                // foreignKeyBuilder.push(")");
                // tableBuilder.push(foreignKeyBuilder.join(""));

                // handle the final table items, join the inner items
                tableBuilder.push(")");
                tableDefinition = tableBuilder.join("\n");
                //z.log.log(tableDefinition);
                break;
        }
    };

    db.load = function(dbName, dbType, dbSizeInBytes) {
        z.check.isString(dbName);
        z.check.isString(dbType);
        z.check.isNumber(dbSizeInBytes);
        _dbType = dbType.toLowerCase();
        switch (_dbType) {
            case "sqlite":
                _database = openDatabase(dbName, "0.1", dbName, dbSizeInBytes);
                // TODO: define newsequentialid() function on sqlite database
                break;
        }
    };

    db.types = {
        "bit": {
            sqlite: { type: "INTEGER" } // sqlite stores booleans as integers 0 and 1
        }
        , "char": { 
            sqlite: { type: "TEXT" }
        }
        , "datetime": {
            sqlite: { type: "TEXT" } // sqlite doesnt have a built in DATETIME type
        }
        , "datetime2": {
            sqlite: { type: "TEXT" } // sqlite doesnt have a built in DATETIME2 type
        }
        , "decimal": {
            sqlite: { type: "REAL" }
        }
        , "float": {
            sqlite: { type: "REAL" }
        }
        , "int": {
            sqlite: { type: "INTEGER" }
        }
        , "money": {
            sqlite: { type: "REAL" }
        }
        , "nvarchar": { 
            sqlite: { type: "TEXT" }
        }
        , "smallint": {
            sqlite: { type: "INTEGER" }
        }
        , "smallmoney": {
            sqlite: { type: "REAL" }
        }
        , "text": {
            sqlite: { type: "TEXT" }
        }
        , "tinyint": {
            sqlite: { type: "INTEGER" }
        }
        , "varchar": { 
            sqlite: { type: "TEXT" }
        }
        , "uniqueidentifier": {
            sqlite: { type: "CHAR", length: 36 }
            , mssql: { type: "uniqueidentifier" } // todo: more
        }
    }

    z.db = db;
    w.util = z;
}(window || this));