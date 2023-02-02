const express = require('express');

module.exports = (app) => {
  const find = (filter = {}) => app.db('transfers').where(filter).select();

  return { find };
};
