/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojcontext', 'ojs/ojcomponentcore', 'ojs/ojdomutils', 'ojdnd'],
function(oj, $, Context, Components, DomUtils)
{
  "use strict";



/* global DomUtils:false, TreeUtils:false */

/* jslint browser: true,devel:true*/

/**
 * @ignore
 * @class oj.TreeDndContext
 * @classdesc  HTML5 Drag and Drop Support and Utils for ojTree
 * @param {Object} component ojTree instance
 * @constructor
 */
oj.TreeDndContext = function (component) {
  this.Init(component);
};

// Subclass from oj.Object
oj.Object.createSubclass(oj.TreeDndContext, oj.Object, 'oj.TreeDndContext');

/**
 * Initializes the instance.
 * @export
 */
oj.TreeDndContext.prototype.Init = function (component) {
  oj.TreeDndContext.superclass.Init.call(this);
  this.component = component;
  this.options = component.options;
  this._reset();
};

/**
 * Returns true if tree is enabled for drag.
 * @return {boolean}   true if the tree is enabled for drag (or reorder drag).
 */
oj.TreeDndContext.prototype.isDragEnabled = function () {
  var dnd = this._dnd;
  return dnd.reorder || dnd.dragFromEnabled;
};

/**
 * Test if tree is enabled for drop.
 * @return {boolean}   true if the tree is enabled for drop (or reorder drop).
 */
oj.TreeDndContext.prototype.isDropEnabled = function () {
  var dnd = this._dnd;
  return dnd.reorder || dnd.dropToEnabled;
};

/**
 *  Handles changes to the dnd option property. On entry the options "dnd"
 *  property has already been updated in  _setOption().  Here we just blow
 *  away all the old settings and reinit.
 */
// eslint-disable-next-line no-unused-vars
oj.TreeDndContext.prototype.handleDnDOptionChange = function (newval) {
  var dnd = this._dnd;
  var cons = oj.TreeDndContext;
  var reorder = dnd.reorder;
  var dragFromEnabled = dnd.dragFromEnabled;

  this._dndCleanAll(); // blow away all the old settings
  this.initDnDOpts(); // reprocess the options into dnd
  dnd = this._dnd; // _dnd is new so reget

  //  If reorder or dragging ability changed, may need to remove css classes.
  //  (Only need to check for removal - if it was not set previously but is
  //   now added, this will be taken care of _initDnD().
  if (reorder !== dnd.reorder || dragFromEnabled !== dnd.dragFromEnabled) {
    if (!dnd.reorder && !dnd.dragFromEnabled) {
      this.component
        ._getContainerList()
        .find('li')
        .removeClass(cons._OJ_DRAGGABLE)
        .removeClass(cons._OJ_DRAG)
        .removeClass(cons._OJ_VALID_DROP)
        .removeAttr('draggable');
    }
  }

  this.initDnD(); // finally re-init DnD support with new options.
};

/**
 *  Process Drag and Drop options.
 *  Note: all relevent DnD listeners have been removed before
 *  entry in _handleDnDOptionChange()
 */
oj.TreeDndContext.prototype.initDnDOpts = function () {
  var odnd = this.options.dnd;
  var dnd = this._dnd;
  var cons = oj.TreeDndContext;
  var bSetDisable = true;
  var opts;
  var ot;
  var cb;
  var n;

  // Handle tree reorder via DnD

  dnd.reorder = false;
  ot = typeof odnd;
  if (ot !== 'object') {
    this.options.dnd = { reorder: 'disable' };
    return;
  }

  opts = odnd[cons._DND_REORDER];
  if (typeof opts === 'string') {
    if (opts === 'enable') {
      dnd.reorder = true;
      bSetDisable = false;
    } else if (opts === 'disable') {
      bSetDisable = false;
    }
  }
  if (bSetDisable) {
    this.options.dnd.reorder = 'disable';
  }

  // Check dnd  drag options for user app callbacks

  //  Inspect drag option
  opts = odnd[cons._DND_DRAG];
  ot = typeof opts;
  if (ot === 'object') {
    n = opts[cons._DND_NODE];
    if (typeof n === 'object') {
      cb = n[cons._DND_DRAGSTART_CB];
      if (typeof cb === 'function') {
        dnd.dragStartCallback = cb;
        dnd.dragFromEnabled = true;
      }
      cb = n[cons._DND_DRAGDRAG_CB];
      if (typeof cb === 'function') {
        dnd.dragDragCallback = cb;
        dnd.dragFromEnabled = true;
      }
      cb = n[cons._DND_DRAGEND_CB];
      if (typeof cb === 'function') {
        dnd.dragEndCallback = cb;
        dnd.dragFromEnabled = true;
      }
      cb = n[cons._DND_DATATYPES];
      if ($.isArray(cb)) {
        dnd.dragDataTypes = cb.slice();
        dnd.dragFromEnabled = true;
      } else if (typeof cb === 'string') {
        dnd.dragDataTypes = [cb];
        dnd.dragFromEnabled = true;
      }
    }
  }

  //  Inspect drop option
  opts = odnd[cons._DND_DROP];
  ot = typeof opts;
  if (ot === 'object') {
    n = opts[cons._DND_NODE];
    if (typeof n === 'object') {
      cb = n[cons._DND_DROPDRAGENTER_CB];
      if (typeof cb === 'function') {
        dnd.dropDragEnterCallback = cb;
        dnd.dropToEnabled = true;
      }
      cb = n[cons._DND_DROPDRAGOVER_CB];
      if (typeof cb === 'function') {
        dnd.dropDragOverCallback = cb;
        dnd.dropToEnabled = true;
      }
      cb = n[cons._DND_DROPDRAGLEAVE_CB];
      if (typeof cb === 'function') {
        dnd.dropDragLeaveCallback = cb;
        dnd.dropToEnabled = true;
      }
      cb = n[cons._DND_DROPDROP_CB];
      if (typeof cb === 'function') {
        dnd.dropDropCallback = cb;
        dnd.dropToEnabled = true;
      }
      cb = n[cons._DND_DATATYPES];
      if ($.isArray(cb)) {
        dnd.dropDataTypes = cb.slice();
        dnd.dropToEnabled = true;
      } else if (typeof cb === 'string') {
        dnd.dropDataTypes = [cb];
        dnd.dropToEnabled = true;
      }
    }
  }

  // Final DnD checks on option values parsed.

  // If no drag dataTypes and no dragStart callback, this tree can't be a drag source
  // unless reorder is permitted..
  if (!dnd.reorder) {
    if (!dnd.dragDataTypes && !dnd.dragStartCallback) {
      dnd.dragFromEnabled = false;
      dnd.dragStartCallback = null;
      dnd.dragDragCallback = null;
      dnd.dragEndCallback = null;
      dnd.dragDataTypes = null;
    }
    // If no drop callback, this tree can't be a drop target unless reorder is permitted.
    if (!dnd.dropDropCallback) {
      dnd.dropToEnabled = false;
      dnd.dropDragEnterCallback = null;
      dnd.dropDragOverCallback = null;
      dnd.dropDragLeaveCallback = null;
      dnd.dropDropCallback = null;
      dnd.dropDataTypes = null;
    }
  }

  dnd.pureReorder = dnd.reorder && !dnd.dragFromEnabled;
};

/**
 *  Initialize Drag and Drop functionality.
 */
oj.TreeDndContext.prototype.initDnD = function () {
  var dnd = this._dnd;
  var vars = dnd.vars;
  var cons = oj.TreeDndContext;

  if (!dnd.dragFromEnabled && !dnd.dropToEnabled && !dnd.reorder) {
    return; // No DnD support required
  }

  //  Create drag insertion ptr and line divs if they don't exist.
  if (!oj.TreeDndContext._dragMarker) {
    vars.m = // dnd insertion point marker
      $(
        "<div class='oj-tree-drop-marker'><span class='oj-tree-drop-ptr oj-component-icon'>&#160;</span></div>"
      )
        .css('pointer-events', 'none') // prevent mouse events on marker, so that
        .hide() // we don't cause bogus dragLeave/dragEnter
        .appendTo('body'); // @HTMLUpdateOK

    vars.ml = $('<div></div>') // dnd insert point marker line
      .addClass(cons._OJT_DROP_MARKER_LINE)
      .css('pointer-events', 'none') // prevent mouse events on the line, so
      .hide() // that we don't cause bogus dragLeave/dragEnter
      .appendTo('body'); // @HTMLUpdateOK

    oj.TreeDndContext._dragMarker = vars.m;
    oj.TreeDndContext._dragMarkerLine = vars.ml;
  } else {
    vars.m = oj.TreeDndContext._dragMarker;
    vars.ml = oj.TreeDndContext._dragMarkerLine;
  }

  dnd.ml_width = vars.ml.width(); // marker line width from style

  // Add Drag/Drop listeners
  var div = this.component.element[0]; // containing div
  var $ul = $(div).children('ul:eq(0)'); // containing UL

  if (dnd.reorder || dnd.dragFromEnabled) {
    dnd.fnDragStart = this._dragStart.bind(this);
    dnd.fnDragEnd = this._dragEnd.bind(this);
    $(div).on('dragstart', dnd.fnDragStart);
    $(div).on('dragend', dnd.fnDragEnd);

    // If here after tree is constructed, it is because of a dnd option change
    if ($ul.length) {
      $ul
        .find('li')
        .addClass(cons._OJ_DRAGGABLE)
        .addClass(cons._OJ_DRAG)
        .addClass(cons._OJ_VALID_DROP)
        .attr('draggable', 'true');
    }
  }

  if (dnd.reorder || dnd.dropToEnabled) {
    dnd.fnDrag = this._drag.bind(this);
    dnd.fnDragEnter = this._dragEnter.bind(this);
    dnd.fnDragOver = this._dragOver.bind(this);
    dnd.fnDragLeave = this._dragLeave.bind(this);
    dnd.fnDragDrop = this._dragDrop.bind(this);
    $(div).on('drag', dnd.fnDrag);
    $(div).on('dragenter', dnd.fnDragEnter);
    $(div).on('dragover', dnd.fnDragOver);
    $(div).on('dragleave', dnd.fnDragLeave);
    $(div).on('drop', dnd.fnDragDrop);
  }
};

/**
 *  Close down all DnD support.
 */
oj.TreeDndContext.prototype._closedown = function () {
  this._dndCleanAll();
};

// -------------------------------------------------------------------//
//                      Internal methods below                       //
// -------------------------------------------------------------------//

/**
 *  (dragstart event handler).
 *  A drag operation on a node has started..
 *  @private
 */
oj.TreeDndContext.prototype._dragStart = function (e) {
  var $targ = $(e.target);
  var $node = $targ.closest('li'); // target node dragged
  var $nodes; // all nodes participating in the drag
  var dt = e.originalEvent.dataTransfer;
  var ret;

  var dnd = this._dnd;
  var vars = dnd.vars;

  vars.o = null; // no dragged node(s) yet
  vars.r = null; // no reference node yet
  dnd.nodeLastEnter = null;
  dnd.nodeLastLeft = null;
  dnd.nodeDraggedId = null;
  dnd.dragStarted = false;

  if (
    (!dnd.reorder && !dnd.dragFromEnabled) ||
    $node.hasClass(TreeUtils._OJ_DISABLED) ||
    this.component._isTreeDisabled()
  ) {
    e.preventDefault(); // drag not allowed.
    return undefined;
  }

  //  If node types have been defined, check that a move is permitted for this node type.
  if (!this.component._canTypedNodeMove($node, 'move')) {
    return false; // drag not allowed.
  }

  //  Add dragged node(s) to transfer data.  If dragged node is selected,
  //  then will drag all selected nodes, else just have the one node.
  $nodes = this.component.isSelected($node) ? this.component._getNode(null, true) : $node;

  // Set app defined dataTypes to the node data
  if (dnd.dragFromEnabled || dnd.pureReorder) {
    this._setDataTypes(dt, $nodes);
  }

  //  If only one node is selected, will use the default drag image.
  //  If multiple nodes selected, will create a custom image.
  this._setDragImage(dt, $nodes);

  //  Call app callback in drag options
  if (dnd.dragStartCallback) {
    var adata = this._getDraggedItemArray($nodes);
    ret = dnd.dragStartCallback(e, { item: adata });
    if (e.isDefaultPrevented() || (typeof ret === 'boolean' && !ret)) {
      return ret; // app vetoed drag
    }

    // If dataTypes was not specified in the drag options, check that callback
    // has created at least one.
    if (!dnd.dragDataTypes && !this._checkAddedDataTypes(dt) && !dnd.reorder) {
      e.preventDefault();
      return false; // dragstart not permitted
    }
  } // end if dragStart callback

  // If no callback or callback did not set the effectAllowed, set default value.
  if (dt.effectAllowed === 'uninitialized') {
    if (dnd.pureReorder) {
      dt.effectAllowed = 'move'; // reorder only & no dragStart callback
    } else {
      dt.effectAllowed = DomUtils.isMetaKeyPressed(e) ? 'copy' : 'move';
    }
  }

  this._dndStartDrag($nodes, $node, e); // final prep
  return undefined;
};

/**
 *  (drag event handler).
 *  A drag operation is continuing (drag event handler).
 *  @private
 */
oj.TreeDndContext.prototype._drag = function (e) {
  var dnd = this._dnd;

  if (dnd.dragDragCallback) {
    // check if app callback in drag options?
    dnd.dragDragCallback(e);
  }
};

oj.TreeDndContext.prototype._dragEnter = function (e) {
  //  Note: due to the composite DOM construction of a node, there
  //  can be several dragEnter calls for the same logical node.

  // If tree is totally empty add a temporary dummy node to act as a reference node.
  if (!this.component._$container_ul[0].firstChild) {
    this._addInternalNode();
  }

  var $targ = $(e.target);
  var $node = this.component._getNode($targ); // <li> of the element entered
  var dnd = this._dnd;
  var vars = dnd.vars;
  var bNode = $node && $node.length > 0 && $node.hasClass('oj-tree-node');
  var dt = e.originalEvent.dataTransfer;
  var cons = oj.TreeDndContext;
  var bForeignTree = false; // true if drag from another tree
  var bClean = false;
  var ret;

  // Check if entering the internal placeholder node (created after
  // tree was emptied by previously dragging all nodes out of it.
  if (bNode && $node.hasClass(TreeUtils._OJ_TEMPNODE)) {
    dnd.bInternalNode = true;
  }

  // Ignore the UL, only interested in the nodes.
  if (bNode && e.target.tagName === 'UL' && e.target.getAttribute('role') === 'group') {
    return undefined; // (prevents bogus insert line under top node)
  }

  // Set dnd.foreign if the drag did not originate from this tree
  dnd.foreign = !dnd.dragStarted; // no preceding _dragStart() so froms another
  // component which may or may not be a tree.

  // If over same tree, but re-order not permitted, or from a foreign tree that is
  // defined as reorder only (no transfer data), ignore.
  if (
    (!dnd.foreign && !dnd.reorder) ||
    (dnd.foreign && this._isDtType(dt, cons._DND_INTERNAL_DT_REORDER))
  ) {
    this._dndClean();
    return undefined;
  }
  // If foreign object see if it is a tree or non-tree
  if (dnd.foreign) {
    bForeignTree = this._isDtType(dt, cons._DND_INTERNAL_DT);

    // Not from this tree. If this tree does not allow drops, can't continue.
    if (!dnd.dropToEnabled) {
      // Drop of any object except (except for reorder from same tree) not permitted.
      // Also since the dragend event goes to the source component, which in this case
      // is foreign, we must clean-up and hide the drop ui for this component too.
      this._dndClean();
      return undefined; // vetoed
    }
  }

  vars.r = false; // no reference node yet

  //  Clear last entered node classes
  if (dnd.nodeLastEnter) {
    this._clearDropClasses(dnd.nodeLastEnter);
  }

  // If we move out of the nodes but are still over the tree container, the
  // reference node is the last node we previously entered.
  if ($targ.hasClass('oj-tree')) {
    $node = dnd.nodeLastEnter;
  }

  //  Check that we have a node and that it is not being dragged over itself
  if ($node && $node.length && $node.attr('id') === dnd.nodeDraggedId) {
    this._dndHideMarker();
    return undefined; // vetoed - drag over self ignored, or don't have a node
  }

  // Handle case where node(s) are being dragged from a foreign tree
  if (bForeignTree && bNode) {
    dnd.nodeLastEnter = null;
    vars.o = 2; // dragged foreign tree node(s) - data is in dataTransfer
  }
  // Handle case where a foreign object (non-tree node) is being dragged to the tree.
  if (dnd.foreign && !bForeignTree) {
    vars.o = 1; // Don't have a source node (non-tree obj)
  }

  vars.r = $node; // the reference node
  dnd.nodeLastEnter = $node;

  this._dndPlacement(e, $node); // get initial marker placement (in dnd.place)
  if (!this._dndEnter()) {
    // Not a valid placement position
    this._clearDropClasses(vars.r);

    vars.r = null; // no reference node
    this._dndHideMarker();
    return undefined;
  }

  vars.r
    .removeClass(cons._OJ_INVALID_DROP)
    .addClass(cons._OJ_VALID_DROP)
    .addClass(cons._OJ_ACTIVE_DROP);

  //  Call dragEnter callback in the drop options if defined
  if (dnd.dropDragEnterCallback) {
    ret = dnd.dropDragEnterCallback(e, {
      item: dnd.bInternalNode ? null : $node,
      position: dnd.bInternalNode ? 'first' : dnd.place,
      reference: dnd.bInternalNode ? null : vars.r
    });
  }

  if (ret === undefined) {
    if (this._isDtAcceptDataTypes(dt)) {
      e.preventDefault(); // accept node or position beside it for a drop
      e.stopPropagation();
    } else {
      // component rejected by dataTypes.
      // If the source component is foreign, we must clean-up and hide the drop
      // ui for this component too.
      bClean = dnd.foreign || !dnd.reorder;
    }
  } else if (ret === false || e.isDefaultPrevented()) {
    // callback returned something
    e.preventDefault(); // accept node or position beside it for a drop
    e.stopPropagation();
  } else if (dnd.foreign || !dnd.reorder) {
    // If the source component is foreign, we must clean-up and hide the drop
    // ui for this component too.
    bClean = dnd.foreign || !dnd.reorder;
  }

  if (bClean) {
    this._dndClean();
  }

  return ret;
};

/**  (dragover event handler).
 *  In drag mode and mouse has moved over a node (or between nodes - i.e.
 *  still over the tree containing div).
 *  @private
 */
oj.TreeDndContext.prototype._dragOver = function (e) {
  var dnd = this._dnd;
  var vars = dnd.vars;
  var dt = e.originalEvent.dataTransfer;
  var bClean = false;
  var ret;

  // Did _dragEnter() determine node is a drop target?
  if (!vars.r || !vars.r.length) {
    this._dndHideMarker();
    return undefined; // no.
  }

  var $node = vars.r; // the reference node set by _dragEnter()

  if (!$node.hasClass('oj-tree-node')) {
    this._dndHideMarker();
    return undefined;
  }

  var elemId = $node.attr('id');
  if (elemId === dnd.nodeDraggedId) {
    // ignore drag over the dragged node itself
    this._dndHideMarker();
    return undefined;
  }

  this._dndPlacement(e, $node);

  if (!this._dndPrepare()) {
    // returns "after", "before", "inside" if drop position is acceptable
    this._dndHideMarker();
    return undefined;
  }

  // Call app dragover callback if defined in dnd options and check if veto
  if (dnd.dropDragOverCallback) {
    ret = dnd.dropDragOverCallback(e, {
      item: dnd.bInternalNode ? null : $node,
      reference: dnd.bInternalNode ? null : vars.r,
      position: dnd.bInternalNode ? 'first' : vars.last_pos
    });
  }

  if (ret === undefined) {
    if (this._isDtAcceptDataTypes(dt)) {
      e.preventDefault(); // accept node or position beside it for a drop
      e.stopPropagation();
    } else {
      // component rejected by dataTypes.
      // If the source component is foreign, we must clean-up and hide the drop
      // ui for this component too.
      bClean = dnd.foreign || !dnd.reorder;
    }
  } else if (ret === false || e.isDefaultPrevented()) {
    // callback returned something
    e.preventDefault(); // accept node or position beside it for a drop
    e.stopPropagation();
  } else if (dnd.foreign || !dnd.reorder) {
    // If the source component is foreign, we must clean-up and hide the drop
    // ui for this component too.
    bClean = dnd.foreign || !dnd.reorder;
  }

  if (bClean) {
    this._dndClean();
  }

  return ret;
};

/**
 *  (drop event handler).
 *  A dragged node has been dropped.
 *  @private
 */
oj.TreeDndContext.prototype._dragDrop = function (e) {
  var dnd = this._dnd;
  var vars = dnd.vars;
  var veto = false;
  var ret;

  if (vars.r) {
    // sanity check - ensure we have a ref node drop position
    if (dnd.dropDropCallback) {
      ret = dnd.dropDropCallback(e, {
        reference: dnd.bInternalNode ? null : vars.r,
        position: dnd.bInternalNode ? 'first' : vars.last_pos,
        reorder: !dnd.foreign && dnd.reorder
      });
    } else if (dnd.foreign || !dnd.reorder) {
      // No callback, only permitted if pure reorder on same tree.
      veto = true; // can't allow - shouldn't be able to get here
    } // because dragEnter should have rejected operation.

    // If reorder, handle itProceed with reorder if not vetoed
    if (!veto && (!ret || e.isDefaultPrevented())) {
      this._dndFinishReorder(e); // Handle same tree node movement
    }
  } // end if (vars.r)

  // Since the dragend event goes to the source component, which could
  // be foreign, we must hide the drop ui for this component too.
  if (dnd.foreign) {
    this._dndClean();
  }

  if (!veto) {
    e.preventDefault();
    e.stopPropagation();
  }

  dnd.nodeLastLeft = null;

  return ret;
};

/**
 *  (dragend event handler).
 *  Drag operation has ended with/without a drop (dragend event handler).
 *  @private
 */
oj.TreeDndContext.prototype._dragEnd = function (e) {
  var dnd = this._dnd;
  var vars = dnd.vars;

  if (dnd.dragEndCallback) {
    // check if app callback in drag options?
    dnd.dragEndCallback(e, {
      reorder: dnd.reorder && vars.o === false
    });
  }

  this._dndStopDrag(); // dragend completion
  this._dndClean(); // clean-up/housekeeping
};

/**
 *  Add a dummy node so that the tree is not empty, and there is a target that can
 *  be used as a reference node to be dragged to.
 *  @private
 */
oj.TreeDndContext.prototype._addInternalNode = function () {
  if (!this._internalNode) {
    this._internalNode = $(
      "<li class='" +
        TreeUtils._OJ_TEMPNODE +
        " oj-tree-node oj-tree-leaf oj-valid-drop' id='" +
        TreeUtils._OJ_TEMPNODE +
        "'><ins class='oj-tree-icon'></ins><a href='#'><ins class='oj-tree-icon'></ins><span class='oj-tree-title'></span></a></li>"
    );
  }
  this.component._$container_ul.append(this._internalNode); // @HTMLUpdateOK  (no user supplied text involved)
};

/**
 *  (dragleave event handler).
 *  Mouse has moved away from a node while dragging (or esc was used
 *  to cancel the drag.
 *  @private
 */
oj.TreeDndContext.prototype._dragLeave = function (e) {
  var dnd = this._dnd;
  var vars = dnd.vars;
  var $targ = $(e.target);
  var $node = $targ.closest('li');
  var bNode = $node && $node.length > 0 && $node.hasClass('oj-tree-node');
  var dt = e.originalEvent.dataTransfer;

  if (dnd.dropDragLeaveCallback) {
    dnd.dropDragLeaveCallback(e, { item: dnd.bInternalNode ? null : $node });
  }

  // Clean up if leaving the tree, or a non-node, or drag canceled
  if ($targ.hasClass('oj-tree') || !bNode || dt.dropEffect === 'none') {
    this._dndLeave(e); // clean up and hide marker(s)
  } else {
    dnd.nodeLastLeft = $node;
  }

  if (vars.r) {
    this._clearDropClasses(vars.r);
  }
};

/**
 *  Handle node entry - inspect position, and prepare move block.
 *  @return {boolean}  true if placement is suitable, else false.
 *  @private
 */
oj.TreeDndContext.prototype._dndEnter = function () {
  var dnd = this._dnd;
  var vars = dnd.vars;

  dnd.prepared = false; // no prepMoveBlk object yet
  var ret = this._dndPrepare();

  var ms = dnd.openTimeoutMs; // open timeout value (ms)
  if (ms) {
    if (dnd.openTimer_Id) {
      clearTimeout(dnd.openTimerId);
    }
    if (vars.r && vars.r.length && vars.r.hasClass(TreeUtils._OJ_COLLAPSED)) {
      // if the node is closed - open it, then recalculate
      dnd.openTimerId = setTimeout(this._dndOpen.bind(this), ms); // @HTMLUpdateOK
    }
  }

  var t = typeof ret;
  ret = (t === 'boolean' && ret) || t === 'string';
  return ret;
};

/**
 *  Expand the target node hovered over while dragging so the user can
 *  drop inside a folder.
 *  @private
 */
oj.TreeDndContext.prototype._dndOpen = function () {
  var dnd = this._dnd;
  var vars = dnd.vars;

  dnd.openTimerId = false;
  this.component._expand(vars.r, this._dndPrepare.bind(this), true);
};

/**
 *  Drop is complete - do the node creation/insertion/movement if this is a reorder.
 *  @private
 */
oj.TreeDndContext.prototype._dndFinishReorder = function (e) {
  var dnd = this._dnd;
  var vars = dnd.vars;

  // For a pure reorder on the same tree, we can just move the nodes.
  if (dnd.dragStarted && dnd.reorder && typeof vars.o === 'object' && vars.o.length > 0) {
    this.component._moveNode(vars.o, vars.r, vars.last_pos, DomUtils.isMetaKeyPressed(e));

    // Don't want dragEnd() to do any node(s) removal since they have just been
    // moved  by tree
    vars.o = false;
  }
};

/**
 *  Apply selection to node and its children if state was set in __getJson/_parseJson
 *  after _createNode().
 *  @private
 */
oj.TreeDndContext.prototype._dndFinishSelection = function (node) {
  if (node.hasClass(TreeUtils._OJ_SELECTED)) {
    // is node tagged from the json?
    node.removeClass(TreeUtils._OJ_SELECTED); // remove selected tag
    this.component._select(node, true); // and select it fully.
  }

  var children = this.component.getChildren(node);
  var len = children && children.length ? children.length : 0;

  for (var i = 0; i < len; i++) {
    this._dndFinishSelection($(children[i]));
  }
};

/**
 *  Decide on the placement relative to the reference node.
 *  Sets this._dnd.place to "after" , "before", or  "inside".
 *  @private
 */
oj.TreeDndContext.prototype._dndPlacement = function (e, $node) {
  var dnd = this._dnd;

  if (!$node) {
    return;
  }

  if (!$node.hasClass(TreeUtils._OJ_TEMPNODE)) {
    // eslint-disable-next-line no-param-reassign
    e = e.originalEvent;
    dnd.off = $node.offset(); // get node coords rel to document
    var place = e.pageY - (dnd.off.top || 0);
    if (place >= this.component._getNodeHeight()) {
      dnd.place = 'after';
    } else if (place < 0) {
      dnd.place = 'before';
    } else {
      dnd.place = 'inside';
    }

    // If placement is after an open folder, treat placement as before
    // the first child node
    if (dnd.place === 'after') {
      if ($node.hasClass(TreeUtils._OJ_EXPANDED)) {
        dnd.place = 'first';
      }
    }
  } else {
    dnd.place = 'after'; // reference node is the dummy placed in an empty tree
  }
};

/**
 *  Mouse is down and we are dragging
 *  @private
 */
/*      Currently not used.
oj.TreeDndContext.prototype._dndDrag  =  function (e)
{
   var dnd  = this._dnd ;
   var vars = dnd.vars ;

   e    = e.originalEvent ;

// if (Math.abs(e.pageX - ctl.init_x) > 5 || Math.abs(e.pageY - ctl.init_y) > 5)  {

   // maybe use a scrolling parent element instead of document?
   if (e.type === "dragover")
   {
      // thought of adding scroll in order to move the helper, but mouse position is n/a
      var d = $(document),
          t = d.scrollTop(),
          l = d.scrollLeft();

      if (e.pageY - t < 20)
      {
        if (vars.sti && vars.dir1 === "down")
        {
//        clearInterval(vars.sti);
          vars.sti = undefined;
        }
        if (! vars.sti)
        {
          vars.dir1 = "up";
//        vars.sti = setInterval(function ()
//                   {
//                     $(document).scrollTop( $(document).scrollTop() - ctl.scroll_spd );
//                   }, 150);
        }
      }
      else
      {
         if (vars.sti && vars.dir1 === "up")
         {
//         clearInterval(vars.sti);
           vars.sti = undefined;
         }
      }

      if ($(window).height() - (e.pageY - t) < 20)
      {
        if (vars.sti && vars.dir1 === "up")
        {
//        clearInterval(vars.sti);
          vars.sti = undefined;
        }
        if (! vars.sti)
        {
          vars.dir1 = "down";
//        vars.sti = setInterval(function ()
//                  {
//                    $(document).scrollTop( Number($(document).scrollTop()) + ctl.scroll_spd );
//                    // above Number() is for the closure compiler!!
//                  }, 150);
        }
      }
      else
      {
         if (vars.sti && vars.dir1 === "down")
         {
//         clearInterval(vars.sti);
           vars.sti = undefined;
         }
      }

      if (e.pageX - l < 20)
      {
        if (vars.sli && vars.dir2 === "right")
        {
//         clearInterval(vars.sli);
           vars.sli = undefined;
        }
        if (! vars.sli)
        {
          vars.dir2 = "left";
//        vars.sli = setInterval(function ()
//               {
//                 $(document).scrollLeft( $(document).scrollLeft() - ctl.scroll_spd );
//               }, 150);
        }
      }
      else
      {
        if (vars.sli && vars.dir2 === "left")
        {
//        clearInterval(vars.sli);
          vars.sli = undefined;
        }
      }

      if ($(window).width() - (e.pageX - l) < 20)
      {
        if (vars.sli && vars.dir2 === "left")
        {
//        clearInterval(vars.sli);
          vars.sli = undefined;
        }
        if (! vars.sli)
        {
          vars.dir2 = "right";
//        vars.sli = setInterval(function ()
//                 {
///                  Number() is for the closure compiler!!
//                   $(document).scrollLeft(Number($(document).scrollLeft()) + ctl.scroll_spd);
//                 }, 150);
        }
      }
      else
      {
        if (vars.sli && vars.dir2 === "right")
        {
//        clearInterval(vars.sli);
          vars.sli = undefined;
        }
      }

   }
};
*/

/**
 *   The mouse has left a node while in drag mode. Clear the markers.
 *   @private
 */
oj.TreeDndContext.prototype._dndLeave = function (e) {
  var dnd = this._dnd;
  var vars = dnd.vars;

  dnd.after = false;
  dnd.before = false;
  dnd.inside = false;
  dnd.lastNodeEnter = null;

  this._dndHideMarker();
  if (vars.r && vars.r[0] === e.target.parentNode) {
    if (dnd.openTimerId) {
      clearTimeout(dnd.openTimerId);
      dnd.openTimerId = false;
    }
  }
};

/**
 *  Cleanup after DnD drag/drop cycle.
 *  @private
 */
oj.TreeDndContext.prototype._dndClean = function () {
  this._dndHideMarker();

  var dnd = this._dnd;
  var vars = dnd.vars;

  vars.o = false;
  vars.r = false;

  if (dnd.openTimerId) {
    clearTimeout(dnd.openTimerId);
  }

  dnd.nodeDraggedId = null;
  dnd.foreign = false;
  dnd.nodeLastEnter = null;
  dnd.nodeLastLeft = null;
  dnd.after = false;
  dnd.before = false;
  dnd.inside = false;
  dnd.off = false;
  dnd.prepared = false;
  dnd.openTimerId = false;
  dnd.foreign = false;
  dnd.bInternalNode = false;
};

/**
 *  Cleanout all DnD settings.
 *  @private
 */
oj.TreeDndContext.prototype._dndCleanAll = function () {
  var dnd = this._dnd;
  var $div;

  //  Clean out the old dnd settings
  $div = $(this.component._getContainer()[0]);
  $div.off('dragstart', dnd.fnDragStart);
  $div.off('dragend', dnd.fnDragEnd);
  $div.off('drag', dnd.fnDrag);
  $div.off('dragenter', dnd.fnDragEnter);
  $div.off('dragover', dnd.fnDragOver);
  $div.off('dragleave', dnd.fnDragLeave);
  $div.off('drop', dnd.fnDragDrop);

  this._dndClean();
  this._reset();
};

/**
 *  Shows the placement marker/marker line. If internal reorder creates a prepMoveBlk object.
 *  Returns placement - "above", "inside", "below", or false
 *  @private
 */
oj.TreeDndContext.prototype._dndPrepare = function () {
  var dnd = this._dnd;
  var vars = dnd.vars;
  var tree = this.component;
  var foreignObj = false;

  if (!vars.r || !vars.r.length) {
    return false;
  }

  // See if from foreign object
  if (typeof vars.o === 'number' && (vars.o === 1 || vars.o === 2)) {
    foreignObj = true; // (1 = foreign tree node, 2 = non-tree node)
  } else if (!vars.o) {
    return false; // no object, so can't handle.
  }

  dnd.off = vars.r.offset(); // get pos of reference node relative to doc

  if (this.component._isRtl) {
    // arrow icon is on the right of the marker line
    dnd.off.right = dnd.off.left + vars.r.width() - vars.r.find('>a').width() - 30;
  }
  dnd.targ_ml_width = vars.r.find('a').width(); // get the width for the insert line

  if (foreignObj) {
    // This is a foreign object (and we are not directly rearranging the
    // Tree DOM as in a reorder, so no internal prepMoveBlk is required).

    dnd.before = dnd.place === 'before';
    dnd.after = dnd.place === 'after';
    dnd.inside = dnd.place === 'inside';
  } else {
    // Re-order - set the dnd before/after/inside booleans
    tree._prepare_move(vars.o, vars.r, 'before'); // create a prepMoveBlk object
    dnd.before = tree._checkMove();
    tree._prepare_move(vars.o, vars.r, 'after');
    dnd.after = tree._checkMove();

    if (this.component._isLoaded(vars.r)) {
      tree._prepare_move(vars.o, vars.r, 'inside');
      dnd.inside = tree._checkMove();
    } else {
      dnd.inside = false;
    }
  }

  dnd.prepared = true; // prepare has completed
  return this._dndShowMarker(); // returns "after", "before", "inside", or false
};

/**
 *  Positions and shows (or hides) the drag insert position marker and line,
 *  and updates the drag and drop targets with the can/can't drop classes.
 *  Returns "above", "inside", "below" or false
 *  @private
 */
oj.TreeDndContext.prototype._dndShowMarker = function () {
  var dnd = this._dnd;
  var isParent = false;
  var cons = oj.TreeDndContext;
  var vars = dnd.vars;
  var rtl = this.component._isRtl;
  var mLeft; // pos of marker rel to document
  var mlLeft; // position of marker line rel to doc
  var lineTop; // top pos of marker line rel to doc
  var nodeHeight = this.component._getNodeHeight();
  var r = false;

  if (!dnd.prepared) {
    this._dndHideMarker();
    return r;
  }

  // Get placement relative to target node
  if (
    (dnd.place === 'after' && dnd.after) ||
    (dnd.place === 'inside' && dnd.inside) ||
    (dnd.place === 'before' && dnd.before) ||
    dnd.place === 'first'
  ) {
    r = dnd.place;
  }

  if (r === 'first') {
    // if to be placed as the first child of
    // a parent, will actually treat as above
    var fc = vars.r.find('li:eq(0)'); // the first child, as far as the marker
    dnd.off = fc.offset(); // is concerned.
  }

  var pos = rtl ? dnd.off.right - 18 : dnd.off.left + 5;
  isParent = !this.component.isLeaf(vars.r);
  mLeft = rtl ? pos + dnd.targ_ml_width + 18 : pos; // pos of marker rel to doc
  mlLeft = rtl ? mLeft - dnd.ml_width : pos + 8; // pos of marker line rel to doc

  lineTop = dnd.off.top - 3; // set line top a small dist above the node for clarity

  switch (r) {
    case 'before':
    case 'first':
      this._moveMarkerUI(vars.m, { left: mLeft, top: lineTop - 7 });
      if (vars.ml) {
        this._moveMarkerUI(vars.ml, { left: mlLeft, top: lineTop });
      }
      break;

    case 'after':
      lineTop += nodeHeight;
      this._moveMarkerUI(vars.m, { left: mLeft, top: lineTop - 2 });
      if (vars.ml) {
        this._moveMarkerUI(vars.ml, { left: mlLeft, top: lineTop + 6 });
      }
      break;

    case 'inside': // marker only, no line
      var mLeftOffset;
      if (rtl) {
        if (isParent) {
          mLeftOffset = -4;
        } else {
          mLeftOffset = 0;
        }
      } else {
        mLeftOffset = 4;
      }

      this._moveMarkerUI(vars.m, {
        left: mLeft + mLeftOffset,
        top: dnd.off.top + nodeHeight / 2 - 8
      });
      if (vars.ml) {
        vars.ml.hide();
      }
      break;

    default:
      this._dndHideMarker();
      break;
  }

  if (r) {
    vars.r.removeClass(cons._OJ_INVALID_DROP).addClass(cons._OJ_VALID_DROP);
  } else {
    vars.r.removeClass(cons._OJ_VALID_DROP).removeClass(cons._OJ_VALID_DROP);
  }

  vars.last_pos = r;
  return r;
};

/**
 *  Hide the drag/drop insertion marker and line
 *  @private
 */
oj.TreeDndContext.prototype._dndHideMarker = function () {
  var vars = this._dnd.vars;

  if (vars) {
    if (vars.m) {
      vars.m.hide();
    }
    if (vars.ml) {
      vars.ml.hide();
    }
    if (vars.r) {
      this._clearDropClasses(vars.r);
    }
  }
};

/**
 *  Move the specified marker UI element.
 *  @private
 */
oj.TreeDndContext.prototype._moveMarkerUI = function ($obj, styles) {
  // eslint-disable-next-line no-param-reassign
  styles.left += 'px';
  // eslint-disable-next-line no-param-reassign
  styles.top += 'px';

  $obj.css(styles).show();
};

/**
 *  The drag operation has started, initial prepare.
 *  @private
 */
oj.TreeDndContext.prototype._dndStartDrag = function ($nodes, $node, e) {
  var dnd = this._dnd;
  var vars = dnd.vars;
  var cons = oj.TreeDndContext;
  var $cnt;

  vars.o = $nodes; // internal note of the node(s) dragged
  vars.o.addClass(cons._OJ_DRAG);
  dnd.nodeDraggedId = $node.attr('id');

  try {
    e.currentTarget.unselectable = 'on';
    e.currentTarget.onselectstart = function () {
      return false;
    };
    if (e.currentTarget.style) {
      e.currentTarget.style.MozUserSelect = 'none';
    }
  } catch (err) {
    // Ignore errors
  }

  if (this.component._isTheme()) {
    if (vars.m) {
      vars.m.addClass('oj-tree-' + this.component._getTheme());
    }
  }

  $cnt = this.component._getContainer();
  dnd.cof = $cnt.offset();
  dnd.cw = parseInt($cnt.width(), 10);
  dnd.ch = parseInt($cnt.height(), 10);

  dnd.dragStarted = true;
};

/**
 *  Cleanup after end of drag.
 *  @private
 */
oj.TreeDndContext.prototype._dndStopDrag = function () {
  var dnd = this._dnd;
  var vars = dnd.vars;
  var cons = oj.TreeDndContext;

  if (vars.r) {
    this._clearDropClasses(vars.r);
  }
  if (typeof vars.o !== 'number' && vars.o) {
    vars.o.removeClass(cons._OJ_DRAG);
  }

  // If we created a drag image, remove it from the DOM.
  if (this._dragImg) {
    document.body.removeChild(this._dragImg);
    this._dragImg = null;
  }

  dnd.dragStarted = false;
};

/**
 *  Set the app defined data types to the dragged node data
 *  @private
 */
oj.TreeDndContext.prototype._setDataTypes = function (dt, $nodes) {
  var dnd = this._dnd;
  var cons = oj.TreeDndContext;
  var adata;
  var data;
  var i;

  adata = this.component.__getJson($nodes);
  if (adata) {
    data = JSON.stringify(adata);
  }
  if (dnd.dragDataTypes) {
    for (i = 0; i < dnd.dragDataTypes.length; i++) {
      dt.setData(dnd.dragDataTypes[i], data);
    }
  }
  dt.setData(cons._DND_INTERNAL_DT, '0'); // internal id tree data
  if (dnd.pureReorder) {
    dt.setData(cons._DND_INTERNAL_DT_REORDER, '0'); // internal id for reorder
  }
};

/**
 *  Create the drag image and set in the data transfer object
 *  @private
 */
oj.TreeDndContext.prototype._setDragImage = function (dt, $nodes) {
  var len = $nodes.length;

  // If only one node being dragged, use the default drag image
  if (len === 1) {
    this._dragImg = null;
    return;
  }

  var $dragImg = $('<div></div>');
  var ul = $("<ul style='padding:0px;margin:0;'></ul>");
  $dragImg.append(ul); // @HTMLUpdateOK no user input involved and
  // only creating a drag image.

  for (var i = 0; i < len; i++) {
    var el = $nodes[i].cloneNode(true);
    el.style.marginLeft = 0;
    el.style.paddingLeft = 0;
    ul.append(el); // @HTMLUpdateOK appended elems have already
    // been sanitized before being added to the DOM,
    // and are only referenced here to create an image
    // for dragging.
  }

  var elem = $dragImg[0];
  document.body.appendChild(elem); // @HTMLUpdateOK pre-sanitized elems used to create a drag image
  elem.style.position = 'absolute';
  elem.style.top = '-' + $dragImg.height() * 2 + 'px';
  elem.style.right = '0';
  this._dragImg = elem; // note for removal in _dragend()
  dt.setDragImage(elem, 0, 0);
};

/**
 *  Check if the specified type is in the drop event's dataTransfer
 *  object.
 *  @return {boolean}  true if the specified type is in the drop dataTransfer
 *  object, else false.
 *  @private
 */
oj.TreeDndContext.prototype._isDtType = function (dt, type) {
  var aTypes = dt.types;
  var len = aTypes.length;
  var i;

  for (i = 0; i < len; i++) {
    if (type === aTypes[i]) {
      return true;
    }
  }
  return false;
};

/**
 *  Check if there is a list of dataTypes in the dnd drag/drop options
 *  (or the list is not defined), at least one of which matches the
 *  dataTypes defined in the dataTransfer object.
 *  @return {boolean}   true if there is a list of dataTypes in the dnd
 *  drag/drop options (or the list is not defined), at least one of which
 *  matches the dataTypes defined in the dataTransfer object, else false.
 *  @private
 */
oj.TreeDndContext.prototype._isDtAcceptDataTypes = function (dt) {
  var dnd = this._dnd;
  var comps = dnd.dropDataTypes;
  var ret = false;
  var i;

  if (comps) {
    ret = !(comps.length > 0);
    for (i = 0; i < comps.length; i++) {
      if (this._isDtType(dt, comps[i])) {
        ret = true;
        break;
      }
    }
  } else {
    ret = true;
  }

  return ret;
};

/**
 *  Check if the user app has added at least one dataType to the dataTransfer
 *  object.
 *  @return {boolean}   true if the if the user app has added at least one
 *  dataType, else false.
 *  @private
 */
oj.TreeDndContext.prototype._checkAddedDataTypes = function (dt) {
  var aTypes = dt.types;
  var len = aTypes && aTypes.length ? aTypes.length : 0;
  var cons = oj.TreeDndContext;
  var ret = false;
  var type;
  var i;

  for (i = 0; i < len; i++) {
    type = aTypes[i];
    if (type !== cons._DND_INTERNAL_DT && type !== cons._DND_INTERNAL_DT_REORDER) {
      ret = true;
      break;
    }
  }
  return ret;
};

/**
 *  Clear DnD drop classes
 *  @private
 */
oj.TreeDndContext.prototype._clearDropClasses = function ($var) {
  var cons = oj.TreeDndContext;

  if ($var) {
    $var
      .removeClass(cons._OJ_VALID_DROP)
      .removeClass(cons._OJ_INVALID_DROP)
      .removeClass(cons._OJ_ACTIVE_DROP);
  }
};

/**
 *  Return an array of node elements
 *  @private
 */
oj.TreeDndContext.prototype._getDraggedItemArray = function ($nodes) {
  var a = [];

  if ($nodes) {
    $nodes.each(function () {
      a.push(this);
    });
  }

  return a;
};

/**
 *  Reset this context's data
 *  @private
 */
oj.TreeDndContext.prototype._reset = function () {
  var _dnd = {};
  this._dnd = _dnd;

  _dnd.reorder = false;
  _dnd.pureReorder = false; // true if reorder and not a drag source
  _dnd.foreign = false; // dragged obj not from this tree

  _dnd.dragStarted = false; // startDrag received on this tree
  _dnd.nodeDraggedId = null; // id of node being dragged
  _dnd.nodeLastEnter = null; // node last entered
  _dnd.fnDragStart = null; // event listeners bound to 'this'
  _dnd.fnDragEnd = null; //   ..     ..
  _dnd.fnDrag = null; //   ..     ..
  _dnd.fnDragEnter = null; //   ..     ..
  _dnd.fnDragOver = null; //   ..     ..
  _dnd.fnDragLeave = null; //   ..     ..
  _dnd.fnDragDrop = null; //   ..     ..

  // App callbacks and flags
  _dnd.dragFromEnabled = false;
  _dnd.dropToEnabled = false;
  _dnd.dragStartCallback = null; //  User App callback
  _dnd.dragDragCallback = null; //   ..   ..    ..
  _dnd.dragDragEndCallback = null; //   ..   ..    ..
  _dnd.dropDragEnterCallback = null; //   ..   ..    ..
  _dnd.dropDragOverCallback = null; //   ..   ..    ..
  _dnd.dropDragLeaveCallback = null; //   ..   ..    ..
  _dnd.dragDropCallback = null; //   ..   ..    ..
  _dnd.dropDataTypes = null;

  _dnd.after = false;
  _dnd.inside = false;
  _dnd.before = false;
  _dnd.off = false;
  _dnd.prepared = false; // true when a prepMoveBlk object has been created
  _dnd.openTimerId = false; // open folder timeout Id from setTimeout() when dragged over
  _dnd.cof = false;
  _dnd.cw = false;
  _dnd.ch = false;
  _dnd.ml_width = 100; // marker line width - updated in _initDnd() from css
  _dnd.targ_ml_width = 100; // marker line width of target node
  _dnd.openTimeoutMs = 500; // open folder timeout when dragged over
  _dnd.vars = {}; // drag/drop block of vars
  _dnd.vars.o = false; // node(s) being dragged, or
  // 1 if foreign obj, or 2 if foreign node(s)
  _dnd.vars.r = false; // reference node
  _dnd.vars.m = false; // marker pointer div
  _dnd.vars.ml = false; // marker line div
};

/**
 *   Convenience function for tracing
 *   @private
 */
oj.TreeDndContext.prototype._trace = function (s) {
  this.component._trace(s);
};

// ------------------------------//
//  ojTree DnD CSS class names  //
// ------------------------------//
/**
 * @private
 * @const
 * @type {string}
 */
oj.TreeDndContext._OJ_DRAGGABLE = 'oj-draggable'; // node is draggable
/**
 * @private
 * @const
 * @type {string}
 */
oj.TreeDndContext._OJ_DRAG = 'oj-drag'; // node that is being dragged
/**
 * @private
 * @const
 * @type {string}
 */
oj.TreeDndContext._OJ_ACTIVE_DROP = 'oj-active-drop'; // over node in process of being dropped on
/**
 * @private
 * @const
 * @type {string}
 */
oj.TreeDndContext._OJ_VALID_DROP = 'oj-valid-drop'; // over node that could be dropped on
/**
 * @private
 * @const
 * @type {string}
 */
oj.TreeDndContext._OJ_INVALID_DROP = 'oj-invalid-drop'; // over node that can't be dropped on
/**
 * @private
 * @const
 * @type {string}
 */
oj.TreeDndContext._OJ_DROP = 'oj-drop'; // nodes that are valid drop targets
/**
 * @private
 * @const
 * @type {string}
 */
oj.TreeDndContext._OJT_DROP_MARKER = 'oj-tree-drop-marker'; // insertion point marker
/**
 * @private
 * @const
 * @type {string}
 */
oj.TreeDndContext._OJT_DROP_MARKER_LINE = 'oj-tree-drop-marker-line'; // insertion point marker line

// --------------------------//
//    ojTree DnD Options    //
// --------------------------//
/**
 * @private
 * @const
 * @type {string}
 */
oj.TreeDndContext._DND_REORDER = 'reorder';
/**
 * @private
 * @const
 * @type {string}
 */
oj.TreeDndContext._DND_DRAG = 'drag';
/**
 * @private
 * @const
 * @type {string}
 */
oj.TreeDndContext._DND_DROP = 'drop';
/**
 * @private
 * @const
 * @type {string}
 */
oj.TreeDndContext._DND_NODE = 'node';
/**
 * @private
 * @const
 * @type {string}
 */
oj.TreeDndContext._DND_DATATYPES = 'dataTypes';
/**
 * @private
 * @const
 * @type {string}
 */
oj.TreeDndContext._DND_DRAGSTART_CB = 'dragStart'; // callbacks
/**
 * @private
 * @const
 * @type {string}
 */
oj.TreeDndContext._DND_DRAGDRAG_CB = 'drag'; //   . .
/**
 * @private
 * @const
 * @type {string}
 */
oj.TreeDndContext._DND_DRAGEND_CB = 'dragEnd'; //   . .
/**
 * @private
 * @const
 * @type {string}
 */
oj.TreeDndContext._DND_DROPDRAGENTER_CB = 'dragEnter'; //   . .
/**
 * @private
 * @const
 * @type {string}
 */
oj.TreeDndContext._DND_DROPDRAGOVER_CB = 'dragOver'; //   . .
/**
 * @private
 * @const
 * @type {string}
 */
oj.TreeDndContext._DND_DROPDRAGLEAVE_CB = 'dragLeave'; //   . .
/**
 * @private
 * @const
 * @type {string}
 */
oj.TreeDndContext._DND_DROPDROP_CB = 'drop'; //   . .
/**
 * @private
 * @const
 * @type {string}
 */
oj.TreeDndContext._DND_INTERNAL_DT = '_ojtree'; // internal data type for tree data
/**
 * @private
 * @const
 * @type {string}
 */
oj.TreeDndContext._DND_INTERNAL_DT_REORDER = '_ojtreereorder'; // internal data type for reorder



/**
 *  Common tree/node state
 *  @ignore
 *  @export
 *  @classdesc  Common Tree/node state
 *  @protected
 *  @constructor
 */
function TreeUtils() {}

// css class names

TreeUtils._OJ_EXPANDED = 'oj-expanded';
TreeUtils._OJ_COLLAPSED = 'oj-collapsed';
TreeUtils._OJ_HOVER = 'oj-hover';
TreeUtils._OJ_SELECTED = 'oj-selected';
TreeUtils._OJ_DISABLED = 'oj-disabled';
TreeUtils._OJ_DEFAULT = 'oj-default';
TreeUtils._OJ_TEMPNODE = 'oj-treenode-temp';

/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 *
 * @license
 * This component is based on original code from:
 * jsTree 1.0-rc3   http://jstree.com/
 * "Copyright (c) 2010 Ivan Bozhanov (vakata.com)
 * Licensed same as jquery - under the terms of either the MIT License or
 * the GPL Version 2 License
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html"
 * @ignore
 */

/* eslint-disable no-param-reassign */ /* component deprecated */
/* global DomUtils:false, TreeUtils:false, Components:false, Context:false */

/*---------------------------------------------------------
   ojTree     Displays a Hierarchical Tree of Nodes
   Depends:   jquery.ui.core.js
              jquery.ui.widget.js
----------------------------------------------------------*/

(function () {
  //  "use strict";   // added by build, not required.

  /*
  function debugObj(o)  {
    var s ;
    try { s = JSON.stringify(o) ; }
    catch (e) { s = "ERROR";}
    return s ;
  };
  */

  //  ojTree class names
  var OJT_TREE = 'oj-tree';
  var OJT_NODE = 'oj-tree-node';
  var OJT_LEAF = 'oj-tree-leaf';
  var OJT_ICON = 'oj-tree-icon';
  var OJT_NICON = 'oj-tree-node-icon';
  var OJT_DISC = 'oj-tree-disclosure-icon';
  var OJT_LAST = 'oj-tree-last';
  var OJT_LOADING = 'oj-tree-loading';
  // var OJT_LAST_SELECTED = 'oj-tree-last-selected';
  var OJT_TITLE = 'oj-tree-title';
  var OJT_TYPE = 'oj-tree-type';
  var OJT_INACTIVE = 'oj-tree-inactive';

  // ojTree disclosure class names
  var OJ_DISC =
    'oj-tree-icon oj-tree-disclosure-icon oj-component-icon oj-clickable-icon-nocontext oj-default';

  //  WAI-ARIA
  var WA_ROLE = 'role';
  var WA_TREE = 'tree';
  var WA_TREEITEM = 'treeitem';
  var WA_GROUP = 'group';
  var WA_SELECTED = 'aria-selected';
  var WA_EXPANDED = 'aria-expanded';
  var WA_ACTIVEDESCENDANT = 'aria-activedescendant';
  // var WA_MULTISELECTABLE = 'aria-multiselectable';
  var WA_LABELLEDBY = 'aria-labelledby';

  //  Data names
  var OJT_CHILDREN = 'oj-tree-children';

  //  Data source in use
  var DS_TREE = 1;
  var DS_COLLECTION = 2;
  var DS_JSON = 3;
  var DS_HTML = 4;
  var DS_NONE = 0;
  var DS_ERROR = -1;

  // Context Menu item id's
  var _arMenuCmdMap = {
    cut: 'ojtreecut',
    copy: 'ojtreecopy',
    paste: 'ojtreepaste',
    'paste-after': 'ojtreepasteafter',
    'paste-before': 'ojtreepastebefore',
    remove: 'ojtreeremove',
    rename: 'ojtreerename'
  };

  // Context Menu translation keys
  var _arMenuKeyMap = {
    cut: 'labelCut',
    copy: 'labelCopy',
    paste: 'labelPaste',
    'paste-after': 'labelPasteAfter',
    'paste-before': 'labelPasteBefore',
    remove: 'labelRemove',
    rename: 'labelRename'
  };

  // Misc translation keys
  var TRANSKEY_LOADING = 'stateLoading';
  // var TRANSKEY_NEWNODE = 'labelNewNode';
  // var TRANSKEY_MULTISEL = 'labelMultiSelection';
  var TRANSKEY_NODATA = 'labelNoData';

  var USER_UL_ID_PREFIX = 'oj-tree-existing-markup-';

  //  Attr's we ignore when creating a list of user attr's
  var ATTR_IGN = ['id', 'title', 'class', 'role', 'draggable', 'style'];

  var scrollbarWidth;

  $(function () {
    var e1;
    var e2;
    if (/msie/.test(navigator.userAgent.toLowerCase())) {
      e1 = $('<textarea cols="10" rows="2"></textarea>')
        .css({ position: 'absolute', top: -1000, left: 0 })
        .appendTo('body'); // @HTMLUpdateOK
      e2 = $('<textarea cols="10" rows="2" style="overflow: hidden;"></textarea>')
        .css({ position: 'absolute', top: -1000, left: 0 })
        .appendTo('body'); // @HTMLUpdateOK
      scrollbarWidth = e1.width() - e2.width();
      e1.add(e2).remove();
    } else {
      e1 = $('<div></div>')
        .css({
          width: 100,
          height: 100,
          overflow: 'auto',
          position: 'absolute',
          top: -1000,
          left: 0
        })
        .prependTo('body') // @HTMLUpdateOK
        .append('<div></div>') // @HTMLUpdateOK
        .find('div')
        .css({ width: '100%', height: 200 });
      scrollbarWidth = 100 - e1.width();
      e1.parent().remove();
    }
  });

  /**
   * Stack of key handler objects for all trees
   * @private
   */
  var _aKeyHandlerStack = [];

  /**
   * Add key combination handler to stack, and add listener
   * @private
   */
  function _addKeyFilter(obj) {
    _aKeyHandlerStack.push(obj);
    $(obj._selector).keydown(_KeyFilterHandler);
  }

  /**
   * Handle keystroke from _KeyFilter and dispatch to the
   * relevent accessibility key combination handler.
   * @private
   */
  function _KeyFilterHandler(e) {
    var s = '';

    if (DomUtils.isMetaKeyPressed(e)) {
      s += 'ctrl+';
    } else if (e.shiftKey) {
      s += 'shift+';
    }
    var key = e.which;
    switch (key) {
      case 32: // Space
        s += 'space';
        break;
      case 37: // Left arrow
        s += 'left';
        break;
      case 38: // Up arrow
        s += 'up';
        break;
      case 39: // Right arrow
        s += 'right';
        break;
      case 40: // Down arrow
        s += 'down';
        break;
      case 46: // Delete
        s += 'del';
        break;
      case 33: // Page Up
        s += 'pgup';
        break;
      case 34: // Page Down
        s += 'pgdn';
        break;
      case 35: // End
        s += 'end';
        break;
      case 36: // Home
        s += 'home';
        break;
      case 56: // asterisk
        s = '*'; // remove the shift required to get *
        break;
      case 113: // F2
      case 121: // F10
        /*
      case 112:                     // F1
      case 114:                     // F3
      case 115:                     // F4
      case 116:                     // F5
      case 117:                     // F6
      case 118:                     // F7
      case 119:                     // F8
      case 120:                     // F9
      case 122:                     // F11
      case 123:                     // F12
*/
        s += 'f' + ('1' - (112 - key));
        break;
      default:
        break;
    }
    if (s.length === 0 || s === 'shift+' || s === 'ctrl+') {
      return true;
    }
    // If we can find a handler from a tree with focus, dispatch the
    // keystroke event to it.
    var retHandler = null;
    $.each(_aKeyHandlerStack, function (i, obj) {
      if (obj._this._data.ui.focused) {
        // does associated tree have focus
        // yes
        obj._this._data.ui.touchEvent = false; // ensure touchEvent flag is off
        if (s === 'shift+f10') {
          // note the active node if shift+F10
          obj._this._data.menu.activeNode = obj._this._data.ui.hovered;
          // if no hovered node (maybe a click and then mouse off the
          // node), use the last selected node.
          if (!obj._this._data.menu.activeNode) {
            obj._this._data.menu.activeNode = obj._this._data.ui.lastSelected;
          }
        } else if (obj._handler[s]) {
          // check if matching handler function
          e.preventDefault();
          retHandler = obj._handler[s].call(obj._this, e); // handle the keystroke(s)
        }
        return false; // break out of $.each
      }
      return undefined;
    });

    if (retHandler != null) {
      return retHandler;
    }
    return undefined;
  }

  /**
   * Remove key combination handler from stack and remove listener
   * @private
   */
  function _removeKeyFilter(selector) {
    $.each(_aKeyHandlerStack, function (i) {
      if (_aKeyHandlerStack[i]._selector === selector) {
        $(selector).off('keydown');
        _aKeyHandlerStack[i] = null;
        _aKeyHandlerStack.splice(i, 1);
        return false;
      }
      return undefined;
    });
  }

  /**
   *  Returns true if a non-inherited object has no properties.
   *  @private
   */
  function isPureObjEmpty(o) {
    var props = Object.keys(o);
    return props.length === 0;
  }

  /**
   *  Creates and adds a style sheet.
   *  @param {Object=}  opts  The css data.
   *  @param {boolean=} bLink  True if opts.url is to be ignored.
   *  @private
   */
  // eslint-disable-next-line no-unused-vars
  function _addSheet(opts, bLink) {
    var tmp = false;
    var isNew = true;

    if (opts.str) {
      if (opts.title) {
        tmp = $("style[id='" + opts.title + "-stylesheet']")[0];
      }
      if (tmp) {
        isNew = false;
      } else {
        tmp = document.createElement('style');
        tmp.setAttribute('type', 'text/css');
        if (opts.title) {
          tmp.setAttribute('id', opts.title + '-stylesheet');
        }
      }

      if (tmp.styleSheet) {
        if (isNew) {
          document.getElementsByTagName('head')[0].appendChild(tmp); // @HTMLUpdateOK
          tmp.styleSheet.cssText = opts.str;
        } else {
          tmp.styleSheet.cssText = tmp.styleSheet.cssText + ' ' + opts.str;
        }
      } else {
        tmp.appendChild(document.createTextNode(opts.str)); // @HTMLUpdateOK
        document.getElementsByTagName('head')[0].appendChild(tmp); // @HTMLUpdateOK
      }

      return tmp.sheet || tmp.styleSheet;
    }

    /*  Not currently used
    if (opts.url) {
      if (bLink) {
        if (document.createStyleSheet)  {
          try  {
                 tmp = document.createStyleSheet(opts.url);    // IE
          }
          catch (e) { }

        }
        else  {
          tmp        = document.createElement('link');
          tmp.rel    = 'stylesheet';
          tmp.type   = 'text/css';
          tmp.media  = "all";
          tmp.href   = opts.url;

          document.getElementsByTagName("head")[0].appendChild(tmp);
          return tmp.styleSheet;
        }
      }
    }
*/
    return undefined;
  }

  /**
   * @private
   */
  var _instance = -1; // current Tree instance id

  /**
   * @ojcomponent oj.ojTree
   * @augments oj.baseComponent
   * @since 0.6.0
   * @ignore
   * @deprecated  4.2.0 Use oj.ojTreeView instead.
   *
   * @classdesc
   * <h3 id="treeOverview-section">
   *   JET Tree Component
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#treeOverview-section"></a>
   * </h3>
   *
   * The ojTree component allows a user to display the hierarchical relationship between the nodes of a tree.<p>
   * The tree contents can be specified in JSON format, or by prepopulating the tree's containing &lt;div&gt; with
   * HTML &lt;ul&gt; list markup.
   * </p></br>
   *
   * <h4 id="treeJSON-section"> JSON Node Format</h4>
   * </br>
   * Each node object typically has a <code class="prettyprint">title</code> and an
   * <code class="prettyprint">attr</code> property. Any node can be defined as a parent by supplying
   * a <code class="prettyprint">children</code> property, which is an array of more node definitions.
   * (Note that if a node has a <code class="prettyprint">children</code> property defined, but no children
   * are actually specified, then ojTree will perform lazy-loading by requesting child node data only
   * when a node is expanded for the first time - refer to <code class="prettyprint">option</code> property
   * <code class="prettyprint">data</code>.
   * <p>Example: Basic JSON Tree definition
   * <pre class="prettyprint">
   * <code>
   *[
   *   {
   *     "title": "Home",
   *     "attr": {"id": "home"},
   *   },
   *   {
   *     "title": "News",
   *     "attr": {"id": "news"}
   *   },
   *   {
   *      "title": "Blogs",
   *      "attr": {"id": "blogs"},
   *      "children": [ {
   *                       "title": "Today",
   *                       "attr": {"id": "today"}
   *                    },
   *                    {
   *                       "title": "Yesterday",
   *                       "attr": {"id": "yesterday"}
   *                    }
   *                  ]
   *   }
   *]
   *</code></pre>
   *</p></br>
   * Whatever attributes are defined for the <code class="prettyprint">attr</code> property are transferred
   * to the associated DOM &lt;li&gt; element. A <code class="prettyprint">metadata</code> attribute can also be
   * defined for arbitrary user-defined data that is to be associated with a node. (This metadata is
   * maintained within the ojTree instance, and is not represented in the DOM.)  A node's metadata can be retrieved
   * using the jQuery .data() method.
   * </p></br>Example: Expanded use of the <code class="prettyprint">attr</code> and <code class="prettyprint">metadata</code> properties
   * <pre class="prettyprint">
   * <code>
   *[
   *  {
   *    "title": "Home",
   *    "attr": {
   *               "id": "home",
   *               "myattr1": "Hello",         &lt;-- additional user-defined attributes
   *               "myattr2": "World"          &lt;-- additional user-defined attributes
   *            },
   *    "metadata": {                          &lt;-- node metadata
   *                  "type": "T123",
   *                  "val": 42,
   *                  "active": true
   *                }
   *  },
   *
   *  . . .
   *  $('#mytree').on("ojoptionchange", function (ev, ui) {
   *                  if (ui.option && ui.option == "selection") {
   *                    // retrieve metadata from (first) selected node
   *                    var meta = $(ui.value[0]).data() ;
   *                  }
   *              }) ;
   *]
   *</code></pre>
   *
   * </p></br>Example: Retrieving node attributes and data
   * <pre class="prettyprint">
   * <code>
   *$("#mytree).on("ojtreehover", function (ev, ui){
   *
   *  // ui.item = node
   *  // ui.item.attr("id")         -  retrieve a node attribute
   *  // ui.item.attr("myattr1")    -    ..
   *  // ui.item.data("active")     -  retrieve the "active" meta-data value from previous example
   *
   *});
   *</code></pre>
   *</p></br>
   * For flexibility, attributes can also be applied to the node's &lt;a&gt; element if required, by specifying
   * the node <code class="prettyprint">data</code> property as an object.
   * </p>Example: Using the data property
   * <pre class="prettyprint">
   * <code>
   *{
   *   "attr" : { "id" : "myid" },                    &lt;-- this is set on the &lt;li&gt;
   *   "data" : {
   *              "attr" : {
   *                         "flags"   : "A-B",       &lt;-- this is set on the &lt;a&gt;
   *                         "title" : "This is a tooltip"
   *                       }
   *             }
   *}
   *</code></pre>
   *</p></br>
   * <h4 id="treeHTML-section"> HTML Node Format</h4>
   * </br>
   * A Tree can be populated via standard HTML markup using a &lt;ul&gt; list structure - refer to
   * <code class="prettyprint">option</code> property <code class="prettyprint">"data"</code>.  In
   * the case where the <code class="prettyprint">"data"</code> option has not been defined, ojTree
   * will use any HTML markup defined in the Tree's containing &lt;div&gt;, and on startup the &lt;ul&gt;
   * the markup will be detached from the containing &lt;div&gt;, saved, and used as a template to create a new
   * tree structure in its place.  When the tree is destroyed, the original markup is restored.  Lazy loading of
   * a node's children (when expanded) is performed if any node indicates that it has children,
   * but its child &lt;ul&gt; list is left empty.
   * </p></br>Example: Using HTML markup to populate a Tree.
   * <pre class="prettyprint">
   * <code>
   * &lt;div id="mytree"&gt;
   *    &lt;ul&gt;
   *       &lt;li id="home"&gt;
   *          &lt;a href="#"&lt;Home&gt;/a&gt;
   *       &lt;/li&gt;
   *       &lt;li id="news"&gt;
   *          &lt;a href="#"&gt;News&lt;/a&gt;
   *       &lt;/li&gt;
   *       &lt;li id="blogs"&gt;
   *            &lt;a href="#"&gt;Blogs&lt;/a&gt;
   *            &lt;ul&gt;
   *              &lt;li id="today"&gt;
   *                 &lt;a href="#"&gt;Today&lt;/a&gt;
   *              &lt;/li>
   *              &lt;li id="yesterday"&gt;
   *                 &lt;a href="#"&gt;Yesterday&lt;/a&gt;
   *              &lt;/li&gt;
   *            &lt;/ul&gt;
   *       &lt;/li&gt;
   * &lt;/div&gt;
   </code></pre>
   * </p></br>
   *
   *
   *
   * <h3 id="touch-section">
   *   Touch End User Information
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
   * </h3>
   *
   * {@ojinclude "name":"touchDoc"}
   * <p>
   *
   * <h3 id="keyboard-section">
   *   Keyboard End User Information
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
   * </h3>
   *
   * {@ojinclude "name":"keyboardDoc"}
   *
   *
   * <br>
   * <h3 id="rtl-section">
   *   Reading direction
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
   * </h3>
   *
   * <p>The only supported way to set the reading direction (LTR or RTL) is to set the <code class="prettyprint">"dir"</code> attribute on the
   * <code class="prettyprint">&lt;html></code> element of the page.  As with any JET component, in the unusual case that the reading direction
   * is changed post-init, the tree must be <code class="prettyprint">refresh()</code>ed, or the page must be reloaded.
   *
   * <br>
   *
   * @desc Creates a JET Tree.
   * @param {Object=} options a map of option-value pairs to set on the component
   *
   * @example <caption>Initialize the Tree with options:</caption>
   * $( ".selector" ).ojTree( {"selectionMode": "single", "data": [JSON objects]} );
   *
   */
  oj.__registerWidget('oj.ojTree', $.oj.baseComponent, {
    widgetEventPrefix: 'oj',
    defaultElement: '<div>',

    options: {
      /** Disables the tree if set to <code class="prettyprint">true</code>.
       *
       * @member
       * @name disabled
       * @memberof oj.ojTree
       * @instance
       * @type {boolean}
       * @default <code class="prettyprint">false</code>
       *
       * @example <caption>Initialize the tree with the <code class="prettyprint">disabled</code> option specified:</caption>
       * $( ".selector" ).ojTree( { "disabled": true } );
       *
       * @example <caption>Get or set the <code class="prettyprint">disabled</code> option, after initialization:</caption>
       * // getter
       * var disabled = $( ".selector" ).ojTree( "option", "disabled" );
       *
       * // setter
       * $( ".selector" ).ojTree( "option", "disabled", true );
       */
      // disabled option declared in superclass, but we still want the above API doc

      /**
       * <p>The JET Menu should be initialized before the Tree using it as a
       * context menu.
       *
       * @ojfragment contextMenuInitOrderDoc - Decomped to fragment so Tabs, Tree, and MasonryLayout can convey their init order restrictions.
       * @memberof oj.ojTree
       */
      /**
       * {@ojinclude "name":"contextMenuDoc"}
       *
       * <p>When defining a contextMenu, ojTree will provide built-in behavior for "edit" style functionality
       *  (e.g. cut/copy/paste) if the following format for menu &lt;li&gt; item's is used (no &lt;a&gt;
       *  elements are required):
       * <ul><li> &lt;li data-oj-command="oj-tree-cut" /&gt;</li>
       *     <li> &lt;li data-oj-command="oj-tree-copy" /&gt;</li>
       *     <li> &lt;li data-oj-command="oj-tree-paste" /&gt;</li>
       *     <li> &lt;li data-oj-command="oj-tree-paste-after" /&gt;</li>
       *     <li> &lt;li data-oj-command="oj-tree-paste-before" /&gt;</li>
       *     <li> &lt;li data-oj-command="oj-tree-remove" /&gt;</li>
       *     <li> &lt;li data-oj-command="oj-tree-rename" /&gt;</li>
       * </ul>
       * The available translated text will be applied to menu items defined this way.
       *
       * @member
       * @name contextMenu
       * @memberof oj.ojTree
       * @instance
       * @type {Element|Array.<Element>|string|jQuery|NodeList}
       * @default <code class="prettyprint">null</code>
       *
       * @example <caption>Initialize a JET Tree with a context menu:</caption>
       * // via recommended HTML5 syntax:
       * &lt;div id="myTree" contextmenu="myMenu" data-bind="ojComponent: { ... }>
       *
       * // via JET initializer (less preferred) :
       * $( ".selector" ).ojTree({ "contextMenu": "#myContextMenu"  ... } });
       *
       * @example <caption>Get or set the <code class="prettyprint">contextMenu</code> option for
       *      an ojTree after initialization:</caption>
       * // getter
       * var menu = $( ".selector" ).ojTree( "option", "contextMenu" );
       *
       * // setter
       * $( ".selector" ).ojTree( "option", "contextMenu", "#myContextMenu"} );
       */

      /**
         * Specifies support for HTML5 Drag and Drop. Please refer to
         * <a href="https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_and_drop">third-party documentation</a> for details of the HTML5 Drag and Drop facilities.<p>
         * The <em>dnd</em> property and its values indicates whether:<ol>
         * <li>the nodes may be reordered using drag and drop within the same tree
         * <li>the tree can participate in drag/drop operations with other drag/drop
         *     enabled components or elements.
         * </ol>
         * To make a tree reorderable, specify an object with the property
         * <code class="prettyprint">reorder</code> set to <code class="prettyprint">'enable'</code>.
         * Setting the <code class="prettyprint">reorder</code>
         * property to <code class="prettyprint">"disable"</code>, or omitting the
         * <code class="prettyprint">reorder</code> property disables reordering support.
         * <br></br>
         * <b>Example: Enable drag and drop for tree node reordering:</b>
         *<pre class="prettyprint">
         *<code>
         * dnd : (
         *         reorder : 'enable'
         *       }
         *</code></pre>
         * </br></br>
         * To allow tree nodes to act as a drag source, specify the optional property <code class="prettyprint">drag</code>.
         * The  drag <code class="prettyprint">node</code> property object allows the application to control the drag process.
         * <br></br>
         * <b>Example: Enable drag support:</b>
         *<pre class="prettyprint">
         *<code>
         * dnd : (
         *         drag : {
         *                  node: {
         *                          ... drag callback properties
         *                        }
         *                }
         *       }
         *</code></pre>
         *</br>
         * To allow a tree to act as a drop target, specify the optional property <code class="prettyprint">drop</code>.
         * The properties of the <code class="prettyprint">drop</code> object relate to movement over potential node
         * drop targets and the drop itself, and permit application control of the drop process.
         * <br></br>
         * <b>Example: Enable drop support:</b>
         *<pre class="prettyprint">
         *<code>
         * dnd : (
         *         drop : {
         *                  node: {
         *                          ... drop callback properties
         *                        }
         *                }
         *       }
         *</code></pre>
         *</br>
         * Note: if the neither of the <code class="prettyprint">drag</code>
         * <code class="prettyprint">dataTypes</code> nor <code class="prettyprint">dragStart</code> properties
         * are specified, the tree will not be drag enabled.  If the <code class="prettyprint">drop</code> property
         * is not specifed, the tree will not be drop enabled.  However, if a tree is drag and/or drop disabled and
         * <code class="prettyprint">reorder: 'enabled'</code> is defined, drag/drop will still be permitted for node
         * reordering only (within the same tree).</br>
         *
         * </br>
         * @property {string} reorder  Valid values are <code class="prettyprint">'enable'</code> or
         *                             <code class="prettyprint">'disable'</code>. Default if omitted
         *                             is <code class="prettyprint">'disable'</code. When reorder support
         *                             is enabled, the Tree automatically adds the HTML attribute draggable=true
         *                             to all tree nodes.
         * @property {Object} drag     Specifies that the tree will act as a drag source.<br>
         *                             The following drag options allow callback functions
         *                             to be specified to provide application control over the drag process.</br>
         *                             (For a discussion of the possible return values from these callback functions,
         *                             refer to the HTML5 documentation for the <code class="prettyprint">dragstart</code>,
         *                             <code class="prettyprint">drag</code>, and <code class="prettyprint">dragend</code> events.)
         * @property {Object} drag.node  Specify an object containing the following optional callback properties.
         * To permit dragging, at least one of the properties <code class="prettyprint">dataTypes</code> or
         * <code class="prettyprint">dragStart</code> is required. That is, if <code class="prettyprint">dataTypes</code>
         * is specified, then <code class="prettyprint">dragStart</code> is not required unless additional control of
         * the drag start is required. If <code class="prettyprint">dataTypes</code> is not defined, then
         *<code class="prettyprint">dragStart</code> should be used to assign the node data to a data type in the
         * event.dataTransfer object.
         * @property {string | Array.<string>} drag.node.dataTypes  The optional MIME type(s) to use for the dragged
         *    data in the dataTransfer object. May be specified as a string if there is only one type, or an array of
         *    strings if multiple types are needed.<p>
         *    When a drag starts, each data type will be set using <em>dataTransfer.setData()</em> with the stringified
         *    array of the JSON representation of the dragged tree node(s). (These node objects may be recreated via
         *    JSON.parse()).  Each array entry is of the same format as used to create/insert nodes using the create() method.)<p>
         *    If not specified, the app should set its own data type(s) in its <em>dragStart</em> callback, using the node
         *    data found in the callback's <code class="prettyprint">ui</code> argument.  If the <em>dataTypes</em> property is
         *    omitted and no data type is set in the <em>dragStart</em> callback, drag is not permitted.
         * @property {function} drag.node.dragStart  An application callback function that will be called
         *                                      when a drag operation is initiated on a node.</br></br>
         *                                      <em>function(event, ui)</em>
         *              <table><tr><th>Name</th><th>Type</th><th>Description</th></tr>
         *                 <tr><td>event</td><td>Event</td><td>the jQuery wrapped native <em>dragstart</em> event object.</td></tr>
         *                 <tr><td>ui</td><td>Object</td><td>tree parameters.
         *                     <table><tr><th>Name</th><th>Type</th><th>Description</th></tr>
         *                            <tr><td>item</td><td>array of objects</td><td>the node(s) being dragged.</td></tr>
         *                     </table></td></tr>
         *              </table>
         *              The <code class="prettyprint">dragStart</code> callback function may use the dataTransfer
         *              method <code class="prettyprint">setDragImage()</code> if it wishes to replace the  default
         *              drag image, and also the <code class="prettyprint">effectAllowed</code>
         *              property. If the callback does not modify <em>effectAllowed</em>, a default of <em>'copy'</em>
         *              is used if the <em>ctrl</em> key is used, else it is set to <em>'move'</em>.  If the <em>dataTypes</em> property
         *              has not been specified, this callback should set a data type using event.dataTransfer.setData() and
         *              the node data in the <em>ui</em> argument. If the <em>dataTypes</em> property is omitted and no data
         *              type is set in the dragStart callback, drag is not permitted.
         *        <p>This function should return <em>true</em> to indicate that the drag is permissible or <em>false</em>
         *         otherwise.  If this function does not return a value, the drag will be permitted.
         * @property {function} drag.node.drag  An application callback function that will be called repeatedly as the
         *                                      drag source is dragged.</br></br>
         *                                      <em>function(event)</em>
         *              <table><tr><th>Name</th><th>Type</th><th>Description</th></tr>
         *                 <tr><td>event</td><td>Event</td><td>the jQuery wrapped native <em>drag</em> event object.</td></tr>
         *              </table>
         * @property {function} drag.node.dragEnd  An application callback function that will be called
         *                                      when a drag operation completes (regardless of whether
         *                                      the drop operation ever occurs or ends successfully or not.</br></br>
         *                                      <em>function(event, ui)</em>
         *              <table><tr><th>Name</th><th>Type</th><th>Description</th></tr>
         *                 <tr><td>event</td><td>Event</td><td>the jQuery wrapped native <em>dragend</em> event object.</td></tr>
         *                 <tr><td>ui</td><td>Object</td><td>tree parameters.
         *                   <table><tr><th>Name</th><th>Type</th><th>Description</th></tr>
         *                       <tr><td>reorder</td><td>boolean</td><td><em>true</em> if a reorder was just performed, else <em>false</em>.<p>
         *                            If <em>reorder</em> is false the <em>dragEnd</em> callback should remove any nodes from the
         *                            tree that were moved (that is, <em>dropEffect</em> is <em>"move"</em>).</td></tr>
         *                   </table>
         *                 </td></tr>
         *              </table>
         *
         * @property {Object} drop       Specifies that the tree can act as a drop target.
         * @property {Object} drop.node  An object allowing callback functions to be specifed to provide drag/drop
         *                               feedback to the application.</br>
         *                               (For a discussion of the possible return values from these callback functions,
         *                               refer to the HTML5 documentation for the <code class="prettyprint">dragenter</code>,
         *                               <code class="prettyprint">dragover</code>, <code class="prettyprint">drop</code>,
         *                               and <code class="prettyprint">dragleave</code> events.)
         * @property {function} drop.node.dragEnter An application callback function that will be called
         *                                      when a tree node is entered during a drag.</br></br>
         *                                      <em>function(event, ui)</em>
         *              <table><tr><th>Name</th><th>Type</th><th>Description</th></tr>
         *                 <tr><td>event</td><td>Event</td><td>the jQuery wrapped native <em>dragenter</em> event object.</td></tr>
         *                 <tr><td>ui</td><td>Object</td><td>tree parameters.
         *                   <table><tr><th>Name</th><th>Type</th><th>Description</th></tr>
         *                     <tr><td>item</td><td>Object</td><td>the jQuery wrapped tree node being entered. This will be null if the tree is empty.</td></tr>
         *                     <tr><td>position</td><td>string</td><td>the drop position relative to the
         *                             reference node. Can be <em>'before'</em>, <em>'after'</em>, <em>'inside'</em>, or <em>'first'</em>.</td></tr>
         *                     <tr><td>reference</td><td>Object</td><td>the jQuery wrapped reference node that <em>ui.position</em> refers to.
         This will be null if the tree is empty.</td></tr>
         *                   </table>
         *                 </td></tr>
         *              </table>
         *        This function should return <em>false</em> to indicate that the dragged data can be accepted,
         *        or <em>true</em> otherwise. Any explicit return value will be passed back to jQuery.  Returning
         *        <em>false</em> will cause event.stopPropagation() and event.preventDefault() to be called.
         *        (event.preventDefault() is required by HTML5 Drag and Drop to indicate acceptance of the dragged
         *        data at the potential drop position.)<p>
         *        If this function does not return a value, <em>dataTypes</em> will be matched against the drag data
         *        types to determine if the data is acceptable. If <em>dataTypes</em> is not defined, the dragged data will be accepted.
         *
         * @property {function} drop.node.dragOver  An application callback function that will be called
         *                                     when a tree node is dragged over. (Note that there will be
         *                                     multiple calls to this function as the mouse moves over
         *                                     the node.</br></br>
         *                                      <em>function(event, ui)</em>
         *              <table><tr><th>Name</th><th>Type</th><th>Description</th></tr>
         *                 <tr><td>event</td><td>Event</td><td>the jQuery wrapped native event object.</td></tr>
         *                 <tr><td>ui</td><td>Object</td><td>tree parameters.
         *                    <table><tr><th>Name</th><th>Type</th><th>Description</th></tr>
         *                       <tr><td>item</td><td>Object</td><td>the jQuery wrapped tree node being dragged over. This will be null if the tree is empty.</td></tr>
         *                       <tr><td>position</td><td>string</td><td>the drop position relative to the
         *                          reference node Can be <em>'before'</em>, <em>'after'</em>, <em>'inside'</em>, or <em>'first'</em>.</td></tr>
         *                      <tr><td>reference</td><td>Object</td><td>the reference node that <em>ui.position</em> refers to.  this will be null if the tree is empty.</td></tr>
         *                    </table>
         *                 </td></tr>
         *              </table>
         *        As for <em>dragEnter</em>, this function should return <em>false</em> to indicate that the dragged data
         *       can be accepted at this position, or <em>true</em> otherwise.  If this function does not return a value,
         *       <em>dataTypes</em> will be matched against the drag data types to determine if the data is acceptable.
         *       If <em>dataTypes</em> is not defined the dragged data will be accepted.
         *
         * @property {function} drop.node.drop  An application callback function that will be called
         *                                     when the dragged object is dropped on a tree.</br></br>
         *                                      <em>function(event, ui)</em>
         *
         *              <table><tr><th>Name</th><th>Type</th><th>Description</th></tr>
         *                 <tr><td>event</td><td>Event</td><td>the jQuery wrapped native event object.</td></tr>
         *                 <tr><td>ui</td><td>Object</td><td>tree parameters.
         *                    <table><tr><th>Name</th><th>Type</th><th>Description</th></tr>
         *                       <tr><td>position</td><td>string</td><td>the drop position relative to the
         *                           reference node Can be <em>'before'</em>, <em>'after'</em>, <em>'inside'</em>, or <em>'first'</em>.</td></tr>
         *                       <tr><td>reference</td><td>string</td><td>the reference node that <em>ui.position</em> refers to.</td></tr>
         *                       <tr><td>reorder</td><td>boolean</td><td><em>true</em> if a reorder was just performed, else <em>false</em>.<p>
         *                            If <em>reorder</em> is <em>true</em>, the <em>drop</em> callback should not perform any tree
         *                            restructuring since this is automatically performed as part of the reorder.</td></tr>
         *                    </table>
         *                 </td></tr>
         *              </table>
         *        This function should return <em>false</em> to indicate that the dragged data is accepted, or <em>true</em> otherwise.
         *
         * @property {function} drop.node.dragLeave An application callback function that will be called
         *                                     when the drag operation moves out of the last entered node.
         *                                     It is also called if the escape key is pressed while the
         *                                     cursor is over a drop position, or a dragOver callback
         *                                     cancels the drag.</br></br>
         *                                      <em>function(event, ui)</em>
         *              <table><tr><th>Name</th><th>Type</th><th>Description</th></tr>
         *                 <tr><td>event</td><td>Event</td><td>the jQuery wrapped native event object.</td></tr>
         *                 <tr><td>ui</td><td>Object</td><td>tree parameters.
         *                    <table><tr><th>Name</th><th>Type</th><th>Description</th></tr>
         *                       <tr><td>item</td><td>Object</td><td>the jQuery wrapped tree node that was last entered.</td></tr>
         *                    </table>
         *                 </td></tr>
         *              </table>
         *
         * @property {string | Array.<string>} drop.node.dataTypes An optional data type string, or array of strings that the
         *                                     tree will test for in the <code class="prettyprint">event.dataTransfer</code>
         *                                     object when the object is moved over a potential tree drop position. If
         *                                     none of the dataTransfer data types are found in this list, a drop over
         *                                     the current position is not permitted.  If the array is omitted or
         *                                     empty, the drag operation will continue.<p>
         *                                     Refer also to <em>dataTypes</em> in the <em>drag</em> property object.
         *</br></br>
         *
         * @example <caption>Allow drag from a tree, do not allow drop on the tree.</caption>
         * <code>
         *Note: to permit dragging, at least one of the dataTypes or dragStart properties is required. That is, if
         *dataTypes is specified, dragStart is not required unless additional tuning of the drag start is needed.
         *If dataTypes is not defined, then dragStart should be used to assign the node data to a dataType.
         *
         *dnd: {
         *       drag: {
         *               node : {
         *                        datatypes: ['xxx'],
         *                        dragStart: myDragStart,
         *                        dragEnd:   myDragend
         *                      }
         *             }
         *     }
         *
         *self.myDragStart = function(event, ui)
         *{
         *   event.preventDefault() ;   // allow drag
         *   return false ;
         *}
         *
         *self.myDragend = function(event)
         *{
         *  var selections ;
         *
         *  if (event.originalEvent.dataTransfer.dropEffect === "move") {
         *    // Remove the moved node(s) selected.
         *    if (self.$tree.ojTree("isSelected", event.target)) {
         *      selections =  self.$tree.ojTree("option", "selection") ;
         *      for (i = 0; i < selections.length; i++) {
         *         self.$tree.ojTree("remove", selections[i]) ;
         *      }
         *    }
         *    else {
         *      // Single unselected node moved
         *      self.$tree.ojTree("remove", event.target) ;
         *    }
         *  }
         *}
         * </code>
         *
         * @example <caption>Handle drop of node(s) from another tree.</caption>
         * <code>
         *dnd: {
         *       drop: {
         *               node : {
         *                        dataTypes: ['xxx'],
         *                        drop:  myDrop
         *                      }
         *             }
         *     }
         *
         *self.myDrop = function(event, ui)
         *{
         *  var data = JSON.parse(event.originalEvent.dataTransfer.getData('xxx')) ;
         *
         *  self.$tree.ojTree("create", ui['reference'][0], ui['position'], data) ;
         *  return false ;
         *}
         * </code>
         *
         * @example <caption>Do not allow drag of a particular node.</caption>
         * <code>
         *dnd: {
         *       drag: {
         *               node : {
         *                        dragStart:  function(event, ui) {
         *                             if (ui.item.id != "myTopId") {
         *                               event.preventDefault() ;     // allow drag
         *                               return false ;
         *                             }
         *                             // else can't drag
         *                        }
         *                      }
         *             }
         *     }
         * </code>
         * @example <caption>Disallow drop above a certain node.</caption>
         * <code>
         *dnd: {
         *       drag: {
         *               node : {
         *                        dragEnter:  function(event, ui)  {
         *                             if ((ui.position != 'above') ||
         *                                 (ui.item.id) != 'mynode')) {
         *                               event.preventDefault() ;     // allow drag
         *                               return false ;
         *                             }
         *                             // else can't drop here
         *                             return true ;
         *                        }
         *                      }
         *             }
         *     }
         * </code>
         *
         * @type {Object}
         * @default <code class="prettyprint">{reorder:'disable'}</code>
         * @expose
         * @instance
         * @memberof oj.ojTree
         */
      dnd: { reorder: 'disable' },

      /**
       * Specify <span class="code-caption">true</span> if expanding a node programatically should
       * also expand its parents (i.e all parent nodes down to this node will be expanded).
       * @type {boolean}
       * @default <code class="prettyprint">false</code>
       * @expose
       * @instance
       * @memberof oj.ojTree
       */
      expandParents: false,

      /**
       * Specifies whether any nodes should be initially expanded on start-up.   Specify an array
       * of node id's, or the string <span class="code-caption">"all"</span> if all parent nodes
       * should be expanded.  The value may optionally be specified as an empty array.
       * @type {Array | null}
       * @default <code class="prettyprint">null</code>
       * @expose
       * @instance
       * @memberof oj.ojTree
       */
      initExpanded: null,

      initLoaded: [], // suppressed per design review

      /** An array of node elements that are currently selected. If the array is modified
       * by an application, the selected node status of the tree is modified to match the array
       * (nodes may be defined as elements, jQuery wrapped nodes, or selectors pointing to the
       * elements that should be selected).
       * @type {Array}
       * @default <code class="prettyprint">Array</code>
       * @expose
       * @instance
       * @memberof oj.ojTree
       */
      selection: [],

      /**
       * Specifies whether selection is permitted, and whether more than one node
       * can be selected at a time.  Values are <span class="code-caption">"single"</span>
       * for single selection, <span class="code-caption">"multiple"</span> to allow multiple
       * concurrent selections, and <span class="code-caption">"none"</span> to inhibit selection.
       * @type {string}
       * @default <code class="prettyprint">"single"</code>
       * @expose
       * @instance
       * @memberof oj.ojTree
       */
      selectionMode: 'single',

      /**
       *  Specifies what action is to be taken when a selected node's parent is collapsed.  Specify
       *  false if nothing is to be done. Specify <span class="code-caption">"selectParent"</span>
       *  if the node's closed parent is to be selected, or specify <span class="code-caption">"deselect"</span>
       *  if the node is to be deselected.
       * @type {boolean | string}
       * @default <code class="prettyprint">false</code>
       * @expose
       * @instance
       * @memberof oj.ojTree
       */
      selectedParentCollapse: false,

      /**
       *  Specifies what action is to be taken when a node is programmatically expanded.  Specify
       *  <span class="code-caption">true</span> if all of the node's closed parents should be opened
       *  automatically.  If <span class="code-caption">false</span> is specified, the node is selected but will
       *  remain invisible if its parents are currently collapsed.
       * @type {boolean}
       * @default <code class="prettyprint">true</code>
       * @expose
       * @instance
       * @memberof oj.ojTree
       */
      selectedParentExpand: true,

      /**
       * Specifies the action to take when a selected node is deleted.  If set to
       * <span class="code-caption">true</span>, its previous sibling (or parent, if no previous siblings)
       * is selected.  If <span class="code-caption">false</span> is specified, no action is taken.
       * @type {boolean}
       * @default <code class="prettyprint">false</code>
       * @expose
       * @instance
       * @memberof oj.ojTree
       */
      selectPrevOnDelete: false,

      /**
       * Specifies the data source used to populate the tree. Currently supported data sources are a <code class="prettyprint">JsonTreeDataSource</code>,
       * or json, or html.</br></br>
       * The general format of the <code class="prettyprint">data</code> option is one of the following:
       *</br></br>
       *<ul>
       *   <li>data : oj.JsonTreeDataSource</br></br></li>
       *   <li>data : null    (or omit) - ojTree will look at the containing &lt;div&gt;
       *                       and use any existing html &lt;ul&gt; markup found</br></br></li>
       *   <li>data : "  json string  "</br></br></li>
       *   <li>data : [ array of json objects ]</br></br></li>
       *   <li>data : "&lt;ul&gt;&lt;li&gt; ...  html markup string  &lt;/ul&gt;"</br></br></li>
       *   <li>data : { "data" : &nbsp; &nbsp; ... or &nbsp; &nbsp; "ajax" : &nbsp; &nbsp; . . . &nbsp; &nbsp;}  &nbsp; &nbsp; &nbsp; // retrieve json or html</li>
       * </ul>
       *</br>
       * Use of the <code class="prettyprint">"data"</code> property of the <code class="prettyprint">data</code> option,
       * specifies that the tree is to be populated from JSON or HTML (local or remote).
       * The <code class="prettyprint">"data"</code> object contains one of two properties:
       * <ul>
       *  <li>"data"</li>
       *  <li>"ajax"</li>
       * </ul>
       *  An optional <code class="prettyprint">"dataType"</code> property may also be specified, which can take the
       *  value <code class="prettyprint">"json"</code> or <code class="prettyprint">"html"</code>, and indicates
       *  what kind of data is being returned in the <code class="prettyprint">"data"</code> or
       *  <code class="prettyprint">"ajax"</code> method (default is "json").
       * </ul>
       *
       * When <span class="code-caption">"data"</span> is specified as an object, its <span class="code-caption">"data"</span> property may be specified as a function which
       * receives two arguments: <span class="code-caption">node</span>, and <span class="code-caption">fn</span>.
       * </p></br>
       * Example: Skeleton outline of a <code class="prettyprint">"data"</code> function:
       *</br>
       *<pre class="prettyprint">
       *<code>
       *data : {
       *          "data" : function(node, fn) {
       *                    // node  -  the jQuery wrapped node to be expanded for a lazy load,
       *                    //          or -1 if it is the initial call to load the tree.
       *                    // fn    -  a function to call with the JSON to be applied.
       *
       *                    fn( new_json_node_data ) ;   // return the JSON
       *                   }
       *        }
       *</code></pre>
       * </br>
       * The <code class="prettyprint">"ajax"</code> property of the <code class="prettyprint">"data"</code> option
       * allows remote JSON to be retrieved. It may be specified as an object (refer to the
       * jQuery .ajax() settings object). If may also be specified as <code class="prettyprint">false</code> or
       * omitted, if no AJAX operations are performed.</br></br>
       * When specified as an object, it should contain the following two properties:
       * <ul>
       *  <li>type</li>
       *  <li>url</li>
       * </ul>
       *<pre class="prettyprint">
       *<code>
       *"ajax" : {
       *           "type": "GET",
       *           "url":   "my_url"      // some url to the content
       *          }
       *</code></pre>
       * <code class="prettyprint">"url"</code> may also be specified as a function which should return
       * a url string:
       *</br>
       *<pre class="prettyprint">
       *<code>
       *"ajax" : {
       *           "type" : "GET",
       *           "url":   function (node) {
       *                         ... return a url string ...
       *                     }
       *          )
       *</code></pre>
       * </br>
       *  where  <span class="code-caption">node</span> is a parent node (can be used for lazy loading), or -1 to
       *  indicate the initial tree load.
       * </br></br>
       *  Optionally, <span class="code-caption">success</span> and <span class="code-caption">error</span>
       *  functions may be defined. If the <span class="code-caption">success</span> function returns a
       *  value, it will be used to populate the tree; this can be useful if there is a need to transform
       *  the data returned by a server at the client before it is displayed in the tree.
       * </br></br></br>
       *
       * Note: to enable lazy loading of a parent node, specify that it has children but do not define them.
       * When it is opened, data() or ajax() will be called with the node whose JSON is to be returned.</br></br>
       *@example <caption>Example 1: Skeleton outline of success and error functions</caption>
       *<code>
       *"ajax": {
       *          "type":"GET",
       *          "url": myurl    &lt;-- url to full tree JSON
       *          "success" : function(data, status, obj) {
       *                        // data   = the JSON data
       *                        // status = "success"
       *                        // obj    = the AJAX object.
       *                        trace("Ajax " + status) ;
       *                        // return the data, can transform it first if required.
       *                        // if no return value, the data is used untransformed.
       *          },
       *          "error" : function(reason, feedback, obj) {
       *                        // reason e.g. "parsererror"
       *                        // feedback.message  e.g. "unexpected string"
       *                        // obj    = the AJAX object.
       *                        trace("Ajax error " + reason + " feedback=" + feedback.message) ;
       *          },
       * </code>
       *
       *@example <caption>Example 2:  Load the complete tree from locally defined JSON.</caption>
       *<code>
       *"data" :  [
       *            {
       *             "title": "Home",
       *             "attr": {"id": "home"},
       *            },
       *            {
       *              "title": "News",
       *              "attr": {"id": "news"}
       *            },
       *            {
       *              "title": "Blogs",
       *              "attr": {"id": "blogs"},
       *              "children": [ {
       *                             "title": "Today",
       *                             "attr": {"id": "today"}
       *                            },
       *                            {
       *                              "title": "Yesterday",
       *                              "attr": {"id": "yesterday"}
       *                            }
       *                          ]
       *            }
       *          ]
       *</code>
       *
       *@example <caption>Example 3:  Load the complete tree with remotely served JSON.</caption>
       *<code>
       *"data" : {
       *            "ajax": {
       *                     "type":"GET",
       *                     "url": myurl    <-- url to full tree JSON
       *                    }
       *
       *          }
       *</code>
       *
       *@example <caption>Example 4:  Load the complete tree with remotely served JSON via a function.</caption>
       *<code>
       *"data" : {
       *
       *           "ajax": {
       *                     "type":"GET",
       *                     "url": function() {
       *                               return (a url) ;
       *                            }
       *                   }
       *
       *          }
       * </code>
       *
       *@example <caption>Example 5:  Load a partial tree, and retrieve node data when a parent node is expanded and needs to be populated.</caption>
       *<code>
       *"data" : {
       *           "ajax": {
       *                     "type":"GET",
       *                     "url": function(node) {
       *                             if (node === -1) {                       // -1 indicates initial load
       *                               return (url for for  partial json) ;   // the tree outline with parent nodes empty.
       *                             }
       *                             else {
       *                               var id = node.attr("id") ;
       *
       *                               return (a url based on the node id to retrieve just the node children) ;
       *                             }
       *                           }
       *                   }
       *
       *          }
       *</code>
       *
       *@example <caption>Example 6:  Transform data received from server before passing to ojTree.</caption>
       *<code>
       *"data" : {
       *           "ajax": {
       *                     "type":"GET",
       *                     "url": function(node) {
       *                              . . .
       *                            },
       *                      "success" : function (data)  {
       *                                    . . .    // transform the received data into node JSON format
       *
       *                                    return (transformed data) ;
       *                                  },
       *                      "error" : function () {
       *                                   // ajax call failed.
       *                                }
       *                   }
       *
       *          }
       *</code>
       *
       * @example <caption>Example 7:  Use own mechanism to load a partial tree and retrieve node data when a parent is expanded.</caption>
       * <code>
       * // Sample outline of a tree.  Note that the parent nodes "Node2" and "Node3" have
       * // their "children" property specifed, but no children are actually defined.
       *
       *{
       *  "title" : Node1",
       *  "attr" : {"id" : "n1"}
       *},
       *{
       *  "title" : Node2",
       *  "attr" : {"id" : "n2"},
       *  "children" : []
       *},
       *{
       *  "title" : Node3",
       *  "attr" : {"id" : "n3"},
       *  "children" : []
       *},
       *
       *
       *"data" : {
       *           "data": function(node, fn) {
       *                     // node  =  the node whose children are to be retrieved
       *                     // fn    =  the function to call with the retrieved node json
       *
       *                     if (node === -1) {             // initial tree load
       *                       fn( acquired node json for the tree) ;
       *                     }
       *                     else {                         // node lazy load
       *                       var id = node.attr("id") ;   // get the node id, will be "n2"
       *                                                    // or "n3", in this example.
       *                       fn( acquired node json for the expanded node ) ;
       *                     }
       *                  }
       *
       *          }
       *}
       * </code>
       * When an <span class="code-caption">option</span> call is made to reset the <span class="code-caption">data</span> property
       * of a tree, the application does not need to call <span class="code-caption">refresh</span>.
       * @type {Object | Array | string | null}
       * @default <code class="prettyprint">null</code>
       * @expose
       * @instance
       * @memberof oj.ojTree
       */
      data: null,

      /**
       * The text to display when there are no data in the Tree. If not specified,
       * default text is extracted from the resource bundle.  Specify an empty string if
       * this default behavior is not required.
       *
       * @expose
       * @memberof oj.ojTree
       * @instance
       * @type {string|null}
       * @default <code class="prettyprint">"No data"</code>
       *
       * @example <caption>Initialize the tree with text set to 'no data':</caption>
       * $( ".selector" ).ojTree({ "data":data, "emptyText": "no data" });
       */
      emptyText: null,

      /**
       * Specifies whether node icons are to be displayed.  Specify <span class="code-caption">true</span>
       * to display icons, or <span class="code-caption">false </span> to suppress node icons.
       * @type {boolean}
       * @default <code class="prettyprint">true</code>
       * @expose
       * @instance
       * @memberof oj.ojTree
       */
      icons: true,

      /*
       *  Specifies whether hierarchy lines between nodes are displayed.
       *  // not exposed in V1
       */
      // dots" : false,

      /**
       * The <span class="code-caption">'types'</span> option allow nodes to be classified and their appearance
       * and behavior modified.</br></br>
       * Typical uses are to define a specific icon for a particular node, or to inhibit certain
       * operations on a particular type of folder (e.g. the root node cannot be deleted or moved).
       * <p>
       * A node <span class="code-caption">type</span> has the following properties:
       * <ul>
       *   <li><span class="code-caption">"image"</span> -  specifies the location of the icon to be used
       *         (optional). May also be specified as <span class="code-caption">false</span> to suppress
       *         the image.</br></br></li>
       *   <li><span class="code-caption">"position"</span> - position of sprite in the image in the format
       *        <span class="code-caption">"left top"</span>, e.g. "-36px -16px".</br>
       *        Optional - omit if icon is not contained within a multi-sprite image.</br></br></li>
       *   <li><span class="code-caption">method name</span> - specify a function or a
       *         boolean. Optional.</br>  Any node operation method (that
       *         is, takes a node as its first argument) can be redefined (e.g. <span class="code-caption">select</span>,
       *         <span class="code-caption">expand</span>, <span class="code-caption">collapse</span>, etc).
       *         Alternatively, the method can be defined as <span class="code-caption">true</span> or
       *         <span class="code-caption">false</span> to permit or inhibit the operation, or a
       *         function that returns a boolean value. The default value
       *         if omitted is <span class="code-caption">true</span> (i.e. the operation is permitted).</li>
       * </ul>
       * In the following example, three node types have been defined: <span class="code-caption">"myroot"</span>,
       * <span class="code-caption">"myfolder"</span>, and <span class="code-caption">"myleaf"</span>.
       * Any node that does not have one of these types defaults its behavior to the default type
       * (whose properties can also be redefined).  The default <span class="code-caption">"default"</span>
       * node type has no restrictions on the operations that can be performed on the node. In the following
       * example, a modification to the default type properties have been made.  Also, for the
       * <span class="code-caption">"myroot"</span> node type, the standard <span class="code-caption">select</span>,
       * <span class="code-caption">remove</span> and <span class="code-caption">move</span> operations return false
       * which inhibts those operations.
       * been redefined to be no-ops.
       * @example <caption>Example 1:  Add custom appearance and node behavior.</caption>
       * <code>
       *"types": {
       *            "myroot" :   {
       *                            "image"  : baseurl + "/img/root.png",
       *                            "select" : function() { return false; },
       *                            "remove" : function() { return false; },
       *                            "move" :   function() { return false; },
       *                         },
       *            "myfolder" : {
       *                            "image" : baseurl + "/img/folder.png"
       *                         },
       *            "myleaf" :   {
       *                           "image" : "baseurl + "/img/leaf.png"
       *                         },
       *            "default" : {   <-- optional redefinition of the default behavior
       *                           "image" : "baseurl + "/img/leaf.png",
       *                           "remove" : function() { return false; }
       *                        }
       *
       *          }
       *}
       *</code>
       * User-defined types are specified as an attribute of the node.  The default
       * node type attribute is <span class="code-caption">"type"</span>, but this could be changed if desired using
       * the <span class="code-caption">"attr"</span> property. Thus, for the node types in example 1 above, the node
       * type attribute values in the node definitions could be set as in example 2:
       * @example <caption>Example 2:  Using node types in the tree JSON.</caption>
       * <code>
       *[
       *   {
       *     "title": "Root",
       *     "attr": {
       *               "id": "root",
       *               "type": "myroot"                      &lt;--- node type
       *             },
       *     "children": [
       *                   {
       *                     "title": "Home",
       *                     "attr": {"id": "home",
       *                              "type": "myleaf"}      &lt;--- node type
       *                   },
       *                   {
       *                     "title": "News",
       *                     "attr": {
       *                               "id": "news",
       *                               "type": "myleaf"      &lt;--- node type
       *                             }
       *                   },
       *                   {
       *                     "title": "Blogs",
       *                     "attr": {
       *                               "id": "blogs",
       *                               "type": "myfolder"    &lt;--- node type
       *                             },
       *                     "children": [ {
       *                                     "title": "Today",
       *                                     "attr": {
       *                                               "id": "today",
       *                                               "type": "myleaf"
       *                                             }
       *                                   },
       *                                   {                 &lt;--- default node type
       *                                     "title": "Yesterday",
       *                                     "attr": {"id": "yesterday"}
       *                                   }
       *                                 ]
       *                   }
       *                 ]
       *  }
       *]
       *</code>
       * As described above, the node type attribute used on the corresponding tree
       * &lt;li&gt; element defaults to <span class="code-caption">"type"</span>, but this can be redefined using the <span class="code-caption">attr</span>
       * property as in the following example:
       * @example <caption>Example 2:  Using node types in the tree JSON.</caption>
       * <code>
       *"types": {
       *           "attr" : "mytype",    &lt;--- node type attribute is now "mytype"
       *           "types": {
       *                      "myroot" : {
       *                                   "image" : . . .
       *                                    . . .
       *                                 }
       *          }
       *</code>
       * @type {Object | null}
       * @default <code class="prettyprint">true</code>
       * @expose
       * @instance
       * @memberof oj.ojTree
       */
      types: null,

      // ---------------------------//
      //   Option Event callbacks  //
      // ---------------------------//

      /**
       * Triggered prior to an event.<p>
       * The following events can be vetoed during <code class="prettyprint">before</code> event
       * processing by returning <code>false</code> from the <code class="prettyprint">before</code>
       * event handler (omitting a return value or returning <code class="prettyprint">true</code>
       * permits the event processing to continue):
       * <code class="prettyprint">collapse</code>, <code class="prettyprint">expand</code>,
       * <code class="prettyprint">hover</code>, <code class="prettyprint">select</code>,
       * <code class="prettyprint">remove</code>, <code class="prettyprint">rename</code>.
       *
       * @expose
       * @event
       * @memberof oj.ojTree
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {string} ui.func the event causing this <code class="prettyprint">before</code> event to be triggered.
       * @property {Object} ui.item the node that is the subject of the event
       *
       * @example <caption>Initialize the Tree with the <code class="prettyprint">before</code> callback specified:</caption>
       * $( ".selector" ).ojTree({
       *     "before": function(event, ui)  {
       *                     console.log("Before event " + ui.func);
       *               }
       * });
       *
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojbefore</code> event:</caption>
       * $( ".selector" ).on( "ojbefore", function( event, ui ) {
       *                   // Verify that component of interest fired the event
       *                   if ($(event.target).is("#mytree")) {
       *                          console.log("Before event " + ui.func);
       *                   }
       *                 });
       */
      before: null,

      /**
       * Triggered when a tree node is collapsed.
       *
       * @expose
       * @event
       * @memberof oj.ojTree
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {Object} ui.item the node that has been collapsed
       *
       * @example <caption>Initialize the Tree with the <code class="prettyprint">collapse</code> callback specified:</caption>
       * $( ".selector" ).ojTree({
       *     "collapse": function( event, ui ) {. . .}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojcollapse</code> event:</caption>
       * $( ".selector" ).on( "ojcollapse", function(event, ui) {
       *                    // Verify that component of interest fired the event
       *                    if ($(event.target).is("#mytree")) { . . . }
       *                  });
       */
      collapse: null,

      /**
       * Triggered when a tree node has been created and added to the tree.
       *
       * @expose
       * @event
       * @memberof oj.ojTree
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {Object} ui.item the node that has been created
       *
       * @example <caption>Initialize the Tree with the <code class="prettyprint">create</code> callback specified:</caption>
       * $( ".selector" ).ojTree({
       *     "create": function( event, ui ) {. . .}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojcreate</code> event:</caption>
       * $( ".selector" ).on( "ojcreate", function(event, ui) {
       *                    // Verify that component of interest fired the event
       *                    if ($(event.target).is("#mytree")) { . . . }
       *                  });
       */
      create: null,

      /**
       * Triggered when all nodes of a parent node, or the complete tree, have been collapsed.
       *
       * @expose
       * @event
       * @memberof oj.ojTree
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {Object} ui.item the node(s) that were collapsed.
       * @property {Object} ui.targ the node that was targeted for collapseAll, or -1 if the complete tree is collapsed.
       *
       * @example <caption>Initialize the Tree with the <code class="prettyprint">collapseAll</code> callback specified:</caption>
       * $( ".selector" ).ojTree({
       *     "collapseAll": function( event, ui ) {. . .}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojcollapseall</code> event:</caption>
       * $( ".selector" ).on( "ojcollapseall", function( event, ui ) {
       *                   // Verify that component of interest fired the event
       *                   if ($(event.target).is("#mytree")) { . . .}
       *                 });
       */
      collapseAll: null,

      /**
       * Triggered when a tree node has been cut from the tree via the context menu.
       *
       * @expose
       * @event
       * @memberof oj.ojTree
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {Object} ui.item the node that was cut
       *
       * @example <caption>Initialize the Tree with the <code class="prettyprint">cut</code> callback specified:</caption>
       * $( ".selector" ).ojTree({
       *     "cut": function( event, ui ) {. . .}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojcut</code> event:</caption>
       * $( ".selector" ).on( "ojcut", function( event, ui ) {
       *                   // Verify that component of interest fired the event
       *                   if ($(event.target).is("#mytree")) { . . .}
       *                 });
       */
      cut: null,

      /**
       * Triggered when a tree node is no longer hovered over.
       *
       * @expose
       * @event
       * @memberof oj.ojTree
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {Object} ui.item the node that is no longer hovered over
       *
       * @example <caption>Initialize the Tree with the <code class="prettyprint">dehover</code> callback specified:</caption>
       * $( ".selector" ).ojTree({
       *     "dehover": function( event, ui ) {. . .}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojdehover</code> event:</caption>
       * $( ".selector" ).on( "ojdehover", function( event, ui ) {
       *                   // Verify that component of interest fired the event
       *                   if ($(event.target).is("#mytree")) { . . .}
       *                 });
       */
      dehover: null,

      /**
       * Triggered when a tree node has been removed.
       *
       * @expose
       * @event
       * @memberof oj.ojTree
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {Object} ui.item the node that has been removed.
       * @property {Object} ui.parent the parent of the node that was removed.
       * @property {Object} ui.prev the previous sibling, or if ui.item is the first child of
       *                    its parent, the parent node.
       *
       * @example <caption>Initialize the Tree with the <code class="prettyprint">remove</code> callback specified:</caption>
       * $( ".selector" ).ojTree({
       *     "remove": function( event, ui ) {. . .}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojremove</code> event:</caption>
       * $( ".selector" ).on( "ojremove", function( event, ui ) {
       *                   // Verify that component of interest fired the event
       *                   if ($(event.target).is("#mytree")) { . . .}
       *                 });
       */
      remove: null,

      /**
       * Triggered when a tree is destroyed.
       *
       * @expose
       * @event
       * @memberof oj.ojTree
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       *
       * @example <caption>Initialize the Tree with the <code class="prettyprint">destroy</code> callback specified:</caption>
       * $( ".selector" ).ojTree({
       *     "destroy": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojdestroy</code> event:</caption>
       * $( ".selector" ).on( "ojdestroy", function( event, ui ) {
       *                   // Verify that component of interest fired the event
       *                   if ($(event.target).is("#mytree")) { . . .}
       *                 });
       */
      destroy: null,

      /**
       * Triggered when a tree node is expanded.
       *
       * @expose
       * @event
       * @memberof oj.ojTree
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {Object} ui.item the node that has been expanded
       *
       * @example <caption>Initialize the Tree with the <code class="prettyprint">expand</code> callback specified:</caption>
       * $( ".selector" ).ojTree({
       *     "expand": function( event, ui ) {. . .}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojexpand</code> event:</caption>
       * $( ".selector" ).on( "ojexpand", function( event, ui ) {
       *                   // Verify that component of interest fired the event
       *                   if ($(event.target).is("#mytree")) { . . .}
       *                 });
       */
      expand: null,

      /**
       * Triggered when all nodes of a parent node, or the complete tree, have been expanded.
       *
       * @expose
       * @event
       * @memberof oj.ojTree
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {Object} ui.item the node(s) that were expanded.
       * @property {Object} ui.targ the node that was targeted for expandAll, or -1 if the complete tree is collapsed.
       *
       * @example <caption>Initialize the Tree with the <code class="prettyprint">expandAll</code> callback specified:</caption>
       * $( ".selector" ).ojTree({
       *     "expandAll": function( event, ui ) {. . .}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojexpandall</code> event:</caption>
       * $( ".selector" ).on( "ojexpandall", function( event, ui ) {
       *                   // Verify that component of interest fired the event
       *                   if ($(event.target).is("#mytree")) { . . .}
       *                 });
       */
      expandAll: null,

      /**
       * Triggered when a tree node is hovered over.
       *
       * @expose
       * @event
       * @memberof oj.ojTree
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {Object} ui.item the node that is hovered over
       *
       * @example <caption>Initialize the Tree with the <code class="prettyprint">hover</code> callback specified:</caption>
       * $( ".selector" ).ojTree({
       *     "hover": function( event, ui ) {. . .}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojhover</code> event:</caption>
       * $( ".selector" ).on( "ojhover", function( event, ui ) {
       *                   // Verify that component of interest fired the event
       *                   if ($(event.target).is("#mytree")) { . . .}
       *                 });
       */
      hover: null,

      /**
       * Triggered when a tree has been loaded and the node data has been applied.
       *
       * @expose
       * @event
       * @memberof oj.ojTree
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       *
       * @example <caption>Initialize the Tree with the <code class="prettyprint">loaded</code> callback specified:</caption>
       * $( ".selector" ).ojTree({
       *     "loaded": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojloaded</code> event:</caption>
       * $( ".selector" ).on( "ojloaded", function( event, ui ) {
       *                   // Verify that component of interest fired the event
       *                   if ($(event.target).is("#mytree")) { . . .}
       *                 });
       */
      loaded: null,

      /**
       * Triggered when a tree node has been moved within the tree.
       *
       * @expose
       * @event
       * @memberof oj.ojTree
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {Object} ui.item the node that was moved
       * @property {string} ui.position the moved node's new position relative to the reference node.
       *                    Can be <em>"before"</em>, <em>"after"</em>, or <em>"inside"</em>.
       * @property {Object} ui.reference the reference node that ui.position refers to.
       *
       * @example <caption>Initialize the Tree with the <code class="prettyprint">move</code> callback specified:</caption>
       * $( ".selector" ).ojTree({
       *     "move": function(event, ui) {. . .}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojmove</code> event:</caption>
       * $( ".selector" ).on( "ojmove", function(event, ui) {
       *                   // Verify that component of interest fired the event
       *                   if ($(event.target).is("#mytree")) { . . .}
       *                 });
       */
      move: null,

      /**
       * Triggered when one or more tree nodes have been pasted into the tree via the context menu.
       *
       * @expose
       * @event
       * @memberof oj.ojTree
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {Array} ui.item the node(s) pasted
       * @property {string} ui.position the placement of the nodes relative to the reference
       *                     node. May be "inside", "before", or "after".
       * @property {Object} ui.reference the reference node
       *
       * @example <caption>Initialize the Tree with the <code class="prettyprint">paste</code> callback specified:</caption>
       * $( ".selector" ).ojTree({
       *     "paste": function( event, ui ) {. . .}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojpaste</code> event:</caption>
       * $( ".selector" ).on( "ojpaste", function( event, ui ) {
       *                   // Verify that the component firing the event is the component of interest
       *                   if ($(event.target).is("#mytree")) { . . .}
       *                 });
       */
      paste: null,

      /**
       * Triggered when a tree node, or the complete tree, has been refreshed.
       *
       * @expose
       * @event
       * @memberof oj.ojTree
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {Object} ui.item the node that has been refreshed, or -1 if the whole tree has been refreshed.
       *
       * @example <caption>Initialize the Tree with the <code class="prettyprint">refresh</code> callback specified:</caption>
       * $( ".selector" ).ojTree({
       *     "refresh": function( event, ui ) {. . .}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojrefresh</code> event:</caption>
       * $( ".selector" ).on( "ojrefresh", function( event, ui ) {
       *                   // Verify that component of interest fired the event
       *                   if ($(event.target).is("#mytree")) { . . .}
       *                 });
       */
      refresh: null,

      /**
       * Triggered when a tree node has been renamed.
       *
       * @expose
       * @event
       * @memberof oj.ojTree
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {Object} ui.item the node that has been renamed
       * @property {string} ui.title the new node text title.
       * @property {string} ui.prevTitle the node title prior to the rename.
       *
       * @example <caption>Initialize the Tree with the <code class="prettyprint">rename</code> callback specified:</caption>
       * $( ".selector" ).ojTree({
       *     "rename": function( event, ui ) {. . .}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojrename</code> event:</caption>
       * $( ".selector" ).on( "ojrename", function( event, ui ) {
       *                   // Verify that component of interest fired the event
       *                   if ($(event.target).is("#mytree")) { . . .}
       *                 });
       */
      rename: null
    }, // end options

    /*---------------*/
    /* Public API's  */
    /*---------------*/

    /** Collapses an expanded node, so that its children are not visible.  Triggers a "collapse" event.
     *
     * @param {HTMLElement | Object | string} node - Can be a DOM element, a jQuery wrapped node, or a selector
     *                        pointing to the element to be collapsed.
     * @param {boolean=} skipAnim - Set to true to suppress node collapse animation (if a non-zero duration
     *                              is defined or defaulted). Default is false.
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    collapse: function (node, skipAnim) {
      skipAnim = skipAnim || false;

      // Get css value $treeAnimationDuration.  This is needed because if the value is zero
      // and a transition is started, browsers do not apparently fire the "transitionend"
      // event and so we don't get the opportunity to emit a collapse event.

      var dur = skipAnim ? 0 : this._animDuration;

      node = this._getNode(node);

      if (
        !node.length ||
        node === -1 ||
        !node.hasClass(TreeUtils._OJ_EXPANDED) ||
        this._data.core.locked ||
        node.hasClass(TreeUtils._OJ_DISABLED)
      ) {
        return false;
      }

      var rslt = this._emitEvent({ obj: node, func: 'collapse' }, 'before');
      if (typeof rslt === 'boolean' && !rslt) {
        return undefined;
      }

      //      if (skipAnim || dur)  {
      //        node.children("ul").attr("style","display:block !important");
      //      }

      node
        .removeClass(TreeUtils._OJ_EXPANDED)
        .addClass(TreeUtils._OJ_COLLAPSED)
        .attr(WA_EXPANDED, 'false'); // @HTMLUpdateOK
      $(node.children()[0]).removeClass(TreeUtils._OJ_SELECTED).addClass('oj-default');

      this._busyStack.push({ op: 'c', id: node.attr('id') });

      // Add a busy state for the animation.  The busy state resolver will be invoked
      // when the animation is completed
      this._addBusyState(
        "Tree (id='" + this._elemId + "') : node id='" + node.attr('id') + "' is animating."
      );

      if (!skipAnim && dur) {
        this._slide(node, true); // slideUp
      } else {
        this._transitionEnd($(node.children('UL')[0]), node);
      }
      return undefined;
    },

    /**
     *  @private
     */
    _slide: function (node, bSlideUp) {
      var $ul;
      var hNow;
      var hFinal;

      $ul = $(node.children('ul'));

      // For the windows safari platform only we have a problem setting "transitionend" events,
      // the transition end event handler does not get called. Also For the iPad, the transition
      // end handler is called multiple times for some unknown reason.
      // ul.on("transitionend", this._proxyTransitionEndHandler) ;    // doesn't work!

      if (this._isSafari) {
        $ul[0].addEventListener('webkitTransitionEnd', this._proxyTransitionEndHandler);
      } else {
        $ul[0].addEventListener('transitionend', this._proxyTransitionEndHandler);
      }

      if (bSlideUp) {
        hNow = $ul[0].offsetHeight; // collapse
        hFinal = 0;
      } else {
        // expand
        hNow = 0;
        hFinal = this._getElemHeight($ul[0]);
      }

      $ul.css('max-height', hNow + 'px'); // set the current height
      this._overflow = $ul.css('overflow'); // note for reset in _transitionEnd()
      $ul.css('overflow', 'hidden');

      if (!bSlideUp) {
        $ul[0].style.display = 'block';
      }

      setTimeout(function () {
        $ul.addClass('oj-tree-transition'); // enable transitioning on max-height
        $ul.css('max-height', hFinal + 'px'); // start the transition
      }, 20);
    },

    /**
     * Compute the height of the ul element
     * @private
     */
    _getElemHeight: function (el) {
      var div = $("<div style='position: absolute'>");
      var parent = el.parentNode;
      var nextSib = el.nextSibling;

      parent.removeChild(el);

      var disp = el.style.display; // note display
      el.style.display = 'block'; // set - it might be 'none'
      div.append(el); // @HTMLUpdateOK
      this._$container[0].appendChild(div[0]); // @HTMLUpdateOK

      var h = el.offsetHeight || el.scrollHeight;

      // Restore DOM
      el.style.display = disp; // reset orig display
      this._$container[0].removeChild(div[0]);
      div[0].removeChild(el);
      if (nextSib) {
        parent.insertBefore(el, nextSib); // @HTMLUpdateOK
      } else {
        parent.appendChild(el); // @HTMLUpdateOK
      }

      // return h ;
      return h + 10; // TDO why is this a few pixels too little.  It causes
      // a small jump at the end of the transition when the
      // ul style is set to 'block'
    },

    /**
     *  @private
     */
    _transitionEndHandler: function (e) {
      var $ul = $(e.target);
      var node = $ul.closest('li');

      // For the windows safari platform only we have a problem with "transitionend" events,
      // (see _slide() where the event listener is set up.  This code matches the routine in _slide().
      // $ul.off("transitionend", this._proxyTransitionEndHandler) ;    // doesn't work

      if (this._isSafari) {
        $ul[0].removeEventListener('webkitTransitionEnd', this._proxyTransitionEndHandler);
      } else {
        $ul[0].removeEventListener('transitionend', this._proxyTransitionEndHandler);
      }

      $ul.removeClass('oj-tree-transition');
      this._transitionEnd($ul, node);
    },

    /**
     *  Common code called after a collapse/expand whether there was a transition or not.
     *  @private
     */
    _transitionEnd: function ($ul, node) {
      var op;

      if (node.hasClass(TreeUtils._OJ_COLLAPSED)) {
        // end collapse
        op = 'c'; // collapse op
        $ul[0].style.display = 'none';
        $ul.css('max-height', '');
        this._emitEvent({ obj: node }, 'collapse');
        this.after_close(node);
      } else {
        // end expand
        op = 'e'; // expand op
        $ul[0].style.display = 'block';
        $ul.css('max-height', '');
        this._emitEvent({ obj: node }, 'expand');
        //        this["after_open"](node);
      }

      if (this._overflow) {
        $ul.css('overflow', this._overflow); // restore, 'hidden' was set in _slide()
        this._overflow = null;
      }

      this._removeFromBusyStack(op, node.attr('id'));
      this._resolveIfBusyStackEmpty();
    },

    /** Collapses a node and all its descendants.  Triggers a "collapseall" event.
     * @param {HTMLElement | Object | string} node - Can be a DOM element, a jQuery wrapped node, or a
     *                       selector pointing to the element whose descendants are to be collapsed.
     *                       If omitted , or set to -1, all nodes in the tree are collapsed.
     * @param {boolean=} anim - Set to true (or omit) if all nodes are to be collapsed with animation
     *                          (if a non-zero duration is defined or defaulted). Default is true.
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    collapseAll: function (node, anim) {
      var origTarg = node || -1;
      var _this = this;

      if (this._data.core.locked) {
        return;
      }

      node = node ? this._getNode(node) : this._$container;
      if (node && origTarg !== -1) {
        origTarg = node;
      }
      if (!node || origTarg === -1) {
        node = this._$container_ul;
      }

      if (node.hasClass(TreeUtils._OJ_DISABLED)) {
        return;
      }

      var subject;
      if (origTarg !== -1 && this.isExpanded(node)) {
        subject = node[0];
      }

      var objs = node.find('li.oj-expanded'); // find child nodes that are open
      if (objs.length) {
        objs.each(function () {
          _this.collapse(this, !anim);
        });
      }

      if (subject) {
        // if subject node is also expanded
        this.collapse(subject, !anim); // include it in the list
        objs.splice(0, 0, subject);
      }

      if (objs.length) {
        this._emitEvent({ obj: objs, targ: origTarg }, 'collapseAll');
      }
    },

    /** Expands a collapsed parent node, so that its children are visible. Triggers an "expand" event.
     * @param {HTMLElement | Object | string} node - Can be a DOM element, a jQuery wrapped node,
     *                        or a selector pointing to the element to be expanded.
     * @param {boolean=} skipAnim - Set to true to suppress node expansion animation (if a
     *                        non-zero duration is defined or defaulted). Default is false.
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    expand: function (node, skipAnim) {
      this._expand(node, false, skipAnim);
    },

    /** May be used as a getter of setter.  If no argument is supplied, the method returns an
       * array of nodes currently expanded. (An empty array implies that no nodes are expanded.)
       * If an array of nodes is supplied as an argument, the specified nodes are expanded.
       * @param {Array=} nodes - Omit to use as a getter, or specify an array of nodes to be
       *                 expanded.  Nodes may be defined as elements, id strings, jQuery wrapped nodes, or
       *                 selectors pointing to the elements to be expanded.
       * @param {boolean=} skipAnim - Set to true to suppress node expansion animation (if a non-zero
       *                        duration is defined or defaulted). Default is false.


       * @return {Object | null} A jQuery wrapped array of nodes if used as a getter, else null
       *                        if used as a setter.
       * @expose
       * @public
       * @instance
       * @memberof oj.ojTree
       */
    expanded: function (nodes, skipAnim) {
      var _this = this;

      if (nodes && $.type(nodes) === 'array') {
        // setter
        if (this._data.core.locked) {
          return null;
        }

        $.each(nodes, function (i, val) {
          _this._expand(val, false, skipAnim);
        });
        return null;
      }
      // getter

      nodes = this._$container_ul.find('li.oj-expanded');
      var exlen = nodes.length;
      var exlr = [];
      for (var n = 0; n < exlen; n++) {
        exlr.push(nodes[n]);
      }
      return $(exlr);
    },

    /** Expands a node and all its descendants.  Triggers an "expandall" event.
     * @param {HTMLElement | Object | string} node - Can be a DOM element, a jQuery wrapped node,
     *                        or a selector pointing to the element whose descendants are to be expanded.
     *                        If omitted , or set to -1, all nodes in the tree are expanded.
     * @param {boolean=} anim - Set to true (or omit) if all nodes are to expanded with animation
     *                        (if a non-zero duration is defined or defaulted). Default is true.
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    expandAll: function (node, anim) {
      this._expandAll(node, anim);
    },

    /** Expands a node if collapsed, or collapses a node if expanded. Triggers an "expand" or "collapse" event.
     * @param {HTMLElement | Object | string} node - Can be a DOM element, a jQuery wrapped node,
     *                        or a selector pointing to the element to be expanded/collapsed.
     * @param {boolean=} skipAnim - Set to true to suppress node expand/collapse animation (if a
     *                        non-zero duration is defined or defaulted). Default is false.
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    toggleExpand: function (node, skipAnim) {
      node = this._getNode(node);
      if (!node || !node.length || node === -1) {
        return undefined;
      }
      if (node.hasClass(TreeUtils._OJ_DISABLED) || this._data.core.locked) {
        return undefined;
      }

      if (node.hasClass(TreeUtils._OJ_COLLAPSED)) {
        return this.expand(node, skipAnim);
      }
      if (node.hasClass(TreeUtils._OJ_EXPANDED)) {
        return this.collapse(node, skipAnim);
      }
      return undefined;
    },

    /** Deselects a node. Triggers an "optionChange" event for options property "selection".
     * @param {HTMLElement | Object | string} node - Can be a DOM element, a jQuery wrapped node,
     *                        or a selector pointing to the element to be deselected.
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    deselect: function (node) {
      var prevSelections = this.options.selection.slice(0); // make new array for optionChange event

      this._deselect(node);
      this._fireOptionChangeEvent('selection', prevSelections, null, null);
    },

    /** Deselects all selected nodes. If optional argument "context" is specified, only the selected
     * nodes within that context will be selected. Triggers an "optionChange" event for options property
     * "selection".
     * @param {HTMLElement | Object | string=} context - Can be a DOM element, a jQuery wrapped node,
     *                        or a selector pointing to an element within the tree.
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    deselectAll: function (context) {
      if (this._data.core.locked) {
        return;
      }

      var prevSelections = this.options.selection.slice(0); // make new array for optionChange event

      this._deselectAll(context);
      this._fireOptionChangeEvent('selection', prevSelections, null, null);
    },

    /** Selects a node. Triggers an "optionChange event for options property "selection".
     * @param {HTMLElement | Object | string} node - Can be a DOM element, a jQuery wrapped node,
     *                       or a selector pointing to the element to be selected.
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    select: function (node) {
      this._select(node, true);
    },

    /** Selects a node if deselected, or deselects a node if selected. Triggers an "optionChange"
     * event for options property "selection".
     *
     * @param {HTMLElement | Object | string} node - Can be a DOM element, a jQuery wrapped node,
     *                        or a selector pointing to the element to be expanded/collapsed.
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    toggleSelect: function (node) {
      node = this._getNode(node);
      if (!node.length) {
        return false;
      }

      if (node.hasClass(TreeUtils._OJ_DISABLED) || this._data.core.locked) {
        return false;
      }

      if (this._isSelected(node)) {
        this.deselect(node);
      } else {
        this._select(node, true);
      }
      return true; // selection was toggled
    },

    /** Returns true if the node is collapsed, else false.
     *
     * @param {HTMLElement | Object | string} node - Can be a DOM element, a jQuery wrapped node,
     *                        or a selector pointing to the element.
     * @return {boolean} true if the node is collapsed, else false.
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    isCollapsed: function (node) {
      node = this._getNode(node);
      return node && node !== -1 && node.hasClass(TreeUtils._OJ_COLLAPSED);
    },

    /** Returns true if the node is expanded, else false.
     *
     * @param {HTMLElement | Object | string} node - Can be a DOM element, a jQuery wrapped node,
     *                        or a selector pointing to the element.
     * @return {boolean} true if the node is expanded,  else false.
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    isExpanded: function (node) {
      node = this._getNode(node);
      return node && node !== -1 && node.hasClass(TreeUtils._OJ_EXPANDED);
    },

    /** Returns true if the node is a leaf node (that is, it has no children), else false.
     *
     * @param {HTMLElement | Object | string} node - Can be a DOM element, a jQuery wrapped node,
     *                        or a selector pointing to the element.
     * @return {boolean} true if the node is a leaf node, else false.
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    isLeaf: function (node) {
      return this._isLeaf(node);
    },

    /** Returns true if the node is selected, else false.
     *
     * @param {HTMLElement | Object | string} node - Can be a DOM element, a jQuery wrapped node,
     *                        or a selector pointing to the element.
     * @return {boolean} true if the node is selected,  else false.
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    isSelected: function (node) {
      return this._isSelected(node);
    },

    /** Creates a new node and adds it to the tree.  Triggers a "create" event.
     *
     * @param {HTMLElement | Object | string} refnode - specifies the node that the new node will be
     *                       placed in, or next to, depending on the "position" argument. Can be a
     *                       DOM element, a jQuery wrapped node, or a selector pointing to the element.
     *                       If there is no reference node (because the tree is empty), specify null or undefined
     *                       (or -1).
     * @param {string | number} position - specifies the position of the newly created node in relation
     *                       to the "refnode" specified by the first argument.  Can be a string : "before",
     *                       "after", "inside", "first", "last", or a zero-based index to position the
     *                       new node at a specific point among the children of "refnode".
     * @param {Object | Array} data - An object or array of objects containing data to create new node(s). The object
     *                       properties are the same as for defining a JSON node:<br>
     *                       "attr" - an object of attribute name/value pairs (at least an "id" property should
     *                       be defined).<br>
     *                       "title" - a string used for the visible text of the node.<br><br>
     * <code>
     * var new Node = { "title" : "My Title", "attr" : { "id": "myid" } };
     * </code>
     * @return {Object} Returns the jQuery wrapped node(s) created from the 'data' argument.
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    create: function (refnode, position, data) {
      var node;
      var i;
      var ar = $.isArray(data);

      if (!ar || data.length === 1) {
        node = this._createNode(refnode, position, ar ? data[0] : data); // single node
        // Check if this node has a selected tag applied temporarily by dnd dragStart,
        // and if so apply the selection state to the node
        this._getDndContext()._dndFinishSelection(node);
        return node;
      }

      // Handle multiple nodes
      ar = [];
      if (position !== 'before') {
        // Recreate in reverse order to maintain tree order because of reuse of 'position'.
        for (i = data.length - 1; i >= 0; i--) {
          node = this._createNode(refnode, position, data[i]);
          ar.unshift(node[0]);
          // if parseJson() applied the select class, select the node
          this._getDndContext()._dndFinishSelection(node);
        }
      } else {
        for (i = 0; i < data.length; i++) {
          node = this._createNode(refnode, position, data[i]);
          ar.push(node[0]);
          this._getDndContext()._dndFinishSelection(node);
        }
      }

      return $(ar);
    },

    /**  Removes a node. Triggers a "remove" event.
     *
     *  @param {HTMLElement | Object | string} node - Can be a DOM element, a jQuery wrapped node,
     *                        or a selector pointing to the element.
     *  @return {Object | boolean}   The jQuery wrapped node used as an argument.
     *  @expose
     *  @public
     *  @instance
     *  @memberof oj.ojTree
     */
    remove: function (node) {
      node = this._getNode(node);

      if (!node.length || node.hasClass(TreeUtils._OJ_DISABLED) || this._data.core.locked) {
        return false;
      }

      var rslt = this._emitEvent({ obj: node, func: 'remove' }, 'before');
      if (typeof rslt === 'boolean' && !rslt) {
        return false;
      }

      this.__rollback();
      var p = this._getParent(node);
      var prev = $([]);
      var t = this;
      var sib = this._getPrev(node);

      node.each(function () {
        prev = prev.add(t._getPrev(this));
      });

      node = node.detach();

      if (p !== -1 && p.find('> ul > li').length === 0) {
        p.removeClass('oj-expanded oj-collapsed').addClass(OJT_LEAF).removeAttr(WA_EXPANDED);
      }

      this._cleanNode(p);
      this._emitEvent({ obj: node, prev: sib, parent: p }, 'remove');

      return node;
    },

    /** Returns the title of the specified node
     *
     * @param {HTMLElement | Object | string} node - Can be a DOM element, a jQuery wrapped node,
     *                       or a selector pointing to the element.
     * @return {string | boolean} The text string title of the node.
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    getText: function (node) {
      node = this._getNode(node);
      if (!node.length) {
        return false;
      }

      node = node.children('a:eq(0)');
      node = node.find('span:eq(0)');
      return node[0].textContent;
    },

    /** Renames a node title.
     *
     * @param {HTMLElement | Object | string} node - Can be a DOM element, a jQuery wrapped node,
     *                        or a selector pointing to the element.
     * @param {string=} text - The new text string.
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    rename: function (node, text) {
      text = this._escapeHtml(text);
      this._renameNode(node, text);
    },

    /** Sets the specifed node as the current node of interest (e.g. a mouse-over).  Triggers a "hover" event.
     *
     * @param {HTMLElement | Object | string} node - Can be a DOM element, a jQuery wrapped node,
     *                        or a selector pointing to the element.
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    hover: function (node) {
      this._hover(node);
    },

    /** Removes the "hover" state of the currently hovered (i.e. active) node.  Triggers a "dehover" event.
     *
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    dehover: function () {
      this._dehover();
    },

    /** Returns the full path to a node, either as an array of ID's or node names, depending on
     * the value of the "idMode" argument.<p>
     * e.g. Given a node with Id 'Node1' at the root level, with a child 'Node2' which has a child 'Node3',
     * then:<p>
     * <span class="code-caption">$tree.ojTree("getPath", "#Node3", true) ;</span>
     * <p>
     * will return:<p>
     * <span class="code-caption">["Node1", "Node2", "Node3"]</span>
     * <br>
     * @param {HTMLElement | Object | string} node - Can be a DOM element, a jQuery wrapped node,
     *                       or a selector pointing to the element.
     * @param {boolean=} idMode - Set to true (or omit) to return ID's from the node attribute
     *                       "id"), or false to return the names (i.e. text titles).  Default is true.
     *
     * @return {Array | boolean} An array of node ID's or names. If the node is not found, false is returned.
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    getPath: function (node, idMode) {
      var p = [];
      var _this = this;

      node = this._getNode(node);
      if (node === -1 || !node || !node.length) {
        return false;
      }

      node.parentsUntil('.oj-tree', 'li').each(function () {
        p.push(idMode ? this.id : _this.getText(this));
      });

      p.reverse();
      p.push(idMode ? node.attr('id') : this.getText(node));

      return p;
    },

    /** Returns the jQuery wrapped top outer &lt;ul&gt; element of the tree.
     *
     * @return {Object} The jQuery wrapped &lt;ul&gt; element of the tree.
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    getRoot: function () {
      return this._$container.children('ul:eq(0)'); // return the top <ul>
    },

    /**  Refreshes the tree or a node.
     *
     *  @param {HTMLElement | Object | string | number=} node - If -1 is specified (or the argument is omitted),
     *                   the whole tree is refreshed.  Alternatively, a specific node to be refreshed can be
     *                   supplied. Can be a DOM element, a jQuery wrapped node, or a selector pointing to the element.
     *  @expose
     *  @public
     *  @instance
     *  @memberof oj.ojTree
     */
    refresh: function (node) {
      this._super();

      if (this._data.core.locked) {
        return;
      }

      this._refresh(node || -1);
    },

    /**  Moves (or copies) a node within a tree, or from one tree to a different tree.
     *
     *  @param {HTMLElement | Object | string | number} node  The node to be moved. Can be a DOM element,
     *            a jQuery wrapped node, or a selector pointing to the element.
     *  @param {HTMLElement | Object | string | number} refnode  The reference node for the move (see "position"
     *            argument below). Can be a DOM element, a jQuery wrapped node, or a selector pointing to the
     *            element. If the receiving tree ie empty and there can be no reference node, null or undefined
     *            (or -1) may be specified.
     *  @param {string | number} position  The position of the moved node relative to the reference node refnode.
     *            Can be "before", "after", "inside", "first", "last", or the zero-based index to position the node at a
     *            specific point among the reference node's current children.
     *  @param {boolean=} iscopy  Omit or specify false for a move operation, or true for a copy.
     *  @expose
     *  @public
     *  @instance
     *  @memberof oj.ojTree
     */
    move: function (node, refnode, position, iscopy) {
      this._moveNode(node, refnode, position, iscopy);
    },

    /**
     *  Returns the user classified node type applied to the node in the
     *  <span class="code-caption">"types"</span> option.
     *  @return {string |boolean}  The node's type. If no types have been defined in the tree options,
     *                             false is returned.
     *  @expose
     *  @public
     *  @instance
     *  @memberof oj.ojTree
     */
    getType: function (node) {
      return this._getType(node);
    },

    /**
     *  Sets the "type" attribute of the node using a type defined in the
     * <span class="code-caption">"types"</span> option.
     *  @param {HTMLElement | Object | string} node - Can be a DOM element, a jQuery wrapped node,
     *                       or a selector pointing to the element.
     *  @param {string} str - The type.
     *  @return {boolean}  true if the change was successful, else false.
     *  @expose
     *  @public
     *  @instance
     *  @memberof oj.ojTree
     */
    setType: function (node, str) {
      return this._setType(node, str);
    },

    // @inheritdoc
    getNodeBySubId: function (locator) {
      if (!locator) {
        return this.element ? this.element[0] : null;
      }

      return this._processSubId(locator);
    },

    /**
     * {@ojinclude "name":"getSubIdByNodeDesc"}
     *
     * @expose
     * @memberof oj.ojTree
     * @instance
     * @since 2.1.0
     * @ignore
     *
     * @param {!Element} node {@ojinclude "name":"getSubIdByNodeNodeParam"}
     * @returns {Object|null} {@ojinclude "name":"getSubIdByNodeReturn"}
     *
     * @example <caption>{@ojinclude "name":"getSubIdByNodeCaption"}</caption>
     * {@ojinclude "name":"getSubIdByNodeExample"}
     */
    getSubIdByNode: function (node) {
      return this._getSubIdFromNodeElem(node);
    },

    /**
       * Returns a context object for the specified tree node. This includes the subid for the
       * node as the subId property.
       * Additional Tree component information is also included. </br>
       *
       * @expose
       * @public
       * @instance
       * @memberof oj.ojTree
       * @param {HTMLElement | Object | string | number} node - Can be a DOM element, a jQuery wrapped node,
       *                        or a selector pointing to a node element.
       * @return {Object|null} An object containing node context data, or
       *                                <span class="code-caption">null</span> if not found.
       * <table class="params"<tr><th>Property</th><th>Type</th><th>Description</th></tr>
       *  <tr><td>subId</td><td>string</td><td><span class="code-caption">"oj-tree-node"</span> or
       *                                 <span class="code-caption">"oj-tree"</span>.</td></tr>
       *  <tr><td>item</td><td>object</td><td>the tree node element.</td></tr>
       *  <tr><td>node</td><td>object</td><td>the jQuery wrapped node.<br>DEPRECATED - please use <span class="code-caption">item</span>.</td></tr>
       *  <tr><td>leaf</td><td>boolean</td><td><span class="code-caption">true</span> if leaf node, else
       *                                 <span class="code-caption">false</span> if a parent node.</td></tr>
       * </table>
       <p>
      */
    getContextByNode: function (node) {
      node = node == null ? 0 : node; // don't give getNode() null/undefined
      node = this._getNode(node); // validate node reference (returns jQ wrapped node, -1, null)
      var bNode = node !== -1 && node.length > 0;
      var bTree = node === -1;

      if (bNode || bTree) {
        return {
          subId: bNode ? OJT_NODE : OJT_TREE,
          item: bNode ? node[0] : null, // <li>
          node: bNode ? node : false, // jQuery wrapped <li>
          leaf: bNode ? this._isLeaf(node) : false // true/false
        };
      }
      return null;
    },

    /**
       * Returns the parent node of the node specified.
       * @param {HTMLElement | Object | string} node - Can be a DOM element, a jQuery wrapped node,
       *                        or a selector pointing to the element.
       * @return {Object | null}   The jQuery wrapped parent node, or null if <span class="code-caption">node</span>
       is a top level node.
       * @expose
       * @public
       * @instance
       * @memberof oj.ojTree
       */
    getParent: function (node) {
      var l = this._getParent(node);
      return l && l.length > 0 ? l : null;
    },

    /**
     * Returns the previous sibling of the node specified.
     * @param {HTMLElement | Object | string} node - Can be a DOM element, a jQuery wrapped node,
     *                        or a selector pointing to the element.
     * @return {Object | null}   The jQuery wrapped sibling node, or null if there is no previous sibling.
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    getPrevSibling: function (node) {
      var l = this._getPrev(node, true);
      return l && l.length > 0 ? l : null;
    },

    /**
     * Returns the next sibling of the node specified.
     * @param {HTMLElement | Object | string} node - Can be a DOM element, a jQuery wrapped node,
     *                        or a selector pointing to the element.
     * @return {Object | null}   The jQuery wrapped sibling node, or null if there is no next sibling.
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    getNextSibling: function (node) {
      var l = this._getNext(node, true);
      return l && l.length > 0 ? l : null;
    },

    /**
     * Returns the children of the node specified.
     * @param {HTMLElement | Object | string | number} node - Can be a DOM element, a jQuery wrapped node,
     *                        or a selector pointing to the element. May also be specified as -1 or omitted to
     *                        indicate the tree, in which case the top level children of the tree are returned.
     * @return {Object | null}   The jQuery wrapped array of child nodes, or null if there are no children.
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    getChildren: function (node) {
      node = node || -1;
      var c = this._getChildren(node);

      c = c && c.length ? c.not('.' + TreeUtils._OJ_TEMPNODE) : c;
      return c && c.length > 0 ? c : null;
    },

    /** Scrolls a node into view.
     * @param {Object} obj - An object containing the scroll properties.
     * <table style="border-collapse:collapse;border:1px solid"><tr style="background-color:#eee"><th>Property</th><th>Description</th></tr>
     *  <tr><td><em>"node"</em></td><td>Can be a DOM element, a jQuery wrapped node,
     *                       or a selector pointing to the element to be selected. Any other non-node reference will
     *                       default to the first tree node.</td></tr>
     * </table>
     * @param {string=} alignTo - Specify <span class="code-caption">'top'</span> if the top of the
     *                         <span class="code-caption">node</span> is to be aligned to the top of
     *                         the container. Specify <span class="code-caption">'bottom'</span> if the
     *                         bottom of the <span class="code-caption">node</span> is to be aligned to
     *                         the bottom of the container. Any other value (or if omitted) will be treated
     *                         as <span class="code-caption">'bottom'</span>.<br>
     *                         Note that placement is only honored if feasible. For example, when scrolling a
     *                         node to the top, movement will stop should the bottom node scroll into view -
     *                         placement to the requested top will not be completely honored in this case.
     * @param {boolean=} setActive - If <span class="code-caption">true</span>, makes
     *                         <span class="code-caption">node</span> the active node (i.e. keyboard focus)
     *                         after scrolling into view. If omitted or set to <span class="code-caption">false</span>,
     *                         node is not made active.
     * @expose
     * @public
     * @instance
     * @memberof oj.ojTree
     */
    scrollIntoView: function (obj, alignTo, setActive) {
      var node;

      if (!obj) {
        node = -1;
      } else {
        node = obj.node;
        node = this._getNode(node);
      }
      if (node === -1) {
        node = this._$container.find('> ul > li:first-child');
      }
      if (!node || !node.length) {
        return undefined;
      }

      var toTop = alignTo === 'top'; // default is 'bottom'
      setActive = !!setActive; // default is false

      if (setActive) {
        this._$container_ul.focus();
        this.hover(node);
      }
      node[0].scrollIntoView(toTop);

      return this;
    },

    // -----------------------------------------//
    //     Internal API's and data             //
    // -----------------------------------------//

    /**
     *  Called the first time the widget is called on an element.
     *  @private
     */
    _ComponentCreate: function () {
      this._super();

      this._index = this._newIndex(); // index for this instance
      this._elemId = this.element.attr('id'); // tree element id
      if (this._elemId === undefined) {
        this._elemId = 'oj-tree-' + this._getIndex();
        this.element.attr('id', this._elemId);
      }
      this._$container = this.element; // the containing <div>
      this._$container_ul = null; // the containing <ul>
      this._data = {}; // working data
      this._tds = null; // Tree DataSource
      this._isRtl = this._GetReadingDirection() === 'rtl';
      this._isTouch = DomUtils.isTouchSupported();
      this._initTree(); // initialize data structures
      this._animDuration = this._getAnimDuration(); // get css $treeAnimationDuration value
      if (this._animDuration) {
        var ai = oj.AgentUtils.getAgentInfo();
        this._isSafari = ai.browser === oj.AgentUtils.BROWSER.SAFARI;
        this._proxyTransitionEndHandler = this._transitionEndHandler.bind(this);
      }
      this._busyStack = [];
      this._start(); // build/display the tree
    },

    /**
     *  Widget is being destroyed.
     *  @private
     */
    _destroy: function () {
      this._resolveBusyContext();
      this._clearTree(); // Clean out the DOM.  After this, the tree markup has
      // been removed from the div, and all event handlers
      // removed.

      // If the tree was constructed from existing user markup found in the div,
      // reinstate that markup to reset the div to its original state pre tree create.
      if (this._data.html.markup_ul) {
        this._unTransformElemIds(this._data.html.markup_ul); // reset to original user id's
        this._$container.append(this._data.html.markup_ul); // @HTMLUpdateOK
        this._data.html.markup_div.remove();
        this._data.html.markup_div = false;
        this._data.html.useExistingMarkup = false;
      }

      this._data.ds.type = DS_NONE;
      this._super();
    },

    /**
     *  Handle an option change.
     *  Called by $(selector).ojtree("options", "prop", value)
     *  @private
     */
    _setOption: function (key, newval, flags) {
      var _this = this;
      var val;

      if (key === 'selection') {
        if (typeof newval === 'string') {
          newval = [newval];
        } else {
          newval = newval && newval.length ? newval : [];
        }
        this._data.core.suppressSelectEvent = true; // don't want select/deselect to fire selection change
        this._handleSelectionOptionChange(newval); // apply selection/deselection
        this._data.core.suppressSelectEvent = false;
        newval = this._getSelected();
        // optionChange event will be fired when super is called below.
      } else if (key === 'selectionMode') {
        if (newval === 'none') {
          val = 0;
        } else if (newval === 'single') {
          val = 1;
        } else if (newval === 'multiple') {
          val = -1;
        } else {
          val = 0;
          newval = 'none';
        }
        if (val !== _this._data.core.selectMode) {
          _this._data.core.selectMode = val;
        }
      } else if (key === 'icons') {
        if ($.type(newval) === 'boolean') {
          if (newval !== _this._data.themes.icons) {
            _this._data.themes.icons = newval;
            if (newval) {
              _this._showIcons();
            } else {
              _this._hideIcons();
            }
          }
        }
        // end "core/ui" options
      } else if (key === 'contextMenu') {
        this._clearMenu();
        if (newval) {
          this._initMenuOpts();
          this._initMenu(newval);
        }
        // end "contextMenu"
      } else if (key === 'disabled') {
        this._handleDisabledChanged(newval);
        // end "disabled"
      } else if (key === 'data') {
        // TDO
        this._super(key, newval, flags);
        this._initDSOpts();
        this._initDataSource();
        this._initExpandedOpts(); // reset the nodes to be initially expanded
        this._loadNodes(); // start node loading from the datasource
        return; // super has already been called
      } else if (key === 'dnd') {
        this._super(key, newval, flags);
        this._getDndContext().handleDnDOptionChange(newval);
        return; // super has already been called
      } else if (key === 'emptyText') {
        newval = this._escapeHtml(newval); // escape the text for security
      }
      this._super(key, newval, flags);
    },

    /**
     *  Compare two option value(s) for equality.  Returns false if they are different.
     *  @private
     */
    _CompareOptionValues: function (option, value1, value2) {
      if (option === 'selection') {
        return this._compareSelectionValues(value1, value2);
      }

      return this._superApply(arguments);
    },

    /**
     *  Compare selection values, return true if the same, else false.
     *  @private
     */
    _compareSelectionValues: function (value1, value2) {
      var bDiff = false;
      var bInList = false;

      var len = value1 && value1.length ? value1.length : 0;
      var len2 = value2 && value2.length ? value2.length : 0;

      if (len !== len2) {
        bDiff = true;
      } else if (len === 0 && len2 === 0) {
        bDiff = false;
      } else {
        for (var i = 0; i < len; i++) {
          var id = $(value1[i]).attr('id');
          bInList = false;
          for (var j = 0; j < len2; j++) {
            if (id === $(value2[j]).attr('id')) {
              bInList = true;
              break;
            }
          }

          if (!bInList) {
            // if not in list, values are different
            bDiff = true;
            break;
          }
        }
      }

      return !bDiff;
    },

    /**
     *  Add animation busyState
     *  @private
     */
    _addBusyState: function (description) {
      if (!this._animationResolve) {
        var busyContext = Context.getContext(this.element[0]).getBusyContext();
        this._animationResolve = busyContext.addBusyState({ description: description });
      }
    },

    /**
     *  Resolve BusyContext
     *  @private
     */
    _resolveBusyContext: function () {
      if (this._animationResolve) {
        this._animationResolve();
        this._animationResolve = null;
      }
    },

    /**
     *  Check if entry is on the busy stack. Returns the index, or -1 if not found.
     *  @private
     */
    _isOnBusyStack: function (op, id) {
      var a = this._busyStack;
      var len = a.length;
      var ret = -1;

      for (var i = 0; i < len; i++) {
        if (a[i].id === id && a[i].op === op) {
          ret = i;
          break;
        }
      }

      return ret;
    },

    /**
     *  Remove entry from the busy stack. Returns the index, or -1 if not found.
     *  @private
     */
    _removeFromBusyStack: function (op, id) {
      var i = this._isOnBusyStack(op, id);

      if (i >= 0) {
        this._busyStack.splice(i, 1);
      }

      return i;
    },

    /**
     *  If busy stack is empty can resolve busy
     *  @private
     */
    _resolveIfBusyStackEmpty: function () {
      if (this._busyStack.length === 0) {
        this._resolveBusyContext();
      }
    },

    /**
     *  Clears out the tree dom
     *  @private
     */
    _clearTree: function () {
      if (this._TreeDndContext) {
        this._TreeDndContext._closedown(); // clear DnD support
        this._TreeDndContext = null;
      }

      var n = this._getIndex();

      this._$container
        .unbind('.oj-tree')
        .undelegate('.oj-tree')
        .removeData('oj-tree-instance-id')
        .find("[class^='oj-tree']")
        .addBack()
        .attr('class', function () {
          return this.className.replace(/oj-tree[^ ]*|$/gi, '');
        });

      var cl = this._$container.attr('class'); // if jQuery has left us with a
      cl = cl.trim(); // class of blanks, remove it.
      if (cl.length === 0) {
        this._$container.removeAttr('class');
      }

      _removeKeyFilter(this._$container_ul); // remove keyboard listener because
      // _$container_ul will be removed
      $(document)
        .unbind('.oj-tree-' + n)
        .undelegate('.oj-tree-' + n);

      // Remove the constructed tree from the DOM.
      this._$container_ul.remove();
      this._$container_ul = null;
    },

    //   /*
    //     *  Returns a jQuery wrapped tree node.  obj can be a selector pointing
    //     *  to an element within the tree, a DOM node, or a jQuery wrapped node.  If -1 is used
    //     *  (indicating the whole tree), -1 is returned.
    //     *  @private
    //     */
    //                                         Not used in V1
    //   _getNodeCore : function(obj)
    //   {
    //       var $obj = $(obj, this._$container);
    //
    //       if ($obj.is(".oj-tree") || obj == -1)  {
    //          return -1;
    //       }
    //       $obj = $obj.closest("li", this._$container);
    //       return $obj.length ? $obj : false;
    //   },

    /**
     *  Returns a jQuery wrapped tree node.  obj can be a selector pointing
     *  to an element within the tree, a DOM node, or a jQuery wrapped node.  If obj is -1
     *  (indicating the whole tree), -1 is returned.  If obj is null, all currently selected
     *  are returned.
     *  @private
     */
    _getNode: function (obj, allowMultiple) {
      if (typeof obj === 'undefined' || obj === null) {
        return allowMultiple ? this._data.ui.selected : this._data.ui.lastSelected;
      }

      var $obj = $(obj, this._getContainer());

      if ($obj.is('.oj-tree') || obj === -1) {
        return -1;
      }

      $obj = $obj.closest('li', this._getContainer());
      return $obj.length ? $obj : false;
    },

    /**
     *  Returns the node previous to the supplied obj.  obj can be a selector pointing
     *  to an element within the tree, a DOM node, or a jQuery wrapped node.  If -1 is used
     *  (indicating the whole tree), -1 is returned.  If arg strict is true, only immediate
     *  siblings are considered, and false will be returned if there is no previous sibling.
     *  If strict is false or omitted and obj has no previous siblings (i.e it is the first
     *  child of its parent), the parent is returned.
     *  @private
     */
    _getPrev: function (obj, strict) {
      obj = this._getNode(obj);
      if (obj === -1) {
        return this._$container.find('> ul > li:last-child');
      }
      if (!obj.length) {
        return false;
      }
      if (strict) {
        return obj.prevAll('li').length > 0 ? obj.prevAll('li:eq(0)') : false;
      }

      if (obj.prev('li').length) {
        obj = obj.prev('li').eq(0);
        while (obj.hasClass(TreeUtils._OJ_EXPANDED)) {
          obj = obj.children('ul:eq(0)').children('li:last');
        }
        return obj;
      }

      var o = obj.parentsUntil('.oj-tree', 'li:eq(0)');
      return o.length ? o : false;
    },

    /**  Returns the node after the supplied obj.  obj can be a selector pointing
     *  to an element within the tree, a DOM node, or a jQuery wrapped node.  If -1 is used
     *  (indicating the whole tree), -1 is returned.  If arg strict is true, only immediate
     *  siblings are considered, else if the obj has no more siblings (i.e is the last
     *  child of its parent), the parent's next sibling is returned.
     *  @private
     */
    _getNext: function (obj, strict) {
      obj = this._getNode(obj);
      if (obj === -1) {
        return this._$container.find('> ul > li:first-child');
      }
      if (!obj.length) {
        return false;
      }
      if (strict) {
        return obj.nextAll('li').length > 0 ? obj.nextAll('li:eq(0)') : false;
      }

      if (obj.hasClass(TreeUtils._OJ_EXPANDED)) {
        return obj.find('li:eq(0)');
      } else if (obj.nextAll('li').length > 0) {
        return obj.nextAll('li:eq(0)');
      }

      return obj.parentsUntil('.oj-tree', 'li').next('li').eq(0);
    },

    /**
     *  Returns the parent node of the supplied obj.  obj can be a selector pointing
     *  to an element within the tree, a DOM node, or a jQuery wrapped node.
     *  child of its parent), the parent is returned.
     *  @private
     */
    _getParent: function (obj) {
      obj = this._getNode(obj);
      if (obj === -1 || !obj.length) {
        return false;
      }
      var o = obj.parentsUntil('.oj-tree', 'li:eq(0)');
      return o.length ? o : -1;
    },

    /**
     *  Returns the child nodes of the supplied obj, or false if no children or failure.
     *  obj can be a selector pointing to an element within the tree, a DOM node, or a
     *  jQuery wrapped node.  obj can be -1 to indicate the whole tree.
     *  @private
     */
    _getChildren: function (obj) {
      obj = this._getNode(obj);
      if (obj === -1) {
        return this._$container.children('ul:eq(0)').children('li');
      }
      if (!obj.length) {
        return false;
      }
      return obj.children('ul:eq(0)').children('li');
    },

    /**
     *  @private
     */
    _isLeaf: function (node) {
      node = this._getNode(node);
      return node && node !== -1 && node.hasClass(OJT_LEAF);
    },

    /**
     *  Returns the jQuery wrapped <li> element for a node specification
     *  @private
     */
    _getNodeElem: function (node) {
      var el = this._$container_ul.find(node);
      var ret = false;

      if (el && el.length && el.length > 0) {
        if ($(el).is('li')) {
          ret = el;
        }
      }

      return ret;
    },

    /**
     *  Returns true if the node is selected, else false.
     *  @private
     */
    _isSelected: function (node) {
      var n = this._getNode(node);
      var r = false;

      if (n && n.length && this._data.ui.selected) {
        r = this._data.ui.selected.index(n) >= 0;
      }
      return r;
    },

    /**
     *  Sets the widget instance for the supplied node as the member
     *  ot in the supplied object o.
     *  @instance
     *  @private
     */
    _reference: function (node, o) {
      // if ((! node) || (! node.length) || (! node.parents) || (typeof node.parents != "function")) {
      //        this._trace("_REFERENCE ERROR " + node) ;
      // }

      var div = node.parents('div').eq(0);
      var ctor = Components.__GetWidgetConstructor(div);

      if (ctor && o) {
        ctor('getCI', o);
      }
      return this;
    },

    //   /**
    //     *  Get the data block for the tree component containing the specified
    //     *  node.  Returned as member db of the supplied object.
    //     *  @instance
    //     *  @private
    //     */
    // Not used in V1
    //   _referenceData : function(node, o)
    //   {
    //      var div   = node.parents("div").eq(0) ;
    //      var ctor  = Components.__GetWidgetConstructor(div) ;
    //
    //      if (ctor && o) {
    //        ctor("getDB", o) ;
    //      }
    //   },

    /**
     *  Internal use only - return component instance as member ot
     *  in supplied object.
     *  @instance
     *  @private
     */
    getCI: function (o) {
      o.ot = this;
    },

    //   /**
    //     *  Internal use only - return the data block for a tree's this.
    //     *  @instance
    //     *  @private
    //     */
    //  Not used in V1
    //   "getDB" : function(o)
    //   {
    //      o.db = this._data ;
    //   },
    //

    /**
     *  Add default values to options, unless already defined in options.
     *  @private
     */
    _applyDefaults: function (to, from) {
      if (to != null && from != null) {
        $.each(from, function (prop, val) {
          if (to[prop] == null) {
            to[prop] = val;
          }
        });
      }
    },

    /**
     *  Handle change of the disabled option
     *  @private
     */
    _handleDisabledChanged: function (newval) {
      var curState;

      if (typeof newval === 'undefined') {
        return;
      }

      curState = this._$container_ul.hasClass(TreeUtils._OJ_DISABLED);
      if (!curState) {
        curState = false; // in case undefined
      }

      if (curState !== newval) {
        if (newval) {
          this._$container_ul.addClass(TreeUtils._OJ_DISABLED);
          this._$container_ul.prop('disabled', true);
        } else {
          this._$container_ul.removeClass(TreeUtils._OJ_DISABLED);
          this._$container_ul.prop('disabled', false);
        }
        //        this._lock(newval) ;
        this._treeDisable(newval);
      }
    },

    /**
     *  @private
     */
    _treeDisable: function (lstate) {
      lstate = lstate || false;
      if (lstate) {
        this._data.core.locked = true;
        this._data.ui.opacity = this._$container.children('ul').css('opacity');
        this._$container_ul.addClass(TreeUtils._OJ_DISABLED).css('opacity', '0.9');
      } else {
        this._data.core.locked = false;
        this._$container_ul
          .removeClass(TreeUtils._OJ_DISABLED)
          .css('opacity', this._data.ui.opacity);
      }
    },

    /**
     *  @private
     */
    _isTreeDisabled: function () {
      return this._data.core.locked;
    },

    /**
     *  Handles a change to the selection option property. Nodes currently selected that are
     *  not in the new array are deselected.  Nodes in the new array become (or stay) selected.
     *  @private
     */
    _handleSelectionOptionChange: function (newSels) {
      var sels = newSels.slice(0); // working copy
      var cur = []; // xfer valid selection args to this
      var _this = this;

      // Convert the new array to jQuery wrapped node elements (thereby changing any
      // refs like "#myid"). If any node reference is invalid, remove it from the
      // selections array.
      $.grep(sels, function (node, i) {
        var $elem = _this._getNodeElem(node);
        if ($elem) {
          // if node elem exists
          cur.push($elem); // note it.
          sels[i] = $elem[0]; // ensure we store an <li> not a string like "#news"
        } else {
          return false; // remove from array
        }
        return true; // retain in array
      });

      //  Deselect any currently selected nodes that are not in the new array.
      var aSelected = this._getSelected();
      $.each(aSelected, function (i, node) {
        var len = cur.length;
        var id = $(node).attr('id');
        var inList = false;
        for (i = 0; i < len; i++) {
          if (id === cur[i].attr('id')) {
            inList = true;
            break;
          }
        }
        if (!inList) {
          _this._deselect(node);
        }
      });

      this._setSelected(cur, null); //  Select all nodes in the new selection array
    },

    /**
     *  Creates a "prepMoveBlk" object containing details of the impending move, and
     *  stores it in this._data.core.prepMoveBlk
     *
     *  The object contains :
     *    .o   the node being moved
     *    .r   the reference node
     *    .p   the destination position relative to the reference node
     *    .np  the new parent
     *    .oc  the original node if there was a copy
     *    .cy  boolean indicating if the move was a copy
     *    .op  the former parent
     *    .or  the node that was previously in the position of the moved node
     *    .ot  the original tree instance this
     *    .rt  the reference tree instance
     *    .cr  same as .np but if a root node is created this is -1
     *
     *  @private
     */
    _prepare_move: function (o, r, pos, cb, isCb) {
      var p = {}; // new prepMoveBlk object

      r = r === -1 || !r ? -1 : this._getNode(r);

      // Get tree component's involved
      this._reference(o, p); // for node being moved
      p.rt = this; // for reference node

      p.o = p.ot._getNode(o);
      p.r = r;
      p.p = typeof pos === 'undefined' || pos === false ? 'last' : pos; // TODO: move to a setting

      if (
        !isCb &&
        this._data.core.prepMoveBlk.o &&
        this._data.core.prepMoveBlk.o[0] === p.o[0] &&
        this._data.core.prepMoveBlk.r[0] === p.r[0] &&
        this._data.core.prepMoveBlk.p === p.p
      ) {
        // this._emitEvent(this._data.core.prepMoveBlk, "prepare_move", true);
        if (cb) {
          cb.call(this, this._data.core.prepMoveBlk);
        }
        return undefined;
      }

      if (p.r === -1 || !p.r) {
        p.cr = -1;

        switch (p.p) {
          case 'first':
          case 'before':
          case 'inside':
            p.cp = 0;
            break;
          case 'after':
          case 'last':
            p.cp = p.rt._$container.find(' > ul > li').length;
            break;
          default:
            p.cp = p.p;
            break;
        }
      } else {
        if (!/^(before|after)$/.test(p.p) && !this._isLoaded(p.r)) {
          return this._load_node(p.r, function () {
            this._prepare_move(o, r, pos, cb, true);
          });
        }
        switch (p.p) {
          case 'before':
            p.cp = p.r.index();
            p.cr = p.rt._getParent(p.r);
            break;
          case 'after':
            p.cp = p.r.index() + 1;
            p.cr = p.rt._getParent(p.r);
            break;
          case 'inside':
          case 'first':
            p.cp = 0;
            p.cr = p.r;
            break;
          case 'last':
            p.cp = p.r.find(' > ul > li').length;
            p.cr = p.r;
            break;
          default:
            p.cp = p.p;
            p.cr = p.r;
            break;
        }
      }

      p.np = p.cr === -1 ? p.rt._getContainer() : p.cr;
      p.op = p.ot._getParent(p.o);
      p.cop = p.o.index();

      if (p.op === -1) {
        p.op = p.ot ? p.ot._$container : this._$container;
      }
      if (
        !/^(before|after)$/.test(p.p) &&
        p.op &&
        p.np &&
        p.op[0] === p.np[0] &&
        p.o.index() < p.cp
      ) {
        p.cp += 1;
      }

      // if(p.p === "before" && p.op && p.np && p.op[0] === p.np[0] && p.o.index() < p.cp) { p.cp--; }
      p.or = p.np.find(' > ul > li:nth-child(' + (p.cp + 1) + ')');
      this._data.core.prepMoveBlk = p;
      // this._emitEvent(this._data.core.prepMoveBlk, "prepare_move", true);

      if (cb) {
        cb.call(this, this._data.core.prepMoveBlk, 'prepare_move');
      }
      return undefined;
    },

    /**
     *  Checks the prepMoveBlk object, and returns true if the move it
     *  reflects is acceptable, else false.
     *  @private
     */
    _checkMove: function () {
      var obj = this._data.core.prepMoveBlk;
      var ret = true;

      var r = obj.r === -1 ? this._$container : obj.r;

      if (!obj || !obj.o || obj.or[0] === obj.o[0]) {
        return false;
      }
      if (!obj.r) {
        // tdo, why is r is false when we use jquery simulate drag
        return false;
      }

      if (!obj.cy) {
        if (obj.op && obj.np && obj.op[0] === obj.np[0] && obj.cp - 1 === obj.o.index()) {
          return false;
        }

        // Get all li ancestors plus the reference node. If the dragged node
        // is found, end loop and set return to false to indicate move is invalid.
        obj.o.each(function () {
          if (r.parentsUntil('.oj-tree', 'li').addBack().index(this) !== -1) {
            ret = false;
            return false;
          }
          return undefined;
        });
      }

      return ret;
    },

    /**
     *  Changes the text title of a node. (Text is already expected to have been escaped
     *  prior to this call.)
     *  @private
     */
    _renameNode: function (node, text) {
      node = this._getNode(node);
      this.__rollback();
      var t = this.getText(node);

      if (node && node.length) {
        var rslt = this._emitEvent(
          {
            obj: node,
            func: 'rename',
            title: text,
            prevTitle: t
          },
          'before'
        );
        if (typeof rslt === 'boolean' && !rslt) {
          return;
        }
      }

      if (
        node &&
        node.length &&
        this._set_text.apply(this, Array.prototype.slice.call(arguments))
      ) {
        this._emitEvent({ obj: node, title: text, prevTitle: t }, 'rename');
      }
    },

    /**
     *   Moves a node within the tree
     *   @private
     */
    _moveNode: function (obj, ref, position, isCopy, isPrepared, skipCheck) {
      if (!isPrepared) {
        obj = this._getNode(obj);

        var rslt = this._emitEvent({ obj: obj, func: 'move' }, 'before');
        if (typeof rslt === 'boolean' && !rslt) {
          return false;
        }
      }

      if ((obj.hasClass && obj.hasClass(TreeUtils._OJ_DISABLED)) || this._data.core.locked) {
        return undefined;
      }

      if (!isPrepared) {
        return this._prepare_move(obj, ref, position, function (p) {
          // Before the move/copy occurs, if the
          // node is being moved (not copied) to
          // a different tree, deselect it.
          if (p.ot !== p.rt && !p.cy) {
            p.ot.deselect(p.o);
          }
          this._moveNode(p, false, false, isCopy, true, skipCheck);
        });
      }

      if (isCopy) {
        this._data.core.prepMoveBlk.cy = true;
      }
      if (!skipCheck && !this._checkMove()) {
        return false;
      }

      this.__rollback();
      var o = false;

      if (isCopy) {
        o = obj.o.clone(true);
        o.find('*[id]')
          .addBack()
          .each(function () {
            if (this.id) {
              this.id = 'copy_' + this.id;
            }
          });
      } else {
        o = obj.o;
      }

      if (obj.or.length) {
        obj.or.before(o); // @HTMLUpdateOK
      } else {
        if (!obj.np.children('ul').length) {
          $('<ul></ul>').appendTo(obj.np); // @HTMLUpdateOK
        }
        obj.np.children('ul:eq(0)').append(o); // @HTMLUpdateOK
      }

      try {
        obj.ot._cleanNode(obj.op);
        obj.rt._cleanNode(obj.np);
        if (!obj.op.find('> ul > li').length) {
          obj.op
            .removeClass('oj-expanded oj-collapsed')
            .removeAttr(WA_EXPANDED)
            .addClass(OJT_LEAF)
            .children('ul')
            .remove();
        }
      } catch (e) {
        // Ignore error
      }

      if (isCopy) {
        this._data.core.prepMoveBlk.cy = true;
        this._data.core.prepMoveBlk.oc = o;
      }
      var d = $.extend(true, {}, this._data.core.prepMoveBlk);
      d.obj = obj.o;
      this._emitEvent(d, 'move');
      return this._data.core.prepMoveBlk;
    },

    /**
     *  Returns the "prepMoveBlk" object created by a previous _prepare_move()
     *
     *  The object contains :
     *     .o   the node being moved
     *     .r   the reference node
     *     .p   the destination position relative to the reference node
     *     .np  the new parent
     *     .oc  the original node if there was a copy
     *     .cy  boolean indicating if the move was a copy
     *     .op  the former parent
     *     .or  the node that was previously in the position of the moved node
     *     .ot  the original tree instance
     *     .rt  the reference tree instance
     *     .cr  same as .np but if a root node is created this is -1
     *     .cp  index of ref node
     *     .cr  parent of ref node (-1, or node)
     *     .cop index of node
     *
     *  @private
     */
    _getMoveBlk: function () {
      return this._data.crrm.prepMoveBlk;
    },

    /**
     *  Returns the "type" attribute of the node.  If not found, returns "default"
     *  @private
     */
    _getType: function (node) {
      var n = null;
      var t = this.options.types; // are types defined?

      if (t) {
        n = this._getNode(node);
      }
      return !n || !n.length ? false : n.attr(this.options.types.attr) || 'default';
    },

    /**
     *  Sets the "type" attribute of the node.
     *  @return {boolean}  true if the change was successful, else false.
     *  @private
     */
    _setType: function (node, str) {
      var s = this.options.types;
      var ret = false;

      node = this._getNode(node);

      if (s && node && node !== -1 && node.length && str) {
        var tattr = s.attr;
        var types = s.types;
        if (tattr && types && types[str]) {
          node.attr(tattr, str); // @HTMLUpdateOK
          node.addClass(OJT_TYPE);
          // this._emitEvent({ "obj" : node, "type" : str}, "settype", true);
          ret = true;
        }
      }

      return ret;
    },

    /**
     *  Check if a node has been typed and the type definition inhibits moving.
     *  @return {boolean} false if the node is inhibited from being moved, else true.
     *  @private
     */
    _canTypedNodeMove: function ($node, func) {
      var ret = true;

      var types = this.options.types;
      if (types) {
        types = types.types;
        if (types) {
          var type = this._getType($node); // "type" attr name for node
          if (
            ((types[type] && typeof types[type][func] !== 'undefined') ||
              (types.default && typeof types.default[func] !== 'undefined')) &&
            this._check(func, $node) === false
          ) {
            ret = false;
          }
        }
      }

      return ret;
    },

    /**
     *  @private
     */
    // eslint-disable-next-line no-unused-vars
    _check: function (rule, obj, opts) {
      obj = this._getNode(obj);

      var v = false;
      var ty = this._getType(obj);
      // var d = 0;
      var s = this._getOptions().types;
      var data = false;

      if (obj === -1) {
        if (s[rule]) {
          v = s[rule];
        } else {
          return undefined;
        }
      } else {
        if (ty === false) {
          return undefined;
        }

        data = this._data.types.defaults.useData ? obj.data('oj-tree') : false;
        if (data && data.types && typeof data.types[rule] !== 'undefined') {
          v = data.types[rule];
        } else if (!!s.types[ty] && typeof s.types[ty][rule] !== 'undefined') {
          v = s.types[ty][rule];
        } else if (!!s.types.default && typeof s.types.default[rule] !== 'undefined') {
          v = s.types.default[rule];
        }
      }

      if ($.isFunction(v)) {
        v = v.call(this, obj);
      }

      /*  Not used in v1
               var md = this._data.types.defaults["maxDepth"] ;

               if ((rule === "maxDepth") && (obj !== -1) && (opts !== false) &&
                   (this._data.types.defaults["maxDepth"] !== -2) && (v !== 0))  {
                 // also include the node itself - otherwise if root node it is not checked
                 obj.children("a:eq(0)").parentsUntil(".oj-tree","li").each(function (i)
                        {
                           // check if current depth already exceeds global tree depth
                           if ((md !== -1) && (md - (i + 1) <= 0))  {
                             v = 0;
                             return false;
                           }

                           d = (i === 0) ? v : _this._check(rule, this, false);

                           // Check if current node max depth is already matched or exceeded
                           if (d !== -1 && d - (i + 1) <= 0)  {
                             v = 0; return false;
                           }

                           // otherwise - set the max depth to the current value minus current depth
                           if (d >= 0 && (d - (i + 1) < v || v < 0) )  {
                             v = d - (i + 1);
                           }

                           // If the global tree depth exists and it minus the nodes calculated
                           // so far is less than `v` or `v` is unlimited
                           if ((md >= 0) && (md - (i + 1) < v || v < 0) )  {
                             v = md - (i + 1);
                           }
                        });
               }
*/
      return v;
    },

    /**
     * Applies/removes all necessary classes/attributes to the node and
     * its descendants. obj can be a node, or -1 to clean the whole tree.
     * @private
     */
    _cleanNode: function (obj) {
      var dndClasses;
      var draggableAttr;
      var draggableAttrVal;
      var dndContext = this._getDndContext();
      var cons = oj.TreeDndContext;

      if (dndContext.isDragEnabled()) {
        dndClasses = cons._OJ_DRAGGABLE;
        draggableAttr = 'draggable';
        draggableAttrVal = true;
      }
      if (dndContext.isDropEnabled()) {
        dndClasses += ' ' + cons._OJ_VALID_DROP;
      }

      obj = obj && obj !== -1 ? $(obj) : this._$container_ul;
      obj = obj.is('li') ? obj.find('li').addBack() : obj.find('li');

      obj
        .removeClass(OJT_LAST)
        .addClass(OJT_NODE)
        .addClass(dndClasses)
        .attr(draggableAttr, draggableAttrVal) // @HTMLUpdateOK
        .filter('li:last-child')
        .addClass(OJT_LAST)
        .end()
        .filter(':has(li)')
        .not('.oj-expanded')
        .removeClass(OJT_LEAF)
        .addClass(TreeUtils._OJ_COLLAPSED)
        .attr(WA_EXPANDED, 'false'); // @HTMLUpdateOK

      obj
        .not('.oj-expanded, .oj-collapsed') // clean leaf nodes
        .addClass(OJT_LEAF)
        .children('ul')
        .remove();

      var typeAttr = this.options.types ? this.options.types.attr : false;

      $.each(obj, function () {
        var t = $(this);
        var disc = t.find('> ins');
        if (disc.length > 1) {
          disc = $(disc[0]);
        }
        if (t.hasClass(OJT_LEAF)) {
          disc.removeClass(OJ_DISC);
          disc.addClass(OJT_ICON);
        } else {
          disc.addClass(OJ_DISC);
          disc.removeClass(OJT_NICON);
        }

        if (typeAttr && t.attr(typeAttr)) {
          // if user has declared a node type
          t.addClass(OJT_TYPE); // give the node our type class.
        }
      });

      // this._emitEvent({ "obj" : obj }, "clean_node", true);
    },

    /**
     *  Creates a new node
     *  @private
     */
    _createNode: function (obj, position, js, callback, isLoaded) {
      obj = obj || -1;

      obj = this._getNode(obj);
      if (obj !== -1 && !obj.length) {
        return null;
      }

      var tmp;

      position = typeof position === 'undefined' ? 'last' : position;

      if (!isLoaded && !this._isLoaded(obj)) {
        this._load_node(obj, function () {
          this._createNode(obj, position, js, callback, true);
        });
        return null;
      }

      this.__rollback();

      //  Parse the JSON
      js = this._parseJson(js);
      if (!js) {
        return null; // parse failed!
      }
      js = js.children(); // remove the wrapping <ul> added by _parseJson()
      var d = $(js[0]);

      if (obj === -1) {
        obj = this._$container;
        if (position === 'before') {
          position = 'first';
        }
        if (position === 'after') {
          position = 'last';
        }
      }

      switch (position) {
        case 'before':
          obj.before(d); // @HTMLUpdateOK
          tmp = this._getParent(obj);
          break;
        case 'after':
          obj.after(d); // @HTMLUpdateOK
          tmp = this._getParent(obj);
          break;
        case 'inside':
        case 'first':
          if (!obj.children('ul').length) {
            obj.append('<ul></ul>'); // @HTMLUpdateOK
          }
          obj.children('ul').prepend(d); // @HTMLUpdateOK
          tmp = obj;
          break;
        case 'last':
          if (!obj.children('ul').length) {
            obj.append('<ul></ul>'); // @HTMLUpdateOK
          }
          obj.children('ul').append(d); // @HTMLUpdateOK
          tmp = obj;
          break;
        default:
          if (!obj.children('ul').length) {
            obj.append('<ul></ul>'); // @HTMLUpdateOK
          }
          if (!position) {
            position = 0;
          }
          tmp = obj.children('ul').children('li').eq(position);
          if (tmp.length) {
            tmp.before(d); // @HTMLUpdateOK
          } else {
            obj.children('ul').append(d); // @HTMLUpdateOK
          }
          tmp = obj;
          break;
      }

      if (tmp === -1 || tmp.get(0) === this._$container.get(0)) {
        tmp = -1;
      }
      this._cleanNode(tmp);
      this._emitEvent({ obj: d, parent: tmp }, 'create');

      if (callback) {
        callback.call(this, d);
      }

      //  If there is now more than one node, remove the dummy reference
      //  node that might have been added by Drag/Drop.
      if (this._$container_ul[0].childNodes.length > 1) {
        this._$container_ul.find('.' + TreeUtils._OJ_TEMPNODE).remove();
      }

      return d;
    },

    /**
     *  Expands a collapsed node
     *  @private
     */
    _expand: function (obj, callback, skipAnim) {
      obj = this._getNode(obj);
      if (!obj || !obj.length) {
        return false;
      }

      skipAnim = skipAnim || false;

      if (obj.hasClass(TreeUtils._OJ_DISABLED) || this._data.core.locked) {
        return undefined;
      }

      if (!obj.hasClass(TreeUtils._OJ_COLLAPSED)) {
        if (callback) {
          callback.call();
        }
        return false;
      }

      // Issue a before event, and cancel the expand if the user vetoes it.

      var rslt = this._emitEvent({ obj: obj, func: 'expand' }, 'before');
      if (typeof rslt === 'boolean' && !rslt) {
        return undefined;
      }

      // Get css value $treeAnimationDuration. This is needed because if the value is
      // zero and a transition is started, the transitionend event does not fire and
      // we don't get the opportunity to emit an expand event.

      var dur = skipAnim ? 0 : this._animDuration;
      var t = this;

      if (!this._isLoaded(obj)) {
        obj.children('a').addClass(OJT_LOADING);

        // Load the node. This does not return if an Ajax request is made and ends in failure.
        // will downdate stack and resolve busy if stack is empty.
        this._load_node(
          obj,
          function () {
            t._expand(obj, callback, skipAnim);
          },
          callback
        );
      } else {
        if (this.options.expandParents) {
          obj.parentsUntil('.oj-tree', '.oj-collapsed').each(function () {
            t._expand(this, false, true);
          });
        }

        //         if (skipAnim || dur)  {
        //           obj.children("ul").css("display","none");
        //         }
        obj
          .removeClass(TreeUtils._OJ_COLLAPSED)
          .addClass(TreeUtils._OJ_EXPANDED)
          .attr(WA_EXPANDED, 'true') // @HTMLUpdateOK
          .children('a')
          .removeClass(OJT_LOADING);
        $(obj.children()[0]).removeClass(TreeUtils._OJ_SELECTED).addClass('oj-default');

        this._busyStack.push({ op: 'e', id: obj.attr('id') });

        // Add a busy state for the animation.  The busy state resolver will be invoked
        // when the animation is completed
        this._addBusyState(
          "Tree (id='" + this._elemId + "') : node id='" + obj.attr('id') + "' is animating."
        );

        if (!skipAnim && dur) {
          this._slide(obj, false); // slideDown
        } else {
          this._transitionEnd($(obj.children('UL')[0]), obj);
        }

        if (callback) {
          callback.call();
        }
      }
      return undefined;
    },

    /**
     *  Expands all collapsed nodes
     *  @private
     */
    _expandAll: function (obj, animate, originalObj) {
      var origTarg = obj || -1;

      obj = obj ? this._getNode(obj) : -1;
      if (!obj || obj === -1) {
        obj = this._$container_ul;
      } else {
        origTarg = obj;
      }

      if (originalObj) {
        obj = obj.find('li.oj-collapsed');
      } else {
        originalObj = obj;
        if (obj.is('.oj-collapsed')) {
          obj = obj.find('li.oj-collapsed').addBack();
        } else {
          obj = obj.find('li.oj-collapsed');
        }
      }

      var _this = this;
      obj.each(function () {
        var __this = this;

        if (!_this._isLoaded(this)) {
          _this.expand(
            this,
            function () {
              _this._expandAll(__this, animate, originalObj);
            },
            !animate
          );
        } else {
          _this._expand(this, false, !animate);
        }
      });

      // so that callback is fired AFTER all nodes are open
      if (originalObj.find('li.oj-collapsed').length === 0) {
        this._emitEvent({ obj: obj, targ: origTarg }, 'expandAll');
      }
    },

    /**
     *  Selects a node. If "e" is not defined, the selection originated from an
     *  app API call and not via mouse/keyboard/touch action.
     *  @return  {boolean} true if selection was actually performed, else false.
     *  @private
     */
    _select: function (node, check, e) {
      var core = this._data.core;
      var ui = this._data.ui;
      var selectMode = core.selectMode; // 0 = no select, 1 to n, or -1 = multi-select

      if (selectMode === 0) {
        return false; //  selection not permitted by option
      }

      node = this._getNode(node);

      if (node === -1 || !node || !node.length) {
        return false;
      }

      if (node.hasClass(TreeUtils._OJ_DISABLED) || core.locked) {
        return false;
      }

      if (!e || e.type !== 'touchend') {
        // if via api, ensure touchEvent flag is off
        ui.touchEvent = false;
      }

      var isSelected = this._isSelected(node);

      if (!isSelected) {
        var rslt = this._emitEvent({ obj: node, func: 'select' }, 'before');
        if (typeof rslt === 'boolean' && !rslt) {
          return false;
        }
      }

      // make copy for potential optionChange event
      var prevSelections = this.options.selection.slice(0);

      //  Establish whether the select should happen, and deselect where necessary.

      var s = this.options;
      var selMultMod = ui.defaults.selectMultipleModifier; // to remove - not published
      var selRangeMod = ui.defaults.selectRangeModifier; // not yet published
      var disSelChildren = ui.defaults.disableSelectingChildren; // not yet published
      var isMultiple =
        selMultMod === 'on' || (selMultMod !== false && e && DomUtils.isMetaKeyPressed(e));
      var isRange =
        selRangeMod !== false &&
        e &&
        e[selRangeMod + 'Key'] &&
        ui.lastSelected &&
        this._data.ui.lastSelected[0] !== node[0] &&
        ui.lastSelected.parent()[0] === node.parent()[0];
      var proceed = true;
      var t = this;

      if (check) {
        if (
          disSelChildren &&
          isMultiple &&
          (node.parentsUntil('.oj-tree', 'li').children('a.oj-selected').length ||
            node.children('ul').find('a.oj-selected:eq(0)').length)
        ) {
          return false;
        }
        proceed = false;
        switch (!0) {
          case isRange:
            ui.lastSelected.addClass('oj-tree-last-selected');
            node =
              node[node.index() < ui.lastSelected.index() ? 'nextUntil' : 'prevUntil'](
                '.oj-tree-last-selected'
              ).addBack();

            if (selectMode === -1 || node.length < selectMode) {
              ui.lastSelected.removeClass('oj-tree-last-selected');
              ui.selected.each(function () {
                if (this !== ui.lastSelected[0]) {
                  t._deselect(this);
                }
              });
              isSelected = false;
              proceed = true;
            } else {
              proceed = false;
            }
            break;

          case ui.touchEvent && selectMode === -1: // touch and multi-select mode
            ui.touchEvent = false; // prevent race, when we call toggleselect()
            this.toggleSelect(node); // call into public API, want event
            proceed = false;
            break;

          case isSelected && !isMultiple:
            if (!e) {
              // if via api, nothing to do - node is
              break; // already selected.
            }
            this._deselectAll();
            if (!ui.spacebar) {
              // only kbd toggles selected status
              isSelected = false;
            }
            proceed = true;
            break;

          case !isSelected && !isMultiple:
            if (e) {
              // if mouse click
              if (ui.selected && ui.selected.length === 1) {
                this._deselect(ui.selected); // clear the selection
              } else {
                this._deselectAll(ui.selected); // clear all selections
              }
            } // if (this._data.core.selectMode == -1 || this._data.core.selectMode > 0)  {
            else if (selectMode === 1) {
              this._deselect(ui.selected); // clear the selection
            } else if (selectMode > 1) {
              // TDO check if the selected count will exceed the
              this._deselectAll(); // the selectMode count. Do we veto this select?
            }
            proceed = true;
            break;

          case isSelected && isMultiple:
            this.deselect(node); // call into public API, want event
            break;

          case !isSelected && isMultiple:
            if (selectMode === -1 || ui.selected.length + 1 <= selectMode) {
              proceed = true;
            }
            break;
          default:
            break;
        }
      }

      // Proceed with the selection

      var bRet = false;
      if (proceed && !isSelected) {
        if (!isRange) {
          ui.lastSelected = node;
        }
        node.children('a').addClass(TreeUtils._OJ_SELECTED);
        node.attr(WA_SELECTED, 'true'); // @HTMLUpdateOK
        bRet = true; // selection performed

        if (s.selectedParentExpand) {
          node.parents('.oj-collapsed').each(function () {
            t._expand(this, false, true);
          });
        }

        ui.selected = ui.selected.add(node);
        this._fix_scroll(node.eq(0));

        if (!core.suppressSelectEvent) {
          this._fireOptionChangeEvent('selection', prevSelections, null, e);
        }
      }

      return bRet;
    },

    /**
     *  Deselects a node.
     *  @private
     */
    _deselect: function (node) {
      node = this._getNode(node);
      if (!node.length) {
        return false;
      }
      if (node.hasClass(TreeUtils._OJ_DISABLED) || this._data.core.locked) {
        return undefined;
      }

      if (this._isSelected(node)) {
        node.children('a').removeClass(TreeUtils._OJ_SELECTED);
        node.removeAttr(WA_SELECTED);

        this._data.ui.selected = this._data.ui.selected.not(node);

        if (this._data.ui.lastSelected && this._data.ui.lastSelected.length) {
          if (this._data.ui.lastSelected.get(0) === node.get(0)) {
            this._data.ui.lastSelected = this._data.ui.selected.eq(0);
          }
        }
      }
      return undefined;
    },

    /**
     *  Deselect all selected nodes, or a specified context node and its selected children.
     *  @private
     */
    _deselectAll: function (context) {
      if (this._data.core.locked) {
        return;
      }

      var ret = context
        ? $(context).find('a.oj-selected').parent()
        : this._$container.find('a.oj-selected').parent();

      ret.not('.oj-disabled');
      if (ret.length === 0) {
        return; // nothing selected
      }

      var _this = this;
      $.each(ret, function () {
        _this._deselect(this);
      });
    },

    /** Selects all nodes specified in array.
     * @param {Array}  nodes - an array of nodes to be selected.  Nodes may be defined as elements,
     *                         jQuery wrapped nodes, or selectors pointing to the elements to be selected.
     * @private
     */
    _setSelected: function (nodes, e) {
      if (this._data.core.locked) {
        return;
      }

      if (nodes && nodes.length > 0) {
        var _this = this;
        $.each(nodes, function (i, val) {
          if (val) {
            _this._select(val, true, e);
          }
        });
      }
    },

    /*
     *  Handle tapping or clicking of a node
     *  @private
     */
    _handleNodeTapClick: function (event) {
      event.preventDefault();
      event.currentTarget.blur();
      if (!$(event.currentTarget).hasClass(OJT_LOADING)) {
        this._setFocus();
        //  Handle case where tree does not have focus and a node has been selected.
        //  We want lastHovered set to the same node so that focus does not move
        //  hover to first node.
        if (!this._data.ui.focused) {
          var hov = this._getNode(event.currentTarget);
          if (hov.length > 0 && hov !== -1) {
            this._data.ui.lastHovered = hov;
          }
          this._$container_ul.focus();
        }

        this._select(event.currentTarget, true, event);
      }
      this._data.ui.touchEvent = false;
    },

    /**
     *  Handle hover over a disclosure icon-font
     *  @private
     */
    _disclosureHover: function (elem, bHover) {
      elem = $(elem);
      if (elem.hasClass(TreeUtils._OJ_DISABLED) || this._data.core.locked) {
        return;
      }

      var par = elem.parent();
      var bOpen = par.hasClass(TreeUtils._OJ_EXPANDED);
      var bClosed = par.hasClass(TreeUtils._OJ_COLLAPSED);
      if (bOpen || bClosed) {
        // only care about disclosure
        if (bHover) {
          // <ins>'s of a disclosable
          elem.addClass(TreeUtils._OJ_HOVER); // parent node.
          elem.removeClass('oj-default');
          elem.removeClass(TreeUtils._OJ_SELECTED);
        } else {
          elem.removeClass(TreeUtils._OJ_HOVER);
          elem.addClass('oj-default');
        }
      }
    },

    /**
     *  Handle hover
     *  @private
     */
    _hover: function (node) {
      if (this._data.menu.activeNode) {
        // TDO. why is this needed for shift-f10 on a node
        return; // near the bottom. A bogus mousenter for a node
      } // near the middle is received

      node = this._getNode(node);
      if (!node.length || node.hasClass(TreeUtils._OJ_DISABLED) || this._data.core.locked) {
        return;
      }
      if (node.hasClass(TreeUtils._OJ_HOVER)) {
        return;
      }

      var rslt = this._emitEvent({ obj: node, func: 'hover' }, 'before');
      if (typeof rslt === 'boolean' && !rslt) {
        return;
      }

      // if(this.data.ui.hovered && node.get(0) === this.data.ui.hovered.get(0)) { return; }
      if (!node.hasClass(TreeUtils._OJ_HOVER)) {
        this._dehover();
      }

      this._data.ui.hovered = node.children('a').addClass(TreeUtils._OJ_HOVER).parent();
      this._$container_ul.attr(WA_ACTIVEDESCENDANT, this._data.ui.hovered.attr('id')); // @HTMLUpdateOK
      this._fix_scroll(node);
      this._emitEvent({ obj: node }, 'hover');
    },

    /**
     *  Handle dehover
     *  @private
     */
    _dehover: function () {
      if (this._data.menu.activeNode) {
        // TDO. why is this needed for shift-f10 on a node
        return; // near the bottom. A bogus mousenter for a node
      } // near the middle is received

      var obj = this._data.ui.hovered;

      if (!obj || !obj.length) {
        return;
      }
      if (obj.hasClass(TreeUtils._OJ_DISABLED) || this._data.core.locked) {
        return;
      }

      var p = obj.find('a.oj-hover');
      if (!p.length) {
        p = this._$container_ul.find('a.oj-hover'); // final check in case we get out of sync?
        if (!p.length) {
          return; // no hover, ignore.
        }
      }
      p = p.removeClass(TreeUtils._OJ_HOVER).parent();
      this._$container_ul.removeAttr(WA_ACTIVEDESCENDANT);

      //       if (this._data.ui.hovered[0] === p[0]) {
      this._data.ui.hovered = null;
      //       }

      if (obj.attr('id') != null) {
        this._emitEvent({ obj: obj }, 'dehover');
      }
    },

    /**
     *  Placeholder for a more specific refresh action. It is replaced
     *  by _refresh_json() for json_data, or _refresh_ui() for html_data.
     *
     *  Refreshes the tree - notes all open nodes, reloads them in the tree
     *  and then reopens the noted open nodes.
     *  @private
     */
    _refresh: function (node) {
      this._refresh_core(node);
    },

    /**
     *  Base _refresh action
     *  @private
     */
    _refresh_core: function (node) {
      var origTarg = node || -1;
      var _this = this;

      this._save_opened();
      this._saveSelected();
      if (!node) {
        node = -1;
      }
      node = this._getNode(node);
      if (!node) {
        node = -1;
      } else {
        origTarg = node;
      }

      if (node !== -1) {
        node.children('UL').remove();
      } else {
        this._$container_ul.empty();
        this._processExistingMarkup(); // if existing markup, reprocess in case it changed
      }
      this._load_node(node, function () {
        _this._emitEvent({ obj: origTarg }, 'refresh');
        _this._reload_nodes();
        _this._rehover();
      });
    },

    /**
     *  Ui _refresh action
     *  @private
     */
    _refresh_ui: function (obj) {
      this._saveSelected();
      this._refresh_core(obj);
    },

    // Not used currently
    //   /**
    //     *  Emits an "after_open" event for internal use only.
    //     *  @private
    //     */
    //   "after_open"  : function (obj)
    //   {
    //      this._emitEvent({ "obj" : obj }, "after_open", true);
    //   },

    /**
     *  Emits an internal "after_close" event for internal use only.
     *  @private
     */
    after_close: function (obj) {
      this._emitEvent({ obj: obj }, 'after_close', true);
    },

    /**
     *  Expand any nodes that have been specified to be expanded.
     *  Emits an internal "reopen" event.
     *  @private
     */
    _reopen: function () {
      var _this = this;

      if (this._data.core.toExpand.length) {
        $.each(this._data.core.toExpand, function (i, val) {
          _this._expand(val, false, true);
        });
      }
      this._emitEvent({}, 'reopen', true); // this event will also cause selections to be tried.
    },

    /**
     *  If a node was hovered, refind it in the DOM (after refresh).
     *  @private
     */
    _rehover: function () {
      var id;
      var $hovered = this._data.ui.lastHovered;
      if ($hovered) {
        id = $hovered.attr('id');
        if (id) {
          $hovered = this._getNode('#' + id);
        }
      }
      this._data.ui.lastHovered = $hovered;
      this._data.ui.hovered = $hovered;
    },

    /**
     *  Returns an array of currently selected nodes.
     *  @private
     */
    _getSelected: function (context) {
      var sel = context ? $(context).find('a.oj-selected').parent() : this._data.ui.selected;
      var ar = [];
      var len = sel.length;
      for (var i = 0; i < len; i++) {
        ar.push(sel[i]);
      }
      return ar;
    },

    /**
     *  Changes the text title of the node's <a>
     *  @private
     */
    _set_text: function (obj, val) {
      obj = this._getNode(obj);
      if (!obj.length) {
        return false;
      }

      obj = obj.children('a:eq(0)');
      obj = obj.find('span:eq(0)');
      this._emitEvent({ obj: obj, name: val }, 'set_text', true);
      obj[0].textContent = val;
      return val;
    },

    /**
         Load the tree
         *  @private
         */
    _loadNodes: function () {
      if (this._data.ds.type !== DS_NONE && this._data.ds.type !== DS_ERROR) {
        // Construct the tree
        this._load_node(-1, function () {
          // success func
          this._loaded(); // emit ojloaded event
          this._reload_nodes(); // handle initExpanded, etc
        });
      } else {
        this._applyEmptyText(); //  Use emptyText option if defined.
        this._loaded();
      }
    },

    /**
     *  @private
     */
    // eslint-disable-next-line no-unused-vars
    _load_node: function (obj, successCallback, errorCallback) {
      // Dummy function overriden by data methods
      this._emitEvent({ obj: obj }, 'load_node', true);
    },

    /**
     *  Returns whether a node is current loaded. This is a dummy function
     *  overriden by data methods such as _isLoaded_J(), _isLoaded_html()
     *  or _isLoaded_DS().
     *  @private
     */
    // eslint-disable-next-line no-unused-vars
    _isLoaded: function (obj) {
      // Dummy function overriden by data methods
      return true;
    },

    /**
     *  TreeDataSource's _load_node
     *  @private
     */
    _load_node_DS: function (obj, successCallback, errorCallback) {
      var _this = this;
      this._load_node_tree(
        obj,
        function () {
          _this._emitEvent({ obj: _this._getNode(obj) }, 'load_node', true);
          successCallback.call(this);
        },
        errorCallback
      );
    },

    /**
     *   JsonTreeDataSource's _isLoaded()
     *   @return {boolean}
     *   @private
     */
    _isLoaded_DS: function (obj) {
      // var s = this.options["data"]["json"];

      obj = this._getNode(obj);

      // return (obj === -1 || !obj ) || (!s["ajax"] && !this._data.ds.progressiveRender && !$.isFunction(s["data"]))
      return (
        obj === -1 ||
        !obj ||
        obj.is('.oj-expanded, .oj-tree-leaf') ||
        obj.children('ul').children('li').length > 0
      );
    },

    /**
     *   JsonTreeDataSource's _refreshDS
     *  @private
     */
    _refresh_DS: function (obj) {
      obj = this._getNode(obj);

      // var s = this.options["data"]["json"];
      // if (obj && obj !== -1 && this._data.ds.progressiveUnload && ($.isFunction(s["data"]) || !!s["ajax"]))  {
      if (obj && obj !== -1) {
        obj.removeData(OJT_CHILDREN);
      }
      return this._refresh_ui(obj);
    },

    /**
     *  JSON_data's _load_node()
     *  @private
     */
    _load_node_J: function (obj, successCallback, errorCallback) {
      var _this = this;
      this._loadNodeJson(
        obj, // node or -1 for tree
        function () {
          // success func
          _this._emitEvent({ obj: _this._getNode(obj) }, 'load_node', true);
          successCallback.call(this);
        },
        errorCallback
      ); // error func
    },

    /**
     *   JSON _data's _isLoaded()
     *   @private
     */
    _isLoaded_J: function (obj) {
      var s = this.options.data;

      obj = this._getNode(obj);
      return (
        obj === -1 ||
        !obj ||
        (!s.ajax && !this._data.ds.progressiveRender && !$.isFunction(s.data)) ||
        obj.is('.oj-expanded, .oj-tree-leaf') ||
        obj.children('ul').children('li').length > 0
      );
    },

    /**
     *   html_data's _load_node
     *   @private
     */
    _load_node_H: function (obj, successCallback, errorCallback) {
      var _this = this;
      this._loadNodeHtml(
        obj,
        function () {
          // success func
          _this._emitEvent({ obj: _this._getNode(obj) }, 'load_node', true);
          successCallback.call(this);
        },
        errorCallback
      ); // error func
    },

    /**
     *  html_data's _isLoaded()
     *  @private
     */
    _isLoaded_H: function (obj) {
      var s = this.options.data;
      var data = null;
      var ajax = null;

      if (s) {
        data = s.data || null;
        ajax = s.ajax || null;
      }

      obj = this._getNode(obj);

      return (
        obj === -1 ||
        !obj ||
        (!ajax && !$.isFunction(data)) ||
        obj.is('.oj-expanded, .oj-tree-leaf') ||
        obj.children('ul').children('li').length > 0
      );
    },

    /**
     *  Rselect nodes as of last savedSelected()
     *  @private
     */
    _reselect: function () {
      var _this = this;
      var s = this._data.ui.toSelect;

      s = $.map($.makeArray(s), function (n) {
        return (
          '#' +
          n
            .toString()
            .replace(/^#/, '')
            .replace(/\\\//g, '/')
            .replace(/\//g, '\\/')
            .replace(/\\\./g, '.')
            .replace(/\./g, '\\.')
            .replace(/:/g, '\\:')
        );
      });
      // Clear selection option
      if (s && s.length) {
        this.options.selection.length = 0; // forget the noted selections
        this._data.ui.selected.length = $();
      }

      // Reapply the selections
      $.each(s, function (i, val) {
        if (val && val !== '#') {
          _this.select(val);
        }
      });

      this._data.ui.selected = this._data.ui.selected.filter(function () {
        return this.parentNode;
      });
      //      this._emitEvent(null, "reselect", true);
    },

    /**
     * Save selection state - see also _reselect()
     * @private
     */
    _saveSelected: function () {
      var ui = this._data.ui;

      ui.toSelect = [];
      ui.selected.each(function () {
        if (this.id) {
          ui.toSelect.push(
            '#' +
              this.id
                .toString()
                .replace(/^#/, '')
                .replace(/\\\//g, '/')
                .replace(/\//g, '\\/')
                .replace(/\\\./g, '.')
                .replace(/\./g, '\\.')
                .replace(/:/g, '\\:')
          );
        }
      });
      // this._emitEvent(ui.toSelect, "savedselected", true);
    },

    /*
     *      Not documented
     */
    rollback: function (rb) {
      if (rb) {
        if (!$.isArray(rb)) {
          rb = [rb];
        }
        //        $.each(rb, function (i, val)
        //                   {
        //                     instances[val.i]["set_rollback"](val.h, val.d);     //TDO
        //                   });
      }
    },

    get_rollback: function () {
      this._emitEvent(null, 'get_rollback', true);
      return {
        i: this._getIndex(),
        h: this._$container.children('ul').clone(true),
        d: this.data // TDO ???
      };
    },

    /*  Currently not used
    "set_rollback" : function (html, data)
    {
       if (this._$container && this._$container_ul)   {
         this._$container_ul.empty().append(html);
       }

       this["data"] = data;                       // TDO ???
       this._emitEvent(null, "set_rollback", true);
    },
*/

    /**
     *  Load json for a particular node (or the whole tree)
     *  @private
     */
    // eslint-disable-next-line no-unused-vars
    _load_node_tree: function (obj, successCallback, errorCallback) {
      var parentKey = obj && obj !== -1 ? obj[0].id : obj || -1;
      var rslt = this._JsonDSToJson(parentKey, obj);

      if (!rslt.success) {
        return;
      }

      var bTree = !obj || obj === -1;
      var s = this.options.data;
      var d;

      if ((!!s.data && !s.ajax) || (!!s.data && !!s.ajax && bTree)) {
        if (bTree) {
          d = this._parseJson(rslt.js, obj);
          if (d) {
            this._$container_ul.empty().append(d.children()); // @HTMLUpdateOK
            this._cleanNode();
          } else if (this._data.ds.correctState) {
            this._$container_ul.empty();
          }
        }
        if (successCallback) {
          successCallback.call(this);
        }
      } else if ((!s.data && !!s.ajax) || (!!s.data && !!s.ajax && !bTree)) {
        d = this._parseJson(rslt.js, obj);
        if (d) {
          if (bTree) {
            var $u = this._$container_ul;
            $u.empty().append(d.children()); // @HTMLUpdateOK
            $u.attr(WA_ROLE, WA_TREE) // @HTMLUpdateOK
              .attr(WA_LABELLEDBY, this._elemId) // @HTMLUpdateOK
              .attr('tabindex', '0') // @HTMLUpdateOK
              .css('outline', 'none');
            if (this._data.core.selectMode === -1) {
              $u.attr('aria-multiselectable', true);
            }
          } else {
            obj.append(d).children('a.oj-tree-loading').removeClass(OJT_LOADING); // @HTMLUpdateOK
            obj.removeData('oj-tree-is-loading');
          }

          this._cleanNode(obj);
          if (successCallback) {
            successCallback.call(this);
          }
        } else if (bTree) {
          if (this._data.ds.correctState) {
            this._$container_ul.empty();
            if (successCallback) {
              successCallback.call(this);
            }
          }
        } else {
          obj.children('a.oj-tree-loading').removeClass(OJT_LOADING);
          obj.removeData('oj-tree-is-loading');
          if (s.correct_state) {
            this._correct_state(obj);
            if (successCallback) {
              successCallback.call(this);
            }
          }
        }
      }
    },

    /**
     * Recursively process a JsonTreeDataSource to a Json array ready for parsing.
     * JsonTreeDataSource does not support later data addition, so all nodes
     * must be available from the outset. This implies that there can be no
     * no lazy-loading.
     * @private
     * @return {Object} contains "success" (boolean) and "js" (the json nodes)
     */
    _JsonDSToJson: function (parentKey, node) {
      var arJson = [];
      var ds = this._tds;
      var range = {};
      var rslt = { success: false, js: null };

      if (parentKey === -1) {
        parentKey = null;
        range.start = 0;
      } else {
        // TDO
      }

      var cc = ds.getChildCount(parentKey);
      if (cc > 0) {
        range.count = cc;
        ds.fetchChildren(
          parentKey,
          range, // get the JsonNodeSet
          {
            // callbacks
            success: function (jns) {
              var c = jns.getCount();

              for (var i = 0; i < c; i++) {
                node = {};
                var attr = jns.getData(i); // get the attribute list to be applied
                if (attr) {
                  node.attr = attr;
                }
                node.title = jns.m_nodes[i].title; // wait for chadwick
                if (attr.metadata) {
                  node.metadata = jns.m_nodes[i].metadata; // wait for chadwick
                }

                var key = node.attr.id;

                var n = ds.getChildCount(key);
                if (n > 0) {
                  var r = this._JsonDSToJson(key, node);
                  node.children = r.js;
                }

                arJson.push(node);
              }

              rslt.success = true;
              rslt.js = arJson;
            }.bind(this),

            error: function () {
              rslt.success = false;
            }
          }
        );
      } else {
        rslt.success = true; // DS was empty.  Will not treat this as an error,
        // because we did not have any failures.
      }
      return rslt;
    },

    /**
     *  @private
     */
    _refresh_json: function (obj) {
      obj = this._getNode(obj);

      if (this._data.core.locked) {
        return undefined;
      }

      var bTree = !obj || obj !== -1 || !obj.length;
      if (!bTree && obj.hasClass(TreeUtils._OJ_DISABLED)) {
        return undefined;
      }

      var s = this.options.data.json;

      if (!bTree && this._data.ds.progressiveUnload && ($.isFunction(s.data) || !!s.ajax)) {
        obj.removeData(OJT_CHILDREN);
      }
      return this._refresh_ui(obj);
    },

    /**
     *  Load json for a particular node (or -1 for the whole tree). successCallback and errorCallback are
     *  optional success and error callback's.
     *  @private
     */
    _loadNodeJson: function (obj, successCallback, errorCallback) {
      var s = this._getOptions().data; // work on a copy of the options to avoid
      var errorFunc = function () {};
      var successFunc = function () {};
      var data = (s && s.data) || null;
      var ajax = (s && s.ajax) || null;

      if (s && !data && !ajax) {
        data = s; // we just have data, no data() ajax() methods defined
      }

      obj = this._getNode(obj);

      if (
        obj &&
        obj !== -1 &&
        (this._data.ds.progressiveRender || this._data.ds.progressiveUnload) &&
        !obj.is('.oj-expanded, .oj-tree-leaf') &&
        obj.children('ul').children('li').length === 0 &&
        obj.data(OJT_CHILDREN)
      ) {
        var d1 = this._parseJson(obj.data(OJT_CHILDREN), obj);
        if (d1) {
          obj.append(d1); // @HTMLUpdateOK
          if (!this._data.ds.progressiveUnload) {
            obj.removeData(OJT_CHILDREN);
          }
        }

        this._cleanNode(obj);
        if (successCallback) {
          successCallback.call(this);
        }
        return;
      }

      if (obj && obj !== -1) {
        if (obj.data('oj-tree-is-loading')) {
          return;
        }

        obj.data('oj-tree-is-loading', true);
      }

      switch (!0) {
        case !data && !ajax:
          throw new Error('ojTree - neither data nor ajax settings supplied.');

        // Data function supplied by user data definition.
        case $.isFunction(data):
          data.call(
            this,
            obj,
            function (d) {
              // invoke user function passing a callback
              d = this._parseJson(d, obj);
              if (!d) {
                if (obj === -1 || !obj) {
                  if (this._data.ds.correctState) {
                    this._$container_ul.empty();
                  }
                } else {
                  obj.children('a.oj-tree-loading').removeClass(OJT_LOADING);
                  obj.removeData('oj-tree-is-loading');

                  if (this._data.ds.correctState) {
                    this._correct_state(obj);
                  }
                }
                if (errorCallback) {
                  errorCallback.call(this);
                }
              } else {
                if (obj === -1 || !obj) {
                  this._$container_ul.empty().append(d.children()); // @HTMLUpdateOK
                } else {
                  obj.append(d).children('a.oj-tree-loading').removeClass(OJT_LOADING); // @HTMLUpdateOK
                  obj.removeData('oj-tree-is-loading');
                }
                this._cleanNode(obj);
                if (successCallback) {
                  successCallback.call(this);
                }
              }
            }.bind(this)
          );
          break;

        case (!!data && !ajax) || (!!data && !!ajax && (!obj || obj === -1)):
          if (!obj || obj === -1) {
            var d2 = this._parseJson(data, obj);
            if (d2) {
              this._$container_ul.empty().append(d2.children()); // @HTMLUpdateOK
              this._cleanNode();
            } else if (this._data.ds.correctState) {
              this._$container_ul.empty();
            }
          }
          if (successCallback) {
            successCallback.call(this);
          }
          break;

        case (!data && !!ajax) || (!!data && !!ajax && obj && obj !== -1):
          // AJAX error function
          errorFunc = function (x, status, e) {
            var self = this.ctx; // get the tree's this
            // console.log("Ajax FAIL JSON id='" + this.id + "' obj.id=" +
            //              ((obj === -1)? -1 : obj.attr("id")) + " url=" + this.url);

            self._noteLoadFailureId(this.id, true); // add id to load failure list
            self._removeFromBusyStack('j', obj === -1 ? -1 : obj.attr('id'));
            self._resolveIfBusyStackEmpty();

            var ef = self._getOptions().data.ajax.error; // reget the options
            if (ef) {
              // without our updated ajax
              ef.call(self, status, e, x); // changes to avoid forever loop
            }
            if (obj !== -1 && obj.length) {
              obj.children('a.oj-tree-loading').removeClass(OJT_LOADING);
              obj.removeData('oj-tree-is-loading');
              if (status === 'success' && self._data.ds.correctState) {
                self._correct_state(obj);
              }
            } else if (status === 'error' || (status === 'success' && self._data.ds.correctState)) {
              self._$container_ul.empty(); // remove tree loading icon/node
              self._applyEmptyText(); // no tree data
            }
            if (errorCallback) {
              errorCallback.call(self);
            }
          };

          // AJAX success function
          successFunc = function (d, status, x) {
            // 'this' is the context ptr
            var self = this.ctx; // get the tree's this

            // console.log("Ajax SUCCESS JSON id='" + this.id + "' obj.id=" +
            //              ((obj === -1)? -1 : obj.attr("id")) + " url=" + this.url);

            self._noteLoadFailureId(this.id, false); // if this id is the failure list, remove it
            self._removeFromBusyStack('j', this.id);

            // Reget the options without our updated ajax changes to avoid forever loop
            var sf = self._getOptions().data.ajax.success;
            if (sf) {
              d = sf.call(self, d, status, x) || d; // call app success function
            }

            // Check if all whitespace since JSON.parse() will barf on this.
            if (typeof d === 'string') {
              var tempd = d.replace(/^[\s\n]+$/, '');
              try {
                tempd = JSON.parse(tempd);
              } catch (err) {
                tempd = null; // have nothing useful to display
              }

              if (!tempd) {
                return errorFunc.call(this, x, 'Bad JSON', '');
              }
            }

            d = self._parseJson(d, obj); // parse json and get a $(ul)
            if (d) {
              if (obj === -1 || !obj) {
                var $u = self._$container_ul;
                $u.empty().append(d.children()); // @HTMLUpdateOK
                $u.attr(WA_ROLE, WA_TREE) // @HTMLUpdateOK
                  .attr(WA_LABELLEDBY, self._elemId) // @HTMLUpdateOK
                  .attr('tabindex', '0')
                  .css('outline', 'none');
                if (self._data.core.selectMode === -1) {
                  $u.attr('aria-multiselectable', true);
                }
              } else {
                obj.append(d).children('a.oj-tree-loading').removeClass(OJT_LOADING); // @HTMLUpdateOK
                obj.removeData('oj-tree-is-loading');
              }

              self._cleanNode(obj);
              if (successCallback) {
                successCallback.call(self);
              }
            } else if (obj === -1 || !obj) {
              // parse returned nothing
              if (self._data.ds.correctState) {
                self._$container_ul.empty();
                if (successCallback) {
                  successCallback.call(self);
                }
              }
            } else {
              obj.children('a.oj-tree-loading').removeClass(OJT_LOADING);
              obj.removeData('oj-tree-is-loading');
              if (self._data.ds.correctState) {
                self._correct_state(obj);
                if (successCallback) {
                  successCallback.call(self);
                }
              }
            }
            return undefined;
          };

          //  Prepare for an aynchronous ajax op. (note: we are updating a copy of the options)

          var nodeId = obj === -1 ? -1 : obj.attr('id');
          this._busyStack.push({ op: 'j', id: nodeId });
          this._addBusyState(
            "Tree (id='" + this._elemId + "') : node id='" + nodeId + "' is lazyloading."
          );

          // console.log("ajax JSON load (" + nodeId + ") . . .  busyStack=" + this._arrayToStr(this._busyStack)) ;

          var reqContext = { ctx: this, id: nodeId };

          s.ajax.context = reqContext;
          s.ajax.error = errorFunc;
          s.ajax.success = successFunc;

          if (!s.dataType) {
            s.ajax.dataType = 'json';
          }
          reqContext.type = s.ajax.dataType;

          if ($.isFunction(s.ajax.url)) {
            s.ajax.url = s.ajax.url.call(this, obj);
            reqContext.url = s.ajax.url;
          }
          if ($.isFunction(s.ajax.data)) {
            s.ajax.data = s.ajax.data.call(this, obj);
          }
          $.ajax(s.ajax);
          break; // end case

        default:
          break;
      } // end switch
    },

    /**
     *  Recursively parses a JSON representation of a tree or tree node(s).
     *  Returns a jQuery wrapped <ul> structure, or false if parse fails.
     *  @private
     */
    _parseJson: function (js, obj, isRecurse) {
      var d = false;

      if (!js) {
        return d;
      }

      if (this._data.ds.progressiveUnload && obj && obj !== -1) {
        obj.data(OJT_CHILDREN, d);
      }

      if (typeof js === 'string') {
        try {
          js = JSON.parse(js);
        } catch (err) {
          js = []; // have nothing useful to display
        }
      }

      if ($.isArray(js)) {
        // array of ojects ?
        d = $('<ul>');
        if (!js.length) {
          return false;
        }

        var len = js.length;
        for (var j = 0; j < len; j++) {
          // recurse until we have an individual node obj
          var tmp = this._parseJson(js[j], obj, true);
          if (tmp.length) {
            d = d.append(tmp); // @HTMLUpdateOK
          }
        }

        d = d.children();
      } else {
        //  We have an individual node object

        if (typeof js === 'string') {
          js = { data: js };
        }

        var title = typeof js.title === 'string' ? js.title : ' ';

        d = $("<li role='" + WA_TREEITEM + "' ></li>"); // start a node

        if (js.attr) {
          if (this._data.types.defType && !js.attr.type) {
            // if no type and "default" type
            js.attr.type = 'oj-tree-deftype'; // defined, add default type
            d.addClass(OJT_TYPE);
          }
          d.attr(js.attr); // apply attr's to the <li>
        }
        if (js.metadata) {
          // apply any user defined arbitrary data for the <li>
          d.data(js.metadata);
        }

        // js.state     // not published - per Design Review
        // Used internally only for DnD
        if (js.children && js.children.length === 0) {
          // length zero means lazy load
          d.addClass(TreeUtils._OJ_COLLAPSED);
        }
        if (js.state && js.state === 's') {
          d.addClass(TreeUtils._OJ_SELECTED); // Added as a flag, see _dndFinish()
        }

        if (!js.data) {
          js.data = { dummy: 0 };
        }

        var bIns = false;

        var tmp2 = $('<a></a>');
        $.each(js.data, function (i, m) {
          if ($.isFunction(m)) {
            m = m.call(this, js);
          }
          if (typeof m === 'object') {
            if (i === 'attr') {
              tmp2.attr(m);
            } else if (i === 'style') {
              tmp2.css(m);
            }
            if (i === 'language') {
              tmp2.addClass(m);
            }
          }
          //              else if (typeof m == "string")  {
          //                tmp2.attr('href','#')[ ht? "html" : "text" ](title);
          //              }

          if (!bIns) {
            var sp = $("<span class='" + OJT_TITLE + "'>");
            sp[0].textContent = title; // per securty post-impl

            // prettier-ignore
            tmp2.prepend( // @HTMLUpdateOK
              "<ins class='oj-tree-icon " + OJT_NICON + " oj-component-icon'>&#160;</ins>",
              sp
            ); // node icon
            bIns = true;
          }
          if (!m.icon && js.icon) {
            m.icon = js.icon;
          }
          if (m.icon) {
            if (m.icon.indexOf('/') === -1) {
              tmp2.children('ins').addClass(m.icon);
            } else {
              tmp2
                .children('ins')
                .css('background', "url('" + m.icon + "') center center no-repeat");
            }
          }
        });

        d.append(tmp2); // append the <a> and its children to the <li>                    //@HTMLUpdateOK
        d.prepend("<ins class='" + OJ_DISC + "'>&#160;</ins>"); // potential disclosure icon   //@HTMLUpdateOK

        if (js.children) {
          if (this._data.ds.progressiveRender && js.state !== 'expanded') {
            d.addClass(TreeUtils._OJ_COLLAPSED)
              .attr(WA_EXPANDED, 'false') // @HTMLUpdateOK
              .data(OJT_CHILDREN, js.children);
          } else {
            if (this._data.ds.progressiveUnload) {
              d.data(OJT_CHILDREN, js.children);
            }
            if ($.isArray(js.children) && js.children.length) {
              tmp2 = this._parseJson(js.children, obj, true);
              if (tmp2.length) {
                var ul2 = $("<ul role='" + WA_GROUP + "' ></ul>");
                ul2.append(tmp2); // @HTMLUpdateOK
                d.append(ul2); // @HTMLUpdateOK
              }
            }
          }
        }
      } // end else

      if (!isRecurse) {
        var ul1 = $('<ul></ul>');
        ul1.append(d); // @HTMLUpdateOK
        d = ul1;
      }

      return d;
    },

    /*
     *   Returns a Json representation of a node
     *   @private
     */
    __getJson: function (obj, liAttr, aAttr, isCallback) {
      var result = [];
      var s = this.options;
      var _this = this;

      obj = this._getNode(obj);

      if (!obj || obj === -1) {
        obj = this._$container.find('> ul > li');
      }
      liAttr = $.isArray(liAttr) ? liAttr : ['id', 'class'];

      if (!isCallback && s.types) {
        liAttr.push(s.types.attr);
      }
      aAttr = $.isArray(aAttr) ? aAttr : [];

      obj.each(function () {
        var sAttr;
        var li = $(this);
        var tmp1 = {};
        var uattr = _this._noteUserAttrs(li); // get list of user added attr's

        if (liAttr.length || (uattr && uattr.length)) {
          tmp1.attr = {};
        }

        // Add user added attr's back into the "attr" property
        if (uattr) {
          $.each(uattr, function (i, v) {
            if (li.attr(v).length > 0) {
              tmp1.attr[v] = li.attr(v);
            }
          });
        }

        $.each(liAttr, function (i, v) {
          //  Find/save any non oj classes
          var tmp2 = li.attr(v);
          if (tmp2 && tmp2.length && tmp2.replace(/oj-tree[^ ]*/gi, '').length) {
            tmp2 = (' ' + tmp2)
              .replace(/ oj-tree[^ ]*/gi, '')
              .replace(/ oj-[^ ]*/gi, '')
              .replace(/\s+$/gi, ' ')
              .replace(/^ /, '')
              .replace(/ $/, '');
            if (tmp2.length) {
              tmp1.attr[v] = tmp2;
            }
          }
        });

        // Additional state for DnD only, not valid for user code
        if (_this._getDndContext().isDragEnabled()) {
          //             if (li.hasClass(OJ_EXPANDED))  {
          //               tmp1["state"] = "e";
          //             }
          if (_this._isSelected(li)) {
            tmp1.state = 's';
          }
        }

        //  Check if node json included a metadata attribute
        var val = li.data();
        if (!isPureObjEmpty(val)) {
          tmp1.metadata = val;
        }
        var a = li.children('a');
        var tmp3 = null;
        a.each(function () {
          var t = $(this);
          var title;

          if (
            aAttr.length ||
            t.children('ins').get(0).style.backgroundImage.length ||
            (t.children('ins').get(0).className &&
              t
                .children('ins')
                .get(0)
                .className.replace(/oj-tree[^ ]*|$/gi, '').length)
          ) {
            title = _this.getText(t);
            $.each(aAttr, function (k, z) {
              sAttr = (' ' + (t.attr(z) || ''))
                .replace(/ oj-tree[^ ]*/gi, '')
                .replace(/ oj-[^ ]*/gi, '')
                .replace(/\s+$/gi, ' ')
                .replace(/^ /, '')
                .replace(/ $/, '');
              if (sAttr.length) {
                if (!tmp3) {
                  tmp3 = { attr: {} };
                }
                tmp3.attr[z] = sAttr;
              }
            });

            if (
              t
                .children('ins')
                .get(0)
                .className.replace(/oj-tree[^ ]*|$/gi, '')
                .replace(/^\s+$/gi, '').length
            ) {
              sAttr = t
                .children('ins')
                .get(0)
                .className.replace(/oj-tree[^ ]*|$/gi, '')
                .replace(/ oj-[^ ]*/gi, '')
                .replace(/\s+$/gi, ' ')
                .replace(/^ /, '')
                .replace(/ $/, '');
              if (sAttr.length) {
                if (!tmp3) {
                  tmp3 = {};
                }
                tmp3.icon = sAttr;
              }
            }

            if (t.children('ins').get(0).style.backgroundImage.length) {
              sAttr = t
                .children('ins')
                .get(0)
                .style.backgroundImage.replace('url(', '')
                .replace(')', '');
              if (sAttr.length) {
                if (!tmp3) {
                  tmp3 = {};
                }
                tmp3.icon = sAttr;
              }
            }
          } else {
            title = _this.getText(t);
          }

          if (tmp3 != null) {
            if (!tmp1.data) {
              tmp1.data = [];
            }
            if (a.length > 1) {
              tmp1.data.push(tmp3);
            } else {
              tmp1.data = tmp3;
            }
          }
          tmp1.title = title;
        });

        li = li.find('> ul > li');
        if (li.length) {
          tmp1.children = _this.__getJson(li, liAttr, aAttr, true);
        }
        result.push(tmp1);
      });

      return result;
    },

    /**
     *  If LI elem contains user attr definitions other than "id", "title" or ones we
     *  have added like "role"/"class", note them so that they can be reinstated for
     *  parseJson().
     *  @private
     *  @return {Array | null} An array of user attr names, else null
     */
    _noteUserAttrs: function ($node) {
      var attrs = $node[0].attributes; // get the LI's attributes
      var ar;

      if (attrs && attrs.length) {
        ar = [];
        var len = ATTR_IGN.length;

        for (var i = 0; i < attrs.length; i++) {
          var attr = attrs[i];
          if (attr) {
            attr = attr.name;
            var j;
            for (j = 0; j < len; j++) {
              if (ATTR_IGN[j] === attr || attr.indexOf('aria-') === 0) {
                break; // ignore if in our excluded list
              }
            }
            if (j >= len) {
              ar.push(attr);
            }
          }
        }
      }

      return ar && ar.length > 0 ? ar : null;
    },

    /**
     *  Corrects nodes by setting closed nodes to leaf nodes if no children found.
     *  @private
     */
    _correct_state: function (obj) {
      obj = this._getNode(obj);
      if (!obj || obj === -1) {
        return false;
      }
      obj
        .removeClass('oj-collapsed oj-expanded')
        .removeAttr(WA_EXPANDED)
        .addClass(OJT_LEAF)
        .children('ul')
        .remove();

      obj.find('ins:first-child').removeClass(OJ_DISC).addClass(OJT_ICON);
      this._emitEvent({ obj: obj }, 'correct_state', true);
      return undefined;
    },

    /*
     *  @private
     */
    /*                                           // not used in V1
     _core_notify : function (n, data)
     {
        if (data.opened)  {
          this._expand(n, false, true);
        }
     },
*/

    /**
     *  Dummy function to fire after the first load (so that there is a loaded event)
     *  @private
     */
    _loaded: function () {
      this._emitEvent(null, 'loaded');
    },

    /**
     *   Process the user tree <ul> list placed in the tree div, or loaded via ajax.
     *   @private
     */
    _loadNodeHtml: function (obj, successCallback, errorCallback) {
      var s = this._getOptions().data; // work on a copy of the options to avoid
      var errorFunc = function () {};
      var successFunc = function () {};
      var data = (s && s.data) || null;
      var ajax = (s && s.ajax) || null;

      obj = this._getNode(obj);
      if (obj && obj !== -1) {
        if (obj.data('oj-tree-is-loading')) {
          return;
        }

        obj.data('oj-tree-is-loading', true);
      }

      switch (!0) {
        case !data && !ajax && s && typeof s === 'string':
          this._loadHtmlString(s, obj, successCallback, errorCallback);
          break;

        case $.isFunction(data):
          data.call(
            this,
            obj,
            function (d) {
              this._loadHtmlString(d, obj, successCallback, errorCallback);
            }.bind(this)
          );
          break;

        case !data && !ajax:
          if (!obj || obj === -1) {
            this._$container_ul
              .empty()
              .append(this._data.html.cloneMarkup) // @HTMLUpdateOK
              .find('li, a')
              .filter(function () {
                return (
                  !this.firstChild || !this.firstChild.tagName || this.firstChild.tagName !== 'INS'
                );
              })
              .prepend("<ins class='oj-tree-icon' >&#160;</ins>") // @HTMLUpdateOK
              .end()
              .filter('a')
              .children('ins:first-child')
              .not('.oj-tree-node-icon')
              .addClass(OJT_NICON)
              .addClass(OJT_ICON);

            this._$container_ul.find('li').children('ins:first-child').addClass(OJ_DISC);

            //  No point in checking for empty parent <ul> because we don't have a
            //  "data" option in the first place, so no lazy loading possible.

            //  Add the <a> text <span> for hover/click styling
            this._insertHtmlTextSpan(this._$container_ul);

            if (this._data.types.defType) {
              // if "default" type defined
              this._addDefType(this._$container_ul); // apply to nodes with no asooc type
            }

            this._cleanNode();
            this._$container_ul.find('ul').attr(WA_ROLE, WA_GROUP); // @HTMLUpdateOK
            this._$container_ul.find('li').attr(WA_ROLE, WA_TREEITEM); // @HTMLUpdateOK
          }
          if (successCallback) {
            successCallback.call(this);
          }
          break;

        case (!!data && !ajax) || (!!data && !!ajax && (!obj || obj === -1)):
          if (!obj || obj === -1) {
            var $data = $(data);
            if (!$data.is('ul')) {
              $data = $('<ul></ul>').append($data); // @HTMLUpdateOK
            }
            this._$container_ul
              .empty()
              .append($data.children()) // @HTMLUpdateOK
              .find('li, a')
              .filter(function () {
                return (
                  !this.firstChild || !this.firstChild.tagName || this.firstChild.tagName !== 'INS'
                );
              })
              .prepend("<ins class='oj-tree-icon'>&#160;</ins>") // @HTMLUpdateOK
              .end()
              .filter('a')
              .children('ins:first-child')
              .not('.oj-tree-node-icon')
              .addClass(OJT_NICON)
              .addClass(OJT_ICON);

            this._$container_ul
              .find('li.oj-tree-leaf ins:first-child')
              .removeClass(OJ_DISC)
              .removeClass(OJT_NICON)
              .addClass(OJT_ICON);

            //  Add the <a> text <span> for hover/click styling
            this._insertHtmlTextSpan(this._$container_ul);

            if (this._data.types.defType) {
              // if "default" type defined
              this._addDefType(this._$container_ul); // apply to nodes with no asooc type
            }

            this._cleanNode();
            this._$container_ul.find('ul').attr(WA_ROLE, WA_GROUP); // @HTMLUpdateOK
            this._$container_ul.find('li').attr(WA_ROLE, WA_TREEITEM); // @HTMLUpdateOK
          }
          if (successCallback) {
            successCallback.call(this);
          }
          break;

        // AJAX request
        case (!data && !!ajax) || (!!data && !!ajax && obj && obj !== -1):
          obj = this._getNode(obj);
          // AJAX error function
          errorFunc = function (x, status, e) {
            var self = this.ctx; // get the tree's this
            // console.log("Ajax FAIL HTML id='" + this.id + "' obj.id=" +
            //              ((obj === -1)? -1 : obj.attr("id")) + " url=" + this.url);

            self._noteLoadFailureId(this.id, true); // add id to load failure list

            self._removeFromBusyStack('j', obj === -1 ? -1 : obj.attr('id'));
            self._resolveIfBusyStackEmpty();

            var ef = self._getOptions().data.ajax.error; // reget the options
            if (ef) {
              // without our updated ajax
              ef.call(self, x, status, e); // changes to avoid forever loop
            }

            if (obj !== -1 && obj.length) {
              obj.children('a.oj-tree-loading').removeClass(OJT_LOADING);
              obj.removeData('oj-tree-is-loading');
              if (status === 'success' && self._data.ds.correctState) {
                self._correct_state(obj);
              }
            } else if (status === 'success' && self._data.ds.correctState) {
              self._$container_ul.empty();
              self._applyEmptyText(); // no tree data
            }
            if (errorCallback) {
              errorCallback.call(self);
            }
          };

          successFunc = function (d, status, x) {
            var self = this.ctx; // get the tree's this
            var parent;

            self._noteLoadFailureId(this.id, false); // if this id is in the failure list, remove
            self._removeFromBusyStack('j', obj === -1 ? -1 : obj.attr('id'));

            var sf = self._getOptions().data.ajax.success; // reget the options
            if (sf) {
              // without our updated ajax
              d = sf.call(self, d, status, x) || d; // changes to avoid forever loop
            }

            if (d === '' || (d && d.toString && d.toString().replace(/^[\s\n]+$/, '') === '')) {
              return errorFunc.call(self, x, status, '');
            }

            // console.log("Ajax SUCCESS HTML id='" + this.id + "' obj.id=" +
            //              ((obj === -1)? -1 : obj.attr("id")) + " url=" + this.url);
            if (d) {
              d = $(d);
              if (!d.is('ul')) {
                d = $('<ul></ul>').append(d); // @HTMLUpdateOK
              }
              if (obj === -1 || !obj) {
                self._$container_ul
                  .empty()
                  .append(d.children()) // @HTMLUpdateOK
                  .find('li, a')
                  .filter(function () {
                    return (
                      !self.firstChild ||
                      !self.firstChild.tagName ||
                      self.firstChild.tagName !== 'INS'
                    );
                  })
                  .prepend("<ins class='oj-tree-icon'>&#160;</ins>") // @HTMLUpdateOK
                  .end()
                  .filter('a')
                  .children('ins:first-child')
                  .not('.oj-tree-node-icon')
                  .addClass(OJT_NICON)
                  .addClass(OJT_ICON);

                self._$container_ul
                  .find('li.oj-tree-leaf ins:first-child')
                  .removeClass(OJ_DISC)
                  .removeClass(OJT_NICON)
                  .addClass(OJT_ICON);
                parent = self._$container_ul;
              } else {
                obj.children('a.oj-tree-loading').removeClass(OJT_LOADING);

                self._removeEmptyUL(obj);

                obj
                  .append(d) // @HTMLUpdateOK
                  .children('ul')
                  .find('li, a')
                  .filter(function () {
                    return (
                      !self.firstChild ||
                      !self.firstChild.tagName ||
                      self.firstChild.tagName !== 'INS'
                    );
                  })
                  .prepend("<ins class='oj-tree-icon'>&#160;</ins>") // @HTMLUpdateOK
                  .end()
                  .filter('a')
                  .children('ins:first-child')
                  .not('.oj-tree-node-icon')
                  .addClass(OJT_NICON)
                  .addClass(OJT_ICON);
                obj.removeData('oj-tree-is-loading');

                obj
                  .find('li.oj-tree-leaf ins:first-child')
                  .removeClass(OJ_DISC)
                  .removeClass(OJT_NICON)
                  .addClass(OJT_ICON);
                parent = obj;
              }

              //  Look for parents with empty children <ul> list (lazy loading),
              //  and add the closed class to make it a parent.
              self._handleHtmlParentNoChildren(parent);

              //  Add the <a> text <span> for hover/click styling
              self._insertHtmlTextSpan(parent);

              //  Escape all Ajax loaded node text for security
              var nodes = parent.children('UL');
              if (nodes.length >= 1) {
                nodes = nodes.first().find('span.oj-tree-title');
                $.each(nodes, function () {
                  this.textContent = self._escapeHtml(this.textContent);
                });
              }

              // If "default" type defined, apply to nodes with no assoc type
              if (self._data.types.defType && parent) {
                self._addDefType(this._$container_ul);
              }

              self._cleanNode(obj);
              if (successCallback) {
                successCallback.call(self);
              }
            } else {
              if (obj && obj !== -1) {
                obj.children('a.oj-tree-loading').removeClass(OJT_LOADING);
                obj.removeData('oj-tree-is-loading');
                if (self._data.ds.correctState) {
                  self._correct_state(obj);
                  if (successCallback) {
                    successCallback.call(self);
                  }
                }
              } else if (self._data.ds.correctState) {
                self._$container_ul.empty();
                if (successCallback) {
                  successCallback.call(self);
                }
              }
              self._$container_ul.find('ul').attr(WA_ROLE, WA_GROUP); // @HTMLUpdateOK
              self._$container_ul.find('li').attr(WA_ROLE, WA_TREEITEM); // @HTMLUpdateOK
            }
            return undefined;
          };

          //  Prepare for an asynchronous ajax op. (note: we are updating a copy of the options)

          var nodeId = obj === -1 ? -1 : obj.attr('id');
          this._busyStack.push({ op: 'j', id: nodeId });
          this._addBusyState(
            "Tree (id='" + this._elemId + "') : node id='" + nodeId + "' is lazyloading."
          );
          // console.log("ajax HTML load (" + nodeId + ") . . . busyStack=" + this._arrayToStr(this._busyStack));

          var reqContext = { ctx: this, id: nodeId };
          s.ajax.context = reqContext;
          s.ajax.error = errorFunc;
          s.ajax.success = successFunc;

          if (!s.ajax.dataType) {
            s.ajax.dataType = 'html';
          }
          reqContext.type = s.ajax.dataType;

          if ($.isFunction(s.ajax.url)) {
            s.ajax.url = s.ajax.url.call(this, obj);
            reqContext.url = s.ajax.url;
          }
          if ($.isFunction(s.ajax.data)) {
            s.ajax.data = s.ajax.data.call(this, obj);
          }
          $.ajax(s.ajax);
          break;
        default:
          break;
      }
    },

    /**
     *   Look for parents with empty children <ul> list (lazy loading), and add the closed
     *   class to make it a parent.
     *   @private
     */
    _handleHtmlParentNoChildren: function (parent) {
      var lazy = parent.find(parent.is('ul') ? 'li ul' : 'ul').filter(function () {
        return (
          !this.firstChild ||
          this.childNodes.length === 0 ||
          (this.childNodes.length === 1 && this.firstChild.nodeType === 3)
        );
      });
      $.each(lazy, function () {
        $(this).closest('li').addClass(TreeUtils._OJ_COLLAPSED);
      });
    },

    /**
     *   Remove an empty <ul> in a node (lazy loading).
     *   @private
     */
    _removeEmptyUL: function (parent) {
      var l = parent.find('ul').filter(function () {
        return (
          !this.firstChild ||
          this.childNodes.length === 0 ||
          (this.childNodes.length === 1 && this.firstChild.nodeType === 3)
        );
      });
      if (l.length > 0) {
        l.remove();
      }
    },

    /**
     *   Load an HTML <ul><li>...</ul> markup string
     *   @private
     */
    // eslint-disable-next-line no-unused-vars
    _loadHtmlString: function (s, obj, successCallback, errorCallback) {
      var parent;

      if (s && s !== '' && s.toString && s.toString().replace(/^[\s\n]+$/, '') !== '') {
        s = $(s);
        if (!s.is('ul')) {
          s = $('<ul></ul>').append(s); // @HTMLUpdateOK
        }

        if (obj === -1 || !obj) {
          this._$container_ul
            .empty()
            .append(s.children()) // @HTMLUpdateOK
            .find('li, a')
            .filter(function () {
              return (
                !this.firstChild || !this.firstChild.tagName || this.firstChild.tagName !== 'INS'
              );
            })
            .prepend("<ins class='oj-tree-icon oj-tree-disclosure-icon'>&#160;</ins>") // @HTMLUpdateOK
            .end()
            .filter('a')
            .children('ins:first-child')
            .not('.oj-tree-node-icon')
            .addClass(OJT_NICON)
            .addClass(OJT_ICON);

          this._$container_ul
            .find('li.oj-tree-leaf ins:first-child')
            .removeClass(OJ_DISC)
            .removeClass(OJT_NICON)
            .addClass(OJT_ICON);

          parent = this._$container_ul;

          //  No point in checking for empty parent <ul> because we don't have a
          //  "data" option in the first place, so no lazy loading posssible.

          //  If the "default" node type has been defined, add the def type to any nodes
          //  that have not been given an explicit type
          this._addDefType(this._$container_ul);
        } else {
          obj.children('a.oj-tree-loading').removeClass(OJT_LOADING);
          obj
            .append(s) // @HTMLUpdateOK
            .children('ul')
            .find('li, a')
            .filter(function () {
              return (
                !this.firstChild || !this.firstChild.tagName || this.firstChild.tagName !== 'INS'
              );
            })
            .prepend("<ins class='oj-tree-icon'>&#160;</ins>") // @HTMLUpdateOK
            .end()
            .filter('a')
            .children('ins:first-child')
            .not('.oj-tree-node-icon')
            .addClass('oj-tree-node-icon')
            .addClass('oj-tree-icon');
          obj.removeData('oj-tree-is-loading');

          parent = obj;

          //  If the "default" node type has been defined, add the def type to
          //  any nodes that have not been given an explicit type
          this._addDefType(this.obj);
        }

        //  Add the <a> text <span> for hover/click styling
        if (parent) {
          this._insertHtmlTextSpan(parent);
        }

        //  Escape all node text for security
        var nodes = parent.children('UL');
        if (nodes.length >= 1) {
          nodes = nodes.first().find('span.oj-tree-title');
          var _this = this;
          $.each(nodes, function () {
            this.textContent = _this._escapeHtml(this.textContent);
          });
        }

        this._cleanNode(obj);
        if (successCallback) {
          successCallback.call(this);
        }
      } else if (obj && obj !== -1) {
        obj.children('a.oj-tree-loading').removeClass(OJT_LOADING);
        obj.removeData('oj-tree-is-loading');
        if (this._data.ds.correctState) {
          this._correct_state(obj);
          if (successCallback) {
            successCallback.call(this);
          }
        }
      } else if (this._data.ds.correctState) {
        this._$container_ul.empty();
        if (successCallback) {
          successCallback.call(this);
        }
      }
    },

    /**
     *  Insert the <a> text <span> for hover/click styling
     *  @private
     */
    _insertHtmlTextSpan: function (elem) {
      $.each(elem.find('li a'), function (i, val) {
        var ih = val.innerHTML; // @HTMLUpdateOK
        ih = ih.replace('ins>', "ins><span class='" + OJT_TITLE + "'>");
        ih += '</span>';
        val.innerHTML = ih; // @HTMLUpdateOK
      });
    },

    /**
     *  Add the "default" type attr to all nodes that do not have an explicit type defined.
     *  @private
     */
    _addDefType: function (obj) {
      if (this._data.types.defType) {
        var s = this.options.types;
        var typeAttr = s ? s.attr : this._data.types.defaults.attr;

        $.each(obj.find('li'), function (i, val) {
          val = $(val);
          if (!val.attr(typeAttr)) {
            val.attr(typeAttr, 'oj-tree-deftype').addClass(OJT_TYPE); // @HTMLUpdateOK
          }
        });
      }
    },

    /**
     *  @private
     */
    _save_opened: function () {
      var _this = this;
      this._data.core.toExpand = [];
      this._$container_ul.find('li.oj-expanded').each(function () {
        if (this.id) {
          _this._data.core.toExpand.push(
            '#' +
              this.id
                .toString()
                .replace(/^#/, '')
                .replace(/\\\//g, '/')
                .replace(/\//g, '\\/')
                .replace(/\\\./g, '.')
                .replace(/\./g, '\\.')
                .replace(/:/g, '\\:')
          );
        }
      });

      // this._emitEvent(_this._data.core.toExpand, "save_opened", true);
    },

    /**
     *  Reload tree nodes
     *  If this is not a callback request, then if initExpanded is defined,
     *  any specified (or all) collapsed nodes are  expanded (loading if neccesaary
     *  because of lazy-loading).
     *  @param {boolean=} bIsCallback  true if this method has been called from within this method.
     *  @private
     */
    _reload_nodes: function (bIsCallback) {
      var _this = this;
      var bDone = true;
      var current = [];
      var remaining = [];

      if (!bIsCallback) {
        this._data.core.reopen = false;
        this._data.core.refreshing = true;
      }

      // If option initExpanded "all", make list of nodes to expand
      if (this._isOptExpandAll()) {
        this._data.core.toExpand = [];
        this._$container_ul.find('li.oj-collapsed').each(function () {
          var id = '#' + $(this).attr('id');
          if (!_this.isExpanded(id)) {
            if (!_this._isLoadFailureId(id)) {
              _this._data.core.toExpand.push(id);
            }
          }
        });
      }

      this._data.core.toExpand = $.map($.makeArray(this._data.core.toExpand), function (n) {
        return (
          '#' +
          n
            .toString()
            .replace(/^#/, '')
            .replace(/\\\//g, '/')
            .replace(/\//g, '\\/')
            .replace(/\\\./g, '.')
            .replace(/\./g, '\\.')
            .replace(/:/g, '\\:')
        );
      });

      this._data.core.toLoad = $.map($.makeArray(this._data.core.toLoad), function (n) {
        return (
          '#' +
          n
            .toString()
            .replace(/^#/, '')
            .replace(/\\\//g, '/')
            .replace(/\//g, '\\/')
            .replace(/\\\./g, '.')
            .replace(/\./g, '\\.')
            .replace(/:/g, '\\:')
        );
      });

      if (this._data.core.toExpand.length) {
        this._data.core.toLoad = this._data.core.toLoad.concat(this._data.core.toExpand);

        // Remove duplicates
        this._data.core.toLoad = this._data.core.toLoad.reduce(function (a, b) {
          if (a.indexOf(b) < 0) a.push(b);
          return a;
        }, []);
      }

      // Analyse combined expand/load list and create current and remaining arrays.

      if (this._data.core.toLoad.length) {
        $.each(this._data.core.toLoad, function (i, val) {
          if (val === '#') {
            return true;
          }
          var n = _this._$container.find(val);
          if (n.length) {
            // is node in the tree
            if (!_this.isExpanded(val)) {
              // and not expanded
              current.push(val); // yes.
            }
          } else {
            remaining.push(val); // no.
          }
          return undefined;
        });

        if (current.length) {
          this._data.core.toLoad = remaining;
          $.each(current, function (i, val) {
            if (!_this._isLoaded(val)) {
              // if load not loaded,
              _this._load_node(
                val, // load it.
                function () {
                  _this._reload_nodes(true);
                }, // success func
                function () {
                  _this._reload_nodes(true);
                } // error func
              );
              bDone = false; // note we're not complete yet since we just loaded a node
            }
          });
        }
      }

      //  Expand the nodes referred to.

      if (this._data.core.toExpand.length) {
        $.each(this._data.core.toExpand, function (i, val) {
          if (!_this.isExpanded(val)) {
            _this._expand(val, false, true); // no animation for initExpand
          }
        });
      }

      if (bDone) {
        // TODO: find a more elegant approach to syncronizing returning requests

        if (this._data.core.reopen) {
          clearTimeout(this._data.core.reopen);
        }
        this._data.core.reopen = setTimeout(function () {
          _this._emitEvent({}, 'reload_nodes', true);
          _this._resolveIfBusyStackEmpty(); // there may be nothing to expand
        }, 50);
        this._data.core.refreshing = false;
        this._reopen(); // check expanded and selections
      }
    },

    /**
     *   Not exposed in V1
     *   @private
     */
    setTheme: function (themeName, themeUrl) {
      if (!themeName) {
        return false;
      }

      if (!themeUrl) {
        themeUrl = this._data.themes._themes + themeName + '/style.css';
      }

      if ($.inArray(themeUrl, this._data.themes.themes_loaded) === -1) {
        _addSheet({ url: themeUrl });
        this._data.themes.themes_loaded.push(themeUrl);
      }

      if (this._data.themes.theme !== themeName) {
        this._$container.removeClass('oj-tree-' + this._data.themes.theme);
        this._data.themes.theme = themeName;
      }

      this._$container.addClass('oj-tree-' + themeName);

      if (!this._data.themes.dots) {
        this._hideDots();
      } else {
        this._showDots();
      }

      if (!this._data.themes.icons) {
        this._hideIcons();
      } else {
        this._showIcons();
      }

      //     this._emitEvent(null, "set_theme", true);
      return undefined;
    },

    /*
     *   Shows the hierarchy lines.  Not used in V1
     *   @private
     */
    /*
    "show_dots"  : function ()
    {
      this._showDots() ;
    },
*/
    /*
     *   Hides the hierarchy lines.  Not used in V1
     *   @private
     */
    /*
    "hide_dots"   : function ()
    {
      this._hideDots() ;
    },
*/
    /*
     *   Toggles the current hierarchy line state.  Not used in V1
     *   @private
     */
    /*
    "toggle_dots" : function ()
    {
       if (this._data.themes.dots) {
         this._hideDots();
       }
       else  {
         this._showDots"]();
       }
    },
*/

    /**
     *   @private
     */
    _isTheme: function () {
      return this._data.themes != null;
    },

    /**
     *   @private
     */
    _getTheme: function () {
      return this._data.themes.theme;
    },

    /**
     *   Returns true if node icons are currently displayed.  Users can find this state from options.
     *   @private
     */
    isIcons: function () {
      return this._data.themes.icons;
    },

    /**
     *   Displays node icons. Users can set this state from options.
     *   @private
     */
    _showIcons: function () {
      this._data.themes.icons = true;
      this._$container.children('ul').removeClass('oj-tree-no-icons');
    },

    /**
     *   Hides node icons. Users can set this state from options.
     *   @private
     */
    _hideIcons: function () {
      this._data.themes.icons = false;
      this._$container.children('ul').addClass('oj-tree-no-icons');
    },

    /**
     *   Toggles the display state of node icons. User can set this state from options.
     *   @private
     */
    toggleIcons: function () {
      /*                                      Not used in V1
       if (this.data.themes.icons) {
         this._hideIcons();
       }
       else  {
         this._showIcons();
       }
*/
    },

    /**
     *   Enables keyboard support
     *   @private
     */
    _enableKeys: function () {
      this._data.keys.enabled = true;
    },

    //  /**
    //    *   Disables keyboard support
    //    *   @private
    //    */
    //         Not used in V1
    //  _disableKeys : function ()
    //  {
    //     this._data.keys.enabled = false;
    //  },
    //

    /**
     *   Initializes the widget, examining options and setting up
     *   internal data structures.
     *   @private
     */
    _initTree: function () {
      this._initData();
      this._initCoreOpts();
      this._initUIOpts();
      //      this._initCrrmOpts() ;      // not in V1
      //      this._initThemeOpts()       // not in V1
      this._initDSOpts(true);
      this._initTypeOpts();
      this._getDndContext().initDnDOpts();
      this._initMenuOpts();

      this._initCore();
      this._initUI();
      this._initThemes();
      this._initDataSource();
      //      this._initCrrm() ;          // not in V1
      this._initTypes();
      this._getDndContext().initDnD();
      this._initKeys();
      this._initMenu();
    },

    /**
     *  Emit events
     *  @param {Object} data an object containing details about the event.
     *  @param {string} evname the raw event name (e.g. "hover", or "expandAll".
     *                          When the event is fired, it is "ojhover" and "ojexpandall",
     *                          but also the options "hover" and "expandAll" are called.
     *  @param {boolean=} bInternal true if an internal event, or omit or set false for
     *                              a public event.
     *  @private
     */
    _emitEvent: function (data, evname, bInternal) {
      if (!evname || $.type(evname) !== 'string') {
        return undefined;
      }
      if (
        this._data.core.locked === true &&
        evname !== 'unlock' &&
        evname !== 'isLocked' &&
        evname !== 'lock'
      ) {
        return undefined;
      }

      // console.log("Event " +  evname + (evname === "before"? " (" + data["func"] + ")" : "") +
      //             " public=" + (bInternal? false : true));

      var args = Array.prototype.slice.call(arguments);
      var inst = this._$container;
      var isBefore = evname === 'before';
      var isPublic = !bInternal;

      if (!isPublic) {
        // internal event?
        evname = '_tree' + evname;
      }

      // Build the "ui" argument
      var eventdata = {};
      eventdata.item = data ? data.obj : undefined;
      eventdata.inst = inst;

      if (isBefore) {
        var func = data.func; // target method
        eventdata.func = func;
        eventdata.args = args;
        if (func === 'rename') {
          eventdata.title = data.title;
          eventdata.prevTitle = data.prevTitle;
        }
      } else if (isPublic) {
        if (evname === 'move') {
          eventdata.position = data.p; // position relative to the reference node
          eventdata.reference = data.r; // the reference node
          eventdata.data = data; // (req'd internally)
        } else if (evname === 'rename') {
          eventdata.title = data.title; // the new node title to be
          eventdata.prevTitle = data.prevTitle; // the current title
        } else if (evname === 'remove') {
          // node was deleted via context menu
          eventdata.parent = data.parent; // parent node
          eventdata.prev = data.prev; // the "previous" node
        } else if (evname === 'delete') {
          // node was deleted via context menu
          eventdata.prev = data.prev; // (req'd internally) - the "previous" node
          eventdata.parent = data.parent; // parent node
        } else if (evname === 'expandAll' || evname === 'collapseAll' || evname === 'deselectAll') {
          eventdata.targ = data.targ; // the target of the op (node or -1)
        } else if (evname === 'loaded') {
          eventdata.item = -1;
        } else if (evname === 'paste') {
          eventdata.position = data.p; // position relative to the reference node
          eventdata.reference = data.r; // the reference node
        }
      }

      if (isPublic) {
        var bContinue = this._trigger(evname, new $.Event('oj' + evname), eventdata);

        if (isBefore) {
          //  console.log("Event " + evname + ") " + eventdata["func"] + " returned " + rslt);
          if (typeof bContinue !== 'undefined') {
            bContinue = !!bContinue; // returns true/false/undefined
          }
          return bContinue;
        }
      } else {
        this._$container.trigger(evname, eventdata); // internal event
      }
      return undefined;
    },

    /**
     *  Fire optionChange event
     *  @param {string}  key             the option key whose property value has been changed.
     *  @param {Object}  prevVal         the previous value prior to the change
     *  @param {Object | null}  newVal   the new value after the change
     *  @param {Event | null} origEvent  false if option change is not due to user interaction.
     *  @private
     */
    _fireOptionChangeEvent: function (key, prevVal, newVal, origEvent) {
      if (key === 'selection') {
        if (newVal == null) {
          newVal = this._getSelected();
        }

        // Only fire the event if the new and prev vals are different.

        if (!this._compareSelectionValues(prevVal, newVal)) {
          this.option(key, newVal, {
            _context: { originalEvent: origEvent, internalSet: true },
            changed: true // don't need comparison check
          });
        } // end if "selection"
      }
    },

    /**
     *  TDO _not currently used in V1
     *  @private
     */
    __rollback: function () {
      var rlbk = this.get_rollback();
      return rlbk;
    },

    /**
     *  Tree initialization is complete.  Build and render the tree.
     *  @private
     */
    _start: function () {
      if (this._isRtl) {
        this._$container.addClass('oj-tree-rtl').css('direction', 'rtl');
      }

      //  Create the outer <ul> with a temporary <li> saying "Loading..."
      // prettier-ignore
      this._$container.html( // @HTMLUpdateOK
        "<ul role='tree' tabindex='0' class='oj-tree-list' style='outline:none'" +
          (this._data.core.selectMode === -1 ? " aria-multiselectable='true'" : '') +
          ' ' +
          WA_LABELLEDBY +
          "='" +
          this._elemId +
          "'" +
          "><li class='oj-tree-last oj-tree-leaf'><ins class='oj-tree-icon'>&#160;</ins><a class='oj-tree-loading' href='#'><ins class='oj-tree-icon'>&#160;</ins>" +
          this._getString(TRANSKEY_LOADING) +
          '</a></li></ul>'
      );

      this._$container_ul = this._$container.children('ul:eq(0)');
      this._$container.data('oj-tree-instance-id', this._getIndex());

      this._data.core.li_height =
        this._$container_ul.find('li.oj-collapsed, li.oj-tree-leaf').eq(0).height() || 18;

      if (this._isTouch) {
        // for tap expand/collapse
        this._$container.delegate(
          '.oj-tree-list ins.oj-tree-disclosure-icon',
          'touchend.ojtree',
          function (event) {
            event.preventDefault(); // don't want browser click generated after 300ms
            var trgt = $(event.target);
            this.toggleExpand(trgt);
          }.bind(this)
        );
      }

      this._$container
        .delegate(
          '.oj-tree-list ins.oj-tree-disclosure-icon',
          'click.ojtree',
          function (event) {
            var trgt = $(event.target);
            // if(trgt.is("ins") && event.pageY - trgt.offset().top < this.data.core.li_height) { this.toggle_node(trgt); }
            this.toggleExpand(trgt);
          }.bind(this)
        )
        .delegate(
          '.oj-tree-list ins.oj-tree-disclosure-icon',
          'mousedown',
          function (event) {
            this._data.ui.disclosureClick = true;
            // if no prev hover/selection, this will
            // prevent hover going to 1st node when
            // a disclosure has been clicked as the first action
            // on the tree (see focus event below)
            var trgt = $(event.target);
            trgt
              .removeClass('oj-default')
              .removeClass(TreeUtils._OJ_HOVER)
              .addClass(TreeUtils._OJ_SELECTED);
          }.bind(this)
        )
        .delegate('.oj-tree-list ins.oj-tree-disclosure-icon', 'mouseup', function (event) {
          var trgt = $(event.target);
          trgt.removeClass(TreeUtils._OJ_SELECTED).addClass('oj-default');
        })
        .bind(
          'mousedown.ojtree',
          function (event) {
            this._setFocus();
            // If IE11, need preventDefault() to avoid weird
            // shift-click highlighting. Not done if HTML5 drag/drop is supported
            if (event.shiftKey) {
              if (!(this._getDndContext() && this._getDndContext().isDragEnabled())) {
                event.preventDefault();
              }
            }
          }.bind(this)
        )
        .bind('dblclick.ojtree', function () {
          var sel;
          if (document.selection && document.selection.empty) {
            document.selection.empty();
          } else if (window.getSelection) {
            sel = window.getSelection();
            try {
              sel.removeAllRanges();
              sel.collapse(document.getElementsByTagName('body')[0], 0);
            } catch (err) {
              // Ignore error
            }
          }
        });

      this._$container_ul
        .focus(
          function () {
            if (this._data.ui.disclosureClick) {
              // if very first action is
              this._data.ui.disclosureClick = false; // mousedown on a disclosure icon
              return false; // don't set hover (and prevent jump to top of list)
            }

            this._data.ui.focused = true;
            var n;

            // Tree has gained focus, highlight a node as current.
            // If no last "current" or selected, will default to the top node.
            if (this._data.ui.hovered) {
              // Check if mouse is over a node, before defaulting to another node as described above.
              n = this._data.ui.hovered;
            } else if (this._data.ui.lastHovered) {
              this._data.ui.hovered = this._data.ui.lastHovered;
              n = this._data.ui.hovered;
            } else if (this._data.ui.lastSelected && this._data.ui.lastSelected.length > 0) {
              this._data.ui.hovered = this._data.ui.lastSelected;
              n = this._data.ui.hovered;
            } else {
              n = this._$container_ul.find('li:first');
            }
            if (n) {
              this.hover(n);
              this._data.ui.lastHovered = null;

              // want color change for selected inactive to selected
              this._$container_ul.find('a.oj-selected').removeClass(OJT_INACTIVE);
            }
            return false; // prevent jump to top of list
          }.bind(this)
        )
        .blur(
          function () {
            this._data.ui.focused = false;
            this._data.ui.lastHovered = this._data.ui.hovered;
            if (this._data.ui.lastHovered) {
              this.dehover(this._data.ui.hovered);
            }
            // want color change for selected active to selected inactive
            this._$container_ul.find('a.oj-selected').addClass(OJT_INACTIVE);
          }.bind(this)
        );

      /*     Not used in V1
       if (this._data.core.load_open)   {
         this._$container
            .bind("_treeload_node", $.proxy(function (e, ui)  {
                 var o = this._getNode(ui["item"]),
                     t = this;
                 if (o === -1)  {
                   o = this._$container_ul;
                 }
                 if (!o.length)  {
                   return;
                 }
                 o.find("li.oj-expanded:not(:has(ul))").each(function ()
                     {
                        this._load_node(this, $.noop, $.noop);
                     });
            }, this));
       }
*/
      this._emitEvent({}, 'init', true); // Tree is now init'd (but nodes have not yet been added)

      this._loadNodes(); // start node loading from the datasource

      //  Tree div is now constructed, note if context menu has been set.
      if (this._data.menu.usermenu) {
        this._applyMenu();
      }

      // Add and enable this tree's keystroke handler
      _addKeyFilter({
        _handler: this._keyHandler,
        _selector: this._$container_ul,
        _this: this
      });
      this._enableKeys();
    },

    /**
     *  Initialize the Core section
     *  @private
     */
    _initCore: function () {
      this._data.core.locked = false;

      this._$container.addClass('oj-tree oj-tree-' + this._getIndex()); // TDO

      this._$container.css('outline', 'none');
      this._$container.css('MozUserSelect', 'none');
      this._$container.css('WebkitTouchCallout', 'none');
      this._$container.css('WebkitUserSelect', 'none');
      this._$container.css('-ms-user-select', 'none');
      this._$container.css('WebkitTapHighlightColor', 'rgba(0,0,0,0)');
    },

    /**
     *  Initialize the UI section handlers
     *  @private
     */
    _initUI: function () {
      this._data.ui.selected = $();
      this._data.ui.lastSelected = false;
      this._data.ui.hovered = null;
      var a = this.options.selection;

      if (a && $.type(a) === 'array' && a.length > 0) {
        this._data.ui.toSelect = a;
        this.options.selection = []; // will be updated when the selections are performed
      }

      // Bind to events

      if (this._isTouch) {
        // for tap select/deselect
        this._$container.delegate(
          '.oj-tree-list a',
          'touchend.ojtree',
          $.proxy(function (event) {
            // This becomes the hovered node
            //               if (! $(event.currentTarget).hasClass(OJT_LOADING))  {
            //                 this["hover"](event.target) ;
            //               }

            this._data.ui.touchEvent = true;
            this._handleNodeTapClick(event); // select the node, or toggle if multi-select

            //  Since this is a tap, no node is hovered
            if (!$(event.currentTarget).hasClass(OJT_LOADING)) {
              this.dehover();
            }
          }, this)
        );
      }

      // -----------------------------------------------------------------//
      //  Handle events (particularly post operation events like move()  //
      //  remove(), collapse(), etc.                                     //
      // -----------------------------------------------------------------//

      this._$container
        .delegate(
          '.oj-tree-list a',
          'click.ojtree',
          function (event) {
            this._data.ui.touchEvent = false;
            this._handleNodeTapClick(event);
          }.bind(this)
        )
        .delegate(
          '.oj-tree-list a',
          'mouseenter.ojtree',
          function (event) {
            if (!$(event.currentTarget).hasClass(OJT_LOADING)) {
              this.hover(event.target);
            }
          }.bind(this)
        )
        .delegate(
          '.oj-tree-list a',
          'mouseleave.ojtree',
          function (event) {
            if (!$(event.currentTarget).hasClass(OJT_LOADING)) {
              this.dehover(event.target);
            }
          }.bind(this)
        )
        .delegate(
          '.oj-tree-list .oj-tree-disclosure-icon',
          'mouseenter.ojtree',
          function (event) {
            if (!$(event.currentTarget).hasClass(OJT_LOADING)) {
              this._disclosureHover(event.target, true);
            }
          }.bind(this)
        )
        .delegate(
          '.oj-tree-list .oj-tree-disclosure-icon',
          'mouseleave.ojtree',
          function (event) {
            if (!$(event.currentTarget).hasClass(OJT_LOADING)) {
              this._disclosureHover(event.target, false);
            }
          }.bind(this)
        )
        .bind(
          '_treereopen',
          function () {
            this._reselect();
          }.bind(this)
        )
        .bind(
          '_treeget_rollback',
          function () {
            this.dehover();
            this._saveSelected();
          }.bind(this)
        )
        /*   Not used in V1
             .bind("_treeset_rollback", $.proxy(function ()
             {
             this["reselect"]();
             }, this))
        */
        .bind(
          'ojcollapse',
          function (event, ui) {
            var obj = this._getNode(ui.item);
            var clk = obj && obj.length ? obj.children('ul').find('a.oj-selected') : $();
            var _this = this;

            if (this.options.selectedParentCollapse === false || !clk.length) {
              return;
            }
            clk.each(function () {
              if (_this.options.selectedParentCollapse === 'selectParent') {
                _this.deselect(this);
                _this.select(obj);
              } else if (_this.options.selectedParentCollapse === 'deselect') {
                _this.deselect(this);
              }
            });
          }.bind(this)
        )
        .bind(
          'ojremove',
          function (event, ui) {
            // node delete
            var s = this.options.selectPrevOnDelete;
            var obj = this._getNode(ui.item);
            var clk = obj && obj.length ? obj.find('a.oj-selected') : [];
            var _this = this;

            clk.each(function () {
              _this.deselect(this);

              // Remove lastHovered if it refers to the node removed
              if (_this._data.ui.lastHovered) {
                var n = _this._getNode(this);
                if (n && _this._data.ui.lastHovered.attr('id') === n.attr('id')) {
                  _this._data.ui.lastHovered = null;
                }
              }
            });
            if (s && clk.length) {
              if (ui.prev) {
                ui.prev.each(function () {
                  if (this.parentNode) {
                    _this.select(this);
                    return false; // if return false is removed all prev nodes will be selected
                  }
                  return undefined;
                });
              }
            }
          }.bind(this)
        )
        .bind('ojmove', function (event, ui) {
          var data = ui.data;
          var copy = data.cy;

          if (copy && data.oc) {
            data.oc.find('a.oj-selected').removeClass(TreeUtils._OJ_SELECTED);
            data.oc.removeAttr(WA_SELECTED);
          }

          // If the node being moved (not copied) is from a different
          // tree, and the node was noted as lastHovered or lastSelected
          // in the tree when it lost focus, clear that tree's lastHovered/
          // lastSelected.

          if (data.ot !== data.rt && !copy) {
            // different trees and a move op?
            var p = data.ot._data.ui;
            if (p.lastHovered) {
              if (data.o.attr('id') === p.lastHovered.attr('id')) {
                p.lastHovered = null;
              }
              if (p.lastSelected) {
                if (data.o.attr('id') === p.lastSelected.attr('id')) {
                  p.lastSelected = null;
                }
              }
            }
          }
        });
    },

    /**
     *  Initialize the data source
     *  @private
     */
    _initDataSource: function () {
      this._initTreeData();
      this._initJsonData();
      this._initHtmlData();
    },

    /**
     *  Initialize the tree data source
     *  @private
     */
    _initTreeData: function () {
      if (this._data.ds.type === DS_TREE) {
        this._tds = this.options.data || null; // the tree data source
        this._load_node = this._load_node_DS;
        this._isLoaded = this._isLoaded_DS;
        this._refresh = this._refresh_DS;
      }
    },

    /**
     *  Initialize the json_data section if requested
     *  @private
     */
    _initJsonData: function () {
      if (this._data.ds.type === DS_JSON) {
        if (this._data.ds.progressiveUnload) {
          this._$container.bind('_treeafter_close', function (e, ui) {
            ui.item.children('ul').remove();
          });
        }

        this._load_node = this._load_node_J;
        this._isLoaded = this._isLoaded_J;
        this._refresh = this._refresh_json;
      }
    },

    /**
     *  Initialize html_data support if requested.
     *  @private
     */
    _initHtmlData: function () {
      if (this._data.ds.type !== DS_HTML) {
        return;
      }

      this._processExistingMarkup(); // check for existing markup in the div

      this._load_node = this._load_node_H;
      this._isLoaded = this._isLoaded_H;
      this._refresh = this._refresh_ui;
    },

    /**
     *  If there is existing html markup in the div, clone it and move it to another div.
     *  @private
     */
    _processExistingMarkup: function () {
      if (!this._data.html.useExistingMarkup) {
        return;
      }

      if (!this._data.html.markup_ul) {
        // first time find the user <ul>
        this._data.html.markup_ul = this._$container.find(' > ul'); // user's <ul>

        // Move the user <ul> in the tree div to another div so that it is still in the DOM,
        // and can be located by the app, changed, and refresh() called if desired, and so it
        // will not interfere with the <ul> we maintain for the tree in the tree div. If the
        // app wants to change the markup, it must find its <ul> first and then find node id's
        // from it if it needs to, because the <ul> has been cloned and the id's will
        // therefore be duplicated.
        // TDO - we need to have a better way to do this.

        this._data.html.markup = this._data.html.markup_ul.find(' > li'); // user's <li>'s
        this._data.html.cloneMarkup = this._data.html.markup.clone(true); // our clone of the <li>'s

        // this used to use html() and clean the whitespace, but this way any attached data was lost
        // remove white space from LI node - otherwise nodes appear a bit to the right
        this._data.html.cloneMarkup
          .find('li')
          .addBack()
          .contents()
          .filter(function () {
            return this.nodeType === 3;
          })
          .remove();

        this._transformElemIds(this._data.html.markup_ul); // make user's markup id's unique

        this._data.html.markup_div = $(
          "<div id='" + USER_UL_ID_PREFIX + this._getIndex() + "' style='display:none'>"
        ).append(this._data.html.markup_ul); // @HTMLUpdateOK
        this._$container.after(this._data.html.markup_div); // @HTMLUpdateOK
      }
    },

    /**
     *  Transform the supplied element Id attributes to make them unique. The tree index is prepended
     *  withe tree index.
     *  @private
     */
    _transformElemIds: function (markup) {
      var $nodes = $(markup).find('li');
      var index = this._getIndex();

      $nodes.each(function (i, node) {
        node.setAttribute('id', index + '_' + node.getAttribute('id'));
      });
    },

    /**
     *  Untransform the supplied element Id attributes by removing the prepended tree index
     *  (see _transformElemIds).
     *  @private
     */
    _unTransformElemIds: function (markup) {
      var $nodes = $(markup).find('li');

      $nodes.each(function (i, node) {
        var id = node.getAttribute('id');
        var n = id.indexOf('_');
        id = id.substr(n + 1); // original user id follows the underscore
        node.setAttribute('id', id);
      });
    },

    /**
     *  Initialize the Themes section   Not used in V1
     *  @private
     */
    _initThemes: function () {
      /*
        // autodetect themes path
        if (this._data.themes._themes === false)  {
           $("script").each(function ()
            {
              if( this.src.toString().match(/jquery\.oj-tree[^\/]*?\.js(\?.*)?$/))  {
                 this._data.themes._themes = this.src.toString().replace(/jquery\.oj-tree[^\/]*?\.js(\?.*)?$/, "") + 'themes/';
                 return false;
              }
            });
        }
*/
      if (this._data.themes._themes === false) {
        this._data.themes._themes = 'themes/';
      }

      this._$container
        .bind(
          '_treeinit',
          $.proxy(function () {
            var s = this.options;

            this._data.themes.dots = s.dots;
            this._data.themes.icons = s.icons;
            this.setTheme(this._data.themes.theme, this._data.themes.url);
          }, this)
        )

        .bind(
          'ojloaded',
          $.proxy(function () {
            // bound here too, as simple HTML tree's won't honor dots & icons otherwise
            if (!this._data.themes.dots) {
              this._hideDots();
            } else {
              this._showDots();
            }
            if (!this._data.themes.icons) {
              this._hideIcons();
            } else {
              this._showIcons();
            }
          }, this)
        );
    },

    /**
     *  Initialize the icon type functionality
     *  @private
     */
    _initTypes: function () {
      var s = this.options.types;
      if (!s) {
        return;
      }

      this._$container
        .bind(
          '_treeinit',
          $.proxy(function () {
            var types = $.extend(true, {}, s.types);
            var attr = s.attr || this._data.types.defaults.attr;
            var iconsCss = '';
            var _this = this;

            $.each(types, function (i, tp) {
              $.each(tp, function (k) {
                if (!/^(maxDepth|maxChildren|icon|validChildren)$/.test(k)) {
                  _this._data.types.attachTo.push(k);
                }
              });

              // For ojTree we allow image and position props to not
              // have to be in an icon object like jsTree.
              var ot = typeof tp.icon;
              if (ot === 'undefined') {
                ot = typeof tp.image;
                if (ot === 'boolean' && !tp.image) {
                  tp.image = 'ojt$none';
                } else if (!tp.image && !tp.position) {
                  return true;
                }

                tp.icon = {};
                if (tp.image) {
                  tp.icon.image = tp.image;
                  delete tp.image;
                }

                if (tp.position !== undefined) {
                  tp.icon.position = tp.position;
                  delete tp.position;
                }
              }

              if (tp.icon.image || tp.icon.position) {
                if (i === 'default') {
                  _this._data.types.defType = true; // note that the "default" type has been defined       iconsCss += '.oj-tree-' + _this._getIndex() + ' a > .oj-tree-icon { ';
                  iconsCss +=
                    '.oj-tree-' +
                    _this._getIndex() +
                    ' .oj-tree-list li.oj-tree-type a > .oj-tree-node-icon { ';
                  iconsCss += _this._addTypeCss(tp, iconsCss);
                  iconsCss += '} ';
                  iconsCss +=
                    '.oj-tree-' +
                    _this._getIndex() +
                    ' .oj-tree-list li[' +
                    attr +
                    '="oj-tree-deftype"].oj-tree-type > a ins.oj-tree-node-icon { ';
                } else if (tp.icon.image) {
                  iconsCss +=
                    '.oj-tree-' +
                    _this._getIndex() +
                    ' .oj-tree-list li[' +
                    attr +
                    '="' +
                    i +
                    '"].oj-tree-type > a > ins.oj-tree-node-icon { ';
                }

                iconsCss += _this._addTypeCss(tp, iconsCss);
                iconsCss += '} ';
              }
              return undefined;
            });

            if (iconsCss !== '') {
              _addSheet({ str: iconsCss, title: 'oj-tree-types' });
            }
          }, this)
        )
        .bind(
          'ojbefore',
          function (e, data) {
            var func = data.func;
            var item = data.item;
            var o = this._data.types.defaults.useData ? this._getNode(item) : false;
            var d = o && o !== -1 && o.length ? o.data('oj-tree') : false;

            if (d && d.types && d[func] === false) {
              e.stopImmediatePropagation();
              return false;
            }

            if ($.inArray(func, this._data.types.attachTo) !== -1) {
              if (!data.item || (!data.item.tagName && !data.item.jquery)) {
                return undefined;
              }

              if (!this._canTypedNodeMove(item, func)) {
                e.stopImmediatePropagation();
                return false;
              }
            }
            return undefined;
          }.bind(this)
        );
    },

    /**
     *  Add css for the type.
     *  @private
     */
    _addTypeCss: function (tp) {
      var css = '';

      if (tp.icon.image !== 'ojt$none') {
        css += ' background-image:url(' + tp.icon.image + '); ';
      } else {
        css += ' background-image:none; ';
      }

      if (tp.icon.position) {
        css += ' background-position:' + tp.icon.position + '; ';
      } else {
        css += ' background-position:0 0; ';
      }
      return css;
    },

    /*
     *  Returns the DnD support context object.
     *  @private
     */
    _getDndContext: function () {
      if (!this._TreeDndContext) {
        this._TreeDndContext = new oj.TreeDndContext(this);
      }
      return this._TreeDndContext;
    },

    /*
     *  Initialize the context menu cut/copy/paste/remove/rename support.
     *  @private
     */
    /*                                Not currently used in V1
     _initCrrm :  function()
     {
        this._$container
               .bind("ojmove",
                    $.proxy(function (e, data)
                              {
                                //if (this.options["crrm"]["move"]["openOnMove"])
                                if (this._data.crrm.defaults["move"]["openOnMove"]) {
                                  var t = this;
//
//                                data.rslt.np.parentsUntil(".oj-tree").addBack()
//                                                                     .filter(".oj-tree-closed")
//                                                                     .each(function ()
//                                                                       {
//                                                                        t["expand"](this, false, true);
//                                                                       });
//
                                }
                              }, this));
     },
*/

    /**
     *  Initialize keyboard support
     *  @private
     */
    _initKeys: function () {},

    /**
     *  Initialize the context menu.  This is called on startup, or on option
     *  "contextMenu" change.
     *  @param {Object=} newVal   true if called because of an option change.
     *  @private
     */
    _initMenu: function (newVal) {
      var menu;

      // Temp code for M6 to clear .  Once the new methods
      // are in place via Max and Jim, this whole mechanism will change.

      if (!newVal && !this.options.contextMenu) {
        menu = this._$container.attr('contextmenu'); // check for attribute
        if (menu) {
          this.options.contextMenu = '#' + menu;
        }
      }

      menu = newVal || this.options.contextMenu;
      if (!menu) {
        return;
      }

      var $m = $(menu); // get the user's <ul> list
      if ($m.length > 0) {
        $m.css('display', 'none'); // ensure it's not visible
        var dm = this._data.menu;
        dm.$container = $m;
        dm.usermenu = true; // have a context menu
      }

      if (this._data.menu.usermenu) {
        // if we have a context menu
        if (newVal) {
          // and it is being changed
          this._applyMenu(); // complete menu creation/attachnment
        }
      }

      //  If not a new val from options, Menu will be noted at the end of initialization in _start()
    },

    /**
     *   Check menu selected to see if it one of our predefined remove/cut/copy/paste id's
     *   @private
     */
    _handleContextMenuSelect: function (ev, ui) {
      //  Make sure its a menu ojselect and not from ojTree
      if (ui.inst) {
        return;
      }

      // There may be multiple trees sharing (and thereby listening to) the same
      // context menu.  Check that this tree is the same as the tree on which the
      // menu was invoked.
      if (this._data.menu.treeDivId !== this._elemId) {
        return;
      }

      var id = ui ? ui.item.attr('id') : undefined;

      if (id === 'ojtreecopy') {
        this._crrm_copy(this._data.menu.node);
      } else if (id === 'ojtreecut') {
        this._crrm_cut(this._data.menu.node);
      } else if (id === 'ojtreepaste' || id === 'ojtreepastebefore' || id === 'ojtreepasteafter') {
        this._crrm_paste(this._data.menu.node, id);
      } else if (id === 'ojtreeremove') {
        if (this._isSelected(this._data.menu.node)) {
          this._crrm_remove();
        } else {
          this._crrm_remove(this._data.menu.node);
        }
      } else if (id === 'ojtreerename') {
        this._crrm_rename(this._data.menu.node);
      } else if (id === 'ojtreecreate') {
        this._crrm_create(this._data.menu.node);
      }
    },

    /**
     *  Notification that the user has invoked the context menu via the default
     *  gestures: right-click, pressHold, and Shift-F10.
     *  We ensure that focus returns to the tree if the menu is dismissed in
     *  some way via the keyboard.
     *  @param {Object} menu       The JET Menu to open as a context menu
     *  @param {Event}  event      Triggering event
     *  @param {string} eventType  Triggering event type (e.g. 'keyboard', 'mouse', 'touch')
     *  @private
     */
    _NotifyContextMenuGesture: function (menu, event, eventType) {
      // this._trace("_NotifyContextMenuGesture() eventType=" + eventType + " event.type=" + event.type) ;
      var keyboard = eventType === 'keyboard';

      if (event.type !== 'contextmenu' && !keyboard && eventType !== 'touch') {
        return;
      }

      //  Get the tree node acted on
      // if no hovered node, use the last selected node
      this._data.menu.node = keyboard
        ? this._data.ui.hovered || this._data.menu.activeNode
        : $(event.target);
      this._data.menu.activeNode = null; // clear keyboard active node

      if (!this._data.menu.node) {
        // is there an active (hovered) or last selected node ?
        event.preventDefault();
        return;
      }

      // () Check that right-click/touch is not on whitespace near a node.
      if (!keyboard) {
        var $origTarg = $(event.originalEvent.target);
        if ($origTarg.is('LI') || $origTarg.hasClass(OJT_TREE) || $origTarg.is('UL')) {
          return; // no context menu
        }
      }

      // var $nodeElem = keyboard ? this._data.menu.node : this._data.menu.node.closest('li');
      // console.log("_NotifyContextMenuGesture node=" + $nodeElem.attr("id"));

      this._data.menu.treeDivId = this._data.menu.node.closest('div').attr('id');

      var openOptions = { launcher: this._$container_ul };
      if (keyboard) {
        // Set position relative to the node in the SHIFT+F10 case.
        // Set here to avoid conflicting with user override in "before open" event
        var textElem = this._data.menu.node.find('.oj-tree-title')[0]; // the node text <span>
        openOptions.position = { of: textElem };
      }

      // Set submenu "Paste" disable state, depending on whether there's been a
      // previous "cut" or "copy"
      if (
        this._data.menu.usermenu &&
        (this._data.menu.$elemPaste ||
          this._data.menu.$elemPasteBefore ||
          this._data.menu.$elemPasteAfter)
      ) {
        var disabledState = !this._data.crrm.ct_nodes && !this._data.crrm.cp_nodes;
        var state;
        var items = [
          this._data.menu.$elemPaste,
          this._data.menu.$elemPasteBefore,
          this._data.menu.$elemPasteAfter
        ];
        var refresh = false;

        for (var i = 0; i < items.length; i++) {
          var $item = items[i];
          if ($item) {
            state = !!$item.hasClass(TreeUtils._OJ_DISABLED);
            if (state !== disabledState) {
              if (disabledState) {
                $item.addClass(TreeUtils._OJ_DISABLED);
              } else {
                $item.removeClass(TreeUtils._OJ_DISABLED);
              }
              refresh = true;
            }
          }
        }
        if (refresh) {
          this._data.menu.$container.ojMenu('refresh');
        }
      }

      this._OpenContextMenu(event, eventType, openOptions);
    },

    /**
     *  Process Core options
     *  @private
     */
    _initCoreOpts: function () {
      var val = this.options.selectionMode;

      val = val == null ? 'single' : val;
      if (val === 'none') {
        val = 0;
      } else if (val === 'single') {
        val = 1;
      } else if (val === 'multiple') {
        val = -1;
      }
      this._data.core.selectMode = val;

      this._data.themes.icons = this.options.icons;

      this._initExpandedOpts(); // (updates this._data.coreToExpand)
      this._data.core.toLoad = this.options.initLoaded;
    },

    /**
     *  Process UI type options
     *  @private
     */
    _initUIOpts: function () {},

    /**
     *  Process data source options
     *  @private
     */
    _initDSOpts: function (bInit) {
      var s = this.options.data;

      this._data.ds.type = DS_NONE;
      this._data.html.useExistingMarkup = false;
      this._data.html.cloneMarkup = false;
      this._loadFailureIds = {};

      // _data.html.markup_ul, _data.html.markup and  _data.html.markup_div
      // are left intact for destroy.

      if (s) {
        var ot = $.type(s);
        if (ot === 'string') {
          if (this._isHtml(s)) {
            this._data.ds.type = DS_HTML; // we have an non-Tree DS html source
          } else {
            this._data.ds.type = DS_JSON; // we have a non-tree DS json source
            this._initJsonOpts();
          }
        } else if (ot === 'array') {
          //  we have an array of local json objects
          this._data.ds.type = DS_JSON; // we have a non-tree DS json source
        } else if (ot === 'object') {
          try {
            // don't crash if no jsontreedatasource
            if (s instanceof oj.JsonTreeDataSource) {
              this._data.ds.type = DS_TREE; // we have a tree DS source
            }
          } catch (e) {
            this._data.ds.type = DS_ERROR;
          }
          if (this._data.ds.type !== DS_TREE) {
            try {
              // don't crash if no data source
              if (s instanceof oj.CollectionTreeDataSource) {
                this._data.ds.type = DS_COLLECTION; // we have a tree DS source
              }
            } catch (e) {
              this._data.ds.type = DS_ERROR;
            }
          }
          if (this._data.ds.type === DS_TREE || this._data.ds.type === DS_COLLECTION) {
            this._initTreeDSOpts();
          } else if (s.data || s.ajax) {
            var dt = s.dataType;
            if (dt) {
              if (dt === 'json') {
                this._data.ds.type = DS_JSON; // we have a non-tree DS json source
                this._initJsonOpts();
              } else if (dt === 'html') {
                this._data.ds.type = DS_HTML; // we have a non-tree DS html source
                this._initHtmlOpts();
              }
            } else {
              s.dataType = 'json';
              this._data.ds.type = DS_JSON; // we have a non-tree DS json source
              this._initJsonOpts();
            }
          }
        }
      }

      //  If no data defined, see if there is initial user markup in the div
      if (bInit && this._data.ds.type === DS_NONE) {
        if (this._$container.find('ul').length > 0) {
          this._data.ds.type = DS_HTML; // note we have an non-Tree DS html source
          this._data.html.useExistingMarkup = true;
        }
      }
    },

    /**
     *  Process Tree DataSource options
     *  @private
     */
    _initTreeDSOpts: function () {},

    /**
     *  Process json_data options
     *  @private
     */
    _initJsonOpts: function () {},

    /**
     *  Process html_data options
     *  @private
     */
    _initHtmlOpts: function () {},

    /**
     *  Process cut/copy/paste/rename/remove options
     *  @private
     */
    //   _initCrrmOpts : function()
    //   {
    //       if (this.options["crrm"] == undefined)  {
    //         //  Will use our defaults until these are made public and can be
    //         //  defined in options.
    //         this._applyDefaults(this.options["crrm"], this._data.crrm.defaults) ;
    //       }
    //   },

    /**
     *  Process context menu options
     *  @private
     */
    _initMenuOpts: function () {},

    //   /**
    //     *  Process theme options
    //     *  @private
    //     */
    //   _initThemeOpts : function()
    //   {
    //     //  Themes support not yet published
    //   },

    /**
     *  Process node type options
     *  @private
     */
    _initTypeOpts: function () {
      var o = this.options.types;

      //     For V1, there are no default options that we publish
      //     if (typeof o === "object") {
      //       //  Add our default requirements until these are made public and can be
      //       //  defined in options.
      //       this._applyDefaults(this["options"]["types"], this._data.types.defaults) ;
      //     }
      if (typeof o === 'object') {
        this._applyDefaults(o, { attr: this._data.types.defaults.attr });
      }
    },

    /**
     *  Set/reset the initExpanded opts
     *  @private
     */
    _initExpandedOpts: function () {
      this._data.core.toExpand = this._varCopy(this.options, 'initExpanded');
      if (this._data.core.toExpand == null) {
        this._data.core.toExpand = [];
      }
    },

    /**
     *  Set up tree instance data
     *  @private
     */
    _initData: function () {
      //  Establish working values, and define default values

      var data = this._data;

      //  Core
      data.core = {
        initLoaded: [],
        selectMode: 1, //  0 = no selection, 1, 2 ..., or -1 for unlimited
        load_open: false,
        li_height: 0,
        toExpand: false,
        toLoad: false,
        prepMoveBlk: {}, // for the _moveNode function
        suppressSelectEvent: false, // used for batching up optionChange events
        strings: {} // translated/escaped strings
      };

      // UI
      data.ui = {
        selected: $(), // selected node jquery list
        lastSelected: false,
        hovered: null, // currently hovered
        lastHovered: null, // last hovered before blur
        disclosureClick: false, // used for 1st time disclosure click
        toSelect: null, // initial selection in options:selection
        opacity: 1, // used by disable/_lock()
        spacebar: false, // true if select caused by keybd (toggles)
        focused: false, // tree has focus
        animDurDiv: null, // div used to get animation duration
        touchEvent: false // true if touch event
      };

      data.ui.defaults = {
        // default values not yet published or suppressed design committee
        selectMultipleModifier: 'ctrl', // on, or ctrl, shift, alt
        selectRangeModifier: 'shift',
        disableSelectingChildren: false
      };

      //  Creating/renaming/removing/moving via context menu

      data.crrm = {};
      data.crrm.cp_nodes = false; // nodes that have been copy'd
      data.crrm.ct_nodes = false; // node(s) that have been cut
      data.crrm.defaults = {
        inputWidthLimit: 200,
        move: {
          alwaysCopy: false, // false, true or "multitree"
          openOnMove: true,
          defaultPosition: 'last',
          checkMove: function () {
            return true;
          }
        }
      };
      data.crrm.prepMoveBlk = {}; // for the move node function

      // Data Source

      data.ds = {};
      data.ds.progressiveRender = false; // options not currently exposed
      data.ds.progressiveUnload = false;
      data.ds.correctState = true;

      data.ds.type = DS_NONE; // type of data source (DS_TREE, DS_JSON, DS_HTML)

      //  json data source

      data.json = {};
      data.json.defaults = {
        data: false, // `data` can be a function:
        //  accepts two arguments - node being loaded
        //  and a callback to pass the result to,
        //  & ajax won't be supported
        ajax: false
      };

      // html data source

      data.html = {};
      data.html.defaults = {
        data: false, // `data` can be a function:
        ajax: false
      };

      data.html.useExistingMarkup = false; // true == use existing div markup
      data.html.markup_ul = false; // user's <ul>
      data.html.markup_div = false; // the added div used to store user's <ul>
      data.html.markup = false; // the user's markup ( <li>'s )
      data.html.cloneMarkup = false; // our clone of user's orig markup <li's>

      //  Themes

      data.themes = {};
      data.themes.icons = true;
      data.themes.dots = false;
      data.themes.theme = 'default';
      data.themes.url = false;

      data.themes.themes_loaded = [];
      data.themes._themes = false; // path to themes folder - if false it will be autodetected

      //  Types

      data.types = {};
      data.types.attachTo = [];
      data.types.defType = false; // true if "default" type defined
      data.types.defaults = {
        //  Options not published in V1
        maxChildren: -1, // defines max number of root nodes
        // (-1 = unlimited, -2 = disable maxChildren checking)
        maxDepth: -1, //  maximum depth of the tree
        validChildren: 'all', // defines valid node types for the root nodes
        useData: false, // whether to use $.data     TDO
        attr: 'type', // attr name in <li> where type is stored
        types: {
          // a list of types
          default: {
            // the default type
            maxChildren: -1,
            maxDepth: -1,
            validChildren: 'all'

            // Bound functions - you can bind any other function here
            // (using boolean or function)
            // "select_node" : true
          }
        }
      };

      //  Context menu

      data.menu = {};
      data.menu.usermenu = false; // user has supplied an ojMenu id if true
      data.menu.$container = false; // the menu <ul>
      data.menu.$elemPaste = false; // the menu "Paste" element
      data.menu.$elemPasteAfter = false; // the menu "Paste" After element
      data.menu.$elemPasteBefore = false; // the menu "Paste Before" element
      data.menu.node = false; // the tree node the menu was activated on
      data.menu.activeNode = false; // active node for shift-F10

      //  Keyboard support

      data.keys = {};
      data.keys.enabled = true;
      data.keys.bound = [];
    },

    /**
     *  @private
     */
    _fix_scroll: function (obj) {
      var c = this._$container[0];

      if (c.scrollHeight > c.offsetHeight) {
        obj = this._getNode(obj);
        if (!obj || obj === -1 || !obj.length || !obj.is(':visible')) {
          return;
        }

        var t = obj.offset().top - this._$container.offset().top;

        if (t < 0) {
          c.scrollTop += t - 1;
        }

        if (
          t + this._data.core.li_height + (c.scrollWidth > c.offsetWidth ? scrollbarWidth : 0) >
          c.offsetHeight
        ) {
          c.scrollTop +=
            t -
            c.offsetHeight +
            this._data.core.li_height +
            1 +
            (c.scrollWidth > c.offsetWidth ? scrollbarWidth : 0);
        }
      }
    },

    /**
     *  @private
     */
    _setFocus: function () {
      // undocumented per Design Review
      /*
       if (this._isFocused()) {
          return;
       }
       var f = this._focused();
       if (f) {
         this._unsetFocus();
       }

       this._$container.addClass("oj-tree-focused");
       if (this._$container_ul) {
         this._$container_ul.focus() ;
       }
       this._data.ui.focused = true ;
       this._emitEvent(null, "setfocus", true);
*/
    },

    //                                         // currently unused
    //   /**
    //      *  Return true if this tree has focus.
    //      *  @private
    //      */
    //    _isFocused  : function ()            // undocumented per Design Review
    //    {
    //       return this._data.ui.focused ;
    //    },

    /**
     *  @private
     */
    _unsetFocus: function () {
      // undocumented per Design Review
      /*    See setFocus()
        if (this._isFocused()) {
          this._$container.removeClass("oj-tree-focused");
          this._data.ui.focused = false ;
          if (this._$container_ul) {
            this._$container_ul.blur() ;
          }
        }
        this._emitEvent(null, "unsetfocus", true);
*/
    },

    //                                          // currently unused
    //   /**
    //     *  Return the "this of the tree that currently has focus, or null.
    //     *  @private
    //     */
    //   _focused : function ()
    //   {
    //      var ret = null ;
    //      $.each(_aInstances, function(i, _this) {
    //          if (_this._data.ui.focused) {
    //            ret = _this ;
    //            return false ;
    //          }
    //      });
    //
    //      return ret ;
    //   },

    /**
     *  Returns the next instance index to use.
     *  @private
     */
    _newIndex: function () {
      _instance += 1;
      return _instance;
    },

    /**
     *  Returns the current instance index.
     *  @private
     */
    _getIndex: function () {
      return this._index;
    },

    /**
     *  Returns a copy of the options.
     *  @private
     */
    _getOptions: function () {
      return $.extend(true, {}, this.options);
    },

    /**
     *  Returns the tree containing div
     *  @private
     */
    _getContainer: function () {
      return this._$container;
    },

    /**
     *  Returns the tree outer list UL
     *  @private
     */
    _getContainerList: function () {
      return this._$container_ul;
    },

    /**
     *   Handle keystroke and combination keystrokes.
     *   The return value is passed to the jQuery keydown handler.
     *   @private
     */
    _keyHandler: {
      up: function () {
        var o = this._data.ui.hovered || this._data.ui.lastSelected || -1;
        this.hover(this._getPrev(o));
        return false;
      },

      'ctrl+up': function () {
        var o = this._data.ui.hovered || this._data.ui.lastSelected || -1;
        this.hover(this._getPrev(o));
        return false;
      },

      'shift+up': function () {
        var o = this._data.ui.hovered || this._data.ui.lastSelected || -1;
        this.select(this._getPrev(o), this._data.ui.selectMode !== -1);
        return false;
      },

      down: function () {
        var o = this._data.ui.hovered || this._data.ui.lastSelected || -1;
        this.hover(this._getNext(o));
        return false;
      },

      'ctrl+down': function () {
        var o = this._data.ui.hovered || this._data.ui.lastSelected || -1;
        this.hover(this._getNext(o));
        return false;
      },

      'shift+down': function () {
        var o = this._data.ui.hovered || this._data.ui.lastSelected || -1;
        this.select(this._getNext(o), this._data.ui.selectMode !== -1);
        return false;
      },

      left: function () {
        var o = this._data.ui.hovered || this._data.ui.lastSelected;
        if (o) {
          if (o.hasClass(TreeUtils._OJ_EXPANDED)) {
            this.collapse(o);
          } else {
            this.hover(this._getPrev(o));
          }
        }
        return false;
      },

      'ctrl+left': function () {
        var o = this._data.ui.hovered || this._data.ui.lastSelected;
        if (o) {
          if (o.hasClass(TreeUtils._OJ_EXPANDED)) {
            this.collapse(o);
          } else {
            this.hover(this._getPrev(o));
          }
        }
        return false;
      },

      'shift+left': function () {
        var o = this._data.ui.hovered || this._data.ui.lastSelected;
        if (o) {
          if (o.hasClass(TreeUtils._OJ_EXPANDED)) {
            this.collapse(o);
          } else {
            this.hover(this._getPrev(o));
          }
        }
        return false;
      },

      right: function () {
        var o = this._data.ui.hovered || this._data.ui.lastSelected;
        if (o && o.length) {
          if (o.hasClass(TreeUtils._OJ_COLLAPSED)) {
            this.expand(o);
          } else {
            this.hover(this._getNext(o));
          }
        }
        return false;
      },

      'ctrl+right': function () {
        var o = this._data.ui.hovered || this._data.ui.lastSelected;
        if (o && o.length) {
          if (o.hasClass(TreeUtils._OJ_COLLAPSED)) {
            this.expand(o);
          } else {
            this.hover(this._getNext(o));
          }
        }
        return false;
      },

      'shift+right': function () {
        var o = this._data.ui.hovered || this._data.ui.lastSelected;
        if (o && o.length) {
          if (o.hasClass(TreeUtils._OJ_COLLAPSED)) {
            this.expand(o);
          } else {
            this.hover(this._getNext(o));
          }
        }
        return false;
      },

      space: function () {
        // toggle hovered node select status
        if (this._data.ui.hovered) {
          this._data.ui.spacebar = true; // note keyboard - so click will toggle
          this._data.ui.hovered.children('a:eq(0)').click();
          this._data.ui.spacebar = false;
        }
        return false;
      },

      home: function () {
        // move hover to top node
        this.hover(this._$container_ul.find('li:first'));
        return false;
      },

      end: function () {
        // move hover to last visible node
        var a = this._$container_ul.find('li.oj-tree-last:visible');
        if (a && a.length) {
          this.hover(a[a.length - 1]);
        }
        return false;
      },

      '*': function () {
        // expand all nodes
        this._expandAll(-1, false);
        return false;
      },

      'ctrl+space': function () {
        // toggle the select state
        if (this._data.ui.hovered) {
          var ev = $.Event('click');
          ev.ctrlKey = true;
          this._data.ui.hovered.children('a:eq(0)').trigger(ev);
        }
        return false;
      },

      'shift+space': function () {
        // select to the hovered node
        if (this._data.ui.hovered) {
          var ev = $.Event('click');
          ev.shiftKey = true;
          this._data.ui.hovered.children('a:eq(0)').trigger(ev);
        }
        return false;
      },

      'shift+home': function (event) {
        // extend selection to top node
        var prevSelections;
        var hover = this._data.ui.hovered;

        if (hover) {
          var bContinue = true;
          var _this = this;
          var nodes = this._$container_ul.find('li:visible');

          // Batch up the optionChange/selection events so that the final result is
          // fired in the optionChange event (rather than individual events).
          this._data.core.suppressSelectEvent = true;
          prevSelections = this.options.selection.slice(0); // make new array for optionChange event

          hover = hover[0];
          $.each(nodes, function (i, node) {
            // select from top
            if (node === hover) {
              // until we find our
              bContinue = false; // starting node
            }
            _this._select(node, true);
            return bContinue;
          });

          this._data.core.suppressSelectEvent = false;
          this._fireOptionChangeEvent('selection', prevSelections, null, event);
        }

        return false;
      },

      'shift+pgdn': function (event) {
        // extend selection to last node
        var prevSelections;
        var hover = this._data.ui.lastSelected || this._data.ui.hovered;

        if (hover) {
          var bFound = false;
          var _this = this;
          var l = this._$container_ul.find('li:visible');

          // Will batch up the optionChange/selection events so that the final result is fired in
          // the optionChange event (rather than individual events).
          this._data.core.suppressSelectEvent = true;
          prevSelections = this.options.selection.slice(0); // make new array for optionChange event

          hover = hover[0];
          $.each(l, function (i, node) {
            if (!bFound) {
              // select to bottom from
              bFound = node === hover; // last selected node
            }
            if (bFound && !_this._isSelected(node)) {
              _this._select(node, true);
            }
            return true;
          });

          this._data.core.suppressSelectEvent = false;
          this._fireOptionChangeEvent('selection', prevSelections, null, event);
        }

        return false;
      },

      f2: function () {
        //         this["rename"](this._data.ui.hovered || this._data.ui.lastSelected);
        this._crrm_rename(this._data.ui.hovered || this._data.ui.lastSelected);
        return false;
      },

      del: function () {
        this.remove(this._data.ui.hovered || this._getNode(null));
        return false;
      }
    },

    /**
     *   Attach the user menu <ul> list to the tree div, and set up listeners on it.
     *   @private
     */
    _applyMenu: function () {
      if (!this._data.menu.usermenu) {
        return;
      }

      // Add our listeners so that we can handle build-in cut/copy/paste, etc
      var $menuContainer = this._data.menu.$container;
      var _this = this;

      $menuContainer.on('ojselect', this._handleContextMenuSelect.bind(this));

      // If there are any ojTree built in menu item ids, construct the menu items
      var listItems = $menuContainer.find('[data-oj-command]');
      var bChanged = false;

      listItems.each(function () {
        var cmd;
        if ($(this).children('a').length === 0) {
          cmd = $(this).attr('data-oj-command').split('oj-tree-'); // get cut/paste, etc
          $(this).replaceWith(_this._buildContextMenuItem(cmd[cmd.length - 1])); // @HTMLUpdateOK
          if ($(this).hasClass('oj-menu-divider')) {
            $(this).removeClass('oj-menu-divider').addClass('oj-menu-item');
          }
          bChanged = true;
        }
      });

      if (bChanged) {
        $menuContainer.ojMenu('refresh');
      }

      //  Note "paste" element for disabling if no prev cut/copy
      this._data.menu.$elemPaste = $menuContainer.find('#ojtreepaste');
      this._data.menu.$elemPasteAfter = $menuContainer.find('#ojtreepasteafter');
      this._data.menu.$elemPasteBefore = $menuContainer.find('#ojtreepastebefore');
    },

    /**
     *  Clear out any contextMenu data.
     *  @private
     */
    _clearMenu: function () {
      var um = this._data.menu;

      if (um.usermenu) {
        um.usermenu = false;
        um.$container.off('ojselect');
        um.$container = null;
      }
    },

    /**
     * Builds a menu for a command, takes care of submenus where appropriate
     * @param {string} cmd
     * @private
     */
    _buildContextMenuItem: function (cmd) {
      return $(this._buildContextMenuListItem(cmd));
    },

    /**
     * Builds a context menu list item from a command
     * @param {string} cmd the string to look up command value for as well as translation
     * @return {string} an HTML string containing a list item and a
     * @private
     */
    _buildContextMenuListItem: function (cmd) {
      var id = _arMenuCmdMap[cmd];
      return '<li id=' + id + '>' + this._buildContextMenuLabel(cmd) + '</li>';
    },

    /**
     * Builds a context menu anchor element with translated text
     * @param {string} cmd the command string whose label translated label should be used.
     * @return {string} an HTML anchor element string containing the translated label
     * @private
     */
    _buildContextMenuLabel: function (cmd) {
      var key = _arMenuKeyMap[cmd];
      return '<a href="#">' + this._getString(key) + '</a>';
    },

    /**
     *  Returns true if node id is in the load failure map
     *  @param {string | number}  id   the node id to query
     *  @return {boolean}     true if in list, else false
     *  @private
     */
    _isLoadFailureId: function (id) {
      id = id === -1 ? '-1' : id;
      id = id.charAt(0) === '#' ? id.substr(1) : id;

      return !!this._loadFailureIds[id];
    },

    /**
     *  Add/remove node id from load failure map
     *  @param {string | number}  id     the node id to add/remove
     *  @param {boolean} add    true if id is to be added, false if it is to be removed.
     *  @private
     */
    _noteLoadFailureId: function (id, add) {
      id = id === -1 ? '-1' : id;

      if (add) {
        this._loadFailureIds[id] = true;
      } else if (this._loadFailureIds[id]) {
        delete this._loadFailureIds[id];
      }
    },

    /**
     *  Menu "cut" functionality
     *  @private
     */
    _crrm_cut: function (obj) {
      // If node is selected, then will cut all selected nodes, else just the one node.
      obj = obj.closest('li');
      if (this._isSelected(obj)) {
        obj = null; // _getNode() will now return all selected nodes
      }

      obj = this._getNode(obj, true);
      if (!obj || !obj.length) {
        return false;
      }

      this._data.crrm.cp_nodes = false;
      this._data.crrm.ct_nodes = obj;
      this._emitEvent({ obj: obj }, 'cut');
      return undefined;
    },

    /**
     *  Menu "copy" functionality
     *  @private
     */
    _crrm_copy: function (obj) {
      // If node is selected, then will copy all selected nodes, else just the one node.
      obj = obj.closest('li');
      if (this._isSelected(obj)) {
        obj = null; // _getNode() will now return all selected nodes
      }
      obj = this._getNode(obj, true);
      if (!obj || !obj.length) {
        return false;
      }
      this._data.crrm.ct_nodes = false;
      this._data.crrm.cp_nodes = obj;
      this._emitEvent({ obj: obj }, 'copy');
      return undefined;
    },

    /**
     *  Menu "paste" functionality
     *  @private
     */
    _crrm_paste: function (obj, menuId) {
      obj = this._getNode(obj);
      if (!obj || !obj.length) {
        return false;
      }
      var nodes = this._data.crrm.ct_nodes ? this._data.crrm.ct_nodes : this._data.crrm.cp_nodes;

      if (!this._data.crrm.ct_nodes && !this._data.crrm.cp_nodes) {
        return false;
      }

      var position = 'inside';
      if (menuId === 'ojtreepasteafter') position = 'after';
      else if (menuId === 'ojtreepastebefore') position = 'before';

      // Handle cut nodes
      if (this._data.crrm.ct_nodes) {
        this._crrm_move_node(this._data.crrm.ct_nodes, obj, position, false, false, true);
        this._data.crrm.ct_nodes = false;
      }
      // Handle copied nodes
      if (this._data.crrm.cp_nodes) {
        this._crrm_move_node(this._data.crrm.cp_nodes, obj, position, true, false, true);
      }
      this._emitEvent({ obj: nodes, p: position, r: obj }, 'paste');
      return undefined;
    },

    /**
     *  Menu move node support for paste
     *  @private
     */
    _crrm_move_node: function (obj, ref, position, isCopy, isPrepared, skipCheck) {
      // var s = this.options["crrm"]["move"];
      var s = this._data.crrm.defaults.move;
      if (!isPrepared) {
        if (typeof position === 'undefined') {
          position = s.defaultPosition;
        }
        if (position === 'inside' && !s.defaultPosition.match(/^(before|after)$/)) {
          position = s.defaultPosition;
        }
        return this._moveNode(obj, ref, position, isCopy, false, skipCheck);
      }

      // if the move is already prepared
      if (
        s.alwaysCopy === true ||
        (s.alwaysCopy === 'multitree' && obj.rt._getIndex() !== obj.ot._getIndex())
      ) {
        isCopy = true;
      }
      this._moveNode(obj, ref, position, isCopy, true, skipCheck);
      return undefined;
    },

    /**
     *  Menu "remove" (i.e. delete) functionality
     *  @private
     */
    _crrm_remove: function (obj) {
      obj = this._getNode(obj, true);

      //      var p    = this._getParent(obj),
      //          prev = this._getPrev(obj);

      this.__rollback();
      this.remove(obj);
      //         if (obj !== false) {
      //           this._emitEvent({ "obj" : obj, "prev" : prev, "parent" : p }, "remove");
      //         }
    },

    /**
     *  Menu rename a node functionality
     *  @private
     */
    _crrm_rename: function (obj) {
      // var f = this._emitEvent;

      obj = this._getNode(obj);
      this.__rollback();
      // eslint-disable-next-line no-unused-vars
      this._crrm_showInput(obj, function (_obj, newName, oldName) {
        //  Emit rename event
        //                                    f.call(this, {
        //                                                   "obj"       : _obj,
        //                                                   "title"     : newName,
        //                                                   "prevTitle" : oldName
        //                                                 },  "rename");
      });
    },

    /**
     *  Turn node into an input field to allow the user to rename the node.
     *  @private
     */
    _crrm_showInput: function (obj, callback) {
      obj = this._getNode(obj);

      var rtl = this._isRtl;
      // w   = this.options["crrm"]["inputWidthLimit"],       // applyDefaults() not done for V1
      var w = this._data.crrm.defaults.inputWidthLimit;
      var w1 = obj.children('ins').width();
      var w2 = obj.find('> a:visible > ins').width() * obj.find('> a:visible > ins').length;
      var t = this.getText(obj);

      var h1 = $('<div></div>', {
        css: {
          position: 'absolute',
          top: '-200px',
          left: rtl ? '0px' : '-1000px',
          visibility: 'hidden'
        }
      }).appendTo('body'); // @HTMLUpdateOK

      // prettier-ignore
      var h2 = obj
        .css('position', 'relative')
        .append( // @HTMLUpdateOK
          $('<input />', {
            value: t,
            class: 'oj-tree-rename-input',
            // "size" : t.length,
            css: {
              padding: '0',
              border: '1px solid silver',
              position: 'absolute',
              left: rtl ? 'auto' : w1 + w2 + 4 + 'px',
              right: rtl ? w1 + w2 + 4 + 'px' : 'auto',
              top: '0px',
              height: this._data.core.li_height - 2 + 'px',
              lineHeight: this._data.core.li_height - 2 + 'px',
              width: '150px' // will be set later below
            },
            blur: $.proxy(function () {
              var i = obj.children('.oj-tree-rename-input');
              var v = i.val();

              v = this._escapeHtml(v);
              if (v === '') {
                v = t;
              }
              h1.remove();
              i.remove(); // rollback purposes
              this._set_text(obj, t); // rollback purposes
              if (v !== t) {
                // if different node text, perform rename with prior before event
                this._renameNode(obj, v);
              }
              callback.call(this, obj, v, t);
              obj.css('position', '');
            }, this),

            keyup: function (event) {
              var key = event.keyCode || event.which;
              if (key === 27) {
                // Esc
                this.value = t;
                this.blur();
              } else if (key === 13) {
                // Enter
                this.blur();
              }
              else {
                h2.width(Math.min(h1.text('pW' + this.value).width(), w));
              }
              return undefined;
            },

            keypress: function (event) {
              var key = event.keyCode || event.which;
              if (key === 13) {
                return false;
              }
              return undefined;
            }
          })
        )
        .children('.oj-tree-rename-input');
      this._set_text(obj, '');
      h1.css({
        fontFamily: h2.css('fontFamily') || '',
        fontSize: h2.css('fontSize') || '',
        fontWeight: h2.css('fontWeight') || '',
        fontStyle: h2.css('fontStyle') || '',
        fontStretch: h2.css('fontStretch') || '',
        fontVariant: h2.css('fontVariant') || '',
        letterSpacing: h2.css('letterSpacing') || '',
        wordSpacing: h2.css('wordSpacing') || ''
      });
      h2.width(Math.min(h1.text('pW' + h2[0].value).width(), w))[0].select();
    },

    /**
     *  @private
     */
    _crrm_create: function (obj, position, js, callback, skipRename) {
      var _this = this;
      obj = this._getNode(obj);
      if (!obj) {
        obj = -1;
      }
      this.__rollback();
      var node = this._createNode(obj, position, js, function (t) {
        var p = this._getParent(t);
        var pos = $(t).index();

        if (callback) {
          callback.call(this, t);
        }
        if (p.length && p.hasClass(TreeUtils._OJ_COLLAPSED)) {
          this.expand(p, false, true);
        }
        if (!skipRename) {
          // eslint-disable-next-line no-unused-vars
          this._crrm_showInput(t, function (_obj, newName, oldName) {
            _this._emitEvent({
              obj: _obj,
              name: newName,
              parent: p,
              position: pos
            });
          });
        } else {
          _this._emitEvent({
            obj: t,
            name: this.getText(t),
            parent: p,
            position: pos
          });
        }
      });

      return node;
    },

    //   // Currently unused
    //   /**
    //     *  @private
    //     */
    //   _crrm_check_move : function ()
    //   {
    //      if (! this.__call_old())  {
    //        return false;
    //      }
    //      //var s = this.options["crrm"]["move"];
    //      var s = this._data.defaults.crrm["move"];
    //      if (! s["checkMove"].call(this, this._getMoveBlk()))  {
    //        return false;
    //      }
    //      return true;
    //   },

    /**
     *  Very brief check to see if string looks like it might be html.
     *  @return {boolean} true if string starts with a "<"
     *  @private
     */
    _isHtml: function (s) {
      var ret = false;

      if (s && s.length >= 3) {
        s = s.trim();
        ret = s.charAt(0) === '<';
      }
      return ret;
    },

    /**
     *  Use emptyText option if defined.
     *  @private
     */
    _applyEmptyText: function () {
      var txt = this.options.emptyText; // has app set new text

      if (typeof txt !== 'string') {
        txt = this._getString(TRANSKEY_NODATA); // no, get default value.
      }
      if (txt && txt.length > 0) {
        var $u = this._$container_ul;
        var $d = $("<li class='oj-tree-empty'></li>"); // no <a>, not interactive
        $d[0].textContent = txt;
        $u.empty().append($d); // @HTMLUpdateOK
      }
    },

    /**
     *  Return the HTMLElement based on the locator subid property.
     *  @private
     */
    _processSubId: function (locator) {
      // Parent node
      // <li role="treeitem" id="blogs" class="oj-tree-node oj-tree-expanded|oj-tree-collapsed">
      //    <ins class="oj-tree-icon oj-tree-disclosure-icon oj-..."> </ins>  <-- disclosure icon
      //    <a tabindex="-1" href="#">
      //       <ins class="oj-tree-icon"> </ins>
      //       <span class="oj-tree-title">Blogs</span>
      //       <ul role="group">
      //          <li . . . child nodes . . .
      //       </ul>
      //    </a>
      // </li>
      //
      //  Leaf node
      // <li role="treeitem" id="home" myattr1="Hello" class="oj-tree-node oj-tree-leaf">
      //    <ins class="oj-tree-icon"> </ins>                   <-- unused disclosure icon
      //    <a tabindex="-1" href="#">
      //       <ins class="oj-tree-icon oj-tree-node-icon oj-component-icon"> </ins>
      //       <span class="oj-tree-title">Home</span>
      //    </a>
      // </li>

      var subId;
      var node;
      var ret;

      if (locator) {
        subId = locator.subId;
      }
      if (!subId) {
        return null;
      }

      var a = subId.split('[');
      if (a.length === 3) {
        a[0] = a[0].trim();
        if (a[0] === 'oj-tree-node') {
          a[1] = a[1].trim();
          var c = a[1].charAt(0); // should be ' or "
          var i = a[1].indexOf(c, 1);
          if (i >= 0) {
            var sNode = a[1].substring(1, i).trim();

            a[2] = a[2].trim();
            c = a[2].charAt(0); // should be ' or "
            i = a[2].indexOf(c, 1);
            if (i >= 0) {
              var sKey = a[2].substring(1, i).trim();
              try {
                node = this._getNode(sNode);
              } catch (e) {
                node = null;
              }
              if (sKey && node && node !== -1) {
                switch (sKey) {
                  case 'icon':
                    if (this._data.themes.icons) {
                      ret = node.find(' > a > ins:eq(0)');
                    }
                    break;
                  case 'link':
                    ret = node.find(' > a:eq(0)');
                    break;
                  case 'disclosure':
                    if (!this._isLeaf(node)) {
                      ret = node.find(' > ins:eq(0)');
                    }
                    break;
                  case 'title':
                    ret = node.find(' > a > span');
                    break;
                  default:
                    break;
                }
              }
            }
          }
        }
      }

      return ret && ret.length ? ret[0] : null;
    },

    /**
     *  Return the subid of a node's DOM child element (or null).
     *  Refer to _processSubId() for returned subId values.
     *  @private
     */
    _getSubIdFromNodeElem: function (elem) {
      var node = elem ? this._getNode(elem) : null; // get tree node from the sub-element
      var request = null;

      if (node && node !== -1 && node.length && node.hasClass(OJT_NODE)) {
        if (elem.tagName && elem.parentNode) {
          var type = elem.tagName;
          var parent = elem.parentNode;
          var parentType = parent.tagName;

          if (type === 'SPAN') {
            request = 'title';
          } else if (type === 'A') {
            request = 'link';
          } else if (type === 'INS') {
            //  Determine whether subId is a node icon, or a parent disclosure icon
            elem = $(elem);
            if (parentType === 'LI' && elem.hasClass(OJT_DISC)) {
              request = 'disclosure';
            } else if (parentType === 'A' && elem.hasClass(OJT_NICON)) {
              request = 'icon';
            }
          }
        }
      }

      if (request) {
        var subId = "oj-tree-node['#" + node.attr('id') + "']['" + request + "']";
        return { subId: subId };
      }

      return null;
    },

    /**
     *  Hide the node connecting lines
     *  @private
     */
    _hideDots: function () {
      this._data.themes.dots = false;
      this._$container.children('ul').addClass('oj-tree-no-dots');
    },

    /**
     *  Show the node connecting lines
     *  @private
     */
    _showDots: function () {
      this._data.themes.dots = true;
      this._$container.children('ul').removeClass('oj-tree-no-dots');
    },

    /**
     *  Check the options for initExpanded : ["all"] ;
     *  @private
     */
    _isOptExpandAll: function () {
      var s = this.options.initExpanded;
      return (s && s === 'all') || ($.isArray(s) && s.length && s[0] === 'all');
    },

    /**
     *   Get translated string and escape it.
     *   @private
     */
    _getString: function (key) {
      var oStrings = this._data.core.strings;

      var s = oStrings[key]; // have we already escaped this string?
      if (!s) {
        // no
        s = this.getTranslatedString(key);
        s = this._escapeHtml(s);
        oStrings[key] = s;
      }
      return s;
    },

    /**
     *  Return sanitized html fragment/text for security
     *  @private
     */
    _escapeHtml: function (text) {
      var div = document.createElement('div');
      $(div).text(text); // escape the text
      return div.textContent;
    },

    /**
     *  Returns the height of node li
     *  @private
     */
    _getNodeHeight: function () {
      return this._data.core.li_height;
    },

    /**
     *  Get the duration in ms from the css $treeAnimationDuration value.
     *  (This is currently neccessary because if the duration is zero, the
     *  transition end callback is not called, and the expand event is
     *  never fired.
     *  @private
     */
    _getAnimDuration: function () {
      var ret = 0;

      if (window.getComputedStyle) {
        var $div = this._data.ui.animDurDiv;
        if (!$div) {
          $div = $(
            "<div id='ojtree-comp-animduration'><span class='oj-tree-transition'>dummy</span></div>"
          );
          this._data.ui.animDurDiv = $div;
          $('body').append($div); // must be <body>, doesn't work if _$container used and not attached to the DOM //@HTMLUpdateOK
        }
        var span = $div[0].childNodes[0];
        var val = window.getComputedStyle(span);
        if (val.transitionDuration) {
          val = val.transitionDuration;
        } else if (val['-webkit-transition-duration']) {
          // need this for windows safari
          val = val['-webkit-transition-duration'];
        } else {
          val = 0;
        }

        $div.detach();

        if (typeof val === 'string' && val.length > 1) {
          var c = val.charAt(val.length - 1).toLowerCase();
          if (c === 's') {
            val = val.substring(0, val.length - 1);
            val = parseFloat(val);
            if (!isNaN(val)) {
              ret = val * 1000;
            }
          } else if (val.length > 2) {
            var s = val.substring(val.length - 2).toLowerCase();
            if (s === 'ms') {
              s = val.substring(0, val.length - 2);
              val = parseFloat(val);
              if (!isNaN(val)) {
                ret = val;
              }
            }
          }
        }
      }
      return ret; // return milliseconds
    },

    /**
     *  Return a copy of a member of an object.
     *  @private
     */
    _varCopy: function (obj, s) {
      var o = {};
      o[s] = obj[s];
      var o2 = $.extend(true, {}, o);

      return o2[s];
    },

    /**
     * For easier debugging on tablet test page via vpn.  Emits a _treetrace event
     * containing the supplied string.
     * @private
     */
    // eslint-disable-next-line no-unused-vars
    _trace: function (s, level) {
      //     this._emitEvent({ "obj" : {"msg" : s }}, "trace", true);
      //   console.log(s) ;
      //   if (level === 1) {
      //     console.log(s) ;
      //   }
    }

    // API doc for inherited methods with no JS in this file:

    /**
     * Removes the Tree from the DOM.  If the tree was constructed from original
     * user &lt;ul&gt; markup defined in the Tree's containing &lt;div&gt;, this
     * markup is reinstated.
     * <p>This method does not accept any arguments.
     *
     * @method
     * @name oj.ojTree#destroy
     * @memberof oj.ojTree
     * @instance
     *
     * @example <caption>Invoke the <code class="prettyprint">destroy</code> method:</caption>
     * $( ".selector" ).ojTree( "destroy" );
     */

    /**
     * Returns a <code class="prettyprint">jQuery</code> object containing the root element of the Tree component.
     *
     * @method
     * @name oj.ojTree#widget
     * @memberof oj.ojTree
     * @instance
     * @return {jQuery} the root element of the component
     *
     * @example <caption>Invoke the <code class="prettyprint">widget</code> method:</caption>
     * var widget = $( ".selector" ).ojTree( "widget" );
     */

    // ////////////////     SUB-IDS     //////////////////

    /**
     * <p>Sub-ID for ojTree component's node icons.</p>
     *
     * To find the icon DOM node for a Tree node, the locator object should have the following:
     * <ul>
     * <li>{<b> subId</b> : "oj-tree-node['node id']<b>['icon']</b>" }</li>
     * </ul>
     *
     * @ojsubid icon
     * @memberof oj.ojTree
     *
     * @example <caption>Get the node icon for the Tree node with Id "#home":</caption>
     * var node = $( ".selector" ).ojTree("getNodeBySubId", {"subId": "oj-tree-node['#home']['icon]" } );
     */

    /**
     * <p>Sub-ID for the ojTree component's disclosure icons.</p>
     *
     * To find the disclosure (expand/collapse) icon DOM node for a Tree node, the locator object should
     * have the following:
     * <ul>
     * <li>{<b> subId</b> : "oj-tree-node['node id']<b>['disclosure']</b>" }</li>
     * </ul>
     *
     * @ojsubid disclosure
     * @memberof oj.ojTree
     *
     * @example <caption>Get the disclosure icon DOM node for the Tree node with Id "#home":</caption>
     * var node = $( ".selector" ).ojTree("getNodeBySubId", {"subId": "oj-tree-node['#home']['disclosure]" } );
     */

    /**
     * <p>Sub-ID for the ojTree component's node title.</p>
     *
     * To find the node title DOM node for a Tree node, the locator object should have the following:
     * <ul>
     * <li>{<b> subId</b> : "oj-tree-node['node id']<b>['title']</b>" }</li>
     * </ul>
     *
     * @ojsubid title
     * @memberof oj.ojTree
     *
     * @example <caption>Get the text title DOM node for the Tree node with Id "#home":</caption>
     * var node = $( ".selector" ).ojTree("getNodeBySubId", {"subId": "oj-tree-node['#home']['title]" } );
     */

    /**
     * <p>Sub-ID for the ojTree's component's node link element.</p>
     *
     * To find the link DOM element for a Tree node, the locator object should have the following:
     * <ul>
     * <li>{<b> subId</b> : "oj-tree-node['node id']<b>['link']</b>" }</li>
     * </ul>
     *
     * @ojsubid link
     * @memberof oj.ojTree
     *
     * @example <caption>Get the link DOM node for the Tree node with Id "#home":</caption>
     * var node = $( ".selector" ).ojTree("getNodeBySubId", {"subId": "oj-tree-node['#home']['link]" } );
     */

    // ////////////////     FRAGMENTS    //////////////////

    /**
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Target</th>
     *       <th>Gesture</th>
     *       <th>Action</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td>Node Disclosure Icon</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Toggle the node's expanded state.</td>
     *     </tr>
     *     <tr>
     *       <td>Node Text</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Select the node. Toggle the select state if multi-select mode.</td>
     *     </tr>
     *     <tr>
     *       <td>Node Text</td>
     *       <td><kbd>Press and Hold</kbd></td>
     *       <td>Open the context menu.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
     * @memberof oj.ojTree
     */

    /**
     *
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Key</th>
     *       <th>Action</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td><kbd>UpArrow/DownArrow</kbd></td>
     *       <td>Moves between visible nodes.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>LeftArrow</kbd></td>
     *       <td>On an expanded node, collapses the node.<br>On a collapsed or leaf node, moves focus to the node's parent.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>RightArrow</kbd></td>
     *       <td>On a collapsed node, expands the node.<br>On an expanded node, moves to the first first child of the node.<br>On an end node, does nothing.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Spacebar</kbd></td>
     *       <td>Toggles the selected status of the node.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Home</kbd></td>
     *       <td>Moves to the top node of the tree.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>End</kbd></td>
     *       <td>Moves to the last visible node of the tree.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift + UpArrow</kbd></td>
     *       <td>Extends selection up one node (assuming multiple selection has been defined).</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift + DownArrow</kbd></td>
     *       <td>Extends selection down one node (assuming multiple selection has been defined).</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift + Home</kbd></td>
     *       <td>Extends selection up to the top-most node.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift + PageDown</kbd></td>
     *       <td>Extends selection to the last node.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Ctrl + Spacebar</kbd></td>
     *       <td>Toggles the selection state of the current node (assuming multiple selection has been defined).</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift + Spacebar</kbd></td>
     *       <td>Extends selection to the current node (assuming multiple selection has been defined).</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift + F10</kbd></td>
     *       <td>Invoke Context Menu (if defined) on current node.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>* (asterisk)</kbd></td>
     *       <td>Expands all nodes.</td>
     *     </tr>
     * </tbody></table>
     *
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
     * @memberof oj.ojTree
     */
  }); // end    $.registerWidget("oj.ojTree", ...
})();

});