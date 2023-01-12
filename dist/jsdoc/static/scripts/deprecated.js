/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/* eslint-disable no-undef */
/* eslint-disable strict */
/* eslint-disable no-use-before-define */
// window.deprecated= false;
// window.jsonly = false;
var isDep = false;
var isJs = false;
window.onload = function () {
  htmlTableOfContents();
  var depComponent = document.getElementById('deprecated');
  var jsComponent = document.getElementById('jsonly');
  var deprecatedVal = sessionStorage.getItem('deprecatedVal');
  var jsonlyVal = sessionStorage.getItem('jsonlyVal');
  var navFocusable = document.getElementById('navIndexFocusable');
  navFocusable.focus();
  var elemRB = document.getElementById('elements_rb');
  var modRB = document.getElementById('modules_rb');
  var elemRBVal = sessionStorage.getItem('elemRBChecked') || "true";
  var navigator = document.getElementById('nav');
  var currNavId = sessionStorage.getItem('dataCurrentItem');
  if (currNavId){
    navigator.setAttribute("data-current-item", currNavId);
  }

  navigator.onclick = function(e){
    if(e.target && e.target.matches("a")){
      var liId = e.target.parentElement.id;
      sessionStorage.setItem('dataCurrentItem', liId);
    }
  }
  var navFocusable = document.getElementById('navIndexFocusable');
  navFocusable.focus();

  if (deprecatedVal === 'true') {
    depComponent.checked = true;
    isDep = true;
    toggle_visibility('deprecated-hidden');
    depComponent.parentElement.classList.toggle('deprecated-option');
  }
  if (jsonlyVal === 'true') {
    isJs = true;
    jsComponent.checked = true;
    toggle_visibility('jsdeprecated-hidden');
    jsComponent.parentElement.classList.toggle('jsdeprecated-option');
  }
  if (elemRBVal === "true"){
    if (elemRB){
      elemRB.checked = "checked";
    }
  }
  else{
    if (modRB){
      modRB.checked = "checked";
    }
  }
  if (elemRB && modRB){
    toggle_navigator(elemRBVal);
  }

  // hide all the ones with clean-only class.
  hideOrShowCommon();
  if (elemRB && modRB){
    elemRB.onclick = function(event){
      sessionStorage.setItem('elemRBChecked', true);
      toggle_navigator("true");
    }
    modRB.onclick = function(event){
      sessionStorage.setItem('elemRBChecked', false);
      toggle_navigator("false");
    }
  }

  depComponent.onclick = function () {
    sessionStorage.setItem('deprecatedVal', this.checked);
    isDep = this.checked;
    this.parentElement.classList.toggle('deprecated-option');
    if (!isDep && isJs) {
      isJs = false;
      jsComponent.checked = false;
      jsComponent.parentElement.classList.toggle('jsdeprecated-option');
      sessionStorage.setItem('jsonlyVal', false);
      toggle_visibility('jsdeprecated-hidden');
    }
    toggle_visibility('deprecated-hidden');
    hideOrShowCommon();
  };
  // no checkbox for stylingdoc pages
  if (jsComponent){
    jsComponent.onclick = function() {
      sessionStorage.setItem('jsonlyVal', this.checked);
      isJs = this.checked;
      this.parentElement.classList.toggle('jsdeprecated-option');
      if(isJs && !isDep){
        isDep = true;
        depComponent.checked = true;
        depComponent.parentElement.classList.toggle('deprecated-option');
        sessionStorage.setItem('deprecatedVal', true);
        toggle_visibility('deprecated-hidden');
      }
      toggle_visibility('jsdeprecated-hidden');
      hideOrShowCommon();
    }
  }

  var nav = document.getElementById('nav');
  var currentId = nav.getAttribute('data-current-item');
  if (!currentId) {return;}
  var link = document.getElementById(currentId);
  if (!link) {return;}
  link.className = link.className ? link.className + ' current-nav-item' : 'current-nav-item';
  nav.scrollTop = link.offsetTop + (link.offsetHeight - nav.offsetHeight) / 2;

  var main = document.getElementById('main');
  var scrollFunction = function () {
    if (main.scrollTop > 40) {
      document.getElementById('jump-to-top-btn').style.display = 'block';
    }
    else {
      document.getElementById('jump-to-top-btn').style.display = 'none';
    }
  };

  // When the user scrolls down 20px from the top of the document, show the button
  if (main) {
    window.main = main;
    main.onscroll = scrollFunction;
  }
};

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  main.scrollTop = 0;
};

