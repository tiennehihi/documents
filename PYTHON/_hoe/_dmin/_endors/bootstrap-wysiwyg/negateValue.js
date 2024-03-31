al space?
function isSlotSegCollision(seg1, seg2) {
	return seg1.bottom > seg2.top && seg1.top < seg2.bottom;
}

;;

/* An abstract class from which other views inherit from
----------------------------------------------------------------------------------------------------------------------*/

var View = FC.View = Class.extend(EmitterMixin, ListenerMixin, {

	type: null, // subclass' view name (string)
	name: null, // deprecated. use `type` instead
	title: null, // the text that will be displayed in the header's title

	calendar: null, // owner Calendar object
	options: null, // hash containing all options. already merged with view-specific-options
	el: null, // the view's containing element. set by Calendar

	isDateSet: false,
	isDateRendered: false,
	dateRenderQueue: null,

	isEventsBound: false,
	isEventsSet: false,
	isEventsRendered: false,
	eventRenderQueue: null,

	// range the view is actually displaying (moments)
	start: null,
	end: null, // exclusive

	// range the view is formally responsible for (moments)
	// may be different