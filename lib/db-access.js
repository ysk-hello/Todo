'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
  'postgres://postgres:postgres@db/todo',
  {
    logging: false
  }
);

const Todo = sequelize.define(
  'Todo',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    content: {
      type: DataTypes.TEXT
    }
  },
  {
    freezeTableName: true,
    timestamps: true
  }
);

Todo.sync();
module.exports = Todo;