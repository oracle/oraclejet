/**
 * @license
 * Copyright (c) 2008 %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

/**
 * Checkpoint manager implementation for Oracle JET
 * @author Max Starets
 * @ignore
 */

function CheckpointManager(disabled) {
  var _DESCRIPTION = 'description';
  var _START = 'start';
  var _END = 'end';
  var _DURATION = 'duration';
  var _NAME = 'name';

  this._enabled = !disabled;
  this._records = {};

  /**
   * Starts a checkpoint
   * @param {!string} name - the name of the checkpoint
   * @param {string=} description - optional description of the checkpoint
   * @ignore
   */
  this.startCheckpoint = function (name, description) {
    if (this._enabled) {
      var record = this._records[name];
      if (record != null) {
        throw new Error('Checkpoint ' + name + ' has aleady been started');
      }

      record = {};
      record[_START] = this._getMillis();
      if (description !== undefined) {
        record[_DESCRIPTION] = description;
      }
      record[_NAME] = name;
      this._records[name] = record;
    }
  };

  /**
   * Ends a checkpoint
   * @param {!string} name - the name of the checkpoint
   * @ignore
   */
  this.endCheckpoint = function (name) {
    if (this._enabled) {
      var record = this._records[name];
      if (record == null) {
        throw new Error('Checkpoint ' + name + ' has not been started yet');
      }

      if (record[_END] != null) {
        throw new Error('Checkpoint ' + name + ' has been already ended');
      }

      var end = this._getMillis();
      record[_END] = end;
      record[_DURATION] = end - record[_START];
    }
  };

  /**
   * Retrieves a checkpoint record for a given name
   * @param {!string} name - the name of the checkpoint
   * @return {undefined|{start: number, end: number, duration: number, name: {string}, description: (string|undefined)}}
   * @ignore
   */
  this.getRecord = function (name) {
    return this._records[name];
  };

  /**
   * Retrieves all checkpoint records matching a regular expression
   * @param {!RegExp} regexp - regular expression to match
   * @return Array.{{start: number, end: number, duration: number, name: {string}, description: (string|undefined)}}
   * @ignore
   */
  this.matchRecords = function (regexp) {
    var records = [];

    var names = Object.keys(this._records);
    for (var i = 0; i < names.length; i++) {
      if (regexp.test(names[i])) {
        records.push(this._records[names[i]]);
      }
    }

    return records;
  };

  /**
   * @private
   */
  this._getMillis = function () {
    return new Date().getTime();
  };
}


/**
 * Global Checkpoint Manager instance that could be used until ojcore is loade,d
 * and oj.CHECKPOINT_MANAGER becomes available
 * @private
 */
// eslint-disable-next-line no-unused-vars
var __ojCheckpointManager = new CheckpointManager();

