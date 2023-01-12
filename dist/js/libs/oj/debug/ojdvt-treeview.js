/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojdvt-toolkit'], function (exports, dvt) { 'use strict';

  /**
   * Base class for tree component nodes.
   * @class The base class for tree component nodes.
   * @constructor
   * @implements {DvtCategoricalObject}
   * @implements {DvtTooltipSource}
   * @implements {DvtSelectable}
   * @implements {DvtKeyboardNavigable}
   * @implements {DvtDraggable}
   */
  class DvtTreeNode {
    /**
     * @param {DvtTreeView} treeView The DvtTreeView that owns this node.
     * @param {object} props The properties for the node.
     * @protected
     */
    constructor(treeView, props) {
      this._view = treeView;
      this._options = props;

      var treeOptions = this._view.getOptions();

      this._id = props['id'] || props['label']; // If id is undefined, use label as id
      this._color = props['color'] ? props['color'] : '#000000';
      this._textStr = props['label'];
      this._labelStyle = props['labelStyle'] ? new dvt.CSSStyle(props['labelStyle']) : null;
      this._pattern = props['pattern'];
      this._selectable = props['selectable'];
      this._shortDesc = props['shortDesc'] ? props['shortDesc'] : props['tooltip'];
      this._size = props['value'];
      var drilling = props['drilling'];
      this._drilling = drilling == 'on' || drilling == 'off' ? drilling : treeOptions['drilling'];
      this._stampId = props['S'];

      // Whether this node is an artificial root
      this._bArtificialRoot = props.bArtificialRoot;

      // Node alpha is always 1 unless during animation
      this._alpha = 1;

      // reference to last visited child
      this._lastVisitedChild = null;

      this._isShowingKeyboardFocusEffect = false;

      this.IsHover = false;

      this._ANIMATION_DELETE_PRIORITY = 0; // The order in which the delete animation occurs
      this._ANIMATION_UPDATE_PRIORITY = 1; // The order in which the update animation occurs
      this._ANIMATION_INSERT_PRIORITY = 2; // The order in which the insert animation occurs

      this._DEFAULT_TEXT_SIZE = 11;
    }

    /**
     * Sets the Array containing all children of this node.
     * @param {array} children The array of children for this node.
     */
    setChildNodes(children) {
      // Set this node as the parent of the children
      if (children != null) {
        for (var i = 0; i < children.length; i++) children[i]._parent = this;
      }

      // Store the children
      this._children = children;
    }

    /**
     * Returns the Array containing all children of this node.
     * @return {array} The array of children belonging to this node.
     */
    getChildNodes() {
      return this._children ? this._children : [];
    }

    /**
     * Returns an Array containing all the descendants of this node
     * @return {Array} The array of descendants of this node
     */
    getDescendantNodes() {
      var descendants = [];
      var childDescendants;
      var child;

      if (!this.hasChildren()) return descendants;

      for (var i = 0; i < this._children.length; i++) {
        child = this._children[i];
        childDescendants = child.getDescendantNodes();
        descendants.push(child);
        descendants = descendants.concat(childDescendants);
      }

      return descendants;
    }

    /**
     * Sets a reference to the last visited child.
     *
     * @param {DvtTreeNode} lastVisited
     * @protected
     */
    SetLastVisitedChild(lastVisited) {
      this._lastVisitedChild = lastVisited;
    }

    /**
     * Returns the last visited child
     *
     * @return {DvtTreeNode} The last visited child
     * @protected
     */
    GetLastVisitedChild() {
      return this._lastVisitedChild;
    }

    /**
     * Updates the last visited child on the given node's parent to this node
     * @protected
     */
    MarkAsLastVisitedChild() {
      var parent = this.GetParent();
      if (parent) {
        parent.SetLastVisitedChild(this);
      }
    }

    /**
     * Returns true if this node is a descendant of the specified node.
     * @param {DvtTreeNode} node
     */
    isDescendantOf(node) {
      if (!node || !this.GetParent()) return false;
      else if (this.GetParent() == node) return true;
      else return this.GetParent().isDescendantOf(node);
    }

    /**
     * Returns an Array containing all nodes that are at the given depth away from the current node
     * @param {DvtTreeNode} root
     * @param {Number} depth
     * @return {Array}
     */
    GetNodesAtDepth(root, depth) {
      var returnArray = [];
      if (depth < 0) return returnArray;

      if (depth == 0) return [this];
      else if (root.hasChildren()) {
        var children = root.getChildNodes();
        var child;
        for (var i = 0; i < children.length; i++) {
          child = children[i];
          returnArray = returnArray.concat(child.GetNodesAtDepth(child, depth - 1));
        }
      }

      return returnArray;
    }

    /**
     * Returns the node with the given id, if it is in the tree with the given root
     * @param {DvtTreeNode} root
     * @param {String} id
     * @return {DvtTreeNode} The node with the given id, or null if no node with the given id is found
     */
    static getNodeById(root, id) {
      if (dvt.Obj.compareValues(root.getView().getCtx(), root.getId(), id)) {
        return root;
      } else {
        // recursively call getNodeById on each of the children
        var node = null;
        var children = root.getChildNodes();
        var length = children.length;
        var child = null;

        for (var i = 0; i < length; i++) {
          child = children[i];
          node = DvtTreeNode.getNodeById(child, id);
          if (node) {
            // if we found the node, return it, otherwise check the next child
            return node;
          }
        }
        return null;
      }
    }

    /**
     * Returns the component that owns this node.
     * @return {DvtTreeView} The component that owns this node.
     */
    getView() {
      return this._view;
    }

    /**
     * Returns the id of the stamp for this node.
     * @return {string} The id of the stamp for this node.
     */
    getStampId() {
      return this._stampId;
    }

    /**
     * Returns the options object for this node.
     * @return {object}
     */
    getOptions() {
      return this._options;
    }

    /**
     * @override
     */
    getCategories() {
      //  - default treemap node categories includes artificial node
      if (this.isArtificialRoot()) return [];

      // Implements function in DvtCategoricalObject
      var categories = this.getOptions()['categories'];
      if (!categories && !this.getView().hasDataProvider()) {
        // Default categories include the id of this node, appended to the categories of its ancestors
        var parent = this.GetParent();
        var parentCategories = parent ? parent.getCategories() : null;
        categories = parentCategories ? parentCategories.slice() : [];
        categories.push(this.getId());
      }
      return categories;
    }

    /**
     * Returns the id for this node.
     * @return {string} The id for this node.
     */
    getId() {
      return this._id;
    }

    /**
     * Returns the relative size of this node.
     * @return {Number} The relative size of this node.
     */
    getSize() {
      // Note: Called by automation APIs
      return this._size;
    }

    /**
     * Returns the color of this node.
     * @return {String} The color of this node.
     */
    getColor() {
      // Note: Called by automation APIs
      return this._color;
    }

    /**
     * @override
     */
    getDatatip() {
      // Custom Tooltip from Function
      var customTooltip = this._view.getOptions()['tooltip'];
      var tooltipFunc = customTooltip ? customTooltip['renderer'] : null;
      if (tooltipFunc)
        return this.getView()
          .getCtx()
          .getTooltipManager()
          .getCustomTooltip(tooltipFunc, this.getDataContext());
      return dvt.Displayable.resolveShortDesc(this._shortDesc, () =>
        DvtTreeNode.getShortDescContext(this)
      );
    }

    /**
     * @override
     */
    getDatatipColor() {
      return this._color;
    }

    /**
     * Returns the shortDesc of the node.
     * @return {string}
     */
    getShortDesc() {
      // Note: Called by automation APIs
      return this._shortDesc;
    }

    /**
     * Returns the shortDesc Context of the node.
     * @param {DvtTreeNode} node
     * @return {object} The shortDesc Context object
     */
    static getShortDescContext(node) {
      var options = node.getOptions();
      var itemData;
      var data = options;
      if (options._noTemplate) {
        itemData = options._itemData;
        data = options._itemData;
      } else if (options._itemData) {
        itemData = options._itemData;
        options = dvt.JsonUtils.clone(options);
        data = options;
        delete options._itemData;
      }
      return {
        id: node.getId(),
        label: node.getLabel(),
        value: node.getSize(),
        data: data,
        itemData: itemData
      };
    }

    /**
     * Returns the data context that will be passed to the tooltip function.
     * @return {object}
     */
    getDataContext() {
      var options = this.getOptions();
      var itemData;
      var data = options;
      if (options._noTemplate) {
        itemData = options._itemData;
        data = options._itemData;
      } else if (options._itemData) {
        itemData = options._itemData;
        options = dvt.JsonUtils.clone(options);
        data = options;
        delete options._itemData;
      }
      return {
        id: this.getId(),
        label: this.getLabel(),
        value: this.getSize(),
        color: this.getColor(),
        data: data,
        itemData: itemData,
        component: this.getView().getOptions()['_widgetConstructor']
      };
    }

    /**
     * Returns the index for this node within the current parent. Used for automation, this takes into account nodes that
     * were not created due to hiddenCategories.
     * @return {number}
     */
    getIndex() {
      return this.getOptions()['_index'];
    }

    /**
     * Returns the alpha for this node.
     * @return {number} The alpha for this node.
     */
    getAlpha() {
      // Note: This API is called by the fadeIn and fadeOut animations
      return this._alpha;
    }

    /**
     * Specifies the alpha for this node.
     * @param {number} alpha The alpha for this node.
     */
    setAlpha(alpha) {
      // Note: This API is called by the fadeIn and fadeOut animations
      this._alpha = alpha;

      if (this._shape) this._shape.setAlpha(this._alpha);
    }

    /**
     * Specifies whether the children of this node are disclosed.
     * @param {boolean} disclosed
     * @protected
     */
    setDisclosed(disclosed) {
      this.getOptions()['_expanded'] = disclosed;
    }

    /**
     * Returns true if the children of this node are disclosed.
     * @return {boolean}
     * @protected
     */
    isDisclosed() {
      return this.getOptions()['_expanded'] !== false;
    }

    /**
     * Returns true if this node is the artificial root of the tree.
     * @return {boolean}
     */
    isArtificialRoot() {
      return this._bArtificialRoot;
    }

    /**
     * Returns true if drill replace is enabled for this node.
     * @return {boolean}
     */
    isDrillReplaceEnabled() {
      return this._drilling == 'on';
    }

    /**
     * Renders this node.
     * @param {dvt.Container} container The container to render in.
     */
    render(container) {
      // subclasses should override
    }

    /**
     * Renders the child nodes of this node.
     * @param {dvt.Container} container The container to render in.
     */
    renderChildren(container) {
      // Render all children of this node
      var children = this.getChildNodes();
      if (children != null) {
        for (var i = 0; i < children.length; i++) {
          children[i].render(container);
        }
      }
    }

    /**
     * Default implementation of getNextNavigable. Returns this node as the next navigable.  Subclasses should override
     * @override
     */
    getNextNavigable(event) {
      // subclasses should override
      this.MarkAsLastVisitedChild();
      return this;
    }

    /**
     * @override
     */
    getKeyboardBoundingBox() {
      // subclasses should override
      return new dvt.Rectangle(0, 0, 0, 0);
    }

    /**
     * @override
     */
    getTargetElem() {
      // subclasses should override
      return null;
    }

    /**
     * @override
     */
    showKeyboardFocusEffect() {
      this._isShowingKeyboardFocusEffect = true;

      this.showHoverEffect();
      if (this.handleMouseOver) this.handleMouseOver();
    }

    /**
     * @override
     */
    hideKeyboardFocusEffect() {
      // Hide the hover effect if it was shown in response to keyboard focus
      if (this._isShowingKeyboardFocusEffect) {
        this._isShowingKeyboardFocusEffect = false;
        this.hideHoverEffect();
      }

      if (this.handleMouseOut) this.handleMouseOut();
    }

    /**
     * @override
     */
    isShowingKeyboardFocusEffect() {
      return this._isShowingKeyboardFocusEffect;
    }

    /**
     * Handles a mouse over event on the node.
     */
    handleMouseOver() {
      this.IsHover = true;
    }

    /**
     * Handles a mouse out event on the node.
     */
    handleMouseOut() {
      this.IsHover = false;
    }

    /**
     * @override
     */
    isSelectable() {
      return this._selectable != 'off' && this.getView().__getNodeSelection() != null;
    }

    /**
     * @override
     */
    isSelected() {
      return this._selected;
    }

    /**
     * @override
     */
    setSelected(selected) {
      // Store the selection state
      this._selected = selected;
      this.UpdateAriaLabel();
    }

    /**
     * @override
     */
    showHoverEffect() {
      // subclasses should override
    }

    /**
     * @override
     */
    hideHoverEffect() {
      // subclasses should override
    }

    /**
     * @override
     */
    highlight(bDimmed, alpha) {
      // Implements DvtCategoricalObject.prototype.highlight
      this.setAlpha(alpha);
    }

    /**
     * @override
     */
    isDragAvailable(clientIds) {
      return this.getView().__isDragAvailable(clientIds);
    }

    /**
     * @override
     */
    getDragTransferable() {
      return this.getView().__getDragTransferable(this);
    }

    /**
     * @override
     */
    getDragFeedback() {
      return this.getView().__getDragFeedback();
    }

    /**
     * Returns a displayable used for drop site feedback.
     * @return {dvt.Displayable}
     */
    getDropSiteFeedback() {
      return null;
    }

    /**
     * Returns true if this node contains the given coordinates.
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */
    contains(x, y) {
      return false; // subclasses should override
    }

    /**
     * Returns the node under the given point, if it exists in the subtree of this node.
     * @param {number} x
     * @param {number} y
     * @return {DvtTreeNode}
     */
    getNodeUnderPoint(x, y) {
      return null; // subclasses should override
    }

    /**
     * Returns the layout parameters for the current animation frame.
     * @return {array} The array of layout parameters.
     * @protected
     */
    GetAnimParams() {
      return []; // subclasses should override
    }

    /**
     * Sets the layout parameters for the current animation frame.
     * @param {array} params The array of layout parameters.
     * @protected
     */
    SetAnimParams(params) {
      // subclasses should override
    }

    /**
     * Creates the update animation for this node.
     * @param {DvtTreeAnimationHandler} handler The animation handler, which can be used to chain animations.
     * @param {DvtTreeNode} oldNode The old node state to animate from.
     */
    animateUpdate(handler, oldNode) {
      // Drilling animations are handled across all nodes up front, no recursion needed
      if (!handler.isDrillAnimation()) {
        // Recurse and animate the children
        handler.constructAnimation(oldNode.getChildNodes(), this.getChildNodes());
      }

      // Create the animator for this node
      var endState = this.GetAnimParams();
      var startState = oldNode.GetAnimParams(endState);

      var nodePlayable;
      if (!dvt.ArrayUtils.equals(startState, endState)) {
        // Only create if state changed
        nodePlayable = new dvt.CustomAnimation(
          this.getView().getCtx(),
          this,
          this.getView().__getAnimDur()
        );
        nodePlayable
          .getAnimator()
          .addProp(
            dvt.Animator.TYPE_NUMBER_ARRAY,
            this,
            this.GetAnimParams,
            this.SetAnimParams,
            endState
          );

        // Create the playable
        handler.add(nodePlayable, this._ANIMATION_UPDATE_PRIORITY);

        // Determine whether size and color changed.  This must be done before start state is set.
        var bSizeChanged = this._size != oldNode._size;
        var bColorChanged =
          dvt.ColorUtils.getRGBA(this._color) != dvt.ColorUtils.getRGBA(oldNode._color);

        // Initialize the start state
        this.SetAnimParams(startState);

        // If the data changed, flash directly into the update color.
        var animationUpdateColor = this._view.getOptions()['animationUpdateColor'];
        if (animationUpdateColor && (bSizeChanged || bColorChanged))
          this._color = animationUpdateColor;
      }
    }

    /**
     * Creates the insert animation for this node.
     * @param {DvtTreeAnimationHandler} handler The animation handler, which can be used to chain animations.
     */
    animateInsert(handler) {
      // Animate if this is a data change animation (not drilling), or if this node is not an
      // ancestor of the old root in a drilling animation.  The ancestors are not animated
      // so that they appear at the beginning of the animation.
      if (!handler.isDrillAnimation() || !handler.isAncestorInsert(this)) {
        // Initialize the start state
        this.setAlpha(0);

        var anim = new dvt.AnimFadeIn(this.getView().getCtx(), this, this.getView().__getAnimDur());
        handler.add(anim, this._ANIMATION_INSERT_PRIORITY);

        // Recurse to children
        if (this.hasChildren()) {
          for (var i = 0; i < this._children.length; i++) {
            this._children[i].animateInsert(handler);
          }
        }
      }
    }

    /**
     * Creates the delete animation for this node.
     * @param {DvtTreeAnimationHandler} handler The animation handler, which can be used to chain animations.
     * @param {dvt.Container} container The container where deletes should be moved for animation.
     */
    animateDelete(handler, container) {
      // Move to the new container, since the old container may be removed
      container.addChild(this._shape);

      // Create the animation
      var anim = new dvt.AnimFadeOut(this.getView().getCtx(), this, this.getView().__getAnimDur());
      handler.add(anim, this._ANIMATION_DELETE_PRIORITY);

      // Drilling animations are handled across all nodes up front, no recursion needed
      if (!handler.isDrillAnimation() && this.hasChildren()) {
        // Recurse to children
        for (var i = 0; i < this._children.length; i++) {
          this._children[i].animateDelete(handler, container);
        }
      }
    }

    /**
     * Returns true if this node has children.
     * @return {boolean} true if this node has children.
     */
    hasChildren() {
      return this._children != null && this._children.length > 0;
    }

    /**
     * Returns true if the component is using a data provider and this node has children.
     * @return {boolean} true if this node has children.
     */
    hasDPChildren() {
      var dataProvider = this.getView().getOptions().data;
      if (dataProvider) {
        var childDP = dataProvider.getChildDataProvider(this.getId());
        return childDP ? childDP.isEmpty() !== 'yes' : false;
      }
      return false;
    }

    /**
     * Returns true the node has a pattern set.
     * @return {boolean} true the node has a pattern set.
     */
    hasPattern() {
      return this._pattern && this._pattern != 'none';
    }

    /**
     * Returns the parent node for this node.
     * @return {DvtTreeNode} The parent node.
     * @protected
     */
    GetParent() {
      return this._parent;
    }

    /**
     * Returns the depth of the node in the tree.
     * @return {number} The depth of the node.
     * @protected
     */
    GetDepth() {
      var depth = 0;
      var parent = this.GetParent();
      while (parent) {
        depth++;
        parent = parent.GetParent();
      }
      return depth;
    }

    /**
     * Returns the dvt.Fill to use for this node.
     * @return {dvt.Fill}
     */
    GetFill() {
      if (this.hasPattern()) return new dvt.PatternFill(this._pattern, this._color);
      else return new dvt.SolidFill(this._color);
    }

    /**
     * Calculates and returns a color for node text that will provide a
     * good contrast with the given color.
     * @param {DvtTreeNode} node
     * @protected
     */
    static GetNodeTextColor(node) {
      if (node.hasPattern()) {
        // Use black for all patterned nodes against white backgrounds
        return '#000000';
      } else {
        return dvt.ColorUtils.getContrastingTextColor(node._color);
      }
    }

    ApplyLabelTextStyle(text) {
      var defaultFillColor = DvtTreeNode.GetNodeTextColor(this);
      text.setSolidFill(defaultFillColor);

      text.setCSSStyle(this.getMergedLabelTextStyle());

      // In high contrast mode, override the app settings and use the default colors
      if (dvt.Agent.isHighContrast()) text.setSolidFill(defaultFillColor);
    }

    /**
     * Returns the merged node text style.
     * @return {dvt.CSSStyle}
     */
    getMergedLabelTextStyle() {
      var textStyle = [];
      textStyle.push(this._view.getOptions()['nodeDefaults']['labelStyle']);
      if (this._labelStyle) textStyle.push(this._labelStyle);
      return dvt.CSSStyle.mergeStyles(textStyle);
    }

    GetTextSize() {
      var size = this._DEFAULT_TEXT_SIZE;
      var textStyle = this._view.getOptions()['nodeDefaults']['labelStyle'];
      var fontSize = textStyle.getFontSize();
      if (fontSize) {
        size = parseFloat(fontSize);
      }
      return size;
    }

    /**
     * Returns the background color for the label. Returns null if none specified.
     * @return {string}
     */
    getLabelBackgroundColor() {
      var nodeLabelStyle = this._labelStyle;
      var nodeBackgroundColor = nodeLabelStyle ? nodeLabelStyle.getStyle('background-color') : null;
      if (nodeBackgroundColor) return nodeBackgroundColor;
      var textStyle = this._view.getOptions()['nodeDefaults']['labelStyle'];
      return textStyle.getStyle('background-color');
    }

    /**
     * Returns the primary displayable for this node.
     * @return {dvt.Displayable}
     */
    getDisplayable() {
      // Note: Called by automation APIs
      return this._shape;
    }

    /**
     * Returns the label string for this node.
     * @return {string}
     */
    getLabel() {
      // Note: Called by automation APIs
      return this._textStr;
    }

    /**
     * Returns whether this node can be double clicked.
     */
    isDoubleClickable() {
      return this.isDrillReplaceEnabled();
    }

    /**
     * Updates the aria label of the node.
     * @protected
     */
    UpdateAriaLabel() {
      // subclasses should override
    }

    /**
     * Determines if the node is the root
     * @return {boolean}
     * @protected
     */
    isRootNode() {
      return (
        dvt.Obj.compareValues(
          this.getView().getCtx(),
          this.getId(),
          this.getView().getRootNode().getId()
        ) || this.isArtificialRoot()
      );
    }
  }

  DvtTreeNode.__NODE_SELECTED_SHADOW = new dvt.Shadow(
    Math.sqrt(2),
    Math.sqrt(2),
    5 / 3,
    'rgba(0, 0, 0, 0.5)'
  );

  /**
   * Simple logical object for drilling and tooltip support.
   * @param {DvtTreeNode} node The associated node, if it has been created.
   * @param {string} id The id of the associated node.
   * @param {string} tooltip The tooltip to display.
   * @param {string|function} datatip The datatip to display.
   * @param {string|function} datatipColor The border color of the datatip.
   * @class
   * @constructor
   * @implements {DvtTooltipSource}
   */
  class DvtTreePeer extends dvt.SimpleObjPeer {
    constructor(node, id, tooltip, datatip, datatipColor) {
      super(tooltip, datatip, datatipColor);
      this._node = node;
      this._id = id;
      this._bDrillable = false;
    }

    /**
     * Returns the id of the associated node.
     * @return {string}
     */
    getId() {
      return this._id;
    }

    /**
     * Returns true if the associated object is drillable.
     * @return {boolean}
     */
    isDrillable() {
      return this._bDrillable;
    }

    /**
     * Specifies whether the associated object is drillable.
     * @param {boolean} drillable
     */
    setDrillable(drillable) {
      this._bDrillable = drillable;
    }

    /**
     * Handles a mouse over event on the associated object.
     */
    handleMouseOver() {
      // Expand/Collapse: hide button if displayed
      if (this._node && this._node.handleMouseOver) {
        this._node.handleMouseOver();
      }
    }

    /**
     * Handles a mouse out event on the associated object.
     */
    handleMouseOut() {
      // Expand/Collapse: hide button if displayed
      if (this._node && this._node.handleMouseOut) {
        this._node.handleMouseOut();
      }
    }
  }

  /**
   * Utility functions for DvtTreeView.
   * @class
   */
  const DvtTreeUtils = {
    /**
     * Returns the maximum depth of the tree rooted at the specified node.
     * @param {DvtTreeNode} node The subtree to find the depth for.
     * @param {number} depth The depth of the specified node.
     * @return {number} The maximum depth of the tree.
     */
    calcMaxDepth: (node, depth) => {
      var maxDepth = depth;
      var children = node.getChildNodes();
      if (children) {
        for (var i = 0; i < children.length; i++) {
          var childDepth = DvtTreeUtils.calcMaxDepth(children[i], depth + 1);
          maxDepth = Math.max(maxDepth, childDepth);
        }
      }
      return maxDepth;
    },

    /**
     * Returns the node count of the tree rooted at the specified node.
     * @param {DvtTreeNode} node The subtree to find the depth for.
     * @return {number}
     */
    calcNodeCount: (node) => {
      var count = 1;
      var children = node.getChildNodes();
      if (children) {
        for (var i = 0; i < children.length; i++) {
          count += DvtTreeUtils.calcNodeCount(children[i]);
        }
      }
      return count;
    },

    /**
     * Returns an array containing all the nodes in the subtree rooted at the specified node.
     * @param {DvtTreeNode} node
     * @return {array}
     */
    getAllNodes: (node) => {
      var ret = [];
      DvtTreeUtils._addNodesToArray(node, ret);
      return ret;
    },

    /**
     * Returns an array containing all the node ids in the subtree rooted at the specified node.
     * @param {DvtTreeNode} node
     * @return {array}
     */
    getAllIds: (node) => {
      return DvtTreeUtils.getAllNodes(node).map((node) => node.getId());
    },

    /**
     * Returns an array containing all the visible nodes in the subtree rooted at the specified node.
     * @param {DvtTreeNode} node
     * @return {array}
     */
    getAllVisibleNodes: (node) => {
      var ret = [];
      DvtTreeUtils._addNodesToArray(node, ret, false, true);
      return ret;
    },

    /**
     * Returns an array containing all the leaf nodes in the subtree rooted at the specified node.
     * @param {DvtTreeNode} node
     * @return {array}
     */
    getLeafNodes: (node) => {
      var ret = [];
      DvtTreeUtils._addNodesToArray(node, ret, true);
      return ret;
    },

    /**
     * Returns true if the node with the specified options would be hidden.
     * @param {object} categoryMap The boolean map of hidden categories.
     * @param {object} nodeOptions The options for the node to process.
     * @return {boolean}
     */
    isHiddenNode: (categoryMap, nodeOptions) => {
      return dvt.ArrayUtils.hasAnyMapItem(categoryMap, nodeOptions['categories']);
    },

    /**
     * Recursively returns an array containing all nodes in the subtree of a given node.
     * @param {DvtTreeNode} node The root of the subtree whose children will be returned.
     * @param {array} ret The array onto which to add the subtree.
     * @param {boolean=} bLeafOnly Optional flag to specify whether only leaf nodes should be included.
     * @param {boolean=} bRendered Optional flag to specify whether only rendered nodes should be included.
     * @private
     */
    _addNodesToArray: (node, ret, bLeafOnly, bRendered) => {
      if (!node) return;

      var children = node.getChildNodes();
      var childCount = children ? children.length : 0;

      // Add this node
      if ((!bLeafOnly || childCount == 0) && !(bRendered && !node.getDisplayable())) ret.push(node);

      // Add its children
      for (var i = 0; i < childCount; i++) {
        DvtTreeUtils._addNodesToArray(children[i], ret, bLeafOnly, bRendered);
      }
    },

    /**
     * Recursively look for the root and set the ancestors object.
     * @param {dvt.Context} context The component's context.
     * @param {object} nodes Array of nodes.
     * @param {string} rootId The id of the root.
     * @param {object} ancestors Array of ancestors.
     * @return {object} Object containg root and ancestors
     */
    findRootAndAncestors: (context, nodes, rootId, ancestors) => {
      for (var i = 0; i < nodes.length; i++) {
        if (dvt.Obj.compareValues(context, nodes[i]['id'], rootId)) {
          return { root: nodes[i], ancestors: ancestors };
        } else if (nodes[i]['nodes']) {
          ancestors.unshift(nodes[i]);
          var result = DvtTreeUtils.findRootAndAncestors(
            context,
            nodes[i]['nodes'],
            rootId,
            ancestors
          );
          if (result != null) return result;
          ancestors.shift();
        }
      }
      return null;
    }
  };

  /**
   * Animation handler for tree data objects.
   * @param {dvt.Context} context The platform specific context object.
   * @param {dvt.Container} deleteContainer The container where deletes should be moved for animation.
   * @class DvtTreeAnimationHandler
   * @constructor
   */
  class DvtTreeAnimationHandler extends dvt.DataAnimationHandler {
    /**
     * Animates the tree component, with support for data changes and drilling.
     * @param {DvtTreeNode} oldRoot The state of the tree before the animation.
     * @param {DvtTreeNode} newRoot The state of the tree after the animation.
     * @param {array} oldAncestors The array of ancestors for the old root node.
     * @param {array} newAncestors The array of ancestors for the new root node.
     */
    animate(oldRoot, newRoot, oldAncestors, newAncestors) {
      this._bDrill = false; // true if this is a drilling animation
      this._oldRoot = oldRoot;
      this._oldAncestors = oldAncestors;

      // Determine whether this is a drill or data change animation
      if (
        DvtTreeAnimationHandler._isAncestor(newAncestors, oldRoot) ||
        DvtTreeAnimationHandler._isAncestor(oldAncestors, newRoot)
      ) {
        // Drilling
        this._bDrill = true;
        var oldList = oldRoot.getDescendantNodes();
        var newList = newRoot.getDescendantNodes();
        oldList.push(oldRoot);
        newList.push(newRoot);
        this.constructAnimation(oldList, newList);
      } else {
        // Data Change Animation
        this.constructAnimation([oldRoot], [newRoot]);
      }
    }

    /**
     * Returns true if the current animation is for a drill operation.  The nodes
     * will call this function and handle their animations differently.
     * @return {boolean}
     */
    isDrillAnimation() {
      return this._bDrill;
    }

    /**
     * Returns true if the specified node was previously an ancestor of the old root.  A value
     * of true indicates that an insert animation should not be performed on this node.
     * @param {DvtTreeNode} node
     */
    isAncestorInsert(node) {
      if (this._bDrill)
        return (
          dvt.Obj.compareValues(this.getCtx(), this._oldRoot.getId(), node.getId()) ||
          DvtTreeAnimationHandler._isAncestor(this._oldAncestors, node)
        );
      else return false;
    }

    /**
     * Returns true if the specified node is contained in the array of ancestors.
     * @param {array} ancestors The array of ancestors to search.
     * @param {DvtTreeNode} node The node to search for.
     * @return {boolean}
     */
    static _isAncestor(ancestors, node) {
      if (!node || !ancestors) return false;

      // Iterate through the array and search for the node
      for (var i = 0; i < ancestors.length; i++) {
        if (ancestors[i]['id'] == node.getId()) return true;
      }

      // No match found
      return false;
    }
  }

  /**
   * Default values and utility functions for breadcrumb versioning.
   * @class
   */
  const DvtBreadcrumbsDefaults = {
    /**
     * Defaults for version 1.
     */
    VERSION_1: {
      labelStyle: dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_11 + 'color: #003286;',
      disabledLabelStyle: dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_11,

      //*********** Internal Attributes *************************************************//
      __labelGap: 4,
      __labelSeparator: '>'
    },

    /**
     * Combines the user options with the defaults for the specified version.  Returns the
     * combined options object.  This object will contain internal attribute values and
     * should be accessed in internal code only.
     * @param {object} userOptions The object containing options specifications for this component.
     * @return {object} The combined options object.
     */
    calcOptions: (userOptions) => {
      var defaults = DvtBreadcrumbsDefaults._getDefaults();

      // Use defaults if no overrides specified
      if (!userOptions) return defaults;
      // Merge the options object with the defaults
      else return dvt.JsonUtils.merge(userOptions, defaults);
    },

    /**
     * Returns the default options object for the specified version of the component.
     * @private
     */
    _getDefaults: () => {
      // Note: Version checking will eventually get added here
      // Note: Future defaults objects are deltas on top of previous objects
      return dvt.JsonUtils.clone(DvtBreadcrumbsDefaults.VERSION_1);
    },

    /**
     * Scales down gap sizes based on the size of the component.
     * @param {object} options The object containing options specifications for this component.
     * @param {Number} defaultSize The default gap size.
     * @return {Number}
     */
    getGapSize: (options, defaultSize) => {
      return Math.ceil(defaultSize * options['layout']['gapRatio']);
    }
  };

  /**
   * Simple logical object for drilling and tooltip support.
   * @param {string} id The id of the associated breadcrumb.
   * @param {dvt.Displayable} displayable The displayable associated with this logical object
   * @class
   * @constructor
   * @implements {DvtTooltipSource}
   */
  class DvtBreadcrumbsPeer extends dvt.SimpleObjPeer {
    constructor(id, displayable, displayableText) {
      super();
      this._id = id;
      this._bDrillable = false;
      this._displayable = displayable;
      this._displayableText = displayableText;
      this._truncated = false;
    }

    /**
     * Returns the id of the associated breadcrumb.
     * @return {string}
     */
    getId() {
      return this._id;
    }

    /**
     * Returns true if the associated breadcrumb is drillable.
     * @return {boolean}
     */
    isDrillable() {
      return this._bDrillable;
    }

    /**
     * Specifies whether the associated breadcrumb is drillable.
     * @param {boolean} drillable
     */
    setDrillable(drillable) {
      this._bDrillable = drillable;
    }

    /**
     * @override
     */
    getDisplayable() {
      return this._displayable;
    }

    /**
     * @override
     */
    getTooltip() {
      return this._truncated ? this._displayableText : null;
    }

    /**
     * Specifies if the displayable will be truncated when rendered.
     * @param {boolean} truncated
     */
    setTruncated(truncated) {
      this._truncated = truncated;
    }
  }

  /**
   * Event Manager for Breadcrumbs.
   */
  class DvtBreadcrumbsEventManager extends dvt.EventManager {
    constructor(breadcrumbs, context, callback, callbackObj) {
      super(context, callback, callbackObj);
      this._breadcrumbs = breadcrumbs;
    }

    /**
     * @override
     */
    OnClick(event) {
      super.OnClick(event);
      this._processBreadcrumbs(this.GetLogicalObject(event.target));
    }

    /**
     * @override
     */
    HandleTouchClickInternal(event) {
      this._processBreadcrumbs(this.GetLogicalObject(event.target));
    }

    /**
     * Processes a possible drill event on a breadcrumb.
     * @param {obj} The logical object which was clicked or tapped.
     * @private
     */
    _processBreadcrumbs(obj) {
      if (obj && obj instanceof DvtBreadcrumbsPeer && obj.isDrillable()) {
        // Create the event and fire to callbacks
        var event = dvt.EventFactory.newBreadcrumbsDrillEvent(obj.getId());
        this.FireEvent(event, this._breadcrumbs);
      }
    }

    /**
     * @override
     */
    handleKeyboardEvent(event) {
      var eventConsumed = true;
      var keyCode = event.keyCode;

      if (keyCode == dvt.KeyboardEvent.TAB) {
        var curCrumbIdx = this._breadcrumbs.updateCrumbFocus(event.shiftKey);

        // If tabbing out of interactive breadcrumbs, propagate event. Last crumb is not interactive.
        if (curCrumbIdx == -1) {
          eventConsumed = false;
        } else {
          // Accessibility Support
          this.UpdateActiveElement(this._breadcrumbs.getCrumb(curCrumbIdx));
        }
      } else if (keyCode == dvt.KeyboardEvent.ENTER) {
        var crumb = this._breadcrumbs.getCrumb(this._breadcrumbs.getCurrentCrumbIndex());
        this._processBreadcrumbs(this.GetLogicalObject(crumb));
      }

      // keystrokes are consumed by default, unless we tab out of the breadcrumbs
      if (eventConsumed) dvt.EventManager.consumeEvent(event);

      return eventConsumed;
    }
  }

  /**
   * Renderer for Breadcrumbs.
   * @class
   */
  const DvtBreadcrumbsRenderer = {
    /**
     * @private
     */
    _TOUCH_BUFFER: 3,

    /**
     * Renders the breadcrumbs in the specified area.
     * @param {Breadcrumbs} breadcrumbs The breadcrumbs being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {number} width The width of the component.
     */
    render: (breadcrumbs, container, width) => {
      var context = breadcrumbs.getCtx();
      var dataItems = breadcrumbs.__getData().items ? breadcrumbs.__getData().items : [];
      var options = breadcrumbs.__getOptions();
      var eventManager = breadcrumbs.getEventManager();

      // Create all of the labels
      var labels = [];
      var peers = [];
      for (var i = 0; i < dataItems.length; i++) {
        var dataItem = dataItems[i];
        if (dataItem) {
          // If the item does not have text, use "" as a placeholder to indicate text was missing
          var textStr = dataItem['label'] ? dataItem['label'] : '';

          // Create the text element
          var label = DvtBreadcrumbsRenderer._createLabel(
            context,
            textStr,
            options,
            i < dataItems.length - 1
          );
          labels.push(label);

          // Create peer for interactivity support
          var peer = new DvtBreadcrumbsPeer(dataItem['id'], label, textStr);
          eventManager.associate(label, peer);
          peers.push(peer);

          // All except the last label are drillable
          if (i < dataItems.length - 1) {
            peer.setDrillable(true);
          }
        }
      }
      breadcrumbs.SetCrumbs(labels);

      // Position the labels
      if (dvt.Agent.isRightToLeft(context))
        DvtBreadcrumbsRenderer._positionLabelsBidi(breadcrumbs, container, width, labels, peers);
      else DvtBreadcrumbsRenderer._positionLabels(breadcrumbs, container, width, labels, peers);
    },

    /**
     * Create a state for a label button.
     * @param {dvt.Context} context The dvt.Context to use.
     * @param {string} text The text for the label.
     * @param {dvt.CSSStyle} cssStyle Style object for the label.
     * @return {dvt.Rect}
     * @private
     */
    _createButtonState: (context, text, cssStyle) => {
      var dvtText = new dvt.OutputText(context, text, 0, 0);
      dvtText.setMouseEnabled(false);
      dvtText.setCSSStyle(cssStyle);

      var padTop = cssStyle.getPadding(dvt.CSSStyle.PADDING_TOP);
      var padRight = cssStyle.getPadding(dvt.CSSStyle.PADDING_RIGHT);
      var padBottom = cssStyle.getPadding(dvt.CSSStyle.PADDING_BOTTOM);
      var padLeft = cssStyle.getPadding(dvt.CSSStyle.PADDING_LEFT);

      var labelDims = dvt.DisplayableUtils.getDimensionsForced(context, dvtText);
      var state = new dvt.Rect(
        context,
        0,
        0,
        labelDims.w + padLeft + padRight,
        labelDims.h + padTop + padBottom
      );
      state.setInvisibleFill();
      state.setCSSStyle(cssStyle);
      dvtText.setTranslate(padLeft, padTop);
      state.addChild(dvtText);

      return state;
    },

    /**
     * Create the label object, which could be a dvt.Button, dvt.Rect, or dvt.Text.
     * @param {dvt.Context} context The dvt.Context to use.
     * @param {string} textStr The text string for the label.
     * @param {object} options Options for the breadcrumbs.
     * @param {boolean} bEnabled Flag indicating if this label is enabled or not.
     * @return {object}
     * @private
     */
    _createLabel: (context, textStr, options, bEnabled) => {
      var label;
      if (bEnabled && (options.labelStyleOver || options.labelStyleDown)) {
        var enaCss = new dvt.CSSStyle(options.labelStyle);
        var ovrCss = new dvt.CSSStyle(options.labelStyleOver);
        var dwnCss = new dvt.CSSStyle(options.labelStyleDown);

        var ena = DvtBreadcrumbsRenderer._createButtonState(context, textStr, enaCss);
        var ovr = DvtBreadcrumbsRenderer._createButtonState(context, textStr, ovrCss);
        var dwn = DvtBreadcrumbsRenderer._createButtonState(context, textStr, dwnCss);

        label = new dvt.Button(context, ena, ovr, dwn);
        label.setAriaRole('link');
        label.setAriaProperty('label', textStr);
      } else {
        var labelStyle = bEnabled ? options.labelStyle : options.disabledLabelStyle;
        var cssStyle = new dvt.CSSStyle(labelStyle);
        if (
          cssStyle.getPadding(dvt.CSSStyle.PADDING_LEFT) ||
          cssStyle.getPadding(dvt.CSSStyle.PADDING_RIGHT) ||
          cssStyle.getPadding(dvt.CSSStyle.PADDING_TOP) ||
          cssStyle.getPadding(dvt.CSSStyle.PADDING_BOTTOM)
        ) {
          label = DvtBreadcrumbsRenderer._createButtonState(context, textStr, cssStyle);
        } else {
          label = new dvt.OutputText(context, textStr, 0, 0);
          label.setCSSStyle(cssStyle);
        }
      }
      return label;
    },

    /**
     * Get the label text string.
     * @param {object} label The label object, which could be a dvt.Button, dvt.Rect, or dvt.Text.
     * @return {string}
     * @private
     */
    _getLabelTextString: (label) => {
      var text;
      if (label instanceof dvt.Button) {
        var ena = label.upState;
        text = ena.getChildAt(0);
        return text.getTextString();
      } else if (label instanceof dvt.Rect) {
        text = label.getChildAt(0);
        return text.getTextString();
      }

      return label.getTextString();
    },

    /**
     * Truncates the breadcrumb labels.
     * @param {object} label The label object, which could be a dvt.Button, dvt.Rect, or dvt.Text.
     * @param {number} maxWidth The maximum label width.
     * @private
     */
    _truncateLabels: (label, maxWidth) => {
      var text;
      if (label instanceof dvt.Button) {
        var ena = label.upState;
        text = ena.getChildAt(0);
        dvt.TextUtils.fitText(
          text,
          Math.max(maxWidth - text.getTranslateX(), 0),
          Infinity,
          text.getParent()
        );
        var ovr = label.overState;
        text = ovr.getChildAt(0);
        dvt.TextUtils.fitText(
          text,
          Math.max(maxWidth - text.getTranslateX(), 0),
          Infinity,
          text.getParent()
        );
        var dwn = label.downState;
        text = dwn.getChildAt(0);
        dvt.TextUtils.fitText(
          text,
          Math.max(maxWidth - text.getTranslateX(), 0),
          Infinity,
          text.getParent()
        );
        return;
      } else if (label instanceof dvt.Rect) {
        text = label.getChildAt(0);
        dvt.TextUtils.fitText(
          text,
          Math.max(maxWidth - text.getTranslateX(), 0),
          Infinity,
          text.getParent()
        );
        return;
      }

      dvt.TextUtils.fitText(label, maxWidth, Infinity, label.getParent());
    },

    /**
     * Positions the labels into the given container.
     * @param {Breadcrumbs} breadcrumbs The breadcrumbs being rendered.
     * @param {dvt.Container} container The container in which the labels will be added.
     * @param {number} availWidth The available width for positioning.
     * @param {array} labels The array of dvt.Text labels.
     * @param {array} peers The array of peers corresponding to the labels.  The last label will never have a peer.
     * @private
     */
    _positionLabels: (breadcrumbs, container, availWidth, labels, peers) => {
      var options = breadcrumbs.__getOptions();
      var eventManager = breadcrumbs.getEventManager();

      var arDims = [];
      var maxHeight = 0;
      for (var j = 0; j < labels.length; j++) {
        container.addChild(labels[j]);
        var labelDims = labels[j].getDimensions();
        arDims[j] = labelDims;
        maxHeight = Math.max(labelDims.h, maxHeight);
        container.removeChild(labels[j]);
      }

      var x = 0;
      for (var i = 0; i < labels.length; i++) {
        // Add and position the label, then calculate the space for the next one
        container.addChild(labels[i]);
        var dims = arDims[i];
        labels[i].setTranslate(x, 0.5 * (maxHeight - dims.h));

        // Add a buffer to make the objects easier to interact with on touch devices
        if (dvt.Agent.isTouchDevice()) {
          var rect = new dvt.Rect(
            container.getCtx(),
            -DvtBreadcrumbsRenderer._TOUCH_BUFFER,
            -DvtBreadcrumbsRenderer._TOUCH_BUFFER,
            dims.w + 2 * DvtBreadcrumbsRenderer._TOUCH_BUFFER,
            dims.h + 2 * DvtBreadcrumbsRenderer._TOUCH_BUFFER
          );
          rect.setInvisibleFill();
          labels[i].addChild(rect);
          if (i < peers.length) eventManager.associate(rect, peers[i]);
        }

        // Truncate if needed
        if (x + dims.w > availWidth) {
          var labelString = DvtBreadcrumbsRenderer._getLabelTextString(labels[i]);
          DvtBreadcrumbsRenderer._truncateLabels(labels[i], availWidth - x);

          // Add a tooltip
          if (i < peers.length) peers[i].setTruncated(true);
          else eventManager.associate(labels[i], new dvt.SimpleObjPeer(labelString));

          // No more space, all done
          return;
        } // Update the x
        else x += dims.w + options.__labelGap;

        // Add a separator if there are more labels
        if (i < labels.length - 1) {
          var separator = DvtBreadcrumbsRenderer._newSeparator(breadcrumbs);
          container.addChild(separator);
          var sepDims = separator.getDimensions();
          separator.setTranslate(x, 0.5 * (maxHeight - sepDims.h));

          // Check that there is enough space
          var separatorWidth = sepDims.w;
          if (x + separatorWidth > availWidth) {
            container.removeChild(separator);
            return;
          }

          x += separatorWidth + options.__labelGap;
        }
      }
    },

    /**
     * Positions the labels into the given container for BIDI locales
     * @param {Breadcrumbs} breadcrumbs The breadcrumbs being rendered.
     * @param {dvt.Container} container The container in which the labels will be added.
     * @param {number} availWidth The available width for positioning.
     * @param {array} labels The array of dvt.Text labels.
     * @param {array} peers The array of peers corresponding to the labels.  The last label will never have a peer.
     * @private
     */
    _positionLabelsBidi: (breadcrumbs, container, availWidth, labels, peers) => {
      var options = breadcrumbs.__getOptions();
      var eventManager = breadcrumbs.getEventManager();

      var x = availWidth;
      for (var i = 0; i < labels.length; i++) {
        // Add and position the label, then calculate the space for the next one
        container.addChild(labels[i]);
        var dims = labels[i].getDimensions();

        // Add a buffer to make the objects easier to interact with on touch devices
        if (dvt.Agent.isTouchDevice()) {
          var rect = new dvt.Rect(
            container.getCtx(),
            -DvtBreadcrumbsRenderer._TOUCH_BUFFER,
            -DvtBreadcrumbsRenderer._TOUCH_BUFFER,
            dims.w + 2 * DvtBreadcrumbsRenderer._TOUCH_BUFFER,
            dims.h + 2 * DvtBreadcrumbsRenderer._TOUCH_BUFFER
          );
          rect.setInvisibleFill();
          labels[i].addChild(rect);
          if (i < peers.length) eventManager.associate(rect, peers[i]);
        }

        // Truncate if needed
        if (x - dims.w < 0) {
          var labelString = DvtBreadcrumbsRenderer._getLabelTextString(labels[i]);
          DvtBreadcrumbsRenderer._truncateLabels(labels[i], x);
          labels[i].setTranslateX(0);

          // Add a tooltip
          if (i < peers.length) peers[i].setTruncated(true);
          else eventManager.associate(labels[i], new dvt.SimpleObjPeer(labelString));

          // No more space, all done
          return;
        } else {
          // Position and update the x
          labels[i].setTranslateX(x - dims.w);
          x -= dims.w + options.__labelGap;
        }

        // Add a separator if there are more labels
        if (i < labels.length - 1) {
          var separator = DvtBreadcrumbsRenderer._newSeparator(breadcrumbs);
          container.addChild(separator);

          // Check that there is enough space
          var separatorWidth = separator.getDimensions().w;
          if (x - separatorWidth < 0) {
            container.removeChild(separator);
            return;
          } else {
            // Enough space, position
            separator.setTranslateX(x - separatorWidth);
            x -= separatorWidth + options.__labelGap;
          }
        }
      }
    },

    /**
     * Creates and returns a new separator for breadcrumb labels.
     * @param {Breadcrumbs} breadcrumbs The breadcrumbs being rendered.
     * @return {dvt.Text}
     * @private
     */
    _newSeparator: (breadcrumbs) => {
      var options = breadcrumbs.__getOptions();
      var label = new dvt.OutputText(breadcrumbs.getCtx(), options.__labelSeparator, 0, 0);
      label.setCSSStyle(new dvt.CSSStyle(options.labelStyle));
      return label;
    }
  };

  /**
   * DvtBreadcrumbs component.
   * @param {dvt.Context} context The rendering context.
   * @param {string} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The optional object instance on which the callback function is defined.
   * @param {object} options The object containing options specifications for this component.
   * @class
   * @constructor
   * @extends {dvt.Container}
   */
  class DvtBreadcrumbs extends dvt.Container {
    constructor(context, callback, callbackObj, options) {
      super(context);
      this.setOptions(options);

      // Create the event handler and add event listeners
      this._eventHandler = new DvtBreadcrumbsEventManager(this, context, callback, callbackObj);
      this._eventHandler.addListeners(this);

      // Make sure the object has an id for clipRect naming
      this.setId('breadcrumbs' + 1000 + Math.floor(Math.random() * 1000000000)); //@RandomNumberOK

      // index of the breadcrumb with keyboard focus. index is used to find the
      // Object stored in the _data object's item field
      this._curCrumbIdx = -1;

      // the dvt.Rect we use to show which breadcrumb has keyboard focus
      this._keyboardFocusRect = null;
      this._crumbs = null;
    }

    /**
     * Specifies the non-data options for this component.
     * @param {object} options The object containing options specifications for this component.
     * @protected
     */
    setOptions(options) {
      this._options = DvtBreadcrumbsDefaults.calcOptions(options);
    }

    /**
     * Renders the component with the specified data.  If no data is supplied to a component
     * that has already been rendered, the component will be re-rendered to the specified size.
     * @param {object} data The object containing data for this component.
     * @param {number} width The width of the component.
     */
    render(data, width) {
      // Update if new data has been provided. Clone to avoid modifying the provided object.
      this._data = data ? dvt.JsonUtils.clone(data) : this._data;

      // Clear previous contents
      this.removeChildren();
      this.SetCrumbs(null);

      // Render the contents
      DvtBreadcrumbsRenderer.render(this, this, width);
    }

    /**
     * Returns the data object for the component.
     * @return {object} The object containing data for this component.
     */
    __getData() {
      return this._data ? this._data : {};
    }

    /**
     * Returns the evaluated options object, which contains the user specifications
     * merged with the defaults.
     * @return {object} The options object.
     */
    __getOptions() {
      return this._options;
    }

    /**
     * Returns the dvt.EventManager for this component.
     * @return {dvt.EventManager}
     */
    getEventManager() {
      return this._eventHandler;
    }

    /**
     * @override
     */
    hideKeyboardFocusEffect() {
      this._curCrumbIdx = -1;
      this._updateKeyboardFocusEffect(this._curCrumbIdx);
    }

    /**
     * Returns the current crumb index
     * @return {Number}
     */
    getCurrentCrumbIndex() {
      return this._curCrumbIdx;
    }

    /**
     * Returns the number of crumbs
     * @return {Number}
     */
    getNumCrumbs() {
      return this._data.items.length;
    }

    /**
     * Updates the crumb in focus
     * @param {boolean} bShiftKey True if the shift key was pressed
     * @return {Number} The currently focused crumb index or -1 if none
     */
    updateCrumbFocus(bShiftKey) {
      var prevCrumbIdx = this._curCrumbIdx;
      this._curCrumbIdx = this._getUpdatedCrumbIndex(prevCrumbIdx, !bShiftKey);
      this._updateKeyboardFocusEffect(this._curCrumbIdx);
      return this._curCrumbIdx;
    }

    /**
     * Returns the updated crumb index which has focus or -1 if tabbed out of the breadcrumbs. Used only for keyboarding.
     * @param {Number} prevIndex The previously focused crumb index
     * @param {boolean} bForward True if we are tabbing forward, false if we are shift-tabbing backwards
     * @return {Number} The currently focused crumb index in the _data object's item array or -1 if none
     * @private
     */
    _getUpdatedCrumbIndex(prevIndex, bForward) {
      // Handle initial keyboarding into breadcrumbs
      if (prevIndex == -1) {
        if (bForward) return 0;
        else return this._data.items.length - 2;
      }

      // Handle subsequent tab and shift-tab traversal of breadcrumbs
      if (bForward) {
        if (prevIndex == this._data.items.length - 2)
          return -1; // The last breadcrumb is not actionable so we are actually tabbing out of the breadcrumbs
        else return ++prevIndex;
      } else {
        if (prevIndex == 0) return -1;
        else return --prevIndex;
      }
    }

    /**
     * Updates the visual keyboard focus effect
     * @param {Number} nextIdx The index in the _data object's item array
     *        indicating the next breadcrumb
     * @private
     */
    _updateKeyboardFocusEffect(nextIdx) {
      // find the dvt.Text objects corresponding to the prev and next breadcrumbs
      var prevKeyboardFocusRect = this._keyboardFocusRect;
      var nextKeyboardFocusRect = null;

      // find the next breadcrumb to apply focus effect to
      var nextCrumbObj = this.getCrumb(nextIdx);
      if (nextCrumbObj) {
        var peer = this._eventHandler.GetLogicalObject(nextCrumbObj);
        if (peer && peer.isDrillable && peer.isDrillable()) {
          // create a new focus effect rectangle for the next breadcrumb
          var context = this.getCtx();
          var bounds = nextCrumbObj.getDimensions();
          var matrix = nextCrumbObj.getMatrix();
          nextKeyboardFocusRect = new dvt.KeyboardFocusEffect(context, this, bounds, matrix);
          this._keyboardFocusRect = nextKeyboardFocusRect;
        } else {
          // we hit the last breadcrumb, which is not drillable. so this tab
          // takes us out of the breadcrumbs
          // clear the reference to the focus rectangle; the focus rectangle
          // is actually removed from the container at the end of this method
          this._keyboardFocusRect = null;
        }
      }

      if (prevKeyboardFocusRect) prevKeyboardFocusRect.hide();

      if (nextKeyboardFocusRect) nextKeyboardFocusRect.show();
    }

    /**
     * Returns the physical object corresponding to the breadcrumb with
     * keyboard focus
     * @param {Number} crumbIdx The index of the breadcrumb of interest
     * @return {dvt.Button}
     */
    getCrumb(crumbIdx) {
      var crumbs = this.GetCrumbs();
      if (crumbIdx < 0 || !crumbs || crumbIdx >= crumbs.length) return null;
      return crumbs[crumbIdx];
    }

    /**
     * Returns the index of the breadcrumb of interest
     * @param {dvt.Button} crumb The breadcrumb of interest
     * @return {Number}
     */
    getCrumbIndex(crumb) {
      var crumbs = this.GetCrumbs();
      for (var i = 0; i < crumbs.length; i++) {
        if (crumbs[i] == crumb) return i;
      }
      return -1;
    }

    /**
     * Sets an array of breadcrumbs
     * @param {array} crumbs
     * @protected
     */
    SetCrumbs(crumbs) {
      this._crumbs = crumbs;
    }

    /**
     * Gets an array of breadcrumbs
     * @return {array}
     * @protected
     */
    GetCrumbs() {
      return this._crumbs;
    }
  }

  /**
   * IconButton
   * @param {dvt.Context} context
   * @param {'outlined'|'borderless'} chroming
   * @param {object} iconOptions supports keys style, size, pos
   * @param {dvt.Shape} background (optional)
   * @param {string} id
   * @param {object=} callback
   * @param {object=} callbackObj
   * @constructor
   */
  class DvtSunburstIconButton extends dvt.IconButton {
    /**
     * @override
     */
    OnMouseOver(event) {
      super.OnMouseOver(event);
      this._callbackObj.showHoverEffect();
    }

    /**
     * @override
     */
    OnMouseOut(event) {
      super.OnMouseOver(event);
      this._callbackObj.hideHoverEffect();
    }
  }

  /**
   * Class representing a sunburst node.
   * @param {Sunburst} sunburst The owning sunburst component.
   * @param {object} props The properties for the node.
   * @class
   * @constructor
   * @extends {DvtTreeNode}
   * @implements {DvtKeyboardNavigable}
   */
  class DvtSunburstNode extends DvtTreeNode {
    constructor(sunburst, props) {
      super(sunburst, props);
      var sunburstOptions = this._view.getOptions();
      var nodeDefaults = sunburstOptions['nodeDefaults'];
      this._labelDisplay = props['labelDisplay']
        ? props['labelDisplay']
        : nodeDefaults['labelDisplay'];
      this._evaluateExpanded(sunburst, props);
      this._labelHalign = props['labelHalign'] ? props['labelHalign'] : nodeDefaults['labelHalign'];

      this._radius = props['radius'];
      this._className = props['className'] || props['svgClassName'];
      this._style = props['style'] || props['svgStyle'];

      this._showDisclosure =
        props['showDisclosure'] === 'on' ||
        (props['showDisclosure'] !== 'off' && nodeDefaults['showDisclosure'] === 'on');

      /**
       * Total buffer for both sizes of the label.
       * @const
       * @private
       */
      this.TEXT_BUFFER_HORIZ = 6;
      /** @private @const */
      this._EXPAND_ICON_SIZE = 16;
      /** @private @const */
      this._MIN_ARC_LENGTH = 1.5;
      /** @private @const */
      this._MIN_ANGLE_EXTENT = 0.0006;

      /** @const **/
      this.LARGE_DATASET_THRESHOLD = 1000;

      // Relative radius of the center node compared to the other layers
      /** @private @const */
      this._CENTER_ARTIFICIAL_ROOT_RADIUS = 0.25;
      /** @private @const */
      this._CENTER_NODE_RADIUS = 0.5;
    }

    /**
     * @override
     */
    render(container) {
      // If not positioned, don't render
      if (!this._hasLayout) return;

      // Keep a reference to the container, for use after z-order changes
      this._nodeContainer = container;

      // Create the shape object
      this._shape = this._createShapeNode();
      container.addChild(this._shape);

      if (!(this.isRootNode() && this._createRootNodeContent())) {
        // Create the text object
        this._text = this._createTextNode(this._shape);
        if (this._text != null) {
          this._shape.addChild(this._text);

          // For pattern nodes, add a background to make the text readable
          var backgroundColor = this.getLabelBackgroundColor();
          if (this.hasPattern() || backgroundColor) {
            var txtDims = this._text.getDimensions();
            this._textBackground = new dvt.Rect(
              this.getView().getCtx(),
              txtDims.x,
              txtDims.y,
              txtDims.w,
              txtDims.h
            );
            if (backgroundColor) this._textBackground.setSolidFill(backgroundColor);
            else this._textBackground.setSolidFill('#FFFFFF');
            this._textBackground.setMouseEnabled(false);
            this._shape.addChild(this._textBackground);

            // Add the transform for rotated text
            var matrix = this._text.getMatrix();
            if (!matrix.isIdentity()) this._textBackground.setMatrix(matrix);

            // Reorder the text in front of the background rect
            this._shape.addChild(this._text);
          }
        }
      }

      // WAI-ARIA
      this._shape.setAriaRole('img');

      // Styling attributes
      this._shape.setStyle(this._style);
      this._shape.setClassName(this._className);

      this.UpdateAriaLabel();

      // Create the container for the children and render
      this.renderChildren(container);
    }

    /**
     * @override
     */
    renderChildren(container) {
      // Render children of this node
      var children = this.getChildNodes();
      var hasLargeNodeCount = this.getView().__getNodeCount() >= this.LARGE_DATASET_THRESHOLD;
      if (children != null) {
        var prevEndCoord = 0;
        for (var i = 0; i < children.length; i++) {
          var render = true;
          var angleExtent = children[i]._angleExtent;

          //  - rendering issues for funnel/pie/sunburst charts
          if (angleExtent >= this._MIN_ANGLE_EXTENT) {
            // Skip rendering some of the thin sunburst outer nodes
            if (hasLargeNodeCount) {
              var nodeOuterRadius = children[i]._getOuterRadius();
              var nodeArc = angleExtent * nodeOuterRadius;
              var endCoord = (children[i]._startAngle + angleExtent) * nodeOuterRadius;

              if (
                nodeArc < this._MIN_ARC_LENGTH &&
                Math.abs(prevEndCoord - endCoord) < this._MIN_ARC_LENGTH
              ) {
                render = false;
              } else prevEndCoord = endCoord;
            }
            if (render) children[i].render(container);
          }
        }
      }
    }

    /**
     * @override
     */
    setSelected(selected) {
      // Delegate to super to store the state
      super.setSelected(selected);

      if (this._shape == null) return;

      // Update the visual feedback
      if (this.isSelected()) {
        // Apply the selection effect to the shape
        this._shape.setSelected(true);

        // Move to the front of the z-order
        this.getView().__moveToSelectedLayer(this._shape);
      } else {
        // Restore the regular effect to the shape
        this._shape.setSelected(false);

        //  - collapse button is under the node on mobile devices.
        // During de-selection on mobile, if the node has an expand/collapse button it must still be moved to the front of
        // the z-order or else the button can get obscured.
        if (dvt.Agent.isTouchDevice() && this._expandButton)
          this.getView().__moveToSelectedLayer(this._shape);
        else if (this._nodeContainer)
          // Restore the z-order
          this._nodeContainer.addChild(this._shape);
      }
    }

    /**
     * @override
     */
    showHoverEffect() {
      if (!this._shape || !this._hasLayout) return;

      // Apply the hover effect
      this._shape.showHoverEffect();

      // Show the hover effect as an overlay
      if (this.isSelected()) {
        // Move to the front of the selected layer
        this.getView().__moveToSelectedLayer(this._shape);
      } else {
        // Unselected nodes get moved to the hover layer
        this.getView().__moveToHoverLayer(this._shape);
      }
    }

    /**
     * @override
     */
    hideHoverEffect() {
      // Don't continue if the shape isn't defined or if the node is currently focused by the keyboard.
      if (!this._shape || !this._hasLayout || this.isShowingKeyboardFocusEffect()) return;

      // Hide the hover effect
      this._shape.hideHoverEffect();

      // Restore the z-order
      if (!this.isSelected() && this._nodeContainer) this._nodeContainer.addChild(this._shape);
    }

    /**
     * Returns true if expand/collapse is enabled for this node.
     * @return {boolean}
     */
    isExpandCollapseEnabled() {
      return this._showDisclosure;
    }

    /**
     * @override
     */
    getNextNavigable(event) {
      var keyCode;
      var next;
      var navigables;
      var idx;
      var root;

      if (event.type === dvt.MouseEvent.CLICK) {
        return super.getNextNavigable(event);
      }

      keyCode = event.keyCode;

      if (keyCode === dvt.KeyboardEvent.SPACE && event.ctrlKey) {
        // multi-select node with current focus; so we navigate to ourself and then let the selection handler take
        // care of the selection
        return this;
      }

      root = this;
      while (root.GetParent()) {
        root = root.GetParent();
      }

      navigables = this.GetNodesAtDepth(root, this.GetDepth());
      idx = DvtSunburstNode._findNodeIndex(this, navigables);

      var midAngle = this._startAngle + this._angleExtent / 2;
      midAngle = DvtSunburstNode._normalizedRadToDeg(midAngle);

      var lastVisitedChild;
      var lastVisitedMidAngle;

      switch (keyCode) {
        case dvt.KeyboardEvent.UP_ARROW:
          // if at root or upper half of sunburst, go to the last visited child if it is in the upper half of the sunburst
          // otherwise use free-form navigation to select the next child in the "up" direction
          if (this === root || midAngle > 180) {
            lastVisitedChild = this.GetLastVisitedChild();
            if (lastVisitedChild) {
              lastVisitedMidAngle = lastVisitedChild._startAngle + lastVisitedChild._angleExtent / 2;
              lastVisitedMidAngle = DvtSunburstNode._normalizedRadToDeg(lastVisitedMidAngle);
              if (lastVisitedMidAngle > 180) {
                return lastVisitedChild;
              }
            }
            next = dvt.KeyboardHandler.getNextAdjacentNavigable(
              this,
              event,
              this.getDescendantNodes()
            );
          }
          // lower half of sunburst
          else next = this._navigateToParent();

          break;

        case dvt.KeyboardEvent.DOWN_ARROW:
          // if at root or lower half of sunburst, go to the last visited child if it is in the lower half of the sunburst
          // otherwise use free-form navigation to select the next child in the "down" direction
          if (this === root || (midAngle >= 0 && midAngle <= 180)) {
            lastVisitedChild = this.GetLastVisitedChild();
            if (lastVisitedChild) {
              lastVisitedMidAngle = lastVisitedChild._startAngle + lastVisitedChild._angleExtent / 2;
              lastVisitedMidAngle = DvtSunburstNode._normalizedRadToDeg(lastVisitedMidAngle);
              if (lastVisitedMidAngle >= 0 && lastVisitedMidAngle <= 180) {
                return lastVisitedChild;
              }
            }
            next = dvt.KeyboardHandler.getNextAdjacentNavigable(
              this,
              event,
              this.getDescendantNodes()
            );
          }
          // upper half of sunburst
          else next = this._navigateToParent();

          break;

        case dvt.KeyboardEvent.LEFT_ARROW:
          if (navigables.length === 1) {
            next = this;
          } else {
            if (idx === 0) next = navigables[navigables.length - 1];
            else next = navigables[idx - 1];
          }
          break;

        case dvt.KeyboardEvent.RIGHT_ARROW:
          if (navigables.length === 1) {
            next = this;
          } else {
            if (idx === navigables.length - 1) next = navigables[0];
            else next = navigables[idx + 1];
          }
          break;

        default:
          next = this;
          break;
      }

      next.MarkAsLastVisitedChild();

      return next;
    }

    /**
     * Returns the parent node and updates last visited child state.
     *
     * @return {DvtSunburstNode} This node's parent, if it is not the root.  Root otherwise
     */
    _navigateToParent() {
      // move to the parent, if not the root node
      var parent = this.GetParent();
      var next;
      if (parent) {
        next = parent;
        // update the grandparent's last visited child to be the current node's parent
        parent.MarkAsLastVisitedChild();
      } else next = this;

      next.MarkAsLastVisitedChild();
      return next;
    }

    /**
     * Normalizes an angle to fall between 0 and 360.  0 is the usual 0 degree mark in trigonometry, but angles are
     * measured CLOCKWISE
     *
     * @param {Number} rad
     * @return {Number} The equivalent angle in degrees
     * @private
     */
    static _normalizedRadToDeg(rad) {
      var deg = dvt.Math.radsToDegrees(rad);
      if (deg < 0) deg += 360;
      else if (deg > 360) deg -= 360;
      return deg;
    }

    /**
     * @override
     */
    getKeyboardBoundingBox() {
      if (this._shape) {
        var bounds = this._shape.getDimensions();
        var point = new dvt.Point(bounds.x, bounds.y);
        point = this._shape.localToStage(point);
        bounds.x = point.x;
        bounds.y = point.y;
        return bounds;
      } else {
        return new dvt.Rectangle(0, 0, 0, 0);
      }
    }

    /**
     * @override
     */
    getTargetElem() {
      if (this._shape) return this._shape.getElem();
      return null;
    }

    //**************** End Overridden Functions *****************//

    /**
     * Sets the result of the layout.
     * @param {number} innerRadius The inner radius of the node.
     * @param {number} outerRadius The outer radius of the node.
     * @param {number} startAngle The starting angle for this node in radians.
     * @param {number} angleExtent The extent of this node in radians.
     */
    setLayoutParams(innerRadius, outerRadius, startAngle, angleExtent) {
      this._innerRadius = innerRadius;
      this._outerRadius = outerRadius;
      this._startAngle = startAngle;
      this._angleExtent = angleExtent;

      // Set a flag indicating layout is done
      this._hasLayout = true;
    }

    /**
     * @override
     */
    GetFill() {
      if (this.isArtificialRoot())
        return dvt.SolidFill.invisibleFill(); // make it as close to invisible as possible
      else return super.GetFill();
    }

    /**
     * @param {array} endState Optional argument to compute shortest path from start to end state
     * @override
     */
    GetAnimParams(endState) {
      var r = dvt.ColorUtils.getRed(this._color);
      var g = dvt.ColorUtils.getGreen(this._color);
      var b = dvt.ColorUtils.getBlue(this._color);

      //  - JS SUNBURST: ROTATION ANIMATION NOT CONSISTENT
      var startAngle = this._startAngle;
      if (endState && !isNaN(endState[2])) {
        var endStartAngle = endState[2];
        if (endStartAngle - this._startAngle > Math.PI) {
          startAngle += DvtSunburstNode.TWO_PI;
        } else if (this._startAngle - endStartAngle > Math.PI) {
          startAngle -= DvtSunburstNode.TWO_PI;
        }
      }
      return [this._innerRadius, this._outerRadius, startAngle, this._angleExtent, r, g, b];
    }

    /**
     * @override
     */
    SetAnimParams(params) {
      // Update the layout params
      this.setLayoutParams(params[0], params[1], params[2], params[3]);

      // Update the color.  Round them since color parts must be ints
      var r = Math.round(params[4]);
      var g = Math.round(params[5]);
      var b = Math.round(params[6]);
      this._color = dvt.ColorUtils.makeRGB(r, g, b);

      // Update the shapes
      this.updateShapes(false);
    }

    /**
     * @override
     */
    animateUpdate(handler, oldNode) {
      if (
        this.isRootNode() &&
        (oldNode._getOuterRadius() !== this._getOuterRadius() || oldNode.getId() !== this.getId())
      )
        this._removeRootNodeContentOverlay();

      var oldNodeRendered = oldNode._hasLayout && oldNode._angleExtent > 0;
      var nodeRendered = this._hasLayout && this._angleExtent > 0;
      if (oldNodeRendered && nodeRendered) {
        // Current and old node exist and is visible, show the update animation
        super.animateUpdate(handler, oldNode);
      } else if (nodeRendered) {
        // Old node did not exist or was not visible, treat as insert
        this.animateInsert(handler);
      } else if (oldNodeRendered) {
        // Current node is not visible, treat as delete
        this.animateDelete(handler, handler.getDeleteContainer());
      }
    }

    /**
     * @override
     */
    animateInsert(handler, oldNode) {
      if (this.isRootNode()) this._removeRootNodeContentOverlay();

      super.animateInsert(handler, oldNode);
    }

    /**
     * @override
     */
    animateDelete(handler, container) {
      if (this.isRootNode()) this._removeRootNodeContentOverlay();

      super.animateDelete(handler, container);
    }

    /**
     * @override
     */
    getNodeUnderPoint(x, y) {
      // Check if the node contains the coords
      if (this.contains(x, y)) return this;
      else {
        var childNodes = this.getChildNodes();
        for (var i = 0; i < childNodes.length; i++) {
          var ret = childNodes[i].getNodeUnderPoint(x, y);
          if (ret) return ret;
        }
      }

      // No node found, return null
      return null;
    }

    /**
     * @override
     */
    contains(x, y) {
      var radius = DvtSunburstNode._calcRadius(x, y);
      var angle = DvtSunburstNode._calcAngle(x, y);
      return this.ContainsRadius(radius) && this.ContainsAngle(angle);
    }

    /**
     * Returns true if this node contains the given angle.
     * @param {number} angle An angle in radius between 0 and 2pi.
     * @protected
     */
    ContainsAngle(angle) {
      // The start and end angles may be from -2pi to 2pi. Adjust angle to check.
      // First adjust angle to be greater than the start angle.
      while (angle < this._startAngle) {
        angle += DvtSunburstNode.TWO_PI;
      }
      // Then adjust to be within 2*PI of it
      while (angle - this._startAngle > DvtSunburstNode.TWO_PI) {
        angle -= DvtSunburstNode.TWO_PI;
      }

      return angle >= this._startAngle && angle <= this._startAngle + this._angleExtent;
    }

    /**
     * Returns true if this node contains the given radius.
     * @protected
     */
    ContainsRadius(radius) {
      return radius >= this._innerRadius && radius <= this._outerRadius;
    }

    /**
     * Returns the location of the point on the arc with the specified radius
     * at the specified angle.
     * @private
     */
    static _calcPointOnArc(radius, angle) {
      var x = Math.cos(angle) * radius;
      var y = Math.sin(angle) * radius;
      return { x: x, y: y };
    }

    /**
     * Returns the angle for a point with the specified coordinates
     * relative to the origin.
     * @param {number} x The x coordinate.
     * @param {number} y The y coordinate.
     * @return {number} The angle for the point with the specified coordinates, in radians.
     * @private
     */
    static _calcAngle(x, y) {
      var angle = Math.atan2(y, x);

      // Adjust, since all node angles are between 0 and 2pi
      if (angle < 0) angle += DvtSunburstNode.TWO_PI;
      else if (angle > DvtSunburstNode.TWO_PI) angle -= DvtSunburstNode.TWO_PI;

      return angle;
    }

    /**
     * Returns the radius for a point with the specified coordinates
     * relative to the origin.
     * @param {number} x The x coordinate.
     * @param {number} y The y coordinate.
     * @return {number} The radius for the point with the specified coordinates.
     * @private
     */
    static _calcRadius(x, y) {
      return Math.sqrt(x * x + y * y);
    }

    /**
     * Creates and return the shape element for this node.
     * @return {dvt.Shape} The shape element for this node.
     * @private
     */
    _createShapeNode() {
      // Skip if no angle extent
      if (!this._angleExtent || this._angleExtent <= 0) return null;

      // Finally create the shape
      var cmd = this._createPathCmd();
      var shape = new dvt.Path(this.getView().getCtx(), cmd);

      // Add pointers between this node and the shape
      this.getView().getEventManager().associate(shape, this);

      // Apply style properties
      shape.setAlpha(this.getAlpha());
      shape.setFill(this.GetFill());

      // Get the defaults
      var nodeDefaults = this._view.getOptions()['nodeDefaults'];

      // Get node overrides
      var options = this.getOptions();
      var borderColor = options['borderColor'] || nodeDefaults['borderColor'];
      var borderWidth =
        options['borderWidth'] == null ? nodeDefaults['borderWidth'] : options['borderWidth'];

      // Apply the border color, border width, selected, and hover strokes
      shape.setStroke(new dvt.Stroke(borderColor, 1, borderWidth));
      if (shape.getCtx().getThemeBehavior() !== 'redwood') {
        shape.setHoverStroke(new dvt.Stroke(nodeDefaults['hoverColor'], 1, 3));
        shape.setSelectedStroke(
          new dvt.Stroke(nodeDefaults['selectedInnerColor'], 1, 1.5),
          new dvt.Stroke(nodeDefaults['selectedOuterColor'], 1, 3.5)
        );
        shape.setSelectedHoverStroke(new dvt.Stroke(nodeDefaults['hoverColor'], 1, 3));
      } else {
        var hoverColor = this.getColor();
        shape.setHoverStroke(
          new dvt.Stroke(nodeDefaults['selectedInnerColor'], 1, 1),
          new dvt.Stroke(hoverColor, 1, 3.5)
        );
        shape.setSelectedStroke(
          new dvt.Stroke(nodeDefaults['selectedInnerColor'], 1, 1),
          new dvt.Stroke(nodeDefaults['selectedOuterColor'], 1, 3.5)
        );
        shape.setSelectedHoverStroke(
          new dvt.Stroke(nodeDefaults['selectedInnerColor'], 1, 1),
          new dvt.Stroke(nodeDefaults['selectedOuterColor'], 1, 3.5)
        );
      }
      // Allows selection cursor to be shown over nodes if nodeSelection is enabled and node is selectable
      shape.setSelectable(this.isSelectable());

      // Set pointer cursor if drillable
      if (this.isDrillReplaceEnabled()) shape.setCursor('pointer');

      // Artificial Root Support: The artificial root is hollow and mouse transparent
      if (this.isArtificialRoot()) {
        shape.setAlpha(0.001);
        shape.setMouseEnabled(false);
      }

      return shape;
    }

    /**
     * Calculates and returns the path command for the current node.
     * @return {string} The path command for the current node.
     * @private
     */
    _createPathCmd() {
      var cmd;
      var p1, p2, p3, p4;

      if (this._angleExtent < DvtSunburstNode.TWO_PI) {
        // Calc the 4 points.  We will draw:
        // 1. Arc from p1 to p2
        // 2. Line/Move from p2 to p3
        // 3. Arc from p3 to p4
        // 4. Line from p4 to p1
        p1 = DvtSunburstNode._calcPointOnArc(this._outerRadius, this._startAngle);
        p2 = DvtSunburstNode._calcPointOnArc(this._outerRadius, this._startAngle + this._angleExtent);
        p3 = DvtSunburstNode._calcPointOnArc(this._innerRadius, this._startAngle + this._angleExtent);
        p4 = DvtSunburstNode._calcPointOnArc(this._innerRadius, this._startAngle);

        // Create the command and feed it into the path
        cmd =
          dvt.PathUtils.moveTo(p1.x, p1.y) +
          dvt.PathUtils.arcTo(
            this._outerRadius,
            this._outerRadius,
            this._angleExtent,
            1,
            p2.x,
            p2.y
          ) +
          dvt.PathUtils.lineTo(p3.x, p3.y) +
          dvt.PathUtils.arcTo(
            this._innerRadius,
            this._innerRadius,
            this._angleExtent,
            0,
            p4.x,
            p4.y
          ) +
          dvt.PathUtils.closePath();
      } else {
        // To work around a chrome/safari bug, we draw two segments around each of the outer and inner arcs
        p1 = DvtSunburstNode._calcPointOnArc(this._outerRadius, this._startAngle);
        p2 = DvtSunburstNode._calcPointOnArc(
          this._outerRadius,
          this._startAngle + this._angleExtent / 2
        );
        p3 = DvtSunburstNode._calcPointOnArc(this._innerRadius, this._startAngle);
        p4 = DvtSunburstNode._calcPointOnArc(
          this._innerRadius,
          this._startAngle + this._angleExtent / 2
        );

        // Create the command and return it
        cmd =
          dvt.PathUtils.moveTo(p1.x, p1.y) +
          dvt.PathUtils.arcTo(
            this._outerRadius,
            this._outerRadius,
            this._angleExtent / 2,
            1,
            p2.x,
            p2.y
          ) +
          dvt.PathUtils.arcTo(
            this._outerRadius,
            this._outerRadius,
            this._angleExtent / 2,
            1,
            p1.x,
            p1.y
          );

        // Add the inner segment for a hollow center
        if (this._innerRadius > 0)
          cmd +=
            dvt.PathUtils.moveTo(p4.x, p4.y) +
            dvt.PathUtils.arcTo(
              this._innerRadius,
              this._innerRadius,
              this._angleExtent / 2,
              0,
              p3.x,
              p3.y
            ) +
            dvt.PathUtils.arcTo(
              this._innerRadius,
              this._innerRadius,
              this._angleExtent / 2,
              0,
              p4.x,
              p4.y
            );

        cmd += dvt.PathUtils.closePath();
      }

      return cmd;
    }

    /**
     * Creates and positions the expand or collapse button button for this node.
     * @param {dvt.Container} container The container for the button.
     * @return {DvtSunburstIconButton}
     * @private
     */
    _createExpandCollapseButton(container) {
      var bDisclosed = this.isDisclosed();
      if (
        !container ||
        !this.isExpandCollapseEnabled() ||
        (!this.hasChildren() && bDisclosed) ||
        (this.getView().hasDataProvider() && !this.hasDPChildren())
      )
        return null;

      // Create the button and add to the container
      var button = bDisclosed ? this._getCollapseButton() : this._getExpandButton();
      this._positionButton(button);
      container.addChild(button);

      // Associate a blank peer so the button is not treated as part of the node
      var tooltip =
        this.getView().getOptions().translations[
          this.isDisclosed() ? 'tooltipCollapse' : 'tooltipExpand'
        ];

      this.getView()
        .getEventManager()
        .associate(button, new DvtTreePeer(this, this.getId(), tooltip));

      return button;
    }

    /**
     * Positions the expand or collapse button button for this node.
     * @param {DvtSunburstIconButton} button
     * @private
     */
    _positionButton(button) {
      var center = DvtSunburstNode._calcPointOnArc(
        this._outerRadius,
        this._startAngle + this._angleExtent / 2
      );
      button.setTranslate(
        center.x - this._EXPAND_ICON_SIZE / 2,
        center.y - this._EXPAND_ICON_SIZE / 2
      );
    }

    /**
     * Creates and return the text element for this node.
     * @param {dvt.Container} container The container element.
     * @return {dvt.Text} The text element for this node.
     * @private
     */
    _createTextNode(container) {
      // If no text or no container to place the text, return
      if (!this._textStr || !container || !this._labelDisplay || this._labelDisplay === 'off')
        return null;

      // : If this is the root node, and the angleExtent is not the full circle, then skip.
      if (this === this.getView().getRootNode() && this._angleExtent < DvtSunburstNode.TWO_PI)
        return null;

      // Determine whether the label is rotated. Rotation is only supported for SVG and XML for now
      var bRotated = false;
      if (this._labelDisplay === 'auto') {
        // If labelDisplay is auto, don't use rotated labels for non-IE on windows, since rotated text does not look good
        // in those browsers.
        bRotated =
          dvt.Agent.browser === 'ie' ||
          dvt.Agent.browser === 'edge' ||
          dvt.Agent.os !== 'windows' ||
          dvt.Agent.isEnvironmentTest();
      } else if (this._labelDisplay === 'rotated') bRotated = true;

      // Don't use rotated labels for the center node or 100% nodes.
      if (bRotated && this._angleExtent < this.getView().__getAngleExtent())
        return this._createTextRotated(container);
      else return this._createTextHoriz(container);
    }

    /**
     * Creates and returns a horizontal text element for this node.
     * @param {dvt.Container} container The container element.
     * @return {dvt.Text} The text element for this node.
     * @private
     */
    _createTextHoriz(container) {
      var textAnchor;
      if (this._innerRadius === 0) textAnchor = { x: 0, y: 0 };
      else {
        // Calculate the anchor point for the text
        textAnchor = DvtSunburstNode._calcPointOnArc(
          (this._innerRadius + this._outerRadius) / 2,
          this._startAngle + this._angleExtent / 2
        );

        // Using the approx width of the text, decide whether the text won't fit
        var approxWidth = (3 * this.GetTextSize()) / 2;
        var leftAngle = DvtSunburstNode._calcAngle(textAnchor.x - approxWidth / 2, textAnchor.y);
        var rightAngle = DvtSunburstNode._calcAngle(textAnchor.x + approxWidth / 2, textAnchor.y);
        if (!(this.ContainsAngle(leftAngle) && this.ContainsAngle(rightAngle))) textAnchor = null;
      }

      if (!textAnchor) return null;

      // Now create the text
      var text = new dvt.OutputText(
        this.getView().getCtx(),
        this._textStr,
        textAnchor.x,
        textAnchor.y,
        null
      );
      text.setFontSize(this.GetTextSize());
      this.ApplyLabelTextStyle(text);
      text.alignCenter();
      text.alignMiddle();
      text.setMouseEnabled(false);

      // Find the estimated dimensions of the label
      var textDims = text.getDimensions();

      // Find the largest rectangle that will fit.  The height is accurate, so we only need to check the width.
      var x1 = textAnchor.x;
      var x2 = textAnchor.x;
      var y1 = textAnchor.y - textDims.h / 2;
      var y2 = textAnchor.y + textDims.h / 2;

      // Calculate the left-most x1 that will fit
      var fitX1 = true;
      while (this.contains(x1, y1) && this.contains(x1, y2) && fitX1) {
        x1--;
        if (this._angleExtent > Math.PI && textAnchor.x - x1 >= textDims.w) fitX1 = false;
      }

      // Calculate the right-most x2 that will fit
      var fitX2 = true;
      while (this.contains(x2, y1) && this.contains(x2, y2) && fitX2) {
        x2++;
        if (this._angleExtent > Math.PI && x2 - textAnchor.x >= textDims.w) fitX2 = false;
      }

      // Add a 3-pixel buffer on each side (accounts for the potential extra pixel in the while loop on failed check)
      x1 += 3;
      x2 -= 3;

      // Adjust the anchor point to the midpoint of available space if truncation would occur centered at current anchor
      var usableSpace = 2 * Math.min(textAnchor.x - x1, x2 - textAnchor.x);
      if (usableSpace < textDims.w) {
        text.setX((x1 + x2) / 2);
        usableSpace = x2 - x1;
      }

      // Truncate and return the text if it fits in the available space
      var labelMinLength = this.getView().getOptions()['nodeDefaults']['labelMinLength'];
      return dvt.TextUtils.fitText(text, usableSpace, textDims.h, container, labelMinLength)
        ? text
        : null;
    }

    /**
     * Creates and returns a rotated text element for this node. Adds the text to the container if it's not empty.
     * @param {dvt.Container} container The container element.
     * @return {dvt.Text} The text element for this node.
     * @private
     */
    _createTextRotated(container) {
      // Note: This function will never get called for 360 degree nodes, so it does not handle them.

      // Calculate the available space for placing text. For text height, we estimate using the inner circumference divided
      // by angle proportion and multiplied by a fudge factor to account for the difference between an arc and straight
      // line. The innerStartCoord is used to provide a buffer for very small inner radii.
      var innerStartCoord = Math.max(this._innerRadius, 10);
      var availWidth = this._outerRadius - innerStartCoord - this.TEXT_BUFFER_HORIZ;
      var availHeight = this._angleExtent * (innerStartCoord + this.TEXT_BUFFER_HORIZ) * 1.1;

      // Skip remaining calculations if availHeight is too small to reasonably fit text
      if (availHeight <= 6) return null;

      // Create the text
      var text = new dvt.OutputText(this.getView().getCtx(), this._textStr, 0, 0);
      text.setFontSize(this.GetTextSize());

      // Set Style Properties
      this.ApplyLabelTextStyle(text);

      // Truncate the text if necessary
      if (!dvt.TextUtils.fitText(text, availWidth, availHeight, container)) return null;

      // Calculate the anchor point and alignment for the text
      var anchorRadius = (innerStartCoord + this._outerRadius) / 2;
      if (this._labelHalign === 'inner' || this._labelHalign === 'outer') {
        container.addChild(text);
        var actualTextWidth = text.getDimensions().w;
        var textBuffer = this.TEXT_BUFFER_HORIZ * 0.75; // Use a slightly greater proportion of the buffer for padding

        if (this._labelHalign === 'inner')
          anchorRadius = innerStartCoord + textBuffer + actualTextWidth / 2;
        else if (this._labelHalign === 'outer')
          anchorRadius = this._outerRadius - textBuffer - actualTextWidth / 2;
      }

      var textAnchor = DvtSunburstNode._calcPointOnArc(
        anchorRadius,
        this._startAngle + this._angleExtent / 2
      );
      text.alignCenter();
      text.alignMiddle();

      // Calc the angle, adjusted to between 0 and 2pi
      var angle = this._startAngle + this._angleExtent / 2;
      angle = angle >= DvtSunburstNode.TWO_PI ? angle - DvtSunburstNode.TWO_PI : angle;
      angle = angle < 0 ? angle + DvtSunburstNode.TWO_PI : angle;

      // If the anchor is on the left half, adjust the rotation for readability
      if (angle > 0.5 * Math.PI && angle < 1.5 * Math.PI) angle += Math.PI;

      // Finally rotate and position
      text.setRotation(angle);
      text.setTranslate(textAnchor.x, textAnchor.y);
      text.setMouseEnabled(false);
      return text;
    }

    /**
     * Returns the index at which the given node can be found in the input array
     * @param {DvtSunburstNode} node
     * @param {Array} nodes
     * @return {Number} The index at which this node is found, or -1 if not found
     * @private
     */
    static _findNodeIndex(node, nodes) {
      for (var i = 0; i < nodes.length; i++) {
        if (node === nodes[i]) return i;
      }

      return -1;
    }

    /**
     * Handles a mouse over event on the node.
     */
    handleMouseOver() {
      // Expand/Collapse: draw button if needed
      if (!this._expandButton) this._expandButton = this._createExpandCollapseButton(this._shape);

      super.handleMouseOver();
    }

    /**
     * Handles a mouse out event on the node.
     */
    handleMouseOut() {
      // Expand/Collapse: hide button if displayed
      if (this._expandButton && this._shape) {
        this._shape.removeChild(this._expandButton);
        this._expandButton = null;
      }
      super.handleMouseOut();
    }

    /**
     * Updates the shapes of this node for the current layout params.
     * @param {boolean} bRecurse True if the subtree of this node should also be updated.
     */
    updateShapes(bRecurse) {
      if (!this._shape) return;

      // Update Shape
      var cmd = this._createPathCmd();
      this._shape.setCmds(cmd);

      // Update the text.  The current impl just destroys and recreates the text element.
      if (!this._showRootContent()) {
        // Update the text.  The current impl just destroys and recreates the text element.
        if (this._text) this._shape.removeChild(this._text);

        this._text = this._createTextNode(this._shape);

        // Recalculate text background size and position
        var backgroundColor = this.getLabelBackgroundColor();
        if (this._text && (this.hasPattern() || backgroundColor)) {
          var dims = this._text.getDimensions();
          if (this._textBackground) this._textBackground.setRect(dims.x, dims.y, dims.w, dims.h);
          else {
            this._textBackground = new dvt.Rect(
              this.getView().getCtx(),
              dims.x,
              dims.y,
              dims.w,
              dims.h
            );
            if (backgroundColor) this._textBackground.setSolidFill(backgroundColor);
            else this._textBackground.setSolidFill('#FFFFFF');
            this._textBackground.setMouseEnabled(false);
            this._shape.addChild(this._textBackground);
          }

          // Add the transform for rotated text
          var matrix = this._text.getMatrix();
          if (!matrix.isIdentity()) this._textBackground.setMatrix(matrix);
        } else if (this._textBackground) {
          this._shape.removeChild(this._textBackground);
          this._textBackground = null;
        }
      }

      // Reposition the expandButton, which might be visible while rotating on touch devices
      if (dvt.Agent.isTouchDevice() && this._expandButton) this._positionButton(this._expandButton);

      // Update the color
      this._shape.setFill(this.GetFill());

      // Recurse to the children
      if (bRecurse) {
        var children = this.getChildNodes();
        for (var i = 0; i < children.length; i++) children[i].updateShapes(true);
      }
    }

    /**
     * @override
     */
    getDropSiteFeedback() {
      if (this._shape instanceof dvt.Circle)
        return new dvt.Circle(
          this.getView().getCtx(),
          this._shape.getCx(),
          this._shape.getCy(),
          this._shape.getRadius()
        );
      else if (this._shape instanceof dvt.Path)
        return new dvt.Path(this.getView().getCtx(), this._shape.getCmds());
      else return null;
    }

    /**
     * Returns the expand button.
     * @return {dvt.Displayable}
     * @private
     */
    _getExpandButton() {
      return this._getButtonHelper('expand');
    }

    /**
     * Returns the collapse button.
     * @return {dvt.Displayable}
     * @private
     */
    _getCollapseButton() {
      return this._getButtonHelper('collapse');
    }

    _getButtonHelper(resourceKey) {
      var context = this.getView().getCtx();

      var half = this._EXPAND_ICON_SIZE / 2;
      var background = new dvt.Circle(context, half, half, half + 2);
      // icon
      var resources = this.getView().getOptions()['_resources'];
      var iconClass = resources[resourceKey];
      var iconStyle = dvt.ToolkitUtils.getIconStyle(context, iconClass);
      // Create button and hook up click listener
      return new DvtSunburstIconButton(
        context,
        'outlined',
        { style: iconStyle, size: this._EXPAND_ICON_SIZE },
        background,
        null,
        this.expandCollapse,
        this
      );
    }

    /**
     * Returns true if this node is isolated
     * @return {Boolean} true if this node is isolated, false otherwise
     */
    __isIsolated() {
      return this._bIsolated;
    }

    /**
     * Delegate to the view to handle the event
     * @param {object} event
     */
    expandCollapse(event) {
      this.getView().expandCollapseNode(this.getId());
      // Stop propagation to prevent selection from changing
      event.stopPropagation();
    }

    /**
     * Returns the expand/collapse button. Used for automation.
     * @return {dvt.Displayable}
     */
    getExpandCollapseButton() {
      return this._expandButton;
    }

    /**
     * Returns true if the root content should be displayed
     * @return {boolean}
     * @private
     */
    _showRootContent() {
      return !this._parent && this._innerRadius === 0 && this._angleExtent === DvtSunburstNode.TWO_PI;
    }

    /**
     * Returns the relative radius of this node.
     * @return {number}
     */
    __getRadius() {
      if (this._radius != null)
        // radius explicitly specified
        return Number(this._radius);
      else if (!this.GetParent()) {
        // Root Node
        if (this.isArtificialRoot()) return this._CENTER_ARTIFICIAL_ROOT_RADIUS;
        else return this._CENTER_NODE_RADIUS;
      } else return 1;
    }

    /**
     * Returns the aria label of the node
     * @return {string} aria label of the node
     */
    getAriaLabel() {
      var translations = this.getView().getOptions().translations;

      var states = [];
      if (this.isSelectable())
        states.push(translations[this.isSelected() ? 'stateSelected' : 'stateUnselected']);
      if (this.isExpandCollapseEnabled())
        states.push(translations[this.isDisclosed() ? 'stateExpanded' : 'stateCollapsed']);
      if (this.isDrillReplaceEnabled()) states.push(translations.stateDrillable);

      return dvt.Displayable.generateAriaLabel(this.getShortDesc(), states, () =>
        DvtTreeNode.getShortDescContext(this)
      );
    }

    /**
     * @override
     */
    UpdateAriaLabel() {
      if (!dvt.Agent.deferAriaCreation() && this._shape)
        // need the null check bc it may fail in unit test (TreemapSelectionTest)
        this._shape.setAriaProperty('label', this.getAriaLabel());
    }

    /**
     * @override
     */
    getDataContext() {
      var dataContext = super.getDataContext();
      dataContext['radius'] = this.__getRadius();
      return dataContext;
    }

    /**
     * Create the custom center content for the root node.
     * @return {boolean} return false if the content is not rendered
     * @private
     */
    _createRootNodeContent() {
      var sunburst = this.getView();
      var options = sunburst.getOptions();
      var rootNodeRenderer = options['rootNodeContent']['renderer'];

      this._removeRootNodeContentOverlay();

      if (!rootNodeRenderer) return false;

      var context = sunburst.getCtx();

      var centerCoord = sunburst.getCenterPoint();
      var outerRadius = this._outerRadius;

      var innerSquareDimension = outerRadius * Math.sqrt(2);
      var nodeOptions = this.getOptions();
      var itemData;
      var data = nodeOptions;
      if (nodeOptions._noTemplate) {
        itemData = nodeOptions._itemData;
        data = nodeOptions._itemData;
      } else if (nodeOptions._itemData) {
        itemData = nodeOptions._itemData;
        nodeOptions = dvt.JsonUtils.clone(nodeOptions);
        data = nodeOptions;
        delete nodeOptions._itemData;
      }

      var dataContext = {
        outerBounds: {
          x: centerCoord.x - outerRadius,
          y: centerCoord.y - outerRadius,
          width: 2 * outerRadius,
          height: 2 * outerRadius
        },
        innerBounds: {
          x: centerCoord.x - innerSquareDimension / 2,
          y: centerCoord.y - innerSquareDimension / 2,
          width: innerSquareDimension,
          height: innerSquareDimension
        },
        id: this._id,
        data: data,
        itemData: itemData,
        component: options['_widgetConstructor']
      };
      dataContext = context.fixRendererContext(dataContext);

      var parentDiv = context.getContainer();
      var customContent = rootNodeRenderer(dataContext);
      if (!customContent) return false;
      var newOverlay = context.createOverlayDiv();
      if (Array.isArray(customContent)) {
        customContent.forEach((node) => {
          newOverlay.appendChild(node); // @HTMLUpdateOK
        });
      } else {
        newOverlay.appendChild(customContent); // @HTMLUpdateOK
      }
      sunburst.rootNodeContent = newOverlay;
      parentDiv.appendChild(newOverlay); // @HTMLUpdateOK

      // Invoke the overlay attached callback if one is available.
      var callback = context.getOverlayAttachedCallback();
      if (callback) callback(newOverlay);

      return true;
    }

    /**
     * Get the outer radius of the node
     * @return {Number}
     * @private
     */
    _getOuterRadius() {
      return this._outerRadius;
    }

    /**
     * Remove the root node content overlay if the radius or root has changed
     * @private
     */
    _removeRootNodeContentOverlay() {
      var sunburst = this.getView();

      // Remove existing overlay if there is one
      var existingOverlay = sunburst.rootNodeContent;
      if (existingOverlay) sunburst.getCtx().getContainer().removeChild(existingOverlay);
      sunburst.rootNodeContent = null;
    }

    /**
     * Sets disclosure to false if this node's id is not contained the expanded array/keySet
     * @param {Sunburst} sunburst The owning sunburst component.
     * @param {object} props The properties for the node.
     * @private
     */
    _evaluateExpanded(sunburst, props) {
      var options = sunburst.getOptions();
      var expanded = options['expanded'];
      if (!props['bArtificialRoot'] && !props['_expanded']) {
        if (expanded['has']) {
          // key set
          if (!expanded['has'](props['id'])) this.setDisclosed(false);
        } else if (
          expanded instanceof Array &&
          !dvt.ArrayUtils.hasAnyMapItem(options['_expandedNodes'], [props['id']])
        )
          this.setDisclosed(false);
      }
    }
  }
  // Constant for efficiency
  DvtSunburstNode.TWO_PI = Math.PI * 2;

  /**
   * Class representing a treemap node.
   * @param {Treemap} treemap The owning treemap component.
   * @param {object} props The properties for the node.
   * @class
   * @constructor
   * @extends {DvtTreeNode}
   * @implements {DvtKeyboardNavigable}
   */
  class DvtTreemapNode extends DvtTreeNode {
    constructor(treemap, props) {
      super(treemap, props);

      var options = this._view.getOptions();
      var nodeDefaults = options['nodeDefaults'];
      var headerDefaults = nodeDefaults['header'];
      var headerOptions = props['header'] ? props['header'] : {};

      this._groupLabelDisplay = props['groupLabelDisplay']
        ? props['groupLabelDisplay']
        : nodeDefaults['groupLabelDisplay'];
      this._labelDisplay = props['labelDisplay']
        ? props['labelDisplay']
        : nodeDefaults['labelDisplay'];
      this._labelHalign = props['labelHalign'] ? props['labelHalign'] : nodeDefaults['labelHalign'];
      this._labelValign = props['labelValign'] ? props['labelValign'] : nodeDefaults['labelValign'];

      this._headerHalign = headerOptions['labelHalign']
        ? headerOptions['labelHalign']
        : headerDefaults['labelHalign'];
      this._headerLabelStyle = headerOptions['labelStyle']
        ? new dvt.CSSStyle(headerOptions['labelStyle'])
        : null;
      this._bHeaderUseNodeColor =
        (headerOptions['useNodeColor']
          ? headerOptions['useNodeColor']
          : headerDefaults['useNodeColor']) === 'on';

      this._className = props['className'] || props['svgClassName'];
      this._style = props['style'] || props['svgStyle'];

      // Isolate Support
      this._isolate = headerOptions['isolate'] ? headerOptions['isolate'] : headerDefaults['isolate'];
      if (this._isolate === 'auto') this._isolate = dvt.Agent.isTouchDevice() ? 'off' : 'on';

      this._bIsolated =
        options['isolatedNode'] != null &&
        dvt.Obj.compareValues(this.getView().getCtx(), options['isolatedNode'], this.getId());

      // TODO: reconsider these constants after alta is dropped
      // Text style options
      this.TEXT_STYLE_HEADER = 'header';
      this.TEXT_STYLE_NODE = 'node';
      this.TEXT_STYLE_OFF = 'off';

      // Constants for All Nodes
      this.TEXT_BUFFER_HORIZ = 5; // Buffer for text alignment
      this.TEXT_BUFFER_VERT = 2; // Buffer for text alignment
      this.MIN_TEXT_BUFFER = 2; // Minimum buffer for text (on opposite side of alignment for example)
      this._LINE_FUDGE_FACTOR = 1;

      this._ANIMATION_ISOLATE_DURATION = 0.3; // in seconds
      // Constants for Group Headers
      this._MIN_TITLE_BAR_HEIGHT = 22;
      this._MIN_TITLE_BAR_HEIGHT_ISOLATE = 22;
      this.DEFAULT_HEADER_BORDER_WIDTH = 1;
      this.DEFAULT_HEADER_WITH_NODE_COLOR_ALPHA = 0.5;
      this._ISOLATE_ICON_SIZE = 12;
      this._ISOLATE_GAP_SIZE = 4;
      this._ISOLATE_TOUCH_BUFFER = 3;

      // Constants for Leaf Nodes
      this.DEFAULT_NODE_TOP_BORDER_COLOR = '#FFFFFF';
      this.DEFAULT_NODE_BOTTOM_BORDER_COLOR = '#000000';
      this.DEFAULT_NODE_BORDER_WIDTH = 1;
      this.DEFAULT_NODE_BORDER_OPACITY = 0.3;

      this.MIN_SIZE_FOR_BORDER = 2 * this.DEFAULT_NODE_BORDER_WIDTH;

      // Constants for Selection Effects
      this.GROUP_HOVER_INNER_OPACITY = 0.8;
      this.GROUP_HOVER_INNER_WIDTH = 3;

      this.NODE_HOVER_OPACITY = 1.0;
      this.NODE_SELECTION_WIDTH = 2;
    }

    //**************** Begin Overridden Functions ***************//
    /**
     * @override
     */
    render(container) {
      // If not positioned, don't render
      if (!this._hasLayout) return;

      // Create the shape object
      this._shape = this._createShapeNode();
      container.addChild(this._shape);

      if (this.hasChildren()) {
        // Create the container for the children and render
        this._childNodeGroup = new dvt.Container(this.getView().getCtx());
        this._shape.addChild(this._childNodeGroup);
        this.renderChildren(this._childNodeGroup);
      }

      if (!this._createCustomNodeContent()) {
        // Create the text object
        this._text = this._createTextNode(this._shape);
        if (this._text != null) {
          var backgroundColor = this.getLabelBackgroundColor();
          // For pattern nodes, add a background to make the text readable
          if (this._textStyle !== this.TEXT_STYLE_HEADER && (this.hasPattern() || backgroundColor)) {
            var dims = this._text.getDimensions();
            this._textBackground = new dvt.Rect(
              this.getView().getCtx(),
              dims.x,
              dims.y,
              dims.w,
              dims.h
            );
            if (backgroundColor) this._textBackground.setSolidFill(backgroundColor);
            else this._textBackground.setSolidFill('#FFFFFF');
            this._textBackground.setMouseEnabled(false);
            this._shape.addChild(this._textBackground);

            // Reorder the text in front of the background rect
            this._addChildText(this._text);
          }
        }
      }

      // WAI-ARIA
      if (this.hasChildren()) this._shape.setAriaRole('group');
      else this._shape.setAriaRole('img');
      this.UpdateAriaLabel();
    }

    /**
     * @override
     */
    setSelected(selected) {
      // Delegate to super to store the state
      super.setSelected(selected);

      // If the node isn't displayed, return
      if (!this._shape) return;

      var nodeDefaults = this.getView().getOptions()['nodeDefaults'];
      var nodeHeaderDefaults = nodeDefaults['header'];

      if (this.isSelected()) {
        // Calculate the bounds for the selection effect
        var x = this._x;
        var y = this._y + this._LINE_FUDGE_FACTOR;
        var w = Math.max(this._width - this._LINE_FUDGE_FACTOR, 0);
        var h = Math.max(this._height - this._LINE_FUDGE_FACTOR, 0);

        // Workaround for different pixel drawing behavior between browsers
        if (dvt.Agent.browser === 'safari' || dvt.Agent.engine === 'blink')
          y -= this._LINE_FUDGE_FACTOR;

        // Clear the selection inner and outer, which may be used by hover
        this._removeChildShape(this._selectionOuter);
        this._removeChildShape(this._selectionInner);
        this._selectionOuter = null;
        this._selectionInner = null;
        var isRedwood = this._shape.getCtx().getThemeBehavior() === 'redwood';
        if (isRedwood && this._textStyle !== this.TEXT_STYLE_HEADER) {
          this._selectionOuter = new dvt.Rect(
            this.getView().getCtx(),
            x + 0.5,
            y + 0.5,
            Math.max(w - 1, 0),
            Math.max(h - 1, 0)
          );
          this._selectionInner = new dvt.Rect(
            this.getView().getCtx(),
            x + 1.5,
            y + 1.5,
            Math.max(w - 3, 0),
            Math.max(h - 3, 0)
          );
        } else {
          this._selectionOuter = new dvt.Rect(this.getView().getCtx(), x, y, w, h);
          this._selectionInner = new dvt.Rect(
            this.getView().getCtx(),
            x + 1,
            y + 1,
            Math.max(w - 2, 0),
            Math.max(h - 2, 0)
          );
        }
        // Create the shapes, the fill will be set based on node type
        this._selectionOuter.setMouseEnabled(false);
        this._selectionOuter.setFill(null);
        this._selectionOuter.setPixelHinting(true);
        this._shape.addChild(this._selectionOuter);
        //  - treemap visualization issues
        this._selectionInner.setMouseEnabled(false);
        this._selectionInner.setFill(null);
        this._selectionInner.setPixelHinting(true);
        this._shape.addChild(this._selectionInner);

        if (this._textStyle === this.TEXT_STYLE_HEADER) {
          // Apply the selection effect to the header
          if (this.IsHover || this.isShowingKeyboardFocusEffect())
            this._innerShape.setSolidFill(nodeHeaderDefaults['hoverBackgroundColor']);
          else {
            this._innerShape.setSolidFill(nodeHeaderDefaults['selectedBackgroundColor']);
            // Update the text color
            if (this._text) {
              this.ApplyHeaderTextStyle(this._text, '_selectedLabelStyle');
            }
          }

          // Apply the right LAF
          this._selectionOuter.setSolidStroke(nodeHeaderDefaults['selectedOuterColor']);
          this._selectionInner.setSolidStroke(nodeHeaderDefaults['selectedInnerColor']);

          if (dvt.Agent.isTouchDevice())
            this._isolateButton = this._createIsolateRestoreButton(this._shape);
        } else {
          // Apply the right LAF
          this._selectionOuter.setSolidStroke(nodeDefaults['selectedOuterColor']);
          this._selectionInner.setSolidStroke(nodeDefaults['selectedInnerColor']);

          // Also apply the shadow.  Use a clone since the object is static and may be used elsewhere in the page.
          //  and : Disable shadows in safari and ff due to rendering issues.
          if (dvt.Agent.browser !== 'safari' && dvt.Agent.browser !== 'firefox') {
            this._shape.addDrawEffect(DvtTreeNode.__NODE_SELECTED_SHADOW);
          }

          // Move to the front of the z-order
          this.getView().__moveToSelectedLayer(this._shape);
        }
      } else {
        // !selected
        // Restore the regular effect to the shape
        this._removeChildShape(this._selectionInner);
        this._selectionInner = null;
        if (dvt.Agent.isTouchDevice()) this._removeIsolateRestoreButton();

        if (this._textStyle === this.TEXT_STYLE_HEADER) {
          // If this is a node with header, adjust it
          if (this.IsHover || this.isShowingKeyboardFocusEffect())
            this._innerShape.setSolidFill(nodeHeaderDefaults['hoverBackgroundColor']);
          else {
            this.ApplyHeaderStyle(this._shape, this._innerShape);
            // Restore the text color
            if (this._text) {
              if (this.isDrillReplaceEnabled())
                this.ApplyHeaderTextStyle(this._text, '_drillableLabelStyle');
              else this.ApplyHeaderTextStyle(this._text, 'labelStyle');
            }
          }
          if (this._selectionOuter) {
            if (this.IsHover || this.isShowingKeyboardFocusEffect())
              this._selectionOuter.setSolidStroke(nodeHeaderDefaults['hoverOuterColor']);
            else {
              this._removeChildShape(this._selectionOuter);
              this._selectionOuter = null;
            }
          }
        } else {
          // leaf node
          // Remove the selection effects on this node
          this._shape.removeAllDrawEffects();
          if (this._selectionOuter) {
            this._removeChildShape(this._selectionOuter);
            this._selectionOuter = null;
          }

          // Restore the element back to its original location under its parent node
          var parentNode = this.GetParent();
          if (parentNode && parentNode._childNodeGroup) {
            // The exact z-order doesn't matter, since only the selected nodes have effects
            // that overflow into surrounding nodes.
            parentNode._childNodeGroup.addChild(this._shape);
          }
        }
      }
    }

    /**
     * @override
     */
    showHoverEffect() {
      if (!this._shape || !this._hasLayout) return;

      var nodeDefaults = this.getView().getOptions()['nodeDefaults'];
      var nodeHeaderDefaults = nodeDefaults['header'];

      // : Do not show the hover effect if the node is not within the isolated subtree.  When a child of an
      // isolated node is selected, it is move to the front of the z-order.  During this move, the node behind it will
      // recieve a mouseOver event, which we should not show a hover effect for.
      var isolatedNode = this._view.__getLastIsolatedNode();
      if (isolatedNode != null && isolatedNode !== this && !this.isDescendantOf(isolatedNode)) return;

      // Prepare the array of points and stroke for the hover effect
      var stroke;
      var x, y, w, h;
      if (this._textStyle === this.TEXT_STYLE_HEADER) {
        // Apply the hover effect to the header
        this._innerShape.setSolidFill(nodeHeaderDefaults['hoverBackgroundColor']);

        // Apply the outer hover effect border
        if (!this._selectionOuter) {
          // If the outer effect doesn't exist, create it
          x = this._x;
          y = this._y;
          w = this._width - this._LINE_FUDGE_FACTOR;
          h = this._height - this._LINE_FUDGE_FACTOR;

          this._selectionOuter = new dvt.Rect(this.getView().getCtx(), x, y, w, h);
          this._selectionOuter.setMouseEnabled(false);
          this._selectionOuter.setFill(null);
          this._selectionOuter.setPixelHinting(true);
          this._shape.addChild(this._selectionOuter);
        }

        // Apply the formatting based on selection
        this._selectionOuter.setSolidStroke(
          this.isSelected()
            ? nodeHeaderDefaults['selectedOuterColor']
            : nodeHeaderDefaults['hoverOuterColor']
        );

        // Apply the hover effect to the group contents
        x = this._x + this.GROUP_HOVER_INNER_WIDTH / 2;
        y = this._y + this._titleBarHeight + this.GROUP_HOVER_INNER_WIDTH / 2;
        w = this._width - this.GROUP_HOVER_INNER_WIDTH - this._LINE_FUDGE_FACTOR;
        h =
          this._height -
          this._titleBarHeight -
          this.GROUP_HOVER_INNER_WIDTH -
          this._LINE_FUDGE_FACTOR;
        stroke = new dvt.Stroke(
          nodeHeaderDefaults['hoverInnerColor'],
          this.GROUP_HOVER_INNER_OPACITY,
          this.GROUP_HOVER_INNER_WIDTH
        );

        // Update the text color
        if (this._text) {
          if (this.isDrillReplaceEnabled())
            this.ApplyHeaderTextStyle(this._text, '_drillableHoverLabelStyle');
          else this.ApplyHeaderTextStyle(this._text, '_hoverLabelStyle');
        }
      } else {
        if (this._shape.getCtx().getThemeBehavior() === 'redwood') {
          x = this._x + 1.5;
          y = this._y + 1.5;
          w = this._width - 3 - this._LINE_FUDGE_FACTOR;
          h = this._height - 3 - this._LINE_FUDGE_FACTOR;
          stroke = new dvt.Stroke(nodeDefaults['selectedInnerColor'], 1, 1);
        } else {
          x = this._x + this.NODE_SELECTION_WIDTH / 2;
          y = this._y + this.NODE_SELECTION_WIDTH / 2;
          w = this._width - this.NODE_SELECTION_WIDTH - this._LINE_FUDGE_FACTOR;
          h = this._height - this.NODE_SELECTION_WIDTH - this._LINE_FUDGE_FACTOR;
          stroke = new dvt.Stroke(
            nodeDefaults['hoverColor'],
            this.NODE_HOVER_OPACITY,
            this.NODE_SELECTION_WIDTH
          );
        }
        //  - treemap visualization issues
        h = Math.max(h, 0);
        w = Math.max(w, 0);

        // Apply and show the effect
        this.getView().__showHoverEffect(x, y, w, h, stroke);
      }
    }

    /**
     * @override
     */
    hideHoverEffect() {
      if (!this._shape || !this._hasLayout) return;

      var nodeDefaults = this.getView().getOptions()['nodeDefaults'];
      var nodeHeaderDefaults = nodeDefaults['header'];

      // Remove the hover effect from the header
      if (this._textStyle === this.TEXT_STYLE_HEADER) {
        if (this.isSelected()) {
          this._innerShape.setSolidFill(nodeHeaderDefaults['selectedBackgroundColor']);
          this._selectionOuter.setSolidStroke(nodeHeaderDefaults['selectedOuterColor']);
          // Update the text color
          if (this._text) {
            if (this.isDrillReplaceEnabled())
              this.ApplyHeaderTextStyle(this._text, '_drillableSelectedLabelStyle');
            else {
              this.ApplyHeaderTextStyle(this._text, '_selectedLabelStyle');
            }
          }
        } else {
          this.ApplyHeaderStyle(this._shape, this._innerShape);
          if (this._selectionOuter) {
            this._shape.removeChild(this._selectionOuter);
            this._selectionOuter = null;
          }
          // Restore the text color
          if (this._text) {
            if (this.isDrillReplaceEnabled())
              this.ApplyHeaderTextStyle(this._text, '_drillableLabelStyle');
            else this.ApplyHeaderTextStyle(this._text, 'labelStyle');
          }
        }
      }

      this.getView().__hideHoverEffect();
    }

    /**
     * @override
     */
    highlight(bDimmed, alpha) {
      // Treemap node children are nested displayables, so we can't highlight the entire object.
      if (this.hasChildren()) {
        // Dim the text for group nodes
        if (this._text) this._text.setAlpha(alpha);

        // Also dim the header if it's displaying the node color. Normal headers are not dimmed because of the border impl,
        // which causes the nodes to appear darker when alpha is applied.
        if (
          this._textStyle === this.TEXT_STYLE_HEADER &&
          this._bHeaderUseNodeColor &&
          this._innerShape
        )
          this._innerShape.setAlpha(alpha);
      } else super.highlight(bDimmed, alpha);
    }

    /**
     * Returns true if isolate is enabled for this node.
     * @return {boolean}
     */
    isIsolateEnabled() {
      return this._isolate !== 'off' && this._textStyle === this.TEXT_STYLE_HEADER;
    }

    /**
     * @override
     */
    getNextNavigable(event) {
      var keyCode;
      var parent;
      var lastChild;
      var next;

      if (event.type === dvt.MouseEvent.CLICK) {
        return super.getNextNavigable(event);
      }

      keyCode = event.keyCode;

      if (keyCode === dvt.KeyboardEvent.SPACE && event.ctrlKey) {
        // multi-select node with current focus; so we navigate to ourself and then let the selection handler take
        // care of the selection
        return this;
      }

      // if alt held, or a bracket, move focus up or down one level in tree
      if (
        (keyCode === dvt.KeyboardEvent.UP_ARROW && event.altKey) ||
        keyCode === dvt.KeyboardEvent.CLOSE_BRACKET
      ) {
        // move up one level in the tree
        parent = this.GetParent();

        // we can move up one level if the parent is not the current root
        if (parent && parent.getId() !== this.getView().getRootNode().getId()) {
          next = parent;

          // update the grandparent's last visited child to be the current node's parent
          // updating the parent's (i.e. next node's) last visited child to point to the current node is
          // done at the end of this sequence of if, else-if statements
          parent.MarkAsLastVisitedChild();
        } else {
          next = this;
        }
      } else if (
        (keyCode === dvt.KeyboardEvent.DOWN_ARROW && event.altKey) ||
        keyCode === dvt.KeyboardEvent.OPEN_BRACKET
      ) {
        // move down one level in the tree
        lastChild = this.GetLastVisitedChild();
        if (lastChild) {
          next = lastChild;
        } else if (this.hasChildren()) {
          next = this.getView().__getDefaultNavigable(this.getChildNodes());
        } // leaf node
        else {
          next = this;
        }
      } else {
        // otherwise, stay in the same level
        var root = this.getView().__getLastIsolatedNode();
        var depth = 0;

        if (root) {
          // We have isolated a treemap node, so make sure we only consider the nodes currently being displayed.
          // Isolated nodes are rendered on top of the other nodes in the treemap, so we have to exclude the
          // other non-visible nodes in the treemap when navigating through an isolated node.
          // Find the depth of the current node from the isolated node
          if (this !== root) {
            parent = this.GetParent();
            depth = 1;
            while (root !== parent) {
              depth++;
              parent = parent.GetParent();
            }
          }
        } else {
          root = this;
          while (root.GetParent()) {
            root = root.GetParent();
          }

          depth = this.GetDepth();
        }

        var navigables = this.GetNodesAtDepth(root, depth);
        next = dvt.KeyboardHandler.getNextNavigable(this, event, navigables, false, null, true);
      }

      next.MarkAsLastVisitedChild();

      return next;
    }

    /**
     * @override
     */
    getKeyboardBoundingBox() {
      return new dvt.Rectangle(this._x, this._y, this._width, this._height);
    }

    /**
     * @override
     */
    getTargetElem() {
      if (this._shape) return this._shape.getElem();
      return null;
    }

    //**************** End Overridden Functions *****************//
    /**
     * Specifies the relative z-order for this node.
     * @param {number} zIndex The relative z-order for this node.
     */
    setZIndex(zIndex) {
      this._zIndex = zIndex;
    }

    /**
     * Sets the position and bounds of this treemap node.
     * @param {number} x The x coordinate of the bounds.
     * @param {number} y The y coordinate of the bounds.
     * @param {number} width The width of the bounds.
     * @param {number} height The height of the bounds.
     * @return {dvt.Rectangle} the rectangle indicating the area to allocate to children, if different than inputs
     */
    setLayoutParams(x, y, width, height) {
      // Nothing to render if either dimension is 0px
      if (width <= 0 || height <= 0) return undefined;

      // Set a flag indicating layout has been performed
      this._hasLayout = true;

      // Cache the previous size and position for isolate support
      this._oldState = this.GetAnimParams();

      // Store the given size and position
      this._x = x;
      this._y = y;
      this._width = width ? width : 0;
      this._height = height ? height : 0;

      // Determine the text style for this node
      if (this.hasChildren()) this._textStyle = this._groupLabelDisplay;
      else this._textStyle = this._labelDisplay;

      // If text not specified, same as off
      if (!this._textStr) this._textStyle = this.TEXT_STYLE_OFF;

      // Return the subsection to allocate to children, ignored for leaf nodes
      if (this._textStyle === this.TEXT_STYLE_HEADER) {
        // Find the height of the header by creating and measuring the text node
        this._titleBarHeight = this._MIN_TITLE_BAR_HEIGHT;
        var text = new dvt.OutputText(this.getView().getCtx(), this._textStr);
        text.setFontSize(this.GetTextSize());
        this.ApplyHeaderTextStyle(text, 'labelStyle');
        var headerLabelHeight = text.getDimensions().h;
        this._titleBarHeight = Math.max(this._titleBarHeight, headerLabelHeight);

        // Additional space for isolate/restore button
        if (this.isIsolateEnabled())
          this._titleBarHeight = Math.max(this._titleBarHeight, this._MIN_TITLE_BAR_HEIGHT_ISOLATE);

        // Headers consume some of the space
        var xx = this._x;
        var yy = this._y + this._titleBarHeight;
        var ww = this._width;
        var hh = this._height - this._titleBarHeight;

        // If there is enough space, then return the rectangle
        if (ww >= 0 && hh >= 0) return new dvt.Rectangle(xx, yy, ww, hh);
        else this._textStyle = null; // Not enough space, don't show header
      }

      return new dvt.Rectangle(this._x, this._y, this._width, this._height);
    }

    /**
     * @override
     */
    getNodeUnderPoint(x, y) {
      // Check if the node contains the coords
      if (this.contains(x, y) || !this._hasLayout) {
        var childNodes = this.getChildNodes();
        for (var i = 0; i < childNodes.length; i++) {
          if (childNodes[i].contains(x, y)) return childNodes[i].getNodeUnderPoint(x, y);
        }

        // No child found, return the current node
        if (this._hasLayout) return this;
      }

      // No node found, return null
      return null;
    }

    /**
     * @override
     */
    contains(x, y) {
      return (
        x >= this._x && x <= this._x + this._width && y >= this._y && y <= this._y + this._height
      );
    }

    /**
     * @override
     */
    GetAnimParams() {
      var r = dvt.ColorUtils.getRed(this._color);
      var g = dvt.ColorUtils.getGreen(this._color);
      var b = dvt.ColorUtils.getBlue(this._color);

      // Force bevel removal during animation for leaf nodes by passing an additional random number to force animation.
      return [
        this._x,
        this._y,
        this._width,
        this._height,
        r,
        g,
        b,
        this.hasChildren() ? 0 : Math.random() // Random Number used to force animation @RandomNumberOK
      ];
    }

    /**
     * @override
     */
    SetAnimParams(params) {
      // Update the layout params
      this.setLayoutParams(params[0], params[1], params[2], params[3]);

      // Update the color.  Round them since color parts must be ints
      var r = Math.round(params[4]);
      var g = Math.round(params[5]);
      var b = Math.round(params[6]);
      this._color = dvt.ColorUtils.makeRGB(r, g, b);

      // Update the shapes
      this._updateShapes();
    }

    /**
     * After a relayout due to isolate or restore, returns the animation to render this node and
     * all of its descendants to the new state.
     * @return {array}
     */
    getIsolateAnimation() {
      var playables = [this._getIsolateAnimation()];
      var descendants = this.getDescendantNodes();
      for (var i = 0; i < descendants.length; i++) {
        playables.push(descendants[i]._getIsolateAnimation());
      }

      return playables;
    }

    /**
     * Returns the isolate or restore animation for this node.
     * @return {dvt.Playable}
     */
    _getIsolateAnimation() {
      if (this._oldState) {
        // Create the playable to animate to the new layout state
        var playable = new dvt.CustomAnimation(
          this.getView().getCtx(),
          this,
          this._ANIMATION_ISOLATE_DURATION
        );
        playable
          .getAnimator()
          .addProp(
            dvt.Animator.TYPE_NUMBER_ARRAY,
            this,
            this.GetAnimParams,
            this.SetAnimParams,
            this.GetAnimParams()
          );

        // Initialize the old state
        this.SetAnimParams(this._oldState);

        return playable;
      } else return null;
    }

    /**
     * @override
     */
    animateUpdate(handler, oldNode) {
      this._removeAllNodeContent();
      var oldNodeRendered = oldNode._hasLayout && oldNode._width > 0 && oldNode._height > 0;
      var nodeRendered = this._hasLayout && this._width > 0 && this._height > 0;
      if (this.GetDepth() === 0 || (oldNodeRendered && nodeRendered)) {
        // Current and old node exist and is visible, show the update animation
        // this.GetDepth() check since root will not have a size
        return super.animateUpdate(handler, oldNode);
      } else if (nodeRendered) {
        // Old node did not exist or was not visible, treat as insert
        return this.animateInsert(handler);
      } else if (oldNodeRendered) {
        // Current node is not visible, treat as delete
        return this.animateDelete(handler, handler.getDeleteContainer());
      }
      return null;
    }

    /**
     * @override
     */
    animateInsert(handler, oldNode) {
      this._removeAllNodeContent();
      super.animateInsert(handler, oldNode);
    }

    /**
     * @override
     */
    animateDelete(handler, container) {
      this._removeAllNodeContent();
      super.animateDelete(handler, container);
    }

    /**
     * Creates and return the shape object for this node.
     * @return {dvt.Shape} The shape object for this node
     * @private
     */
    _createShapeNode() {
      var context = this.getView().getCtx();
      var options = this.getView().getOptions();
      var bNodeGaps = options['nodeSeparators'] === 'gaps';

      // Create the basic shape with geometry
      var shape;
      if (this._textStyle === this.TEXT_STYLE_HEADER) {
        // Create the header, which is made of an outer shape for the border and an inner shape for the fill
        if (bNodeGaps) {
          var rects = this._getGeometriesWithGaps();

          shape = new dvt.Rect(
            context,
            rects._shape.x,
            rects._shape.y,
            rects._shape.w,
            rects._shape.h
          );
          this._innerShape = new dvt.Rect(
            context,
            rects._innerShape.x,
            rects._innerShape.y,
            rects._innerShape.w,
            rects._innerShape.h
          );

          // Also draw a background shape to prevent bleed through during isolate
          this._backgroundShape = new dvt.Rect(
            context,
            rects._backgroundShape.x,
            rects._backgroundShape.y,
            rects._backgroundShape.w,
            rects._backgroundShape.h
          );
          this._backgroundShape.setSolidFill('#FFFFFF');
          shape.addChild(this._backgroundShape);
        } else {
          shape = new dvt.Rect(context, this._x, this._y, this._width, this._height);
          this._innerShape = new dvt.Rect(
            context,
            this._x + 1,
            this._y + 1,
            this._width - 2,
            this._height - 2
          );
        }

        // Apply the style attributes to the header
        this.ApplyHeaderStyle(shape, this._innerShape);

        this._innerShape.setMouseEnabled(false);
        shape.addChild(this._innerShape);

        // Isolate Support
        if (this.__isIsolated()) this._isolateButton = this._createIsolateRestoreButton(shape);
      } else {
        // Non-header node.
        var fill = this.GetFill();
        if (bNodeGaps) {
          var rectsGaps = this._getGeometriesWithGaps();
          shape = new dvt.Rect(
            context,
            rectsGaps._shape.x,
            rectsGaps._shape.y,
            rectsGaps._shape.w,
            rectsGaps._shape.h
          );

          // If the non-header node has children, use invisible fill so that the gaps on the
          // children don't bleed through.
          shape.setFill(this.hasChildren() ? dvt.SolidFill.invisibleFill() : fill);
        } else {
          // All bevels: {shape: topLeftBevel, secondShape: bottomRightBevel, thirdShape: fill}
          // Bottom right bevel only: {shape: bottomRightBevel, secondShape: fill}
          // No bevels: {firstShape: fill}

          // Create the outermost shape
          shape = new dvt.Rect(context, this._x, this._y, this._width, this._height);

          // Create the bevel effect for the node: Disabled on phones/tablets for 1000+ nodes for performance reasons.
          var bVisualEffects = this.getView().__getNodeCount() < 1000 || !dvt.Agent.isTouchDevice();
          if (
            bVisualEffects &&
            this._width >= this.MIN_SIZE_FOR_BORDER &&
            this._height >= this.MIN_SIZE_FOR_BORDER
          ) {
            // Retrieve the bevel colors and blend with the fill color to get the desired effect
            var fillColor = this.getColor();
            var topLeftColor = dvt.ColorUtils.interpolateColor(
              this.DEFAULT_NODE_TOP_BORDER_COLOR,
              fillColor,
              1 - this.DEFAULT_NODE_BORDER_OPACITY
            );
            var bottomRightColor = dvt.ColorUtils.interpolateColor(
              this.DEFAULT_NODE_BOTTOM_BORDER_COLOR,
              fillColor,
              1 - this.DEFAULT_NODE_BORDER_OPACITY
            );

            // Creation of bevels varies based on the minimum of the width and height of the node:
            // 0: Won't reach this code
            // 1: No bevels
            // 2: Bottom right bevel only
            // 4+: All bevels
            var minDim = Math.min(this._width, this._height);

            // Both bevels
            if (minDim >= 4) {
              // shape is the bottomRight bevel in this case
              shape.setSolidFill(bottomRightColor);

              // topLeftShape hides all but the bottomRight bevel
              this._topLeftShape = new dvt.Rect(
                context,
                this._x,
                this._y,
                this._width - 1,
                this._height - 1
              );
              this._topLeftShape.setSolidFill(topLeftColor);
              this._topLeftShape.setMouseEnabled(false);
              shape.addChild(this._topLeftShape);

              // fillShape exposes both bevels
              this._fillShape = new dvt.Rect(
                context,
                this._x + 1,
                this._y + 1,
                this._width - 2,
                this._height - 2
              );
              this._fillShape.setFill(fill);
              this._fillShape.setMouseEnabled(false);
              shape.addChild(this._fillShape);
            } else if (minDim >= 2) {
              // Bottom Right Bevel
              // shape is the bottomRight bevel in this case
              shape.setSolidFill(bottomRightColor);

              // fillShape exposes the bevel
              this._fillShape = new dvt.Rect(
                context,
                this._x,
                this._y,
                this._width - 1,
                this._height - 1
              );
              this._fillShape.setFill(fill);
              this._fillShape.setMouseEnabled(false);
              shape.addChild(this._fillShape);
            } // No bevels
            else shape.setFill(fill);
          } // No bevels
          else shape.setFill(fill);
        }
        shape.setStyle(this._style);
        shape.setClassName(this._className);
      }

      // Add pointers between this node and the shape
      this.getView().getEventManager().associate(shape, this);

      // Allows selection cursor to be shown over nodes if nodeSelection is enabled and node is selectable
      // Unselectable nodes explicitly set as default so correct pointer appears if un-selectable node is drawn inside selectable node
      if (this.isSelectable()) shape.setSelectable(true);
      else if (this.isDrillReplaceEnabled()) shape.setCursor('pointer');
      else shape.setCursor('default');

      shape.zIndex = this._zIndex;
      return shape;
    }

    /**
     * Creates and positions the isolate or restore button for this node.
     * @param {dvt.Container} container The container for the button.
     * @return {dvt.IconButton}
     * @private
     */
    _createIsolateRestoreButton(container) {
      if (this._textStyle !== this.TEXT_STYLE_HEADER || !this.isIsolateEnabled()) return null;

      var button = null;
      var x1 = this._x;
      var x2 = this._x + this._width - this._LINE_FUDGE_FACTOR;
      var y1 = this._y + this._LINE_FUDGE_FACTOR;
      var y2 = this._y + this._titleBarHeight;
      var availIconWidth = x2 - x1 - this._ISOLATE_GAP_SIZE * 2;
      if (availIconWidth > this._ISOLATE_ICON_SIZE) {
        // Create the button and add to the container
        button = this.__isIsolated() ? this._getRestoreButton() : this._getIsolateButton();
        var transX;
        if (dvt.Agent.isRightToLeft(container.getCtx())) transX = x1 + this._ISOLATE_GAP_SIZE;
        else transX = x2 - this._ISOLATE_ICON_SIZE - this._ISOLATE_GAP_SIZE;
        button.setTranslate(transX, (y2 + y1 - this._ISOLATE_ICON_SIZE) / 2);
        container.addChild(button);

        // Add a buffer to make the objects easier to interact with on touch devices
        if (dvt.Agent.isTouchDevice()) {
          var rect = new dvt.Rect(
            container.getCtx(),
            -this._ISOLATE_TOUCH_BUFFER,
            -this._ISOLATE_TOUCH_BUFFER,
            this._ISOLATE_ICON_SIZE + 2 * this._ISOLATE_TOUCH_BUFFER,
            this._ISOLATE_ICON_SIZE + 2 * this._ISOLATE_TOUCH_BUFFER
          );
          rect.setInvisibleFill();
          button.addChild(rect);
        }

        // For Alta, associate the node so the hover effect doesn't get removed.
        this.getView().getEventManager().associate(button, this);
      }

      return button;
    }

    /**
     * Removes the isolate/restore button, if displayed.
     * @private
     */
    _removeIsolateRestoreButton() {
      if (this._isolateButton) {
        this._removeChildShape(this._isolateButton);
        this._isolateButton = null;
      }
    }

    /**
     * Creates and return the text object for this node. Adds the text to the container if it's not empty.
     * @param {dvt.Container} container The container to render in.
     * @return {dvt.Text} The text object for this node.
     * @private
     */
    _createTextNode(container) {
      var isRTL = dvt.Agent.isRightToLeft(container.getCtx());

      // If no text or no container to place the text, return
      if (!this._textStr || !container || !this._textStyle || this._textStyle === this.TEXT_STYLE_OFF)
        return null;

      // Approximate whether the text could fit vertically
      var availHeight = this._height;
      var textHeight = this.GetTextSize();
      if (textHeight > availHeight) return null;

      // Figure out the horizontal alignment
      var hAlign = this._textStyle === this.TEXT_STYLE_NODE ? this._labelHalign : this._headerHalign;
      if (isRTL) {
        if (hAlign === 'start') hAlign = 'end';
        else if (hAlign === 'end') hAlign = 'start';
      }

      // Approximate whether the text could fit horizontally (conservative)
      var availWidth = this._width - (this.TEXT_BUFFER_HORIZ + this.MIN_TEXT_BUFFER);
      var isolateWidth = 0;
      if (this.isIsolateEnabled()) {
        isolateWidth = this._ISOLATE_ICON_SIZE + this._ISOLATE_GAP_SIZE;
        if (hAlign === 'center') availWidth -= 2 * isolateWidth;
        // center aligned text should always be centered, meaning space is reserved on either size for the button
        else availWidth -= isolateWidth;
      }

      if (availWidth <= 0) return null;

      // Create the text object. Use multiline for node text when there is space for multiple lines and not enough width to fit the label.
      var text;
      var computedTextStyle = this.getMergedLabelTextStyle();
      if (
        this._textStyle === this.TEXT_STYLE_NODE &&
        availHeight > textHeight * 2 &&
        computedTextStyle.getStyle(dvt.CSSStyle.WHITE_SPACE) !== 'nowrap' &&
        dvt.TextUtils.getTextStringWidth(this.getView().getCtx(), this._textStr, computedTextStyle) >
          availWidth
      ) {
        text = new dvt.MultilineText(this.getView().getCtx(), this._textStr);
      } else text = new dvt.OutputText(this.getView().getCtx(), this._textStr);

      // Calculate the horizontal text position
      if (hAlign === 'start') {
        if (isRTL) text.setX(this._x + this.TEXT_BUFFER_HORIZ + isolateWidth);
        else text.setX(this._x + this.TEXT_BUFFER_HORIZ);
        text.alignLeft();
      } else if (hAlign === 'center') {
        text.setX(this._x + this._width / 2);
        text.alignCenter();
      } else if (hAlign === 'end') {
        if (isRTL) text.setX(this._x + this._width - this.TEXT_BUFFER_HORIZ);
        else text.setX(this._x + this._width - this.TEXT_BUFFER_HORIZ - isolateWidth);
        text.alignRight();
      }

      if (this._textStyle === this.TEXT_STYLE_NODE) {
        // Update it with the correct style
        this.ApplyLabelTextStyle(text);

        // Set the correct available height
        availHeight = this._height - this.TEXT_BUFFER_VERT * 2;
      } else if (this._textStyle === this.TEXT_STYLE_HEADER) {
        // Note: No need to worry about available height here.  Headers are sized based on the text size.
        var chromeAdjustment =
          dvt.Agent.browser === 'safari' || dvt.Agent.engine === 'blink'
            ? this._LINE_FUDGE_FACTOR
            : 0;
        text.setY(
          this._y + this.DEFAULT_HEADER_BORDER_WIDTH + this._titleBarHeight / 2 + chromeAdjustment
        );
        text.alignMiddle();
        this.ApplyHeaderTextStyle(text, 'labelStyle');
      }

      if (this._textStyle === this.TEXT_STYLE_HEADER && this.isDrillReplaceEnabled()) {
        // Drillable text link
        this.ApplyHeaderTextStyle(text, '_drillableLabelStyle');
        text.setCursor('pointer');

        // Associate with a DvtTreePeer to handle drilling
        var peer = new DvtTreePeer(
          this,
          this.getId(),
          null,
          this.getDatatip.bind(this),
          this.getDatatipColor.bind(this)
        );
        peer.setDrillable(true);
        this.getView().getEventManager().associate(text, peer);
      } // Parent node will handle all events
      else text.setMouseEnabled(false);

      // Truncate the text if necessary
      var labelMinLength = this.getView().getOptions()['nodeDefaults']['labelMinLength'];
      var renderText = dvt.TextUtils.fitText(
        text,
        availWidth,
        availHeight,
        container,
        labelMinLength
      );

      // Calculate the vertical text position after the fitText call
      if (this._textStyle === this.TEXT_STYLE_NODE) {
        // Get the text height
        var textHeightDim = text.getDimensions().h;

        // Vertical Alignment
        if (this._labelValign === 'top') text.setY(this._y + this.TEXT_BUFFER_VERT);
        else if (this._labelValign === 'center')
          text.setY(this._y + this._height / 2 - textHeightDim / 2);
        else if (this._labelValign === 'bottom')
          text.setY(this._y + this._height - this.TEXT_BUFFER_VERT - textHeightDim);
      }
      return renderText ? text : null;
    }

    /**
     * Applies style to a header node.
     * @param {dvt.Shape} shape The outer shape for the header, used for the border
     * @param {dvt.Shape} innerShape The inner shape for the header, use for the fill
     */
    ApplyHeaderStyle(shape, innerShape) {
      var nodeHeaderDefaults = this.getView().getOptions()['nodeDefaults']['header'];
      if (this._bHeaderUseNodeColor) {
        var fillColor = this.getColor();
        innerShape.setSolidFill(fillColor);
        var borderColor = dvt.ColorUtils.interpolateColor(
          nodeHeaderDefaults['borderColor'],
          fillColor,
          1 - this.DEFAULT_HEADER_WITH_NODE_COLOR_ALPHA
        );
        shape.setSolidFill(borderColor);
      } else {
        shape.setSolidFill(nodeHeaderDefaults['borderColor']);
        innerShape.setSolidFill(nodeHeaderDefaults['backgroundColor']);
      }

      // Also update the background shape if one exists.
      if (this._backgroundShape) this._backgroundShape.setFill(innerShape.getFill());
    }

    /**
     * Applies the specified header style to the node header text.
     * @param {dvt.OutputText} text The node header text instance.
     * @param {string} styleType The style to use from the node header defaults.
     */
    ApplyHeaderTextStyle(text, styleType) {
      var textStyle = [];

      // Top Level Header is Bold
      if (this.GetDepth() <= 1 && this.getView().__getMaxDepth() >= 3)
        textStyle.push(new dvt.CSSStyle('font-weight:bold;'));

      // Header style defaults from CSS
      textStyle.push(this.getView().getOptions()['nodeDefaults']['header']['_labelStyle']);

      // Header Default styles
      textStyle.push(this.getView().getOptions()['nodeDefaults']['header'][styleType]);

      // Header Label Style
      if (this._headerLabelStyle) textStyle.push(this._headerLabelStyle);

      //User defined Options
      textStyle.push(
        new dvt.CSSStyle(this.getView().getOptions()['nodeDefaults']['header']['labelStyle'])
      );

      // Header UseNodeColor for Non-Hover/Selected Labels
      if (
        this._bHeaderUseNodeColor &&
        (styleType === 'labelStyle' || styleType === '_drillableLabelStyle')
      )
        textStyle.push(new dvt.CSSStyle('color: ' + DvtTreeNode.GetNodeTextColor(this)));

      text.setCSSStyle(dvt.CSSStyle.mergeStyles(textStyle));
    }

    /**
     * Handles a mouse out event on the node.
     */
    handleMouseOver() {
      // Isolate: draw button if needed
      if (!this._isolateButton && !dvt.Agent.isTouchDevice())
        this._isolateButton = this._createIsolateRestoreButton(this._shape);
      super.handleMouseOver();
    }

    /**
     * Handles a mouse out event on the node.
     */
    handleMouseOut() {
      // Isolate: hide button if displayed
      if (this.__isIsolated() !== true && !dvt.Agent.isTouchDevice())
        this._removeIsolateRestoreButton();
      super.handleMouseOut();
    }

    /**
     * Returns an object with rectangles referring to the geometries for the shapes.
     * @return {object}
     * @private
     */
    _getGeometriesWithGaps() {
      var ret = {};
      if (this._textStyle === this.TEXT_STYLE_HEADER) {
        ret._shape = new dvt.Rectangle(this._x, this._y, this._width - 1, this._titleBarHeight);
        ret._innerShape = new dvt.Rectangle(
          this._x + 1,
          this._y + 1,
          this._width - 3,
          this._titleBarHeight - 1
        );

        //  - treemap visualization issues
        var adjustedBackgroundShapeWidth = Math.max(this._width - 1, 0);
        var adjustedBackgroundShapeHeight = Math.max(this._height - this._titleBarHeight - 1, 0);
        ret._backgroundShape = new dvt.Rectangle(
          this._x,
          this._y + this._titleBarHeight,
          adjustedBackgroundShapeWidth,
          adjustedBackgroundShapeHeight
        );
      } else {
        // Non-header node with children, make 0 height so it doesn't bleed through the gaps.
        if (this.hasChildren()) ret._shape = new dvt.Rectangle(this._x, this._y, 0, 0);
        else {
          // Allocate the gaps from the right and bottom sides.
          var adjustedWidth = Math.max(this._width - 1, 0);
          var adjustedHeight = Math.max(this._height - 1, 0);
          ret._shape = new dvt.Rectangle(this._x, this._y, adjustedWidth, adjustedHeight);
        }
      }
      return ret;
    }

    /**
     * Updates the shapes for the current layout params.
     * @private
     */
    _updateShapes() {
      if (!this._shape) return;

      var options = this.getView().getOptions();
      var bNodeGaps = options['nodeSeparators'] === 'gaps';
      if (bNodeGaps) {
        var rects = this._getGeometriesWithGaps();
        this._shape.setRect(rects._shape);

        if (this._innerShape) this._innerShape.setRect(rects._innerShape);

        if (this._backgroundShape) this._backgroundShape.setRect(rects._backgroundShape);
      } else {
        // Update the shape
        this._shape.setRect(this._x, this._y, this._width, this._height);
        if (this._innerShape)
          this._innerShape.setRect(this._x + 1, this._y + 1, this._width - 2, this._height - 2);
      }

      // Also update the color
      if (this._textStyle !== this.TEXT_STYLE_HEADER || this._bHeaderUseNodeColor) {
        this._shape.setFill(this.GetFill());
      }

      if (this.isSelected()) this.setSelected(false);

      // Clear all border effects.  They will be restored in the animationEnd listener.
      this._removeChildShape(this._fillShape);
      this._removeChildShape(this._topLeftShape);
      this._fillShape = null;
      this._topLeftShape = null;

      // Remove isolate/restore if displayed
      this._removeIsolateRestoreButton();

      // Handle the node content
      if (
        options['nodeContent'] &&
        options['nodeContent']['renderer'] &&
        this._textStyle !== this.TEXT_STYLE_HEADER
      ) {
        this._removeAllNodeContent();
      } else {
        // No template, update the text
        // Remove the text background
        this._removeChildShape(this._textBackground);
        this._textBackground = null;

        // Update the text.  This implementation simply removes and repaints it.
        if (this._text) this._text.getParent().removeChild(this._text); // necessary because the parent may not be the shape
        this._text = this._createTextNode(this._shape);
      }
    }

    /**
     * @override
     */
    getDropSiteFeedback() {
      if (this._shape) {
        return new dvt.Rect(
          this.getView().getCtx(),
          this._shape.getX(),
          this._shape.getY(),
          this._shape.getWidth(),
          this._shape.getHeight()
        );
      } else return null;
    }

    /**
     * Adds the specified dvt.Text as a child.
     * @param {dvt.Text} text
     */
    _addChildText(text) {
      if (this._textStyle === this.TEXT_STYLE_NODE && this.hasChildren())
        this.getView().__getGroupTextLayer().addChild(text);
      else this._shape.addChild(text);
    }

    /**
     * Helper function to remove child shapes from this node.
     * @param {dvt.Shape} childShape The child shape to remove.
     * @private
     */
    _removeChildShape(childShape) {
      if (childShape) this._shape.removeChild(childShape);
    }

    /**
     * Returns the isolate button for use on the node header.
     * @return {dvt.Displayable}
     * @private
     */
    _getIsolateButton() {
      return this._getButtonHelper('isolate', this.__isolateNode);
    }

    /**
     * Returns the restore button for use on the node header.
     * @return {dvt.Displayable}
     * @private
     */
    _getRestoreButton() {
      return this._getButtonHelper('restore', this.__restoreNode);
    }

    _getButtonHelper(resourceKey, callback) {
      var context = this.getView().getCtx();

      // icon
      var resources = this.getView().getOptions()['_resources'];
      var iconClass = resources[resourceKey];
      var iconStyle = dvt.ToolkitUtils.getIconStyle(context, iconClass);
      // Create button and hook up click listener
      var button = new dvt.IconButton(context, 'borderless', {
        style: iconStyle,
        size: this._ISOLATE_ICON_SIZE
      });
      button.addEvtListener(dvt.MouseEvent.CLICK, callback, false, this);
      return button;
    }

    /**
     * Returns true if this node is isolated
     * @return {Boolean} true if this node is isolated, false otherwise
     */
    __isIsolated() {
      return this._bIsolated;
    }

    /**
     * Isolates this node and maximizes it.
     */
    __isolateNode(event) {
      this._bIsolated = true;
      this._removeAllNodeContent();
      this.hideHoverEffect();
      this.getView().__isolate(this);

      // Remove the isolate button, to be redrawn after isolate is complete
      this._removeIsolateRestoreButton();

      this.UpdateAriaLabel();

      // Stop propagation to prevent selection from changing
      if (event) event.stopPropagation();
    }

    /**
     * Restores this node to its normal size.
     */
    __restoreNode(event) {
      this._bIsolated = false;
      this.hideHoverEffect();
      this.getView().__restore();

      // Remove the restore button, to be redrawn after isolate is complete
      this._removeIsolateRestoreButton();

      this.UpdateAriaLabel();

      // Stop propagation to prevent selection from changing
      if (event) event.stopPropagation();
    }

    /**
     * Returns the isolate/restore button. Used for automation.
     * @return {dvt.Displayable}
     */
    getIsolateRestoreButton() {
      return this._isolateButton;
    }

    /**
     * @override
     */
    getDatatip(target, x, y) {
      if (target && target instanceof dvt.IconButton) return null; // tooltip is displayed for isolate button
      return super.getDatatip(target, x, y);
    }

    /**
     * @override
     */
    getDatatipColor(target) {
      if (target && target instanceof dvt.IconButton) return null; // tooltip is displayed for isolate button
      return super.getDatatipColor(target);
    }

    /**
     * @override
     */
    getTooltip(target) {
      if (target && target instanceof dvt.IconButton)
        return this.getView().getOptions().translations[
          this.__isIsolated() ? 'tooltipRestore' : 'tooltipIsolate'
        ];
      else return null;
    }

    /**
     * Returns the aria label of the node
     * @return {string} aria label of the node
     */
    getAriaLabel() {
      var translations = this.getView().getOptions().translations;

      var states = [];
      if (this.isSelectable())
        states.push(translations[this.isSelected() ? 'stateSelected' : 'stateUnselected']);
      if (this.__isIsolated()) states.push(translations.stateIsolated);
      if (this.isDrillReplaceEnabled()) states.push(translations.stateDrillable);

      return dvt.Displayable.generateAriaLabel(this.getShortDesc(), states, () =>
        DvtTreeNode.getShortDescContext(this)
      );
    }

    /**
     * @override
     */
    UpdateAriaLabel() {
      if (!dvt.Agent.deferAriaCreation() && this._shape)
        // need the null check bc it may fail in unit test (TreemapSelectionTest)
        this._shape.setAriaProperty('label', this.getAriaLabel());
    }

    /**
     * Create the custom center content for the root node.
     * @return {boolean} return false if the content is not rendered
     * @private
     */
    _createCustomNodeContent() {
      var treemap = this.getView();
      var options = treemap.getOptions();
      var id = this.getId();
      this._removeNodeContent(id);

      var nodeRenderer = options['nodeContent']['renderer'];
      if (!nodeRenderer || this.hasChildren()) return false;

      var isolatedNodes = treemap.getIsolatedNodes();
      if (
        isolatedNodes.length <= 0 ||
        this.isDescendantOf(isolatedNodes[treemap._isolatedNodes.length - 1])
      ) {
        var context = treemap.getCtx();
        var nodeOptions = this.getOptions();
        var itemData;
        var data = nodeOptions;
        if (nodeOptions._noTemplate) {
          itemData = nodeOptions._itemData;
          data = nodeOptions._itemData;
        } else if (nodeOptions._itemData) {
          itemData = nodeOptions._itemData;
          nodeOptions = dvt.JsonUtils.clone(nodeOptions);
          data = nodeOptions;
          delete nodeOptions._itemData;
        }

        var dataContext = {
          bounds: {
            x: this._x,
            y: this._y,
            width: this._width - this.DEFAULT_NODE_BORDER_WIDTH,
            height: this._height - this.DEFAULT_NODE_BORDER_WIDTH
          },
          id: id,
          data: data,
          itemData: itemData,
          component: nodeOptions['_widgetConstructor']
        };
        dataContext = context.fixRendererContext(dataContext);

        var parentDiv = context.getContainer();
        var customContent = nodeRenderer(dataContext);
        if (!customContent) return false;
        var newOverlay = context.createOverlayDiv();
        if (Array.isArray(customContent)) {
          customContent.forEach((node) => {
            newOverlay.appendChild(node); // @HTMLUpdateOK
          });
        } else {
          newOverlay.appendChild(customContent); // @HTMLUpdateOK
        }
        var nodeContent = treemap.getNodeContent();
        nodeContent[id] = newOverlay;
        parentDiv.appendChild(newOverlay); // @HTMLUpdateOK

        // Invoke the overlay attached callback if one is available.
        var callback = context.getOverlayAttachedCallback();
        if (callback) callback(newOverlay);
      }
      return true;
    }

    /**
     * Remove the node content
     * @param {string} id The id of the node being removed
     * @private
     */
    _removeNodeContent(id) {
      var treemap = this.getView();
      var nodeContentMap = treemap.getNodeContent();
      // Remove existing overlay if there is one
      var existingOverlay = nodeContentMap[id];
      if (existingOverlay) {
        treemap.getCtx().getContainer().removeChild(existingOverlay);
        delete nodeContentMap[id];
      }
    }

    /**
     * Remove the node content overlay for all nodes in the treemap
     * @private
     */
    _removeAllNodeContent() {
      for (var id in this.getView().getNodeContent()) {
        this._removeNodeContent(id);
      }
    }
  }

  /**
   *  Provides automation services for treemap/sunburst.  To obtain a
   *  @class  DvtTreeAutomation
   *  @param {DvtTreeView} treeView
   *  @implements {dvt.Automation}
   *  @constructor
   */
  class DvtTreeAutomation extends dvt.Automation {
    /**
     * Valid subIds inlcude:
     * <ul>
     * <li>node[nodeIndex0][nodeIndex1]...[nodeIndexN]</li>
     * </ul>
     * @override
     */
    GetSubIdForDomElement(displayable) {
      var logicalObj = this._comp.getLogicalObject(displayable);
      var rootNode = this._comp.getRootNode();

      // check if we have a button
      var isButton = displayable instanceof dvt.Button || displayable instanceof dvt.IconButton;
      var parent = displayable.getParent();
      if (parent instanceof dvt.Button || parent instanceof dvt.IconButton) {
        displayable = parent;
        isButton = true;
      }

      if (!logicalObj) {
        // could be a breadcrumb
        parent = displayable.getParent();
        if (parent instanceof DvtBreadcrumbs)
          return 'breadcrumbs[' + parent.getCrumbIndex(displayable) + ']';
        return null;
      }

      var nodeSubId = null;
      if (logicalObj instanceof DvtTreePeer && isButton) {
        // sunburst expand/collapse buttons
        var node = logicalObj._node;
        nodeSubId = this.GetSubIdForDomElement(node.getDisplayable());
        return this._getSubIdForButton(nodeSubId, node, displayable);
      } else if (logicalObj instanceof DvtTreeNode) {
        var currentNode = logicalObj;
        var indices = '';

        if (!rootNode.isArtificialRoot()) {
          // If logicalObj represents real root node, return default subId
          // Else include index for real root as first index in string of indices
          if (currentNode == rootNode) return 'node[0]';
          else indices += '[0]';
        }
        // Indices for nodes beyond the root
        var childIndices = this._getIndicesFromNode(currentNode, rootNode.getChildNodes());
        indices = childIndices ? indices + childIndices : indices;

        if (indices.length > 0) nodeSubId = 'node' + indices;

        if (isButton)
          // treemap isolate/restore buttons
          return this._getSubIdForButton(nodeSubId, logicalObj, displayable);
        else return nodeSubId;
      }

      return null;
    }

    /**
     * Returns the subId of a tree node button based on its state
     * @param {String} nodeSubId The subId for the tree node
     * @param {Object} node The tree node
     * @param {DvtButton} displayable The button
     * @return {String} node[nodeIndex0][nodeIndex1]...[nodeIndexN]:state
     * @private
     */
    _getSubIdForButton(nodeSubId, node, displayable) {
      if (nodeSubId) {
        if (node instanceof DvtTreemapNode) {
          // In the event of executing a click on the button during automation, the node state is updated before this check
          // so we have to check the displayable aria properties to determine the button's state
          var ariaLabel = displayable.getAriaProperty('label');
          var isolatedText = node.getView().getOptions().translations.stateIsolated;
          return ariaLabel.indexOf(isolatedText) >= 0 ? 'restore' : nodeSubId + ':isolate';
        } else if (node instanceof DvtSunburstNode) return nodeSubId + ':disclosure';
      }

      return null;
    }

    /**
     * Returns the index values of the given node
     * @param {Object} node The tree node to find the indices for
     * @param {Object} children The legend nodes whose descendants are being searched
     * @return {String} [nodeIndex0][nodeIndex1]...[nodeIndexN]
     * @private
     */
    _getIndicesFromNode(node, children) {
      // If there are sections in this options object, recurse through the section object
      if (children && children.length > 0) {
        for (var n = 0; n < children.length; n++) {
          if (children[n] == node) return '[' + n + ']';
          else {
            var nodeIndex = this._getIndicesFromNode(node, children[n].getChildNodes());
            if (nodeIndex) return '[' + n + ']' + nodeIndex;
          }
        }
      }
      return null;
    }

    /**
     * Valid subIds inlcude:
     * <ul>
     * <li>node[nodeIndex0][nodeIndex1]...[nodeIndexN]</li>
     * <li>tooltip</li>
     * </ul>
     * @override
     */
    getDomElementForSubId(subId) {
      if (!subId) return null;

      var rootNode = this._comp.getRootNode();

      // tooltip
      if (subId == dvt.Automation.TOOLTIP_SUBID) return this.GetTooltipElement(this._comp);

      // treemap breadcrumbs
      if (subId.indexOf('breadcrumbs') == 0) {
        var index = subId.substring(subId.indexOf('[') + 1, subId.indexOf(']'));
        var crumb = rootNode.getView().getBreadcrumbs().getCrumb(index);
        return crumb ? crumb.getElem() : null;
      }

      // treemap restore button
      if (subId == 'restore') {
        var restoreNode = this._comp._restoreNode || this._comp.__getLastIsolatedNode();
        if (restoreNode) return restoreNode.getIsolateRestoreButton().getElem();
      }

      // If root is real remove first index from subId because we begin searching at the root
      if (!rootNode.isArtificialRoot())
        subId = subId.substring(0, subId.indexOf('[')) + subId.substring(subId.indexOf(']') + 1);

      // If no more indices exist in the string at this point, the desired node is the root node.
      // If not, find the node.
      var nextOpenParen = subId.indexOf('[');
      var foundNode = nextOpenParen == -1 ? rootNode : this._getNodeFromSubId(rootNode, subId);

      if (foundNode) {
        // Check if the subId is for a child element of the node
        var colon = subId.indexOf(':');
        if (colon >= 0) {
          subId = subId.substring(colon + 1);

          // sunburst expand/collapse buttons
          if (foundNode instanceof DvtSunburstNode && subId == 'disclosure') {
            var expandCollapseBtn = foundNode.getExpandCollapseButton();
            if (expandCollapseBtn) return expandCollapseBtn.getElem();
          }

          // treemap isolate buttons
          if (foundNode instanceof DvtTreemapNode && subId == 'isolate') {
            var isolateRestoreBtn = foundNode.getIsolateRestoreButton();
            if (isolateRestoreBtn) return isolateRestoreBtn.getElem();
          }
        } // return the node element
        else return foundNode.getDisplayable().getElem();
      }

      return null;
    }

    /**
     * Returns the tree node for the given subId
     * @param {Object} node The tree node whose children wil be searched
     * @param {String} subId The subId of the desired node
     * @return {Object} the child node corresponding to the given subId
     * @private
     */
    _getNodeFromSubId(node, subId) {
      var openParen = subId.indexOf('[');
      var closeParen = subId.indexOf(']');
      if (openParen >= 0 && closeParen >= 0) {
        var index = subId.substring(openParen + 1, closeParen);
        subId = subId.substring(closeParen + 1);
        var nextOpenParen = subId.indexOf('[');
        var nextCloseParen = subId.indexOf(']');

        var childNode = DvtTreeAutomation._getNodeByIndex(node.getChildNodes(), index);
        if (childNode && nextOpenParen >= 0 && nextCloseParen >= 0) {
          // If there is another index layer recurse into the child node at that index
          return this._getNodeFromSubId(childNode, subId);
        } // If we are at the last index return the child node at that index
        else return childNode;
      }
      return null;
    }

    /**
     * Returns the tree node for the given path array
     * @param {Object} node The tree node whose children wil be searched
     * @param {String} path The array of indices
     * @return {Object} the child node corresponding to the given path
     * @private
     */
    _getNodeFromPath(node, path) {
      // Remove index at the head of the array
      var index = path.shift();

      var childNode = DvtTreeAutomation._getNodeByIndex(node.getChildNodes(), index);
      if (path.length == 0)
        // If this is the last index return child node at that position
        return childNode;
      else if (path.length > 0) return this._getNodeFromPath(childNode, path);

      return null;
    }

    /**
     * Returns an object containing data for a tree node. Used for verification.
     * Valid verification values inlcude:
     * <ul>
     * <li>color</li>
     * <li>label</li>
     * <li>selected</li>
     * <li>size</li>
     * <li>tooltip</li>
     * </ul>
     * @param {String} subIdPath The array of indices in the subId for the desired node
     * @return {Object|null} An object containing data for the node
     */
    getNode(subIdPath) {
      var rootNode = this._comp.getRootNode();
      if (!rootNode) {
        return null;
      }

      // If the root is real, remove first element of subIdPath since we already start searching at the root
      if (!rootNode.isArtificialRoot() && subIdPath[0] == 0) subIdPath.shift();

      // If root index was the only element of subIdPath, set the node to get data for as the root, else search for the correct node
      var node = subIdPath.length == 0 ? rootNode : this._getNodeFromPath(rootNode, subIdPath);

      if (node) {
        return {
          color: node.getColor(),
          label: node.getLabel(),
          selected: node.isSelected() == undefined ? false : node.isSelected(),
          size: node.getSize(),
          tooltip: node.getShortDesc()
        };
      }

      return null;
    }

    /**
     * Returns the node from the array with the specified index.
     * @param {array} nodes
     * @param {number} index
     * @return {DvtTreeNode}
     * @private
     */
    static _getNodeByIndex(nodes, index) {
      for (var i = 0; i < nodes.length; i++) {
        if (index == nodes[i].getIndex()) return nodes[i];
      }

      // None found, return null
      return null;
    }
  }

  /**
   * Breadcrumb rendering utilities for tree components.
   * @class
   */
  const DvtTreeBreadcrumbsRenderer = {
    _COMPONENT_GAP: 6,
    _ENABLED_INLINE_STYLE: 'color: #003286;',

    /**
     * Performs layout and rendering for the breadcrumbs in the given space.  Updates the available
     * space and returns the rendered displayable.
     * @param {DvtTreeView} treeView The owning component.
     * @param {dvt.Rectangle} availSpace The rectangle within which to layout.
     * @param {array} ancestors
     * @param {string} rootLabel The label for the root node.
     * @return {dvt.Displayable} The rendered legend contents.
     */
    render: (treeView, availSpace, ancestors, rootLabel) => {
      var context = treeView.getCtx();
      var styleDefaults = treeView.getOptions()['styleDefaults'];

      // Figure out the label styles
      var enabledStyleArray = [];
      enabledStyleArray.push(new dvt.CSSStyle(DvtTreeBreadcrumbsRenderer._ENABLED_INLINE_STYLE));
      enabledStyleArray.push(styleDefaults['_drillTextStyle']);
      var enabledStyle = dvt.CSSStyle.mergeStyles(enabledStyleArray).toString();
      var enabledStyleOver = enabledStyle + 'text-decoration: underline;';

      var disabledStyleArray = [];
      disabledStyleArray.push(styleDefaults['_currentTextStyle']);
      var disabledStyle = dvt.CSSStyle.mergeStyles(disabledStyleArray).toString();

      // Create the breadcrumbs component and temporarily add to the component
      var options = {
        labelStyle: enabledStyle,
        labelStyleOver: enabledStyleOver,
        labelStyleDown: enabledStyleOver,
        disabledLabelStyle: disabledStyle
      };
      var breadcrumbs = new DvtBreadcrumbs(
        context,
        treeView.__processBreadcrumbsEvent,
        treeView,
        options
      );
      treeView.addChild(breadcrumbs);

      // Create the data object for the breadcrumbs.  Use the reverse of the ancestors array, since
      // the most distant ancestor is rendered first.
      var dataItems = ancestors.slice(0).reverse();
      dataItems.push({ label: rootLabel });
      var data = { items: dataItems };
      breadcrumbs.render(data, availSpace.w);

      // Figure out the height used and reduce availSpace
      var dims = breadcrumbs.getDimensions();
      breadcrumbs.setTranslate(availSpace.x, availSpace.y);
      var height = dims.h + DvtTreeBreadcrumbsRenderer._COMPONENT_GAP;
      availSpace.y += height;
      availSpace.h -= height;

      // Remove the breadcrumbs so that it can be added under the right parent.
      treeView.removeChild(breadcrumbs);
      return breadcrumbs;
    }
  };

  /**
   * Category rollover handler for TreeView
   * @param {function} callback A function that responds to component events.
   * @param {object} callbackObj The object instance that the callback function is defined on.
   * @class DvtTreeCategoryRolloverHandler
   * @extends {dvt.CategoryRolloverHandler}
   * @constructor
   */
  class DvtTreeCategoryRolloverHandler extends dvt.CategoryRolloverHandler {
    /**
     * @override
     */
    GetRolloverCallback(event) {
      return () => {
        this.SetHighlightMode(true);
        this._processHighlighting();
        this.FireCallback(event);
      };
    }
    /**
     * Highlights all the nodes and their descendants
     * @param {DvtTreeNode} node
     */
    _highlightDescendants(node) {
      var nodeAndDescendantsIds = new Set(DvtTreeUtils.getAllIds(node));
      var allNodes = DvtTreeUtils.getAllNodes(this._callbackObj.getRootNode());
      var n, dim;
      for (var i = 0; i < allNodes.length; i++) {
        n = allNodes[i];
        // If node is null, then we want to remove highlight and un-dim all the nodes
        dim = node && !nodeAndDescendantsIds.has(n.getId());
        n.highlight(dim, dim ? dvt.CategoryRolloverHandler._FADE_OUT_OPACITY : 1);
      }
    }
    /**
     * @override
     */
    GetRolloutCallback(event) {
      return () => {
        this.SetHighlightModeTimeout();
        this._processHighlighting();
        this.FireCallback(event);
      };
    }

    /**
     * Process highlighting
     */
    _processHighlighting() {
      var tree = this._callbackObj;
      var options = tree.getOptions();
      var highlightMode = options['highlightMode'];
      if (highlightMode === 'descendants') {
        var obj = tree.EventManager.getCurrentHoverObj();
        this._highlightDescendants(obj);
      } else {
        // Perform the highlighting
        dvt.CategoryRolloverHandler.highlight(
          options['highlightedCategories'],
          DvtTreeUtils.getAllNodes(tree.getRootNode()),
          options['highlightMatch'] == 'any'
        );
      }
    }
  }

  /**
   * Event Manager for tree components.
   * @param {DvtTreeView} view
   * @param {dvt.Context} context
   * @param {function} callback A function that responds to component events.
   * @param {object} callbackObj The optional object instance that the callback function is defined on.
   * @constructor
   */
  class DvtTreeEventManager extends dvt.EventManager {
    constructor(view, context, callback, callbackObj) {
      super(context, callback, callbackObj, view);
      this._view = view;
    }

    /**
     * Returns the owning tree component.
     * @return {DvtTreeView}
     * @protected
     */
    GetView() {
      return this._view;
    }

    /**
     * @override
     */
    OnDblClickInternal(event) {
      // Done if there is no object
      var obj = this.GetLogicalObject(event.target);
      if (!obj) return;

      // Only double click to drill if selectable. Otherwise, drill with single click.
      if (obj.isSelectable && obj.isSelectable()) this._processDrill(obj, event.shiftKey);
    }

    /**
     * @override
     */
    OnClick(event) {
      super.OnClick(event);

      // If the object is a DvtTreePeer (for node labels), handle drilling
      var obj = this.GetLogicalObject(event.target);
      this._processNodeLabel(obj);

      // Only drill if not selectable. If selectable, drill with double click.
      if (obj && !(obj.isSelectable && obj.isSelectable())) this._processDrill(obj, event.shiftKey);
    }

    /**
     * @override
     */
    OnMouseOver(event) {
      super.OnMouseOver(event);

      // Additional mouse over support
      var obj = this.GetLogicalObject(event.target);
      if (!obj) return;

      if (obj.handleMouseOver) obj.handleMouseOver();
    }

    /**
     * @override
     */
    OnMouseOut(event) {
      super.OnMouseOut(event);

      // Additional mouse out support
      var obj = this.GetLogicalObject(event.target);
      if (!obj) return;

      // Don't hide on mouseOut to object belonging to same node (expand button for example)
      if (obj.handleMouseOut) {
        var relatedObj = this.GetLogicalObject(event.relatedTarget);
        var relatedId = relatedObj && relatedObj.getId ? relatedObj.getId() : null;
        if (obj.getId() == null || !dvt.Obj.compareValues(this.getCtx(), relatedId, obj.getId()))
          obj.handleMouseOut();
      }
    }

    /**
     * @override
     */
    ProcessKeyboardEvent(event) {
      var eventConsumed = false;
      var keyCode = event.keyCode;

      if (keyCode == dvt.KeyboardEvent.ENTER && !event.ctrlKey) {
        // handle drill operations
        var obj = this.getFocus();
        if (obj.isDrillReplaceEnabled && obj.isDrillReplaceEnabled()) {
          // SHIFT+ENTER means drill up from the current root, even if the node with keyboard focus is not the current root
          if (event.shiftKey) obj = this._view.getRootNode();

          // Delegate to the view to fire a drill event
          this._view.__drill(obj.getId(), event.shiftKey);
        }

        dvt.EventManager.consumeEvent(event);
        eventConsumed = true;
      } else {
        eventConsumed = super.ProcessKeyboardEvent(event);
      }

      return eventConsumed;
    }

    /**
     * @override
     */
    HandleTouchClickInternal(event) {
      var targetObj = event.target;
      var obj = this.GetLogicalObject(targetObj);
      this._processNodeLabel(obj);

      if (this._currentHoverItem) {
        if (this._currentHoverItem != obj) {
          this._currentHoverItem.handleMouseOut();
          this._currentHoverItem = null;
        }
      }

      if (!obj) return;

      if (obj instanceof DvtTreeNode) {
        if (this._currentHoverItem != obj) {
          this._currentHoverItem = obj;
          obj.handleMouseOver();
        }
      }

      // Only drill if not selectable. If selectable, drill with double click.
      if (!(obj.isSelectable && obj.isSelectable())) this._processDrill(obj, event.shiftKey);
    }

    /**
     * @override
     */
    HandleTouchDblClickInternal(event) {
      var targetObj = event.target;
      var obj = this.GetLogicalObject(targetObj);
      if (!obj) return;

      // Only double click to drill if selectable. Otherwise, drill with single click.
      if (obj.isSelectable && obj.isSelectable()) this._processDrill(obj, false);
    }

    /**
     * Processes a click on a node label.
     * @param {DvtLogicalObject} obj The logical object that was the target of the event
     * @private
     */
    _processNodeLabel(obj) {
      if (obj && obj instanceof DvtTreePeer && obj.isDrillable()) {
        // Delegate to the view to fire a drill event
        this._view.__drill(obj.getId(), false);
      }
    }

    /**
     * Processes a drill on the specified object.
     * @param {DvtLogicalObject} obj The logical object that was the target of the event
     * @param {boolean} shiftKey True if the shift key was pressed.
     * @private
     */
    _processDrill(obj, shiftKey) {
      // Fire a drill event if drilling is enabled
      if (obj.isDrillReplaceEnabled && obj.isDrillReplaceEnabled()) {
        // Delegate to the view to fire a drill event
        this._view.__drill(obj.getId(), shiftKey);
      }
    }

    /**
     * @override
     */
    ProcessRolloverEvent(event, obj, bOver) {
      // Don't continue if not enabled
      var options = this._view.getOptions();
      if (options['hoverBehavior'] != 'dim') return;

      this._currentHoverItem = bOver ? obj : null;

      // Compute the new highlighted categories and update the options
      var categories = obj.getCategories ? obj.getCategories() : [];
      options['highlightedCategories'] = bOver ? categories.slice() : null;

      // Fire the event to the rollover handler, who will fire to the component callback.
      var rolloverEvent = dvt.EventFactory.newCategoryHighlightEvent(
        options['highlightedCategories'],
        bOver
      );
      var nodes = DvtTreeUtils.getAllNodes(this.GetView().getRootNode());
      var hoverBehaviorDelay = dvt.CSSStyle.getTimeMilliseconds(options['hoverBehaviorDelay']);
      this.RolloverHandler.processEvent(
        rolloverEvent,
        nodes,
        hoverBehaviorDelay,
        options['highlightMatch'] == 'any'
      );
    }

    /**
     * @override
     */
    CreateCategoryRolloverHandler(callback, callbackObj) {
      return new DvtTreeCategoryRolloverHandler(callback, callbackObj);
    }
    /**
     * Returns the current hover obj
     * @returns {Object} the current hover obj
     */
    getCurrentHoverObj() {
      return this._currentHoverItem;
    }

    /**
     * @override
     */
    GetTouchResponse() {
      return this._view.getOptions()['touchResponse'];
    }
  }

  /*---------------------------------------------------------------------------------*/
  /*  DvtTreeKeyboardHandler     Keyboard handler for Sunburst                   */
  /*---------------------------------------------------------------------------------*/
  /**
   *  @param {dvt.EventManager} manager The owning dvt.EventManager
   *  @class DvtTreeKeyboardHandler
   *  @extends {dvt.KeyboardHandler}
   *  @constructor
   */
  class DvtTreeKeyboardHandler extends dvt.KeyboardHandler {
    /**
     * @override
     */
    isSelectionEvent(event) {
      return this.isNavigationEvent(event) && !event.ctrlKey;
    }

    /**
     * @override
     */
    isMultiSelectEvent(event) {
      return event.keyCode == dvt.KeyboardEvent.SPACE && event.ctrlKey;
    }
  }

  /**
   * Legend rendering utilies for tree components.
   * @class
   */
  const DvtTreeLegendRenderer = {
    /** @private @const **/
    _LEGEND_GAP: 4,
    /** @private @const **/
    _LEGEND_LABEL_GAP: 7,
    /** @private @const **/
    _LEGEND_SECTION_GAP: 24,

    /**
     * Performs layout and rendering for the legend in the given space.  Updates the available
     * space and returns the rendered displayable.
     * @param {DvtTreeView} treeView The owning component.
     * @param {dvt.Rectangle} availSpace The rectangle within which to layout.
     * @return {dvt.Displayable} The rendered legend contents.
     */
    render: (treeView, availSpace) => {
      var options = treeView.getOptions();
      var sizeValueStr = options['sizeLabel'];
      var colorValueStr = options['colorLabel'];
      if (
        (sizeValueStr == null || sizeValueStr == '') &&
        (colorValueStr == null || colorValueStr == '')
      )
        return null;

      var context = treeView.getCtx();

      // Create the legend container and temporarily add to the component
      var legend = new dvt.Container(context);
      treeView.addChild(legend);

      // Size/Color Labels
      var labelContainer = DvtTreeLegendRenderer._renderLabels(
        context,
        treeView,
        legend,
        availSpace.w,
        sizeValueStr,
        colorValueStr
      );

      // Position the sections horizontally
      var labelDims = labelContainer ? labelContainer.getDimensions() : null;
      if (labelContainer)
        // Only labels, center
        labelContainer.setTranslateX(availSpace.y + (availSpace.w - labelDims.w) / 2);

      // Figure out the height used and reduce availSpace
      var legendDims = legend.getDimensions();
      legend.setTranslateY(availSpace.y + availSpace.h - legendDims.h);
      availSpace.h -= legendDims.h + DvtTreeLegendRenderer._LEGEND_GAP;

      // Remove the legend so that it can be added under the right parent.
      treeView.removeChild(legend);
      return legend;
    },

    /**
     * Performs layout and rendering for the legend labels.
     * @param {dvt.Context} context
     * @param {DvtTreeView} treeView The owning component.
     * @param {dvt.Container} legend The legend container.
     * @param {number} availWidth The available horizontal space.
     * @param {string} sizeValueStr A description of the size metric.
     * @param {string} colorValueStr A description of the color metric.
     * @return {dvt.Displayable} The rendered contents.
     */
    _renderLabels: (context, treeView, legend, availWidth, sizeValueStr, colorValueStr) => {
      var isRTL = dvt.Agent.isRightToLeft(context);
      var eventManager = treeView.getEventManager();
      var styleDefaults = treeView.getOptions()['styleDefaults'];

      var labelContainer = null;
      if (sizeValueStr || colorValueStr) {
        // Create a container for the labels
        labelContainer = new dvt.Container(context);
        legend.addChild(labelContainer);

        var textStyle = [];
        textStyle.push(styleDefaults['_attributeTypeTextStyle']);
        var attrTypeStyle = dvt.CSSStyle.mergeStyles(textStyle);

        textStyle = [];
        textStyle.push(styleDefaults['_attributeValueTextStyle']);
        var attrValueStyle = dvt.CSSStyle.mergeStyles(textStyle);

        // Size: Size Metric
        var sizeLabel;
        var sizeValueLabel;
        var sizeLabelWidth;
        var sizeValueLabelWidth;
        var sizeWidth = 0;
        if (sizeValueStr) {
          // Size Label
          var sizeStr = treeView.getOptions().translations.labelSize;
          sizeLabel = new dvt.OutputText(context, sizeStr, 0, 0);
          sizeLabel.setCSSStyle(attrTypeStyle);
          labelContainer.addChild(sizeLabel);
          sizeLabelWidth = sizeLabel.getDimensions().w;

          // Size Value Label
          sizeValueLabel = new dvt.OutputText(context, sizeValueStr, 0, 0);
          sizeValueLabel.setCSSStyle(attrValueStyle);

          labelContainer.addChild(sizeValueLabel);
          sizeValueLabelWidth = sizeValueLabel.getDimensions().w;

          // Size section width
          sizeWidth = sizeLabelWidth + sizeValueLabelWidth + DvtTreeLegendRenderer._LEGEND_LABEL_GAP;
        }

        // Color: Color Metric
        var colorLabel;
        var colorValueLabel;
        var colorLabelWidth;
        var colorValueLabelWidth;
        var colorWidth = 0;
        if (colorValueStr) {
          // Color Label
          var colorStr = treeView.getOptions().translations.labelColor;
          colorLabel = new dvt.OutputText(context, colorStr, 0, 0);
          colorLabel.setCSSStyle(attrTypeStyle);
          labelContainer.addChild(colorLabel);
          colorLabelWidth = colorLabel.getDimensions().w;

          // Color Value Label
          colorValueLabel = new dvt.OutputText(context, colorValueStr, 0, 0);
          colorValueLabel.setCSSStyle(attrValueStyle);

          labelContainer.addChild(colorValueLabel);
          colorValueLabelWidth = colorValueLabel.getDimensions().w;

          // Size section width
          colorWidth =
            colorLabelWidth + colorValueLabelWidth + DvtTreeLegendRenderer._LEGEND_LABEL_GAP;
        }

        // Reduce size to fit if needed
        availWidth -= DvtTreeLegendRenderer._LEGEND_SECTION_GAP;
        if (sizeWidth + colorWidth > availWidth) {
          var widthPerSection = availWidth / 2;
          if (sizeWidth > widthPerSection && colorWidth > widthPerSection) {
            // Both don't fit, truncate and reposition
            var sizeValueSpace = isNaN(sizeLabelWidth)
              ? 0
              : widthPerSection - sizeLabelWidth - DvtTreeLegendRenderer._LEGEND_LABEL_GAP;
            if (dvt.TextUtils.fitText(sizeValueLabel, sizeValueSpace, Infinity, labelContainer)) {
              sizeValueLabelWidth = sizeValueLabel.getDimensions().w;
              eventManager.associate(sizeValueLabel, new dvt.SimpleObjPeer(sizeValueStr));
            } else {
              labelContainer.removeChild(sizeLabel);
              labelContainer.removeChild(sizeValueLabel);
              sizeValueLabel = null;
              sizeValueLabelWidth = 0;
            }

            var colorValueSpace =
              widthPerSection - colorLabelWidth - DvtTreeLegendRenderer._LEGEND_LABEL_GAP;
            if (dvt.TextUtils.fitText(colorValueLabel, colorValueSpace, Infinity, labelContainer)) {
              colorValueLabelWidth = colorValueLabel.getDimensions().w;
              eventManager.associate(colorValueLabel, new dvt.SimpleObjPeer(colorValueStr));
            } else {
              labelContainer.removeChild(colorLabel);
              labelContainer.removeChild(colorValueLabel);
              colorValueLabel = null;
              colorValueLabelWidth = 0;
            }
          } else if (sizeWidth > colorWidth) {
            // Reduce the size label size
            if (
              dvt.TextUtils.fitText(
                sizeValueLabel,
                availWidth - colorWidth - sizeLabelWidth - DvtTreeLegendRenderer._LEGEND_LABEL_GAP,
                Infinity,
                labelContainer
              )
            ) {
              sizeValueLabelWidth = sizeValueLabel.getDimensions().w;
              eventManager.associate(sizeValueLabel, new dvt.SimpleObjPeer(sizeValueStr));
            } else {
              labelContainer.removeChild(sizeLabel);
              labelContainer.removeChild(sizeValueLabel);
              sizeValueLabel = null;
              sizeValueLabelWidth = 0;
            }
          } else {
            // Reduce the color label size
            var colorLabelSize = isNaN(colorLabelWidth)
              ? 0
              : availWidth - sizeWidth - colorLabelWidth - DvtTreeLegendRenderer._LEGEND_LABEL_GAP;
            if (dvt.TextUtils.fitText(colorValueLabel, colorLabelSize, Infinity, labelContainer)) {
              colorValueLabelWidth = colorValueLabel.getDimensions().w;
              eventManager.associate(colorValueLabel, new dvt.SimpleObjPeer(colorValueStr));
            } else {
              labelContainer.removeChild(colorLabel);
              labelContainer.removeChild(colorValueLabel);
              colorValueLabel = null;
              colorValueLabelWidth = 0;
            }
          }
        }

        // Position the text objects
        var x = 0;
        if (isRTL) {
          if (colorLabel && colorValueLabel) {
            colorValueLabel.setX(x);
            x += colorValueLabelWidth + DvtTreeLegendRenderer._LEGEND_LABEL_GAP;
            colorLabel.setX(x);
            x += colorLabelWidth + DvtTreeLegendRenderer._LEGEND_SECTION_GAP;
          }

          if (sizeLabel && sizeValueLabel) {
            sizeValueLabel.setX(x);
            x += sizeValueLabelWidth + DvtTreeLegendRenderer._LEGEND_LABEL_GAP;
            sizeLabel.setX(x);
          }
        } else {
          if (sizeLabel && sizeValueLabel) {
            sizeLabel.setX(x);
            x += sizeLabelWidth + DvtTreeLegendRenderer._LEGEND_LABEL_GAP;
            sizeValueLabel.setX(x);
            x += sizeValueLabelWidth + DvtTreeLegendRenderer._LEGEND_SECTION_GAP;
          }

          if (colorLabel && colorValueLabel) {
            colorLabel.setX(x);
            x += colorLabelWidth + DvtTreeLegendRenderer._LEGEND_LABEL_GAP;
            colorValueLabel.setX(x);
          }
        }
      }
      return labelContainer;
    }
  };

  /**
   * The base class for tree components.
   * @extends {dvt.BaseComponent}
   * @class The base class for tree components.
   * @constructor
   */
  class DvtTreeView extends dvt.BaseComponent {
    /**
     * Initializes the tree view.
     * @param {dvt.Context} context The rendering context.
     * @param {object} callback The function that should be called to dispatch component events.
     * @param {object} callbackObj The object context for the callback function
     * @protected
     */
    constructor(context, callback, callbackObj) {
      super(context, callback, callbackObj);

      // Create the event handler and add event listeners
      this.EventManager = this.CreateEventManager(this, context, this.dispatchEvent, this);
      this.EventManager.addListeners(this);

      // Drag and drop support
      // this._dragSource = new dvt.DragSource(context);
      // this.EventManager.setDragSource(this._dragSource);

      /**
       * Field used to store the legend displayable during render.
       * @private
       */
      this._legend = null;

      // boolean to indicate whether or not this view has current keyboard focus
      this._hasFocus = false;

      // String to indicate the id of the node that should get keyboard focus
      // Used when an event causes the view to re-render or animate and we want to re-set the keyboard focus to a
      // non-default node, for example when we
      // 1. drill up (set keyboard focus to the node that was the previous, drilled-in root of the treemap)
      // 2. restore a treemap after isolating a node (set focus to the node that was previously isolated)
      // 3. expand or collapse a sunburst node (set focus to the node that was expanded/collapsed)
      this._navigableIdToFocus = null;
    }

    /**
     * @override
     */
    SetOptions(options) {
      super.SetOptions(options);
      if (options) {
        this.Options = this.Defaults.calcOptions(options);

        if (dvt.Agent.isEnvironmentTest()) {
          this.Options['animationOnDisplay'] = 'none';
          this.Options['animationOnDataChange'] = 'none';
        }
        // Save a backup copy of original nodes object to access data during drilling
        this.Options['_nodes'] = this.Options['nodes'];

        if (this.Options['rootNode']) {
          this.Options['_ancestors'] = null;
          var rootAndAncestors = DvtTreeUtils.findRootAndAncestors(
            this.getCtx(),
            this.Options['nodes'],
            this.Options['rootNode'],
            []
          );
          if (rootAndAncestors && rootAndAncestors['root'])
            this.Options['nodes'] = [rootAndAncestors['root']];
          if (rootAndAncestors && rootAndAncestors['ancestors'])
            this.Options['_ancestors'] = rootAndAncestors['ancestors'];
        }
      } else if (!this.Options) this.Options = this.GetDefaults();
    }

    /**
     * Renders the component using the specified options.  If no options is supplied to a component
     * that has already been rendered, this function will rerender the component with the
     * specified size.
     * @param {object} options The new options object.
     * @param {number} width The width of the component.
     * @param {number} height The height of the component.
     */
    render(options, width, height) {
      // Update if a new options object has been provided or initialize with defaults if needed.
      var bNewOptions = options || !this.Options;
      this.SetOptions(options);

      if (bNewOptions) {
        // Process the options object
        var root = this._processNodes();
        this.ApplyParsedProps({ root: root });
      }

      // Update the width and height if provided
      if (!isNaN(width) && !isNaN(height)) {
        this.Width = width;
        this.Height = height;
      }

      // Hide any currently shown tooltips
      if (this.EventManager) this.EventManager.hideTooltip();

      // Relayout the component (for resize or new data)
      var availSpace = new dvt.Rectangle(0, 0, this.Width, this.Height);
      this.Layout(availSpace);

      // Create a new container and render the component into it
      var container = new dvt.Container(this.getCtx());
      this.addChild(container);

      this.Render(container, availSpace);

      // Animation Support
      // Stop any animation in progress
      this.StopAnimation();

      // Construct the new animation playable
      var animationOnDataChange = this.getOptions()['animationOnDataChange'];
      var bounds = new dvt.Rectangle(0, 0, this.Width, this.Height);
      var bBlackBoxUpdate = false; // true if this is a black box update animation
      if (!this._container) {
        this.Animation = this.GetDisplayAnim(container, bounds);
      } else if (animationOnDataChange && bNewOptions) {
        // AnimationOnDataChange
        if (dvt.BlackBoxAnimationHandler.isSupported(animationOnDataChange)) {
          // Black Box Animation
          this.Animation = dvt.BlackBoxAnimationHandler.getCombinedAnimation(
            this.getCtx(),
            animationOnDataChange,
            this._container,
            container,
            bounds,
            this.AnimationDuration
          );
          bBlackBoxUpdate = true;
        } else if (this._oldRoot && animationOnDataChange == 'auto') {
          // Data Change Animation
          // Create the animation handler, calc, and play the animation
          this._deleteContainer = this.GetDeleteContainer();
          this.addChild(this._deleteContainer);
          var ah = new DvtTreeAnimationHandler(this.getCtx(), this._deleteContainer);
          ah.animate(this._oldRoot, this._root, this._oldAncestors, this._ancestors);
          this.Animation = ah.getAnimation(true);
        }
      }

      // Clear out the old info, not needed anymore
      this._oldRoot = null;
      this._oldAncestors = null;

      // If an animation was created, play it
      if (this.Animation) {
        // Disable event listeners temporarily
        this.EventManager.removeListeners(this);

        // Start the animation
        this.Animation.setOnEnd(this.OnAnimationEnd, this);
        this.Animation.play();
      }

      // Clean up the old container.  If doing black box animation, store a pointer and clean
      // up after animation is complete.  Otherwise, remove immediately.
      if (bBlackBoxUpdate) {
        this._oldContainer = this._container;
      } else if (this._container) {
        // Not black box animation, so clean up the old contents
        this.removeChild(this._container);
      }

      // Update the pointer to the new container
      this._container = container;

      // Selection Support
      if (bNewOptions) {
        // Update the selection manager with the initial selections.  This must be done after
        // the shapes are created to apply the selection effects.
        this._processInitialSelections();
      } else this.ReselectNodes(); // Resize or Rerender: Reselect the nodes using the selection handler's state

      // Update the event manager with the initial focus
      this._processInitialFocus(!this.Animation);

      // Process the highlightedCategories. We'll also do this in the animation end listener to avoid conflicts with insert
      // animations.
      if (!this.Animation) this._processInitialHighlighting();

      this.UpdateAriaAttributes();

      if (!this.Animation)
        // If not animating, that means we're done rendering, so fire the ready event.
        this.RenderComplete();
    }

    /**
     * Parses the xml and returns the root node.
     * @param {string} xmlString The string to be parsed
     * @return {object} An object containing the parsed properties.
     * @protected
     */
    Parse(xmlString) {
      // subclasses should override
      return null;
    }

    /**
     * Performs layout for the component.
     * @param {dvt.Rect} availSpace The rectangle within which to perform layout.
     * @protected
     */
    Layout(availSpace) {
      // subclasses should override
    }

    /**
     * Renders the component.
     * @param {dvt.Container} container The container to render within.
     * @param {dvt.Rectangle} bounds The bounds of the node area.
     * @protected
     */
    Render(container, bounds) {
      // subclasses should override
    }

    /**
     * Renders the background.
     * @param {dvt.Container} container The container to render within.
     * @protected
     */
    RenderBackground(container) {
      // Render an invisible fill for eventing
      var background = new dvt.Rect(this.getCtx(), 0, 0, this.Width, this.Height);
      background.setInvisibleFill();
      container.addChild(background);
    }

    /**
     * Lays out the breadcrumbs and updates the available space.
     * @param {dvt.Rect} availSpace The rectangle within which to perform layout.
     * @protected
     */
    LayoutBreadcrumbs(availSpace) {
      if (this._ancestors.length > 0) {
        var rootLabel = this._root ? this._root.getLabel() : null;

        if (this._breadcrumbs)
          this.EventManager.removeComponentKeyboardHandler(this._breadcrumbs.getEventManager());

        this._breadcrumbs = DvtTreeBreadcrumbsRenderer.render(
          this,
          availSpace,
          this._ancestors,
          rootLabel
        );
        this.EventManager.addComponentKeyboardHandlerAt(this._breadcrumbs.getEventManager(), 0);
      } else {
        if (this._breadcrumbs)
          this.EventManager.removeComponentKeyboardHandler(this._breadcrumbs.getEventManager());

        this._breadcrumbs = null;
      }
    }

    /**
     * Renders the breadcrumbs.
     * @param {dvt.Container} container The container to render within.
     * @protected
     */
    RenderBreadcrumbs(container) {
      // The breadcrumbs are actually already rendered in _layoutBreadcrumbs, so just add it to the tree here.
      if (this._breadcrumbs) {
        container.addChild(this._breadcrumbs);
      }
    }

    /**
     * Lays out the legend component and updates the available space.
     * @param {dvt.Rect} availSpace The rectangle within which to perform layout.
     * @protected
     */
    LayoutLegend(availSpace) {
      this._legend = DvtTreeLegendRenderer.render(this, availSpace, this._legendSource);
    }

    /**
     * Renders the legend.
     * @param {dvt.Container} container The container to render within.
     * @protected
     */
    RenderLegend(container) {
      // The legend is actually already rendered in _layoutLegend, so just add it to the tree here.
      if (this._legend) {
        container.addChild(this._legend);

        // Clear the pointer, since we don't need it anymore
        this._legend = null;
      }
    }

    /**
     * Renders the empty text message, centered in the available space.
     * @param {dvt.Container} container The container to render within.
     * @protected
     */
    RenderEmptyText(container) {
      var options = this.getOptions();
      var emptyText = options['emptyText'];
      if (!emptyText) emptyText = options.translations.labelNoData;

      this.renderEmptyText(
        container,
        emptyText,
        new dvt.Rectangle(0, 0, this.Width, this.Height),
        this.getEventManager(),
        options['_statusMessageStyle']
      );
    }

    /**
     * Checks whether the component has valid data.
     * @return {boolean} True if the component has valid data.
     * @protected
     */
    HasValidData() {
      return this._root && this._root.getSize() > 0;
    }

    /**
     * Returns the animation to use on initial display of this component.
     * @param {dvt.Container} container The container to render within.
     * @param {dvt.Rectangle} bounds The bounds of the node area.
     * @return {dvt.BaseAnimation} The initial display animation.
     * @protected
     */
    GetDisplayAnim(container, bounds) {
      var animationOnDisplay = this.getOptions()['animationOnDisplay'];
      if (dvt.BlackBoxAnimationHandler.isSupported(animationOnDisplay))
        return dvt.BlackBoxAnimationHandler.getInAnimation(
          this.getCtx(),
          animationOnDisplay,
          container,
          bounds,
          this.AnimationDuration
        );
      else return null;
    }

    /**
     * Hook for cleaning up animation behavior at the end of the animation.
     * @protected
     */
    OnAnimationEnd() {
      // Remove the container containing the delete animations
      if (this._deleteContainer) {
        this.removeChild(this._deleteContainer);
        this._deleteContainer = null;
      }

      // Clean up the old container used by black box updates
      if (this._oldContainer) {
        this.removeChild(this._oldContainer);
        this._oldContainer = null;
      }

      // Restore event listeners
      this.EventManager.addListeners(this);

      // Restore visual effects on node with keyboard focus
      this._processInitialFocus(true);

      // Process the highlightedCategories
      this._processInitialHighlighting();

      if (!this.AnimationStopped) this.RenderComplete();

      // Reset animation flags
      this.Animation = null;
      this.AnimationStopped = false;
    }

    /**
     * Creates a container that can be used for storing delete animation content.
     * @return {dvt.Container}
     * @protected
     */
    GetDeleteContainer() {
      return new dvt.Container(this.getCtx());
    }

    /**
     * Returns a keyboard handler that can be used by the view's event manager
     * @param {dvt.EventManager} manager The owning event manager
     * @return {dvt.KeyboardHandler}
     * @protected
     */
    CreateKeyboardHandler(manager) {
      return new DvtTreeKeyboardHandler(manager);
    }

    /**
     * Returns an event manager that will handle events on this view
     * @param {dvt.Container} view
     * @param {dvt.Context} context
     * @param {object} callback The function that should be called to dispatch component events.
     * @param {object} callbackObj The object context for the callback function
     * @return {dvt.EventManager}
     * @protected
     */
    CreateEventManager(view, context, callback, callbackObj) {
      return new DvtTreeEventManager(view, context, callback, callbackObj);
    }

    /**
     * Returns the node that should receive initial keyboard focus when the view first gets focus
     * @param {DvtTreeNode} root The node that should receive initial keyboard focus
     * @return {DvtTreeNode}
     * @protected
     */
    GetInitialFocusedItem(root) {
      if (root && root.isArtificialRoot()) {
        var nodes = root.getChildNodes();
        if (nodes && nodes.length > 0) return nodes[0];
      }
      return root;
    }

    /**
     * @override
     */
    highlight(categories) {
      // Update the options
      this.getOptions()['highlightedCategories'] = dvt.JsonUtils.clone(categories);

      // Perform the highlighting
      dvt.CategoryRolloverHandler.highlight(
        categories,
        DvtTreeUtils.getAllNodes(this._root),
        this.getOptions()['highlightMatch'] == 'any'
      );
    }

    /**
     * @override
     */
    select(selection) {
      // Update the options
      var options = this.getOptions();
      options['selection'] = dvt.JsonUtils.clone(selection);

      // Perform the selection
      if (this._selectionHandler) {
        var targets = DvtTreeUtils.getAllNodes(this._root);
        this._selectionHandler.processInitialSelections(options['selection'], targets);
      }
    }

    /**
     * Returns the maximum depth of the tree.
     * @return {number} The maximum depth of the tree.
     */
    __getMaxDepth() {
      return this._maxDepth;
    }

    /**
     * Returns the node count of the tree.
     * @return {number} The node count of the tree.
     */
    __getNodeCount() {
      return this._nodeCount;
    }

    /**
     * Applies the parsed properties to this component.
     * @param {object} props An object containing the parsed properties for this component.
     * @protected
     */
    ApplyParsedProps(props) {
      var options = this.getOptions();

      // Save the old info for animation support
      this._oldRoot = this._root;
      this._oldAncestors = this._ancestors;

      // Save the parsed properties
      this._root = props.root;
      this._ancestors = options['_ancestors'] ? options['_ancestors'] : [];
      this._nodeCount = this._root ? DvtTreeUtils.calcNodeCount(this._root) : 0;
      this._maxDepth = this._root ? DvtTreeUtils.calcMaxDepth(this._root, 0) : 0;

      // TODO : This uses the weird client side value in seconds
      this.AnimationDuration = dvt.CSSStyle.getTimeMilliseconds(options['animationDuration']) / 1000;

      this._styles = props.styles ? props.styles : {};

      // Selection Support
      if (options['selectionMode'] == 'none') this._nodeSelection = null;
      else if (options['selectionMode'] == 'single')
        this._nodeSelection = dvt.SelectionHandler.TYPE_SINGLE;
      else this._nodeSelection = dvt.SelectionHandler.TYPE_MULTIPLE;

      if (this._nodeSelection) {
        this._selectionHandler = new dvt.SelectionHandler(this.getCtx(), this._nodeSelection);
        this._initialSelection = options['selection'];
      } else this._selectionHandler = null;

      // Event Handler delegates to other handlers
      this.EventManager.setSelectionHandler(this._selectionHandler);

      // Keyboard Support
      this.EventManager.setKeyboardHandler(this.CreateKeyboardHandler(this.EventManager));

      // Attribute Groups and Legend Support
      this._legendSource = null;
    }

    /**
     * Reselects the selected nodes after a re-render.
     * @protected
     */
    ReselectNodes() {
      var selectedNodes = this._selectionHandler ? this._selectionHandler.getSelection() : [];
      for (var i = 0; i < selectedNodes.length; i++) selectedNodes[i].setSelected(true);
    }

    /**
     * Update the selection handler with the initial selections.
     * @private
     */
    _processInitialSelections() {
      if (this._selectionHandler && this._initialSelection) {
        var targets = DvtTreeUtils.getAllNodes(this._root);
        this._selectionHandler.processInitialSelections(this._initialSelection, targets);
        this._initialSelection = null;
      }
    }

    /**
     * Update the displayables with the initial highlighting.
     * @private
     */
    _processInitialHighlighting() {
      var highlightedCategories = this.getOptions()['highlightedCategories'];
      if (highlightedCategories && highlightedCategories.length > 0)
        this.highlight(highlightedCategories);
    }

    /**
     * Update the event manager with the initial focused item
     * @param {Boolean} applyVisualEffects True if we want to apply visual effects to indicate which node has
     *                  keyboard focus.
     * @private
     */
    _processInitialFocus(applyVisualEffects) {
      var initialFocus = null;
      var id = this.__getNavigableIdToFocus();

      if (id) {
        initialFocus = DvtTreeNode.getNodeById(this._root, id);
        this.EventManager.setFocus(initialFocus);
      }

      if (applyVisualEffects) {
        // if we are applying visual effects in response to an event that caused a re-render or animation, and this
        // event specified a non-default node to set keyboard focus on, clear that value now that we've used it
        this.__setNavigableIdToFocus(null);
      }

      if (!initialFocus) {
        // set the item that has initial keyboard focus to a default if none was previously defined
        initialFocus = this.GetInitialFocusedItem(this._root);
        this.EventManager.setFocus(initialFocus);
      }

      // have the event manager apply any needed visual effects
      // however, do this only if we are not animating so as to prevent the focus visual effect
      // from appearing during the duration of the animation
      if (applyVisualEffects) this.setFocused(this.isFocused());
    }

    /**
     * Update the visual effects on view when it receives or loses keyboard focus
     *
     * @param {boolean} isFocused
     */
    setFocused(isFocused) {
      this._hasFocus = isFocused;
      this.EventManager.setFocused(isFocused);
    }

    /**
     * Returns true if the view currently has keyboard focus
     * @return {boolean}
     */
    isFocused() {
      return this._hasFocus;
    }

    /**
     * Returns the animation duration, in milliseconds.
     * @return {number}
     */
    __getAnimDur() {
      return this.AnimationDuration;
    }

    /**
     * Returns the node under the specified coordinates.
     * @param {number} x
     * @param {number} y
     * @return {DvtTreeNode}
     */
    __getNodeUnderPoint(x, y) {
      return this._root.getNodeUnderPoint(x, y);
    }

    /**
     * Returns the clientId of the drag source owner if dragging is supported.
     * @param {array} clientIds
     * @return {string}
     */
    __isDragAvailable(clientIds) {
      // Drag and drop supported when selection is enabled, only 1 drag source
      if (this._selectionHandler) return clientIds[0];
      else return null;
    }

    /**
     * Returns the row keys for the current drag.
     * @param {DvtTreeNode} node The node where the drag was initiated.
     * @return {array} The row keys for the current drag.
     */
    __getDragTransferable(node) {
      // Select the node if not already selected
      if (!node.isSelected()) {
        this._selectionHandler.processClick(node, false);
        this.EventManager.fireSelectionEvent();
      }

      // Gather the rowKeys for the selected objects
      var rowKeys = [];
      var selection = this._selectionHandler.getSelection();
      for (var i = 0; i < selection.length; i++) {
        rowKeys.push(selection[i].getId());
      }

      return rowKeys;
    }

    /**
     * Returns the displayables to use for drag feedback for the current drag.
     * @return {array} The displayables for the current drag.
     */
    __getDragFeedback() {
      // This is called after __getDragTransferable, so the selection has been updated already.
      // Gather the displayables for the selected objects
      var displayables = [];
      var selection = this._selectionHandler.getSelection();
      for (var i = 0; i < selection.length; i++) {
        displayables.push(selection[i].getDisplayable());
      }

      return displayables;
    }

    /**
     * Displays drop site feedback for the specified node.
     * @param {DvtTreeNode} node The node for which to show drop feedback, or null to remove drop feedback.
     * @return {dvt.Displayable} The drop site feedback, if any.
     */
    __showDropSiteFeedback(node) {
      // Remove any existing drop site feedback
      if (this._dropSiteFeedback) {
        this.removeChild(this._dropSiteFeedback);
        this._dropSiteFeedback = null;
      }

      // Create feedback for the node
      if (node) {
        this._dropSiteFeedback = node.getDropSiteFeedback();
        if (this._dropSiteFeedback) {
          var styleDefaults = this.getOptions()['styleDefaults'];
          this._dropSiteFeedback.setSolidFill(
            styleDefaults['_dropSiteFillColor'],
            styleDefaults['_dropSiteOpacity']
          );
          this._dropSiteFeedback.setSolidStroke(styleDefaults['_dropSiteBorderColor']);
          this.addChild(this._dropSiteFeedback);
        }
      }
      return this._dropSiteFeedback;
    }

    /**
     * Processes a breadcrumb drill event.
     * @param {object} event
     */
    __processBreadcrumbsEvent(event) {
      if (event.type === 'breadcrumbsDrill') this.__drill(event.id, false);
    }

    /**
     * Performs a drill on the specified node.
     * @param {string} id
     * @param {boolean} bDrillUp True if this is a drill up operation.
     */
    __drill(id, bDrillUp) {
      var component = this.getOptions()['_widgetConstructor'];
      if (bDrillUp && this._root && id == this._root.getId() && this._ancestors.length > 0) {
        // after the drill up completes, set keyboard focus on the node that was the
        // root of the previously drilled-down view
        this.__setNavigableIdToFocus(id);

        // Drill up only supported on the root node
        this.dispatchEvent(
          dvt.EventFactory.newTreeDrillEvent(
            this._ancestors[0].id,
            DvtTreeUtils.findRootAndAncestors(
              this.getCtx(),
              this.getOptions()['_nodes'],
              this._ancestors[0].id,
              []
            )['root'],
            component
          )
        );
      } else if (!bDrillUp)
        // Fire the event
        this.dispatchEvent(
          dvt.EventFactory.newTreeDrillEvent(
            id,
            DvtTreeUtils.findRootAndAncestors(this.getCtx(), this.getOptions()['_nodes'], id, [])[
              'root'
            ],
            component
          )
        );

      // Hide any tooltips being shown
      this.getCtx().getTooltipManager().hideTooltip();
    }

    /**
     * Returns the logical object corresponding to the physical target
     * @param {Object} target
     * @return {Object}
     */
    getLogicalObject(target) {
      return this.EventManager.GetLogicalObject(target);
    }

    /**
     * @return {DvtTreeNode} the root tree node.
     */
    getRootNode() {
      return this._root;
    }

    /**
     * Returns the id of the node that should get keyboard focus, if the default node should not receive focus.
     * Used when an event causes the view to re-render or animate and we want to set the keyboard focus
     * to a non-default node.
     *
     * @return {String} the id of the node that should receive keyboard focus
     */
    __getNavigableIdToFocus() {
      return this._navigableIdToFocus;
    }

    /**
     * Sets the id of the node that should get keyboard focus, if the default node should not receive focus.
     * Used when an event causes the view to re-render or animate and we want to set the keyboard focus
     * to a non-default node.
     *
     * @param {String} id The id of the node that should receive keyboard focus
     */
    __setNavigableIdToFocus(id) {
      this._navigableIdToFocus = id;
    }

    /**
     * @return {String} whether nodeSelection is multiple, single, or null.
     */
    __getNodeSelection() {
      return this._nodeSelection;
    }

    /**
     * Creates a node for this view. Subclasses must override.
     * @param {object} nodeOptions The options for the node.
     * @return {DvtTreeNode}
     * @protected
     */
    CreateNode(nodeOptions) {
      // subclasses must override
      return null;
    }

    /**
     * Returns the automation object for this treeView
     * @return {dvt.Automation} The automation object
     */
    getAutomation() {
      return new DvtTreeAutomation(this);
    }

    /**
     * Returns the breadcrumbs object for this treeView
     * Used by automation APIs
     * @return {Breadcrumbs} The breadcrumbs object
     */
    getBreadcrumbs() {
      return this._breadcrumbs;
    }

    /**
     * Recursively creates and returns the root layer nodes based on the options object. Creates an artificial node if
     * needed for multi-rooted trees.
     * @return {DvtTreeNode}
     * @private
     */
    _processNodes() {
      var options = this.getOptions();
      if (options['nodes'] == null || options['displayLevels'] == 0) return null;

      // Create each of the root level nodes
      var rootNodes = [];
      // create a boolean map of hidden categories for better performance
      var hiddenCategories = dvt.ArrayUtils.createBooleanMap(options['hiddenCategories']);
      for (var i = 0; i < options['nodes'].length; i++) {
        var nodeOptions = options['nodes'][i];

        // Store the index for automation
        nodeOptions['_index'] = i;

        // Recursively process the node
        var rootNode = this._processNode(hiddenCategories, nodeOptions, options['displayLevels']);
        if (rootNode) rootNodes.push(rootNode);
      }

      // Ensure that there's a single root, creating an artificial one if needed
      if (rootNodes.length == 1) return rootNodes[0];
      else {
        // Calculate the sum of the child sizes
        var size = 0;
        for (var j = 0; j < rootNodes.length; j++) {
          size += rootNodes[j].getSize();
        }

        // Create the actual node and set the children
        var props = { value: size, bArtificialRoot: true, id: this._id };
        var artificialRoot = this.CreateNode(props);
        artificialRoot.setChildNodes(rootNodes);
        return artificialRoot;
      }
    }

    /**
     * Recursively creates and returns the node based on the options object.
     * @param {object} hiddenCategories The boolean map of hidden categories.
     * @param {object} nodeOptions The options for the node to process.
     * @param {number} depth The depth to recurse down to
     * @return {DvtTreeNode}
     * @private
     */
    _processNode(hiddenCategories, nodeOptions, depth) {
      // Don't create if node is hidden
      if (DvtTreeUtils.isHiddenNode(hiddenCategories, nodeOptions)) return null;

      // Create the node
      var node = this.CreateNode(nodeOptions);

      // Create child nodes only if this node is expanded
      if (node.isDisclosed() && depth > 1) {
        // Recurse and build the child nodes
        var childNodes = [];
        var childOptions = nodeOptions['nodes'] ? nodeOptions['nodes'] : [];
        for (var childIndex = 0; childIndex < childOptions.length; childIndex++) {
          var childNodeOptions = childOptions[childIndex];
          childNodeOptions['_index'] = childIndex;
          var childNode = this._processNode(
            hiddenCategories,
            childNodeOptions,
            depth != null ? depth - 1 : depth
          );
          if (childNode) childNodes.push(childNode);
        }
        node.setChildNodes(childNodes);
      }

      return node;
    }

    /**
     * Annotates nodes with aria flowto properties for VoiceOver navigation
     * @param {DvtTreeNode} root The root node
     * @protected
     */
    UpdateAriaNavigation(root) {
      // VoiceOver workaround for 
      if (dvt.Agent.isTouchDevice() || dvt.Agent.isEnvironmentTest()) {
        var nodes = DvtTreeUtils.getAllVisibleNodes(root);
        for (var i = 0; i < nodes.length - 1; i++) {
          // Set the aria flowto property of the current node to the next node's id
          var id =
            this.getId() + (nodes[i + 1].getId() ? nodes[i + 1].getId() : nodes[i + 1].getLabel());
          // VoiceOver doesn't work well if there are spaces in the id so remove all spaces first
          id = id.replace(/\s+/g, '');
          nodes[i + 1].getDisplayable().setId(id, true);
          nodes[i].getDisplayable().setAriaProperty('flowto', id);
        }
      }
    }

    /**
     * Check if nodes data came from data provider
     * @return {boolean} return true for data provider mode
     */
    hasDataProvider() {
      return !!this.getOptions()['data'];
    }
  }

  /**
   * Default values and utility functions for component versioning.
   * @class
   * @constructor
   * @extends {dvt.BaseComponentDefaults}
   */
  class DvtTreeDefaults extends dvt.BaseComponentDefaults {
    constructor(defaultsMap, context) {
      /**
       * Defaults for version 1. This component was exposed after the Alta skin, so no earlier defaults are provided.
       */
      const SKIN_ALTA = {
        skin: dvt.CSSStyle.SKIN_ALTA,

        // Note, only attributes that are different than the XML defaults need
        // to be listed here, at least until the XML API is replaced.
        animationDuration: 500,
        animationOnDataChange: 'none',
        animationOnDisplay: 'none',
        drilling: 'off',
        displayLevels: Number.MAX_VALUE,
        highlightMatch: 'all',
        hoverBehavior: 'none',
        hoverBehaviorDelay: 200,
        nodeDefaults: {
          labelStyle: new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_11),
          labelMinLength: 1
        },
        selectionMode: 'multiple',
        sorting: 'off',
        _statusMessageStyle: new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA),
        styleDefaults: {
          _attributeTypeTextStyle: new dvt.CSSStyle(
            dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_BOLD_12 + 'color:#4F4F4F'
          ),
          _attributeValueTextStyle: new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12),
          _currentTextStyle: new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12),
          _drillTextStyle: new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12),
          _labelStyle: new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA)
        },
        touchResponse: 'auto',

        _resources: {}
      };
      super({ alta: dvt.JsonUtils.merge(defaultsMap['alta'], SKIN_ALTA) }, context);
    }
  }

  /**
   * Default values and utility functions for component versioning.
   * @class
   * @constructor
   * @param {dvt.Context} context The rendering context.
   * @extends {DvtTreeDefaults}
   */
  class DvtSunburstDefaults extends DvtTreeDefaults {
    constructor(context) {
      /**
       * Defaults for version 1. This component was exposed after the Alta skin, so no earlier defaults are provided.
       */
      const SKIN_ALTA = {
        // Note, only attributes that are different than the XML defaults need
        // to be listed here, at least until the XML API is replaced.

        nodeDefaults: {
          borderColor: 'rgba(255,255,255,0.3)',
          borderWidth: 1,
          hoverColor: '#FFFFFF',
          labelDisplay: 'auto',
          labelHalign: 'center',
          selectedInnerColor: '#FFFFFF',
          selectedOuterColor: '#000000'
        },
        rootNodeContent: {},
        rotation: 'on',
        expanded: 'all',
        startAngle: 90
      };
      super({ alta: SKIN_ALTA }, context);
    }
  }

  /**
   * Event Manager for Sunburst.
   *
   * @param {Sunburst} view The Sunburst to associate with this event manager
   * @param {dvt.Context} context The platform specific context object.
   * @param {function} callback A function that responds to component events.
   * @param {object} callbackObj The optional object instance that the callback function is defined on.
   * @class
   * @constructor
   */
  class DvtSunburstEventManager extends DvtTreeEventManager {
    constructor(view, context, callback, callbackObj) {
      super(view, context, callback, callbackObj);
      this.ROTATE_KEY = 'rotateKey';
    }
    /**
     * @override
     */
    OnMouseDown(event) {
      // Rotation Support
      var obj = this.GetLogicalObject(event.target);
      if (
        obj &&
        obj.getId &&
        obj.getId() === DvtSunburstEventManager.ROTATION_ID &&
        !this._bRotating
      ) {
        this._bRotating = true;

        var relPos = this._context.pageToStageCoords(event.pageX, event.pageY);
        this.GetView().__startRotation(relPos.x, relPos.y);
      } else super.OnMouseDown(event);
    }

    /**
     * @override
     */
    OnMouseMove(event) {
      if (this._bRotating) {
        var relPos = this._context.pageToStageCoords(event.pageX, event.pageY);
        this.GetView().__continueRotation(relPos.x, relPos.y);
      } else super.OnMouseMove(event);
    }

    /**
     * @override
     */
    OnMouseUp(event) {
      if (this._bRotating) {
        this._bRotating = false;
        this.GetView().__endRotation();
      } else super.OnMouseUp(event);
    }

    /**
     * @override
     */
    ProcessKeyboardEvent(event) {
      var eventConsumed = true;

      var keyCode = event.keyCode;
      var node = this.getFocus(); // the item with current keyboard focus
      var sunburst = this.GetView();
      var expandCollapseEnabled =
        node && node.isExpandCollapseEnabled && node.isExpandCollapseEnabled();
      // expand/collapse
      if (
        expandCollapseEnabled &&
        ((dvt.KeyboardEvent.isPlus(event) && !node.isDisclosed()) ||
          (dvt.KeyboardEvent.isMinus(event) && node.isDisclosed()) ||
          (event.ctrlKey && keyCode === dvt.KeyboardEvent.ENTER))
      ) {
        sunburst.expandCollapseNode(node.getId());
        dvt.EventManager.consumeEvent(event);
      } else if (
        sunburst &&
        sunburst.__isRotationEnabled() &&
        (keyCode === dvt.KeyboardEvent.LEFT_ARROW || keyCode === dvt.KeyboardEvent.RIGHT_ARROW) &&
        !event.ctrlKey &&
        event.altKey &&
        event.shiftKey
      ) {
        // rotation
        var newAngle;
        if (keyCode === dvt.KeyboardEvent.LEFT_ARROW) newAngle = -5 * (Math.PI / 180);
        else newAngle = 5 * (Math.PI / 180);

        sunburst.__setRotationAnchor(0);
        sunburst.__rotate(newAngle);
        sunburst.__endRotation();
        dvt.EventManager.consumeEvent(event);
      } else {
        eventConsumed = super.ProcessKeyboardEvent(event);
      }

      return eventConsumed;
    }

    HandleImmediateTouchStartInternal(event) {
      var obj = this.GetLogicalObject(event.target);
      if (obj && obj.getId && obj.getId() === DvtSunburstEventManager.ROTATION_ID) {
        this.TouchManager.processAssociatedTouchAttempt(
          event,
          this.ROTATE_KEY,
          this.RotateStartTouch,
          this
        );
      }
    }

    HandleImmediateTouchMoveInternal(event) {
      this.TouchManager.processAssociatedTouchMove(event, this.ROTATE_KEY);
    }

    HandleImmediateTouchEndInternal(event) {
      this.TouchManager.processAssociatedTouchEnd(event, this.ROTATE_KEY);
    }

    RotateStartTouch(event, touch) {
      var touchIds = this.TouchManager.getTouchIdsForObj(this.ROTATE_KEY);
      if (touchIds.length <= 1) {
        this.TouchManager.saveProcessedTouch(
          touch.identifier,
          this.ROTATE_KEY,
          null,
          this.ROTATE_KEY,
          this.ROTATE_KEY,
          this.RotateMoveTouch,
          this.RotateEndTouch,
          this
        );
        this.TouchManager.setTooltipEnabled(touch.identifier, false);
        var pos = this._context.pageToStageCoords(touch.pageX, touch.pageY);
        this.GetView().__startRotation(pos.x, pos.y);
        event.blockTouchHold();
      }
    }

    RotateMoveTouch(event, touch) {
      var pos = this._context.pageToStageCoords(touch.pageX, touch.pageY);
      this.GetView().__continueRotation(pos.x, pos.y);
      event.preventDefault();
    }

    RotateEndTouch() {
      this.GetView().__endRotation();
    }
  }
  DvtSunburstEventManager.ROTATION_ID = '_rotationShape'; // id used to identify the shape used for rotation

  /**
   * Layout class for sunbursts.
   * @class
   */
  const DvtSunburstLayout = {
    /**
     * Performs layout for the sunburst.
     * @param {number} totalRadius The total radius of the sunburst.
     * @param {DvtSunburstNode} root The root of the tree.
     * @param {number} startAngle The starting angle for the sunburst in radians.
     * @param {number} angleExtent The extent of this node in radians.
     * @param {string} sorting "on" if sorting by size is enabled.
     */
    layout: (totalRadius, root, startAngle, angleExtent, sorting) => {
      // Calculate the longest branch radius and radius per unit of depth
      var longestRadius = DvtSunburstLayout._calcLargestRadius(root);
      var radiusPerDepth = totalRadius / longestRadius;

      // Layout the nodes
      DvtSunburstLayout._layout(radiusPerDepth, root, startAngle, angleExtent, sorting, 0);
    },

    /**
     * Performs layout for the specified node in the sunburst.
     * @param {number} radiusPerDepth The radius per depth unit.
     * @param {DvtSunburstNode} node The root of the subtree.
     * @param {number} startAngle The starting angle for this node in radians.
     * @param {number} angleExtent The extent of this node in radians.
     * @param {string} sorting "on" if sorting by size is enabled.
     * @param {number} innerRadius The inner radius of the node to layout.
     */
    _layout: (radiusPerDepth, node, startAngle, angleExtent, sorting, innerRadius) => {
      // First layout the node itself
      var outerRadius = innerRadius + node.__getRadius() * radiusPerDepth;
      node.setLayoutParams(innerRadius, outerRadius, startAngle, angleExtent);

      // Layout the children
      var children = node.getChildNodes();
      if (children != null && node.isDisclosed()) {
        var childStartAngle = startAngle;

        // Sorting
        if (sorting === 'on') {
          // Copy and sort by decreasing size
          children = children.slice(0);
          children.sort((a, b) => {
            return b.getSize() - a.getSize();
          });
        }

        // BIDI Support: For horizontal layout, reverse the order of the nodes
        if (dvt.Agent.isRightToLeft(node.getView().getCtx())) children = children.slice(0).reverse();

        // Find the total of the children
        var i;
        var total = 0;
        for (i = 0; i < children.length; i++)
          total += children[i].getSize() > 0 ? children[i].getSize() : 0; // ignore negatives, which skew child size calc

        // Find the size of each child
        for (i = 0; i < children.length; i++) {
          var child = children[i];

          // Ignore negative and zero sized nodes
          if (child.getSize() > 0) {
            // Calculate the bounds of the child
            var sizeRatio = child.getSize() / total;
            var childAngleExtent = sizeRatio * angleExtent;

            // Recursively layout the child
            DvtSunburstLayout._layout(
              radiusPerDepth,
              child,
              childStartAngle,
              childAngleExtent,
              sorting,
              outerRadius
            );

            // Update the start angle
            childStartAngle += childAngleExtent;
          }
        }
      }
    },

    /**
     * Returns the radius of the tree rooted at the specified node.
     * @param {DvtSunburstNode} node The subtree to find the radius for.
     * @return {number} The maximum radius of the tree.
     * @private
     */
    _calcLargestRadius: (node) => {
      var maxRadius = 0;

      // Search children
      var children = node.getChildNodes();
      if (children && children.length > 0) {
        for (var i = 0; i < children.length; i++) {
          var childRadius = DvtSunburstLayout._calcLargestRadius(children[i]);
          maxRadius = Math.max(maxRadius, childRadius);
        }
        return maxRadius + node.__getRadius();
      } else {
        // Use 1 for default if not specified
        return node.__getRadius();
      }
    }
  };

  /**
   * @constructor
   * Sunburst component.
   * @param {dvt.Context} context The rendering context.
   * @param {object} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The object context for the callback function
   * @class Sunburst component.
   * @extends {DvtTreeView}
   */
  class Sunburst extends DvtTreeView {
    constructor(context, callback, callbackObj) {
      super(context, callback, callbackObj);

      // Create the defaults object
      this.Defaults = new DvtSunburstDefaults(context);

      // Initialize the angle extent, which may be changed during animation
      this._angleExtent = 2 * Math.PI;
      this.setId('sunburst'); // this is needed for animation purposes

      /** @const @private **/
      this._ROTATION_SHAPE_RADIUS = 15; // size of additional radius for mouse rotation detection
      /** @const @private **/
      this._ROTATION_SHAPE_RADIUS_TOUCH = 60; // size of additional radius for mouse rotation detection

      // Layout Constants
      /** @const @private **/
      this._BUFFER_SPACE = 3;
      /** @const @private **/
      this._MIN_BUFFER_SPACE = 2; // Minimum buffer for very small sunbursts
    }

    /***
     * @override
     */
    ApplyParsedProps(props) {
      super.ApplyParsedProps(props);

      var options = this.getOptions();

      if (dvt.Agent.browser === 'ie' || dvt.Agent.browser === 'edge') {
        // -- ie doesn't support cursor image positioning
        this._rotateCursor = 'url(' + options['_resources']['rotateCursor'] + '), auto';
      } else this._rotateCursor = 'url(' + options['_resources']['rotateCursor'] + ') 8 8, auto';

      // Calculate the start angle.  Use a value from -PI to PI
      this._startAngle = ((360 - options['startAngle']) * DvtSunburstNode.TWO_PI) / 360;
      if (this._startAngle > Math.PI) this._startAngle -= DvtSunburstNode.TWO_PI;

      // animationOnDisplay: auto defaults to fan
      if (options['animationOnDisplay'] === 'auto') options['animationOnDisplay'] = 'fan';
    }

    /**
     * @override
     */
    Layout(availSpace) {
      // Update available space
      var bufferSpace = Math.max(
        Math.ceil((this._BUFFER_SPACE * Math.min(availSpace.w, availSpace.h)) / 400),
        this._MIN_BUFFER_SPACE
      );
      availSpace.x += bufferSpace;
      availSpace.y += bufferSpace;
      availSpace.w -= 2 * bufferSpace;
      availSpace.h -= 2 * bufferSpace;

      // Layout legend and breadcrumbs
      this.LayoutBreadcrumbs(availSpace);
      this.LayoutLegend(availSpace);

      // Calculate the radius and total depth first
      this._totalRadius = Math.floor(Math.min(availSpace.w, availSpace.h) / 2);

      // Layout the nodes
      if (this._root)
        DvtSunburstLayout.layout(
          this._totalRadius,
          this._root,
          this._startAngle,
          this._angleExtent,
          this.getOptions()['sorting']
        );
    }

    /**
     * @override
     */
    Render(container, bounds) {
      // Background
      this.RenderBackground(container);

      // Breadcrumbs
      this.RenderBreadcrumbs(container);

      // Legend
      this.RenderLegend(container);

      // Calculate the center of the sunburst
      this._translatePt = new dvt.Point(bounds.x + bounds.w / 2, bounds.y + bounds.h / 2);

      // Rotation Support
      if (this.__isRotationEnabled() && this.HasValidData()) {
        var buffer = dvt.Agent.isTouchDevice()
          ? this._ROTATION_SHAPE_RADIUS_TOUCH
          : this._ROTATION_SHAPE_RADIUS;
        var rotationShape = new dvt.Circle(
          this.getCtx(),
          bounds.x + bounds.w / 2,
          bounds.y + bounds.h / 2,
          this._totalRadius + buffer
        );
        rotationShape.setInvisibleFill();
        rotationShape.setCursor(this._rotateCursor);
        container.addChild(rotationShape);

        // Associate for event handling
        this.getEventManager().associate(
          rotationShape,
          new DvtTreePeer(null, DvtSunburstEventManager.ROTATION_ID)
        );
      }

      // Create a node container, which will contain all nodes.
      var nodeContainer = new dvt.Container(this.getCtx());
      // Translate to center, since all nodes are drawn at (0,0)
      nodeContainer.setTranslate(this._translatePt.x, this._translatePt.y);
      container.addChild(nodeContainer);

      if (this.HasValidData()) {
        // Render the nodes. This creates the shape objects, but does not render them yet.
        var nodeLayer = new dvt.Container(this.getCtx());
        nodeContainer.addChild(nodeLayer);
        this._root.render(nodeLayer);
        this.UpdateAriaNavigation(this._root);

        // Create a group for selected nodes
        this._selectedLayer = new dvt.Container(this.getCtx());
        nodeContainer.addChild(this._selectedLayer);

        // Prepare the hover effect
        this._hoverLayer = new dvt.Container(this.getCtx());
        nodeContainer.addChild(this._hoverLayer);
      } else {
        // Display the empty text message
        this.RenderEmptyText(container);
      }
    }

    /**
     * @override
     */
    CreateEventManager(view, context, callback, callbackObj) {
      return new DvtSunburstEventManager(view, context, callback, callbackObj);
    }

    /**
     * @override
     */
    GetDisplayAnim(container, bounds) {
      if (this.getOptions()['animationOnDisplay'] === 'fan' && this.HasValidData()) {
        // Set up the initial state
        this._animateAngleExtent(0);

        // Create and return the animation
        var anim = new dvt.CustomAnimation(this.getCtx(), this, this.AnimationDuration);
        anim
          .getAnimator()
          .addProp(
            dvt.Animator.TYPE_NUMBER,
            this,
            this.__getAngleExtent,
            this._animateAngleExtent,
            2 * Math.PI
          );
        return anim;
      } else return super.GetDisplayAnim(container, bounds);
    }

    /**
     * @override
     */
    GetDeleteContainer() {
      var ret = super.GetDeleteContainer();
      if (ret) {
        ret.setTranslate(this._translatePt.x, this._translatePt.y);
      }
      return ret;
    }

    /**
     * Hook for cleaning up animation behavior at the end of the animation.
     * @override
     */
    OnAnimationEnd() {
      // If the animation is complete (and not stopped), then rerender to restore any flourishes hidden during animation.
      if (!this.AnimationStopped) {
        this._container.removeChildren();

        // Finally, re-layout and render the component
        var availSpace = new dvt.Rectangle(0, 0, this.Width, this.Height);
        this.Layout(availSpace);
        this.Render(this._container, availSpace);

        // Reselect the nodes using the selection handler's state
        var selectedNodes = this._selectionHandler ? this._selectionHandler.getSelection() : [];
        for (var i = 0; i < selectedNodes.length; i++) selectedNodes[i].setSelected(true);
      }

      // : Force full angle extent in case the display animation didn't complete
      if (this._angleExtent < 2 * Math.PI) this._animateAngleExtent(2 * Math.PI);

      // Delegate to the superclass to clear common things
      super.OnAnimationEnd();
    }

    /**
     * Moves the specified object to the selected layer, above the non-selected objects.
     * @param {dvt.Displayable} displayable The object to be moved.
     */
    __moveToHoverLayer(displayable) {
      // Move the object to the hover layer
      this._hoverLayer.addChild(displayable);
    }

    /**
     * Moves the specified object to the selected layer, above the non-selected objects.
     * @param {dvt.Displayable} displayable The object to be moved.
     */
    __moveToSelectedLayer(displayable) {
      // Move the object to the selected layer
      this._selectedLayer.addChild(displayable);

      // Also reapply the shadow.  Use a clone since the object is static and may be used elsewhere in the page.
      //  and : Disable shadows in safari and ff due to rendering issues.
      if (dvt.Agent.browser !== 'safari' && dvt.Agent.browser !== 'firefox') {
        this._selectedLayer.removeAllDrawEffects();
        this._selectedLayer.addDrawEffect(DvtTreeNode.__NODE_SELECTED_SHADOW);
      }
    }

    /**
     * Returns the angle extent of the entire sunburst, for use in animating the sunburst.
     * @return {number} angleExtent The angle extent of the entire sunburst.
     */
    __getAngleExtent() {
      return this._angleExtent;
    }

    /**
     * Animates the angle extent of the sunburst to the specified value.
     * @param {number} extent The new angle extent.
     * @private
     */
    _animateAngleExtent(extent) {
      // Steps: Update the field, relayout the sunburst, update the shapes.
      this._angleExtent = extent;

      var bounds = new dvt.Rectangle(0, 0, this.Width, this.Height);
      this.Layout(bounds);
      if (this._root) this._root.updateShapes(true);
    }

    /**
     * Initiates the rotation from the specified coordinates.  This call establishes a rotation
     * anchor which determines the amount of rotation performed.
     * @param {number} mouseX The x coordinate of the rotation anchor.
     * @param {number} mouseY The y coordinate of the rotation anchor.
     */
    __startRotation(mouseX, mouseY) {
      this.__setRotationAnchor(this._calcAngle(mouseX, mouseY));
    }

    /**
     * Sets the rotation anchor for the Sunburst.
     * @param {number} angle The rotation anchor, in radians
     */
    __setRotationAnchor(angle) {
      // Store the angle at which the rotation started
      this._currentAngle = angle;

      // Apply a mask to show cursor and prevent interaction on nodes
      this._rotationMask = new dvt.Rect(this.getCtx(), 0, 0, this.Width, this.Height);
      this._rotationMask.setInvisibleFill();
      this._rotationMask.setCursor(this._rotateCursor);
      this.addChild(this._rotationMask);

      // Associate for event handling
      this.getEventManager().associate(
        this._rotationMask,
        new DvtTreePeer(null, DvtSunburstEventManager.ROTATION_ID)
      );
    }

    /**
     * Continues the rotation at the specified coordinates.
     * @param {number} mouseX The new x coordinate of the rotation anchor.
     * @param {number} mouseY The new y coordinate of the rotation anchor.
     */
    __continueRotation(mouseX, mouseY) {
      this.__rotate(this._calcAngle(mouseX, mouseY));
    }

    /**
     * Continues the rotation at the specified angle
     * @param {number} newAngle The new value of the rotation anchor, in radians
     */
    __rotate(newAngle) {
      // Calculate and update the angle of the component
      var change = newAngle - this._currentAngle;
      this._currentAngle = newAngle;
      this._updateStartAngle(change);

      // Fire the intermediate rotation event
      var degrees = 360 - Math.round((this._startAngle * 180) / Math.PI);
      this.dispatchEvent(dvt.EventFactory.newSunburstRotationEvent(degrees, false));
    }

    /**
     * Completes the rotation.
     */
    __endRotation() {
      // Clear flags
      this._currentAngle = null;

      // Remove the rotation mask
      this.removeChild(this._rotationMask);
      this._rotationMask = null;

      // Fire events to update ADF state, convert to degrees API (reversed from SVG)
      var degrees = 360 - Math.round((this._startAngle * 180) / Math.PI);
      this.dispatchEvent(dvt.EventFactory.newSunburstRotationEvent(degrees, false));
      this.dispatchEvent(dvt.EventFactory.newSunburstRotationEvent(degrees, true));
    }

    /**
     * @override
     */
    SetOptions(options) {
      super.SetOptions(options);
      if (this.Options['expanded'] instanceof Array) {
        // not a KeySet or 'all'
        this.Options['_expandedNodes'] = dvt.ArrayUtils.createBooleanMap(this.Options['expanded']);
      }
    }

    /**
     * Applies the updated disclosure and expanded array and re-renders.
     * @param {string} id The id of the node to expand or collapse.
     */
    expandCollapseNode(id) {
      var root = this.getRootNode();
      var node = DvtTreeNode.getNodeById(root, id);
      var bDisclosed = !node.isDisclosed();
      var expanded = this.getOptions()['expanded'];

      // If expanded is 'all' replace with array of nodes
      if (expanded === 'all') {
        var allNodes = DvtTreeUtils.getAllNodes(this._root);
        for (var i = 0; i < allNodes.length; i++) {
          allNodes[i] = allNodes[i].getId();
        }
        expanded = allNodes;
      }

      if (expanded instanceof Array) {
        if (bDisclosed) expanded.push(id);
        else {
          var index = expanded.indexOf(id);
          if (index > -1) expanded.splice(index, 1);
        }
      } else if (expanded['has'])
        // key set
        expanded = bDisclosed ? expanded['add']([id]) : expanded['delete']([id]);

      var rootAndAncestors = DvtTreeUtils.findRootAndAncestors(
        this.getCtx(),
        this.getOptions()['_nodes'],
        id,
        []
      )['root'];
      this.dispatchEvent(
        new dvt.EventFactory.newExpandCollapseEvent(
          bDisclosed ? 'expand' : 'collapse',
          id,
          rootAndAncestors,
          this.getOptions()['_widgetConstructor'],
          expanded
        )
      );
      this.__setNavigableIdToFocus(id);
    }

    /**
     * Calculates the angle for the specified coordinates.
     * @param {number} x
     * @param {number} y
     * @return {number} The angle in radians.
     * @private
     */
    _calcAngle(x, y) {
      return Math.atan2(y - this._translatePt.y, x - this._translatePt.x);
    }

    /**
     * Updates the start angle by the specified amount.
     * @param {number} change The change in start angle, in radians.
     * @private
     */
    _updateStartAngle(change) {
      // Update start angle and constrain to -PI to PI
      this._startAngle += change;
      if (this._startAngle < -Math.PI) this._startAngle += 2 * Math.PI;
      else if (this._startAngle > Math.PI) this._startAngle -= 2 * Math.PI;

      // Relayout and update shapes
      var bounds = new dvt.Rectangle(0, 0, this.Width, this.Height);
      this.Layout(bounds);
      if (this._root) this._root.updateShapes(true);
    }

    /**
     * @override
     */
    __getNodeUnderPoint(x, y) {
      return this._root.getNodeUnderPoint(x - this._translatePt.x, y - this._translatePt.y);
    }

    /**
     * @override
     */
    __showDropSiteFeedback(node) {
      var feedback = super.__showDropSiteFeedback(node);
      if (feedback) {
        feedback.setTranslate(this._translatePt.x, this._translatePt.y);
      }

      return feedback;
    }

    /**
     * Returns true if Sunburst rotation is enabled
     * @return {Boolean} true if rotation is enabled, false otherwise
     */
    __isRotationEnabled() {
      return this.getOptions()['rotation'] !== 'off';
    }

    /**
     * @override
     */
    CreateNode(nodeOptions) {
      return new DvtSunburstNode(this, nodeOptions);
    }

    /**
     * Returns the center point of the sunburst
     * @return {object}
     */
    getCenterPoint() {
      return this._translatePt;
    }
  }

  /**
   * Default values and utility functions for component versioning.
   * @class
   * @constructor
   * @param {dvt.Context} context The rendering context.
   * @extends {DvtTreeDefaults}
   */
  class DvtTreemapDefaults extends DvtTreeDefaults {
    constructor(context) {
      /**
       * Defaults for version 1. This component was exposed after the Alta skin, so no earlier defaults are provided.
       */
      const SKIN_ALTA = {
        // Note, only attributes that are different than the XML defaults need
        // to be listed here, at least until the XML API is replaced.
        groupGaps: 'outer',

        nodeDefaults: {
          header: {
            backgroundColor: '#FFFFFF',
            borderColor: '#d6dfe6',
            hoverBackgroundColor: '#ebeced',
            hoverOuterColor: '#ebeced',
            hoverInnerColor: '#d6d7d8',
            isolate: 'auto',
            labelHalign: 'start',
            _labelStyle: new dvt.CSSStyle(
              dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12 + 'color:#252525;'
            ),
            selectedBackgroundColor: '#dae9f5',
            selectedInnerColor: '#FFFFFF',
            selectedOuterColor: '#000000',
            useNodeColor: 'off',

            _hoverLabelStyle: new dvt.CSSStyle('color:#252525;'),
            _selectedLabelStyle: new dvt.CSSStyle('color:#252525;'),

            _drillableLabelStyle: new dvt.CSSStyle('color:#145c9e;'),
            _drillableHoverLabelStyle: new dvt.CSSStyle('color:#145c9e;'),
            _drillableSelectedLabelStyle: new dvt.CSSStyle('color:#145c9e;')
          },
          hoverColor: '#ebeced',
          groupLabelDisplay: 'header',
          labelDisplay: 'node',
          labelHalign: 'center',
          labelValign: 'center',
          selectedInnerColor: '#FFFFFF',
          selectedOuterColor: '#000000'
        },
        nodeSeparators: 'gaps',
        nodeContent: {}
      };
      super({ alta: SKIN_ALTA }, context);
    }
  }

  /**
   * Event Manager for Treemap.
   * @param {Treemap} view The treemap to associate with this event manager
   * @param {dvt.Context} context The platform specific context object.
   * @param {function} callback A function that responds to component events.
   * @param {object} callbackObj The optional object instance that the callback function is defined on.
   * @extends {DvtTreeEventManager}
   * @class
   * @constructor
   */
  class DvtTreemapEventManager extends DvtTreeEventManager {
    /**
     * @override
     */
    ProcessKeyboardEvent(event) {
      var eventConsumed = true;
      var keyCode = event.keyCode;

      if (keyCode === dvt.KeyboardEvent.ENTER && event.ctrlKey) {
        // isolate or restore
        var node = this.getFocus();
        if (node.isIsolateEnabled()) {
          if (node.__isIsolated()) node.__restoreNode();
          else node.__isolateNode();
        }
        dvt.EventManager.consumeEvent(event);
      } else {
        eventConsumed = super.ProcessKeyboardEvent(event);
      }

      return eventConsumed;
    }
  }

  /*---------------------------------------------------------------------------------*/
  /*  DvtTreemapKeyboardHandler     Keyboard handler for Treemap                     */
  /*---------------------------------------------------------------------------------*/
  /**
   *  @param {dvt.EventManager} manager The owning dvt.EventManager
   *  @class DvtTreemapKeyboardHandler
   *  @extends {DvtTreeKeyboardHandler}
   *  @constructor
   */
  class DvtTreemapKeyboardHandler extends DvtTreeKeyboardHandler {
    /**
     * @override
     */
    isNavigationEvent(event) {
      var isNavigable = super.isNavigationEvent(event);

      if (!isNavigable) {
        var keyCode = event.keyCode;
        if (keyCode === dvt.KeyboardEvent.OPEN_BRACKET || keyCode === dvt.KeyboardEvent.CLOSE_BRACKET)
          isNavigable = true;
      }

      return isNavigable;
    }
  }

  /**
   * Base layout class for treemaps.
   * @class
   * @constructor
   */
  class DvtTreemapLayoutBase {
    constructor() {
      this._zIndex = 0; // counter to help keep track of the zIndex of the nodes

      /** @private @const **/
      this._GROUP_GAP = 2;
    }

    /**
     * Performs layout for the tree.  The specific algorithm varies by subclass.
     * @param {Treemap} view The treemap component.
     * @param {DvtTreeNode} root The root of the tree.
     * @param {number} x The x coordinate for this node.
     * @param {number} y The y coordinate for this node.
     * @param {number} width The width of this node.
     * @param {number} height The height of this node.
     * @param {boolean} bShowRoot True if the root node should be displayed.
     */
    layout(view, root, x, y, width, height, bShowRoot) {
      // subclasses should override
    }

    /**
     * Applies the specified bounds to the node and returns the space available to the node's children.
     * @param {DvtTreeNode} node
     * @param {number} x The x coordinate for this node.
     * @param {number} y The y coordinate for this node.
     * @param {number} width The width of this node.
     * @param {number} height The height of this node.
     * @param {boolean} isRoot true if this node is the root of the tree.
     * @return {dvt.Rectangle} The rectangle indicating the area to allocate to the children of this node.
     */
    setNodeBounds(node, x, y, width, height, isRoot) {
      // Set the relative zIndex of the node and increment
      node.setZIndex(this._zIndex);
      this._zIndex++;

      // The root node is not rendered, unless it's a singleton
      if (!isRoot || !node.hasChildren()) {
        // Support for gaps between nodes
        var gap = this.getGapSize(node.getView(), node.GetDepth());

        // Round the values to pixel locations and add gaps
        var xx = Math.round(x + gap);
        var yy = Math.round(y + gap);
        var ww = Math.round(x + width - gap) - xx;
        var hh = Math.round(y + height - gap) - yy;

        // Set the rectangle on the node and get the bounds available to its children
        var availBounds = node.setLayoutParams(xx, yy, ww, hh);
        if (availBounds) return availBounds;
      }

      // If no explicit bounds returned, use the entire space
      return new dvt.Rectangle(x, y, width, height);
    }

    /**
     * Returns the gap size for a node at the specified depth.
     * @param {Treemap} view
     * @param {number} depth The depth of the node for which the gap should be replied.
     * @return {number} The size of the gaps around this node.
     */
    getGapSize(view, depth) {
      var groupGaps = view.getOptions()['groupGaps'];
      if (groupGaps === 'outer')
        return depth === 1 && view.__getMaxDepth() >= 2 ? this._GROUP_GAP : 0;
      else if (groupGaps === 'all') return depth < view.__getMaxDepth() ? this._GROUP_GAP : 0;
      // none
      else return 0;
    }
  }

  /**
   * Layout class for treemaps.  This layout allocates space across a single dimension for each layer,
   * alternating between horizontal and vertical allocation.  This layout maintains the ordering of
   * the nodes while sacrificing aspect ratio.
   * @param {boolean} isHoriz true if the first layer is laid out horizontally.
   * @class
   * @constructor
   * @extends {DvtTreemapLayoutBase}
   */
  class DvtTreemapLayoutSliceAndDice extends DvtTreemapLayoutBase {
    constructor(isHoriz) {
      super();
      this._isHoriz = isHoriz;
    }

    /**
     * @override
     */
    layout(view, root, x, y, width, height, bShowRoot) {
      var isRoot = bShowRoot ? false : true;
      this._layout(this._isHoriz, view, root, x, y, width, height, isRoot);
    }

    /**
     * Performs layout for the specified node in the tree.
     * @param {boolean} isHoriz true if this layer is laid out horizontally.
     * @param {Treemap} view The treemap component.
     * @param {DvtTreemapNode} node The root of the tree.
     * @param {number} x The x coordinate for this node.
     * @param {number} y The y coordinate for this node.
     * @param {number} width The width of this node.
     * @param {number} height The height of this node.
     * @param {boolean} isRoot true if this node is the root of the tree.
     * @private
     */
    _layout(isHoriz, view, node, x, y, width, height, isRoot) {
      var options = view.getOptions();

      // Set the bounds on the current node and get the space available for its children
      var availBounds = this.setNodeBounds(node, x, y, width, height, isRoot);

      // Layout the children
      var children = node.getChildNodes();
      if (children != null) {
        var childX = availBounds.x;
        var childY = availBounds.y;
        // Width and height will be overwritten based on isHoriz
        var childWidth = availBounds.w;
        var childHeight = availBounds.h;

        // Find the total size of the children.  This may not match node.getSize() for
        // hierarchies that vary based on depth.
        var total = 0;
        var i;
        for (i = 0; i < children.length; i++)
          total += children[i].getSize() > 0 ? children[i].getSize() : 0; // ignore negatives, which skew child size calc

        // Sorting
        if (options['sorting'] === 'on') {
          // Copy and sort by decreasing size
          children = children.slice(0);
          children.sort((a, b) => {
            return b.getSize() - a.getSize();
          });
        }

        // BIDI Support: For horizontal layout, reverse the order of the nodes
        if (isHoriz && dvt.Agent.isRightToLeft(view.getCtx())) children = children.slice(0).reverse();

        for (i = 0; i < children.length; i++) {
          var child = children[i];

          // Ignore negative and zero sized nodes
          if (child.getSize() > 0) {
            // Calculate the bounds of the child
            var sizeRatio = child.getSize() / total;
            if (isHoriz) childWidth = availBounds.w * sizeRatio;
            else childHeight = availBounds.h * sizeRatio;

            // Recursively layout the child
            this._layout(!isHoriz, view, child, childX, childY, childWidth, childHeight, false);

            // Update the x and y
            if (isHoriz) childX += childWidth;
            else childY += childHeight;
          }
        }
      }
    }
  }

  /**
   * Layout class for treemaps.  This layout optimizes the aspect ratios, making the nodes as square as
   * possible for improved comparisons between nodes.  This layout does not maintain the ordering of
   * the nodes.
   * @class
   * @constructor
   * @extends {DvtTreemapLayoutBase}
   */
  class DvtTreemapLayoutSquarifying extends DvtTreemapLayoutBase {
    /**
     * @override
     */
    layout(view, root, x, y, width, height, bShowRoot) {
      var isRoot = bShowRoot ? false : true;
      this._layout(root, x, y, width, height, isRoot);
    }

    /**
     * Performs layout for the specified node in the tree.
     * @param {DvtTreemapNode} node the root of the tree
     * @param {number} x The x coordinate for this node.
     * @param {number} y The y coordinate for this node.
     * @param {number} width The width of this node.
     * @param {number} height The height of this node.
     * @param {boolean} isRoot true if this node is the root of the tree.
     */
    _layout(node, x, y, width, height, isRoot) {
      // Set the bounds on the current node and get the space available for its children
      var availBounds = this.setNodeBounds(node, x, y, width, height, isRoot);

      // Layout the children
      var children = node.getChildNodes();
      if (children != null && children.length > 0) {
        // Calculate the pixel size for each node and store in a temp field
        this._calcPixelSize(children, availBounds.w * availBounds.h);

        // Make a copy of the children array and sort ascending by size.
        // The ascending sort is used because squarify will move from back to front
        children = children.slice(0).sort((a, b) => {
          return a.getSize() - b.getSize();
        });

        var w = Math.min(availBounds.w, availBounds.h);
        var r = new dvt.Rectangle(availBounds.x, availBounds.y, availBounds.w, availBounds.h);
        this._squarify(children, [], w, r, Infinity);
      }
    }

    /**
     * Calculates and sets the pixel size for each child node.
     * @param {array} children The array of treemap node children.
     * @param {number} area The pixel area available for these children.
     * @private
     */
    _calcPixelSize(children, area) {
      // First calculate the total.
      var total = 0;
      for (var i = 0; i < children.length; i++)
        total += children[i].getSize() > 0 ? children[i].getSize() : 0; // ignore negatives, which skew child size calc

      // Then set the size
      var factor = area === 0 ? 0 : area / total;
      for (var j = 0; j < children.length; j++) {
        var child = children[j];
        child.__pxSize = child.getSize() * factor;
      }
    }

    /**
     * Recursively arranges the rectangles to perform layout with lowest aspect ratio.
     * @param {array} children The array of treemap nodes that still need layout, in ascending order by size.
     * @param {array} row The array of treemap nodes arranged in the current row.
     * @param {number} w The length along which the rectangles will be laid out.
     * @param {dvt.Rectangle} r The rectangle available for layout.
     * @param {number} worst The worst aspect ratio in the current row.
     * @private
     */
    _squarify(children, row, w, r, worst) {
      // Note: This algorithm was modified from recursive to iterative to avoid the maximum
      //       recursive stack size in javascript.  This new implementation is much better
      //       at dealing with 0 size nodes and with large breadth size.

      // If there are no more children, assign the row and return
      if (children == null || children.length === 0) {
        this._layoutRow(row, w, r);
        return;
      }

      while (children.length > 0) {
        var c = children.pop();

        // If c has no visible size, we are done, since children are sorted in ascending size.
        if (c.__pxSize < 0) {
          // Assign the layout and finish
          this._layoutRow(row, w, r);
          return;
        }

        // Otherwise assign it to the row
        row.push(c);

        var newWorst = this._getWorst(row, w);
        if (newWorst > worst) {
          // Adding child does not improve layout. Reset arrays, assign the layout and recurse.
          children.push(c); // add c back to the children
          row.pop(); // remove c from the row
          r = this._layoutRow(row, w, r);
          this._squarify(children, [], Math.min(r.w, r.h), r, Infinity);
          return;
        } else if (children.length === 0) {
          // No more children to allocate.  Assign layout and finish
          this._layoutRow(row, w, r);
          return;
        } // update the worst field
        else worst = newWorst;
      }
    }

    /**
     * Returns the highest aspect ratio of a list of rectangles.
     * @param {array} areas The array of treemap nodes
     * @param {number} w The length along which the rectangles will be laid out
     * @return {number} The greatest aspect ratio of the list of rectangles.
     * @private
     */
    _getWorst(areas, w) {
      var total = 0;
      var min = Infinity;
      var max = -Infinity;

      for (var i = 0; i < areas.length; i++) {
        total += areas[i].__pxSize;
        min = Math.min(min, areas[i].__pxSize);
        max = Math.max(max, areas[i].__pxSize);
      }

      var s2 = total * total;
      var w2 = w * w;
      return Math.max((w2 * max) / s2, s2 / (w2 * min));
    }

    /**
     * Assigns the layout for the current row.
     * @param {array} row The array of treemap nodes arranged in the current row.
     * @param {number} w The length along which the rectangles will be laid out.
     * @param {dvt.Rectangle} r The rectangle available for layout.
     * @return {dvt.Rectangle} A rectangle containing the unallocated space.
     * @private
     */
    _layoutRow(row, w, r) {
      // Calculate the sum of the row areas
      var total = 0;
      var i;
      for (i = 0; i < row.length; i++) total += row[i].__pxSize;

      // Assign positions to the row nodes
      var x = r.x;
      var y = r.y;
      var width, height;
      if (w === r.w) {
        // Horizontal Layout
        height = w === 0 ? 0 : total / w;
        for (i = 0; i < row.length; i++) {
          width = row[i].__pxSize / height; // equivalent to w*size/total
          this._layout(row[i], x, y, width, height, false); // Set and recurse
          x += width;
        }

        // Return the remaining space
        return new dvt.Rectangle(r.x, r.y + height, r.w, r.h - height);
      } else {
        // Vertical Layout
        width = w === 0 ? 0 : total / w;
        for (i = 0; i < row.length; i++) {
          height = row[i].__pxSize / width; // equivalent to w*size/total
          this._layout(row[i], x, y, width, height, false); // Set and recurse
          y += height;
        }

        // Return the remaining space
        return new dvt.Rectangle(r.x + width, r.y, r.w - width, r.h);
      }
    }
  }

  /**
   * @constructor
   * Treemap component.
   * @param {dvt.Context} context The rendering context.
   * @param {string} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The object context for the callback function
   * @class Treemap component.
   * @extends {DvtTreeView}
   */
  class Treemap extends DvtTreeView {
    constructor(context, callback, callbackObj) {
      super(context, callback, callbackObj);
      // Create the defaults object
      this.Defaults = new DvtTreemapDefaults(context);

      this._nodeContent = {};

      // Make sure the object has an id for accessibility 
      this.setId('treemap' + 1000 + Math.floor(Math.random() * 1000000000)); //@RandomNumberOK

      /** @const @private **/
      this._MIN_BUFFER_SPACE = 1; // Minimum buffer for very small treemaps
    }

    /**
     * @override
     */
    ApplyParsedProps(props) {
      super.ApplyParsedProps(props);
      var options = this.getOptions();
      // Layout
      if (options['layout'] === 'sliceAndDiceHorizontal')
        this._layout = new DvtTreemapLayoutSliceAndDice(true);
      else if (options['layout'] === 'sliceAndDiceVertical')
        this._layout = new DvtTreemapLayoutSliceAndDice(false);
      else this._layout = new DvtTreemapLayoutSquarifying();

      // Isolate Support
      this._isolatedNodes = [];
      this._processInitialIsolate(options['isolatedNode']);

      // animationOnDisplay: auto defaults to fan
      if (options['animationOnDisplay'] === 'auto') options['animationOnDisplay'] = 'alphaFade';
    }

    /**
     * @override
     */
    Layout(availSpace) {
      // Allocate buffer space for the container. The minimum buffer is used for JET, where no default border is shown.
      var bufferSpace = this._MIN_BUFFER_SPACE;
      bufferSpace = Math.max(
        Math.ceil((bufferSpace * Math.min(availSpace.w, availSpace.h)) / 400),
        this._MIN_BUFFER_SPACE
      );
      availSpace.x += bufferSpace;
      availSpace.y += bufferSpace;
      availSpace.w -= 2 * bufferSpace;
      availSpace.h -= 2 * bufferSpace;

      // Legend and Breadcrumbs
      // Add the additional buffer space for nodes to make the legend line up.
      var gap = this._layout.getGapSize(this, 1);
      availSpace.x += gap;
      availSpace.w -= 2 * gap;
      this.LayoutBreadcrumbs(availSpace);
      this.LayoutLegend(availSpace);
      // Restore the gap for use by the nodes
      availSpace.x -= gap;
      availSpace.w += 2 * gap;

      // Layout Algorithm: For a layout in response to isolate or restore, only re-layout the newly visible isolated node.
      // Otherwise, layout the root, and then each isolated child in order.
      var numIsolated = this._isolatedNodes.length;
      if (numIsolated > 0 && this._isolateRestoreLayout) {
        // Isolate or Restore Action: Don't layout unchanged, since it would affect animation
        var lastIsolated = this._isolatedNodes[numIsolated - 1];
        this._layout.layout(
          this,
          lastIsolated,
          availSpace.x,
          availSpace.y,
          availSpace.w,
          availSpace.h,
          true
        );
      } else {
        // Standard Layout: Layer the isolated nodes so that they can be peeled back like a stack.
        if (this._root)
          this._layout.layout(
            this,
            this._root,
            availSpace.x,
            availSpace.y,
            availSpace.w,
            availSpace.h,
            false
          );

        for (var i = 0; i < numIsolated; i++) {
          var layoutRoot = this._isolatedNodes[i];
          this._layout.layout(
            this,
            layoutRoot,
            availSpace.x,
            availSpace.y,
            availSpace.w,
            availSpace.h,
            true
          );
        }
      }
    }

    /**
     * @override
     */
    Render(container) {
      // Background
      this.RenderBackground(container);

      // Breadcrumbs
      this.RenderBreadcrumbs(container);

      // Legend
      this.RenderLegend(container);

      // Node or Empty Text
      if (this.HasValidData()) {
        // Layer for group text displayed on node.  Will be reordered after the selected layer
        this._groupTextLayer = new dvt.Container(this.getCtx());
        container.addChild(this._groupTextLayer);

        // Render the nodes.  The root node is not rendered unless it's a singleton
        // This creates the shape objects, but does not render them yet.
        if (this._isolatedNode) this._isolatedNode.render(container);
        else if (!this._root.hasChildren()) this._root.render(container);
        else {
          this._root.renderChildren(container);
          this.UpdateAriaNavigation(this._root);
        }

        // Create a group for isolated nodes
        this._isolatedLayer = new dvt.Container(this.getCtx());
        container.addChild(this._isolatedLayer);

        // Create a group for selected nodes
        this._selectedLayer = new dvt.Container(this.getCtx());
        container.addChild(this._selectedLayer);

        // Reorder group text after selected layer
        container.addChild(this._groupTextLayer);

        // Prepare the hover effect
        this._hoverEffect = new dvt.Rect(this.getCtx(), 0, 0, 0, 0);
        this._hoverEffect.setVisible(false);
        this._hoverEffect.setMouseEnabled(false);
        this._hoverEffect.setPixelHinting(true);
        this._hoverEffect.setInvisibleFill();
        container.addChild(this._hoverEffect);

        // Fix the z-order of the isolated objects
        for (var i = 0; i < this._isolatedNodes.length; i++) {
          var displayable = this._isolatedNodes[i].getDisplayable();
          this._isolatedLayer.addChild(displayable);
        }
      } else {
        // Display the empty text message
        this.RenderEmptyText(container);
      }
    }

    /**
     * Hook for cleaning up animation behavior at the end of the animation.
     * @override
     */
    OnAnimationEnd() {
      // Before the animation, the treemap nodes will remove their bevels and selection
      // effects.  If the animation is complete (and not stopped), then rerender to restore.
      if (!this.AnimationStopped) {
        this._container.removeChildren();

        // Finally, re-layout and render the component
        var availSpace = new dvt.Rectangle(0, 0, this.Width, this.Height);
        this.Layout(availSpace);
        this.Render(this._container);

        // Reselect the nodes using the selection handler's state
        this.ReselectNodes();
      }

      // Delegate to the superclass to clear common things
      super.OnAnimationEnd();
    }

    /**
     * Reselects the selected nodes after a re-render.
     * @protected
     */
    ReselectNodes() {
      var selectedNodes = this._selectionHandler ? this._selectionHandler.getSelection() : [];
      for (var i = 0; i < selectedNodes.length; i++) {
        // Don't show selection effect for obscured nodes when isolate is being used
        if (this._isolatedNodes.length > 0) {
          var lastIsolated = this._isolatedNodes[this._isolatedNodes.length - 1];
          if (selectedNodes[i] === lastIsolated || selectedNodes[i].isDescendantOf(lastIsolated))
            selectedNodes[i].setSelected(true);
        } else selectedNodes[i].setSelected(true);
      }
    }

    /**
     * @override
     */
    CreateKeyboardHandler(manager) {
      return new DvtTreemapKeyboardHandler(manager);
    }

    /**
     * @override
     */
    CreateEventManager(view, context, callback, callbackObj) {
      return new DvtTreemapEventManager(view, context, callback, callbackObj);
    }

    /**
     * @override
     */
    GetInitialFocusedItem(root) {
      var isolatedRootNode = this.__getLastIsolatedNode();

      if (isolatedRootNode)
        return this.__getDefaultNavigable(DvtTreeUtils.getLeafNodes(isolatedRootNode));
      else if (root) return this.__getDefaultNavigable(DvtTreeUtils.getLeafNodes(root));
      else return null;
    }

    /**
     * Updates the hover effect to display the specified stroke along the specified points.
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {dvt.Stroke} stroke The stroke definition.
     */
    __showHoverEffect(x, y, w, h, stroke) {
      this._hoverEffect.setX(x).setY(y).setWidth(w).setHeight(h);
      this._hoverEffect.setStroke(stroke);
      this._hoverEffect.setVisible(true);
    }

    /**
     * Hides the hover effect.
     */
    __hideHoverEffect() {
      this._hoverEffect.setVisible(false);
    }

    /**
     * Returns the layer for rendering group text displayed on nodes.  This layer is above the selected
     * layer, so that selected nodes will node obscure it.
     * @return {dvt.Container}
     */
    __getGroupTextLayer() {
      return this._groupTextLayer;
    }

    /**
     * Moves the specified object to the selected layer, above the non-selected objects.
     * @param {dvt.Rect} rect The object to be moved.
     */
    __moveToSelectedLayer(rect) {
      // Loop through the selected layer to find the right position
      var newIndex = 0;
      var numChildren = this._selectedLayer.getNumChildren();
      for (var i = 0; i < numChildren; i++) {
        var child = this._selectedLayer.getChildAt(i);
        if (rect.zIndex > child.zIndex) newIndex = i + 1;
      }

      // Add the object
      if (newIndex < numChildren) this._selectedLayer.addChildAt(rect, newIndex);
      else this._selectedLayer.addChild(rect);
    }

    /**
     * @override
     */
    __getNodeUnderPoint(x, y) {
      // For isolated nodes, search from the last isolated node
      if (this._isolatedNodes.length > 0) {
        var lastIsolated = this._isolatedNodes[this._isolatedNodes.length - 1];
        return lastIsolated.getNodeUnderPoint(x, y);
      } else return this._root.getNodeUnderPoint(x, y);
    }

    /**
     * Isolates the specified node.
     * @param {DvtTreeNode} node The node to isolate.
     */
    __isolate(node) {
      var currentNavigable = this.getEventManager().getFocus();
      if (currentNavigable) currentNavigable.hideKeyboardFocusEffect();

      // Keep track of the isolated node
      this._isolatedNodes.push(node);
      this.getOptions()['isolatedNode'] = node.getId();

      // Update state
      this.dispatchEvent(dvt.EventFactory.newTreemapIsolateEvent(node.getId()));

      // Layout the isolated node and its children
      this._isolateRestoreLayout = true;
      this.Layout(new dvt.Rectangle(0, 0, this.Width, this.Height));
      this._isolateRestoreLayout = false;

      // Update z-order
      var displayable = node.getDisplayable();
      this._isolatedLayer.addChild(displayable);

      // Render the changes
      this._renderIsolateRestore(node);
    }

    /**
     * Restores the full tree from the isolated state.
     */
    __restore() {
      this._restoreNode = this._isolatedNodes.pop(); // store the node for automation purposes

      // Update the options state
      this.getOptions()['isolatedNode'] =
        this._isolatedNodes.length > 0
          ? this._isolatedNodes[this._isolatedNodes.length - 1].getId()
          : null;

      var currentNavigable = this.getEventManager().getFocus();
      if (currentNavigable) currentNavigable.hideKeyboardFocusEffect();

      // after we restore the full tree, set keyboard focus on the node that was previously isolated
      this.__setNavigableIdToFocus(this._restoreNode.getId());

      // Update state
      this.dispatchEvent(dvt.EventFactory.newTreemapIsolateEvent());

      // Layout the isolated node and its children
      this._isolateRestoreLayout = true;
      this.Layout(new dvt.Rectangle(0, 0, this.Width, this.Height));
      this._isolateRestoreLayout = false;

      // Render the changes
      this._renderIsolateRestore(this._restoreNode);
      this._restoreNode = null;
    }

    /**
     * Returns the currently isolated node, or null if no node is isolated
     *
     * @return {DvtTreemapNode}
     */
    __getLastIsolatedNode() {
      if (this._isolatedNodes && this._isolatedNodes.length > 0)
        return this._isolatedNodes[this._isolatedNodes.length - 1];
      else return null;
    }

    /**
     * The node that was isolated or restored.
     * @param {DvtTreemapNode} node
     * @private
     */
    _renderIsolateRestore(node) {
      // Animate or re-render to display the updated state
      if (this.getOptions()['animationOnDataChange'] !== 'none') {
        // Deselect all nodes so that the selected layer doesn't display above the
        // isolated node during animation.  Nodes will be reselected at the end of animation.
        var selectedNodes = this._selectionHandler ? this._selectionHandler.getSelection() : [];
        for (var i = 0; i < selectedNodes.length; i++) {
          selectedNodes[i].setSelected(false);
        }

        // Animate the isolated node
        var playables = node.getIsolateAnimation();
        this.Animation = new dvt.ParallelPlayable(this.getCtx(), playables);
        this.Animation.setOnEnd(this.OnAnimationEnd, this);

        // Disable event listeners temporarily
        this.getEventManager().removeListeners(this);

        // Start the animation
        this.Animation.play();
      } else {
        // : the true prevents the options object from being evaluated, so that the isolated node will not
        // be cleared.  This is necessary until we remove the xml layer, after which we can remove the true param.
        this.render(null, this.Width, this.Height, true);
      }
    }

    /**
     * Processes the initially isolated node, if any.
     * @param {string} isolateRowKey The initially isolated node, if any.
     * @private
     */
    _processInitialIsolate(isolateRowKey) {
      if (isolateRowKey && this._root) {
        var allNodes = this._root.getDescendantNodes();
        allNodes.push(this._root);

        // Look through all the nodes for the isolated node
        for (var i = 0; i < allNodes.length; i++) {
          if (dvt.Obj.compareValues(this.getCtx(), allNodes[i].getId(), isolateRowKey)) {
            this._isolatedNodes.push(allNodes[i]);
            return;
          }
        }
      }
    }

    /**
     * Returns the default navigable item to receive keyboard focus.
     * @param {Array} navigableItems An array of DvtNavigableItems that could receive keyboard focus
     * @return {DvtKeyboardNavigable}
     */
    __getDefaultNavigable(navigableItems) {
      var keyboardHandler = this.getEventManager().getKeyboardHandler();
      if (keyboardHandler) return keyboardHandler.getDefaultNavigable(navigableItems);
      else if (navigableItems && navigableItems.length > 0) return navigableItems[0];
      else return null;
    }

    /**
     * @override
     */
    CreateNode(nodeOptions) {
      return new DvtTreemapNode(this, nodeOptions);
    }

    /**
     * Get the array of isolated nodes.
     * @return {arrray}
     * @protected
     */
    getIsolatedNodes() {
      return this._isolatedNodes;
    }

    /**
     * Get the object containing information about the custom node content overlays.
     * @return {object}
     * @protected
     */
    getNodeContent() {
      return this._nodeContent;
    }
  }

  exports.Sunburst = Sunburst;
  exports.Treemap = Treemap;

  Object.defineProperty(exports, '__esModule', { value: true });

});
