import ResponsiveUtils = require('../ojresponsiveutils');
import 'knockout';
export function createMediaQueryObservable(queryString: string): ko.Observable<boolean>;
export function createScreenRangeObservable(): ko.Observable<ResponsiveUtils.ScreenRange>;