function toggle_navigator(elemsVisible){
  var elements = document.getElementById("nav_elements");
  var nonElements = document.getElementById("nav_non_elements");
  var modules = document.getElementById("nav_modules");

  if (elemsVisible === "true"){
    elements? elements.style.display = 'list-item' : "";
    nonElements? nonElements.style.display = 'list-item' : "";
    modules? modules.style.display = 'none' : "";
  }
  else{
    elements? elements.style.display = 'none' : "";
    nonElements? nonElements.style.display = 'none' : "";
    modules? modules.style.display = 'list-item' : "";
  }
}

function toggle_visibility(className) {
  var elements = document.getElementsByClassName(className);
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].tagName === 'LI') {
      elements[i].style.display = elements[i].style.display == 'list-item' ? 'none' : 'list-item';
    }
    else if (elements[i].tagName === 'TR') {
      elements[i].style.display = elements[i].style.display == 'table-row' ? 'none' : 'table-row';
    }
    else if (elements[i].tagName === 'DT' || elements[i].tagName === 'DD' || elements[i].tagName === 'SECTION') {
      elements[i].style.display = elements[i].style.display == 'block' ? 'none' : 'block';
    }
    else if (elements[i].tagName === 'DIV') {
      elements[i].style.display = elements[i].style.display == 'block' ? 'none' : 'block';
    }
    else {
      elements[i].style.display = elements[i].style.display == 'inline' ? 'none' : 'inline';
    }
  }
}

function hideOrShowCommon() {

  var elements = document.getElementsByClassName('dep-type');
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = 'none';
  }
  elements = document.getElementsByClassName('jsdoc-type');
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = 'none';
  }
  elements = document.getElementsByClassName('clean-only');
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = 'inline';
  }

  if (isDep) { // for case where jsonly does not have a deprecated format, we may want to show either deprecated
    // or clean based on this flag.
    elements = document.getElementsByClassName('clean-only');
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.display = 'none';
    }
    elements = document.getElementsByClassName('dep-type');
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.display = 'inline';
    }
  }
  if (isJs) {
    elements = document.getElementsByClassName('clean-only');
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.display = 'none';
    }
    elements = document.getElementsByClassName('dep-type');
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.display = 'none';
    }
    elements = document.getElementsByClassName('jsdoc-type');
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.display = 'inline';
    }
  }
}

function htmlTableOfContents() {
  var toc = document.getElementById('toc');
  if (!toc){
    return;
  }
  var main = document.getElementById('main');
  var headings = [].slice.call(main.querySelectorAll('h2, h3, h4, h5, h6'));
  var isValidTocHeading = function(heading) {
    if (!heading) {
      return false;
    }
    // If a header contain the marker class 'notoc', it will not be included in the table of contents.
    if (heading.className){
      let classnames = heading.className.split(' ');
      if (Array.isArray(classnames)){
        const found = classnames.find(cls => cls === 'notoc');
        if (found){
          return false;
        }
      }
    }

    var parent = heading.parentElement;
    while (parent.tagName !== 'TD' && parent.id !== 'main' ) {
      parent = parent.parentElement;
    }
    return parent.tagName !== 'TD';
  };
  headings.forEach(function (heading, index) {
    if (isValidTocHeading(heading)) {
      var anchor = document.createElement('a');
      anchor.setAttribute('name', 'toc' + index);
      anchor.setAttribute('id', 'toc' + index);

      var link = document.createElement('a');
      link.setAttribute('href', '#toc' + index);
      link.textContent = heading.textContent;

      var div = document.createElement('div');
      div.setAttribute('class', heading.tagName.toLowerCase());

      div.appendChild(link);
      toc.appendChild(div);
      heading.parentNode.insertBefore(anchor, heading);
    }
  });
}
