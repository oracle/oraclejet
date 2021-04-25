(function() {
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcore-base', 'ojs/ojdomutils', 'ojs/ojvcomponent-element', 'ojs/ojtranslation', 'ojs/ojfilepickerutils'], function (exports, oj, DomUtils, ojvcomponentElement, Translations, ojfilepickerutils) {
  'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;

  var __decorate = null && null.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
      if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };

  var Props = function Props() {
    _classCallCheck(this, Props);

    this.accept = null;
    this.capture = 'none';
    this.disabled = false;
    this.selectOn = 'auto';
    this.selectionMode = 'multiple';
  };

  exports.FilePicker = /*#__PURE__*/function (_ojvcomponentElement$) {
    _inherits(FilePicker, _ojvcomponentElement$);

    var _super = _createSuper(FilePicker);

    function FilePicker(props) {
      var _this;

      _classCallCheck(this, FilePicker);

      _this = _super.call(this, props);
      _this.inDropZone = false;
      _this.isDroppable = false;
      _this.selecting = false;
      _this.state = {
        focus: false,
        validity: 'NA'
      };

      _this.rootElemRef = function (element) {
        _this.rootElem = element;
      };

      return _this;
    }

    _createClass(FilePicker, [{
      key: "_doSelectHelper",
      value: function _doSelectHelper(filelist) {
        var _this2 = this;

        var promise = new Promise(function (resolve) {
          _this2.elementPromiseResolver = resolve;
        });

        this._fileSelectedHelper(filelist);

        return promise;
      }
    }, {
      key: "_handleSelectingFiles",
      value: function _handleSelectingFiles(event) {
        var _a;

        if (event.type === 'click' || event.type === 'keypress' && event.keyCode === 13) {
          this.selecting = true;
          event.preventDefault();
          var props = this.props;
          ojfilepickerutils.pickFiles(this._handleFileSelected, {
            accept: props.accept,
            selectionMode: props.selectionMode,
            capture: (_a = props.capture) !== null && _a !== void 0 ? _a : 'none'
          });
          return true;
        }

        return false;
      }
    }, {
      key: "_handleFileSelected",
      value: function _handleFileSelected(files) {
        this._fileSelectedHelper(files);
      }
    }, {
      key: "_fileSelectedHelper",
      value: function _fileSelectedHelper(files) {
        if (files.length > 0) {
          var rejected = this._validateTypes(files).rejected;

          if (rejected.length > 0) {
            this._fireInvalidSelectAction(this._getMimeTypeValidationMessages(rejected), event, false);
          } else {
            this._handleFilesAdded(files, event);
          }
        }

        this.selecting = false;
      }
    }, {
      key: "_handleDragEnter",
      value: function _handleDragEnter(event) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, {
      key: "_handleDragOver",
      value: function _handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        var dataTransfer = event.dataTransfer;

        if (this.inDropZone) {
          return;
        }

        var ai = oj.AgentUtils.getAgentInfo();
        this.inDropZone = true;
        this.isDroppable = true;

        if (ai.browser !== oj.AgentUtils.BROWSER.SAFARI && ai.browser !== oj.AgentUtils.BROWSER.IE) {
          var files = dataTransfer.items;
          var messages = [];

          var selectionModeValid = this._validateSelectionMode(files);

          var droppable = this._validateTypes(files);

          if (selectionModeValid && droppable.rejected.length === 0) {
            this.updateState({
              validity: 'valid'
            });
          } else {
            this.isDroppable = false;

            if (selectionModeValid) {
              messages = this._getMimeTypeValidationMessages(droppable.rejected);
            } else {
              messages.push({
                severity: 'error',
                summary: Translations.getTranslatedString('oj-ojFilePicker.singleFileUploadError')
              });
            }

            this._fireInvalidSelectAction(messages, event, true);
          }
        } else {
          this.updateState({
            validity: 'valid'
          });
        }
      }
    }, {
      key: "_handleDragLeave",
      value: function _handleDragLeave(event, mimeTypeDropFail) {
        if (!this.inDropZone) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (!this.rootElem.contains(event.relatedTarget)) {
          this.inDropZone = false;
          this.updateState({
            validity: 'NA'
          });

          if (!this.isDroppable && !mimeTypeDropFail) {
            this.dragPromiseResolver();
            this.dragPromiseResolver = null;
          }
        }
      }
    }, {
      key: "_handleFileDrop",
      value: function _handleFileDrop(event) {
        if (this.inDropZone) {
          event.preventDefault();
          event.stopPropagation();

          var files = this._createFileList(event.dataTransfer.files);

          var mimeTypeDropFail = false;

          if (this.isDroppable) {
            var messages = [];

            if (this._validateSelectionMode(files)) {
              var droppable = this._validateTypes(files);

              if (droppable.rejected.length > 0) {
                messages = this._getMimeTypeValidationMessages(droppable.rejected);
                mimeTypeDropFail = true;
              }
            } else {
              messages.push({
                severity: 'error',
                summary: Translations.getTranslatedString('oj-ojFilePicker.singleFileUploadError')
              });
            }

            if (messages.length > 0) {
              this.isDroppable = false;

              this._fireInvalidSelectAction(messages, event, false);
            }

            if (this.isDroppable) {
              this._handleFilesAdded(files, event);
            }
          }

          this._handleDragLeave(event, mimeTypeDropFail);
        }
      }
    }, {
      key: "_handleFocusIn",
      value: function _handleFocusIn() {
        if (this.selecting) {
          return;
        }

        this.updateState({
          focus: !DomUtils.recentPointer()
        });
      }
    }, {
      key: "_handleFocusOut",
      value: function _handleFocusOut() {
        if (this.selecting) {
          return;
        }

        this.updateState({
          focus: false
        });
      }
    }, {
      key: "render",
      value: function render() {
        var props = this.props;
        var triggerSlot = this.props.trigger;

        if (props.disabled) {
          return this._renderDisabled(props, triggerSlot);
        }

        var clickHandler = props.selectOn != 'drop' ? this._handleSelectingFiles : undefined;
        return triggerSlot ? this._renderWithCustomTrigger(props, triggerSlot, clickHandler) : this._renderWithDefaultTrigger(props, clickHandler);
      }
    }, {
      key: "_renderDisabled",
      value: function _renderDisabled(props, triggerSlot) {
        var rootClasses = triggerSlot ? 'oj-filepicker' : 'oj-filepicker oj-filepicker-no-trigger';
        return ojvcomponentElement.h("oj-file-picker", {
          class: rootClasses
        }, ojvcomponentElement.h("div", {
          class: 'oj-filepicker-disabled oj-filepicker-container'
        }, triggerSlot || this._renderDefaultTriggerContent(props)));
      }
    }, {
      key: "_renderWithCustomTrigger",
      value: function _renderWithCustomTrigger(props, triggerSlot, clickHandler) {
        var dndHandlers = this._getDndHandlers(props);

        return ojvcomponentElement.h("oj-file-picker", {
          class: 'oj-filepicker' + this._getFocusClass(),
          ref: this.rootElemRef,
          onFocusin: this._handleFocusIn,
          onFocusout: this._handleFocusOut
        }, ojvcomponentElement.h("div", {
          onClick: clickHandler,
          onKeypress: this._handleSelectingFiles,
          onDragenter: dndHandlers.handleDragEnter,
          onDragover: dndHandlers.handleDragOver,
          onDragleave: dndHandlers.handleDragLeave,
          onDragend: dndHandlers.handleDragLeave,
          onDrop: dndHandlers.handleFileDrop,
          class: 'oj-filepicker-container'
        }, triggerSlot));
      }
    }, {
      key: "_renderWithDefaultTrigger",
      value: function _renderWithDefaultTrigger(props, clickHandler) {
        var validity = this.state.validity;
        var validityState = validity === 'valid' ? ' oj-valid-drop' : validity === 'invalid' ? ' oj-invalid-drop' : '';

        var dndHandlers = this._getDndHandlers(props);

        return ojvcomponentElement.h("oj-file-picker", {
          class: 'oj-filepicker oj-filepicker-no-trigger',
          ref: this.rootElemRef
        }, ojvcomponentElement.h("div", {
          onClick: clickHandler,
          onKeypress: this._handleSelectingFiles,
          class: 'oj-filepicker-container'
        }, ojvcomponentElement.h("div", {
          tabindex: '0',
          class: 'oj-filepicker-dropzone' + validityState + this._getFocusClass(),
          onDragenter: dndHandlers.handleDragEnter,
          onDragover: dndHandlers.handleDragOver,
          onDragleave: dndHandlers.handleDragLeave,
          onDragend: dndHandlers.handleDragLeave,
          onDrop: dndHandlers.handleFileDrop,
          onFocusin: this._handleFocusIn,
          onFocusout: this._handleFocusOut
        }, this._renderDefaultTriggerContent(props))));
      }
    }, {
      key: "_renderDefaultTriggerContent",
      value: function _renderDefaultTriggerContent(props) {
        var isSingle = props.selectionMode == 'single';
        var primary = props.primaryText;
        var primaryText;

        if (primary) {
          if (typeof primary === 'string') {
            primaryText = primary;
          } else {
            var primaryFunc = primary;
            primaryText = primaryFunc();
          }
        } else {
          primaryText = Translations.getTranslatedString('oj-ojFilePicker.dropzonePrimaryText');
        }

        var secondary = props.secondaryText;
        var secondaryText;

        if (secondary) {
          if (typeof secondary === 'string') {
            secondaryText = secondary;
          } else {
            var secondaryFunc = secondary;
            secondaryText = secondaryFunc({
              selectionMode: props.selectionMode
            });
          }
        } else {
          secondaryText = Translations.getTranslatedString(isSingle ? 'oj-ojFilePicker.secondaryDropzoneText' : 'oj-ojFilePicker.secondaryDropzoneTextMultiple');
        }

        return [ojvcomponentElement.h("div", null, ojvcomponentElement.h("div", {
          class: 'oj-filepicker-text'
        }, primaryText), ojvcomponentElement.h("div", {
          class: 'oj-filepicker-secondary-text'
        }, secondaryText)), ojvcomponentElement.h("div", {
          class: 'oj-filepicker-icon oj-fwk-icon-plus oj-fwk-icon'
        })];
      }
    }, {
      key: "_getDndHandlers",
      value: function _getDndHandlers(props) {
        return props.selectOn != 'click' ? {
          handleDragEnter: this._handleDragEnter,
          handleDragOver: this._handleDragOver,
          handleDragLeave: this._handleDragLeave,
          handleFileDrop: this._handleFileDrop
        } : {};
      }
    }, {
      key: "_getFocusClass",
      value: function _getFocusClass() {
        return this.state.focus ? ' oj-focus-highlight' : '';
      }
    }, {
      key: "_validateSelectionMode",
      value: function _validateSelectionMode(files) {
        return this.props.selectionMode !== 'single' || files.length === 1;
      }
    }, {
      key: "_validateTypes",
      value: function _validateTypes(files) {
        var accepted = [];
        var rejected = [];
        var file;
        var type;

        if (files) {
          for (var i = 0; i < files.length; i++) {
            file = files[i];
            var name = file.name;
            type = Translations.getTranslatedString('oj-ojFilePicker.unknownFileType');

            if (name) {
              var nameSplit = name.split('.');
              type = nameSplit.length > 1 ? '.' + nameSplit.pop() : type;
            }

            type = file.type ? file.type : type;

            if (accepted.indexOf(type) === -1 && rejected.indexOf(type) === -1) {
              if (this._acceptFile(file)) {
                accepted.push(type);
              } else {
                rejected.push(type);
              }
            }
          }
        }

        return {
          accepted: accepted,
          rejected: rejected
        };
      }
    }, {
      key: "_getMimeTypeValidationMessages",
      value: function _getMimeTypeValidationMessages(rejected) {
        var messages = [];

        if (rejected.length === 1) {
          messages.push({
            severity: 'error',
            summary: Translations.getTranslatedString('oj-ojFilePicker.singleFileTypeUploadError', {
              fileType: rejected[0]
            })
          });
        } else {
          messages.push({
            severity: 'error',
            summary: Translations.getTranslatedString('oj-ojFilePicker.multipleFileTypeUploadError', {
              fileTypes: rejected.join(Translations.getTranslatedString('oj-converter.plural-separator'))
            })
          });
        }

        return messages;
      }
    }, {
      key: "_acceptFile",
      value: function _acceptFile(file) {
        var acceptProp = this.props.accept;

        if (!acceptProp || acceptProp.length === 0 || !file) {
          return true;
        }

        var accept;

        for (var i = 0; i < acceptProp.length; i++) {
          accept = oj.StringUtils.trim(acceptProp[i]);

          if (!accept) {
            return true;
          } else if (accept.startsWith('.', 0)) {
            if (!file.name || file.name && file.name.endsWith(accept)) {
              return true;
            }
          } else if (!file.type) {
            return false;
          } else if (accept === 'image/*') {
            if (file.type.startsWith('image/', 0)) {
              return true;
            }
          } else if (accept === 'video/*') {
            if (file.type.startsWith('video/', 0)) {
              return true;
            }
          } else if (accept === 'audio/*') {
            if (file.type.startsWith('audio/', 0)) {
              return true;
            }
          } else if (file.type === accept) {
            return true;
          }
        }

        return false;
      }
    }, {
      key: "_handleFilesAdded",
      value: function _handleFilesAdded(files, oEvent) {
        var _this3 = this;

        var _a, _b;

        var list = this._createFileList(files);

        (_b = (_a = this.props).onOjBeforeSelect) === null || _b === void 0 ? void 0 : _b.call(_a, {
          files: list,
          originalEvent: oEvent
        }).then(function () {
          var _a, _b;

          (_b = (_a = _this3.props).onOjSelect) === null || _b === void 0 ? void 0 : _b.call(_a, {
            files: list,
            originalEvent: oEvent
          });

          if (_this3.elementPromiseResolver) {
            _this3.elementPromiseResolver();

            _this3.elementPromiseResolver = null;
          }
        }, function (messages) {
          _this3._fireInvalidSelectAction(messages, oEvent, false);
        });
      }
    }, {
      key: "_fireInvalidSelectAction",
      value: function _fireInvalidSelectAction(messages, oEvent, isDrag) {
        var _this4 = this;

        var _a, _b;

        if (isDrag) {
          this.updateState({
            validity: 'invalid'
          });
        }

        var dragPromise = isDrag ? new Promise(function (resolve) {
          _this4.dragPromiseResolver = resolve;
        }) : null;
        (_b = (_a = this.props).onOjInvalidSelect) === null || _b === void 0 ? void 0 : _b.call(_a, {
          messages: messages,
          originalEvent: oEvent,
          until: dragPromise
        });

        if (this.elementPromiseResolver) {
          this.elementPromiseResolver();
          this.elementPromiseResolver = null;
        }
      }
    }, {
      key: "_createFileList",
      value: function _createFileList(origList) {
        var descriptor = {
          length: {
            value: origList.length
          },
          item: {
            value: function value(index) {
              return this[index];
            }
          }
        };

        for (var i = 0; i < origList.length; i++) {
          descriptor[i] = {
            value: origList[i],
            enumerable: true
          };
        }

        return Object.create(FileList.prototype, descriptor);
      }
    }]);

    return FilePicker;
  }(ojvcomponentElement.ElementVComponent);

  exports.FilePicker.metadata = {
    "extension": {
      "_DEFAULTS": Props
    },
    "properties": {
      "accept": {
        "type": "Array<string>|null",
        "value": null
      },
      "capture": {
        "type": "string|null",
        "enumValues": ["user", "environment", "implementation", "none"],
        "value": "none"
      },
      "disabled": {
        "type": "boolean",
        "value": false
      },
      "primaryText": {
        "type": "string|function"
      },
      "secondaryText": {
        "type": "string|function"
      },
      "selectOn": {
        "type": "string",
        "enumValues": ["auto", "click", "clickAndDrop", "drop"],
        "value": "auto"
      },
      "selectionMode": {
        "type": "string",
        "enumValues": ["multiple", "single"],
        "value": "multiple"
      }
    },
    "slots": {
      "trigger": {}
    },
    "events": {
      "ojBeforeSelect": {
        "cancelable": true
      },
      "ojInvalidSelect": {},
      "ojSelect": {}
    },
    "methods": {
      "_doSelectHelper": {}
    }
  };

  __decorate([ojvcomponentElement.listener()], exports.FilePicker.prototype, "_handleSelectingFiles", null);

  __decorate([ojvcomponentElement.listener()], exports.FilePicker.prototype, "_handleFileSelected", null);

  __decorate([ojvcomponentElement.listener()], exports.FilePicker.prototype, "_handleDragEnter", null);

  __decorate([ojvcomponentElement.listener()], exports.FilePicker.prototype, "_handleDragOver", null);

  __decorate([ojvcomponentElement.listener()], exports.FilePicker.prototype, "_handleDragLeave", null);

  __decorate([ojvcomponentElement.listener()], exports.FilePicker.prototype, "_handleFileDrop", null);

  __decorate([ojvcomponentElement.listener()], exports.FilePicker.prototype, "_handleFocusIn", null);

  __decorate([ojvcomponentElement.listener()], exports.FilePicker.prototype, "_handleFocusOut", null);

  exports.FilePicker = __decorate([ojvcomponentElement.customElement('oj-file-picker')], exports.FilePicker);
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

}())