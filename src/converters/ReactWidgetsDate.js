/**
 * Object with functions returning Globalize functions required by
 * ReactWidgets globalizeLocalizer() if you use DateTimePicker or Calendar.
 * Should be the same formats as in react-widgets-globalize/index.js
 *
 * All formats must be hard-coded for webpack GlobalizePlugin
 * to export precompiled functions.
 * For example: the following causes compile time ReferenceError: footerFormat is not defined
 * var footerFormat = { date: "full" };
 * const footerFn = Globalize.dateFormatter(footerFormat);
 *
 * Here an object is returned with functions returning the actual converters.
 * You can export the actual converter functions directly but then they will remain
 * the same when the user changes the locale.
 */

import Globalize from "globalize";

const DateConverters = {

    // Used by Pickers
    defaultDateFormatter: () => {
        return Globalize.dateFormatter({datetime: 'medium'});
    },
    defaultDateParser: () => {
        return Globalize.dateParser({datetime: 'medium'});
    },
    // Also used by TimeList which is used by DateTimePicker
    timeFormatter: () => {
        return Globalize.dateFormatter({time: "short"})
    },
    timeParser: () => {
        return Globalize.dateParser({time: "short"})
    },
    dateFormatter: () => {
        return Globalize.dateFormatter({date: "short"})
    },
    dateParser: () => {
        return Globalize.dateParser({date: "short"})
    },

    // Used by Calendar which is used by DateTimePicker
    headerFormatter: () => {
        return Globalize.dateFormatter({raw: "MMMM yyyy"})
    },
    footerFormatter: () => {
        return Globalize.dateFormatter({date: "full"})
    },
    weekdayFormatter: () => {
        return Globalize.dateFormatter({raw: 'eeeeee'})
    },
    dayOfMonthFormatter: () => {
        return Globalize.dateFormatter({raw: 'd'})
    },
    monthFormatter: () => {
        return Globalize.dateFormatter({raw: 'MMM'})
    },
    yearFormatter: () => {
        return Globalize.dateFormatter({raw: 'yyyy'})
    },
    firstOfWeekFormatter: () => {
        return Globalize.dateFormatter({raw: 'e'})
    }
};

export default DateConverters;