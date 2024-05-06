import ResponsiveUtils = require('../ojresponsiveutils');
import 'knockout';
export function createCompositeMediaQueryObservable(queryString: string, componentElement: Element): ko.Observable<boolean>;
export function createCompositeScreenRangeObservable(componentElement: Element): ko.Observable<ResponsiveUtils.ScreenRange>;
export function createMediaQueryObservable(queryString: string): ko.Observable<boolean>;
export function createScreenRangeObservable(): ko.Observable<ResponsiveUtils.ScreenRange>;
