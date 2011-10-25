#jQuery plugin - Month Picker 

This is another picker with the only difference is thought for months.
The first idea came up when I needed a date picker but only for months, without days.

##How to Use
```js
$("#someInput").MonthPicker();
```
That's it!

- Browser compatibility: IE7+, FF3.6+, Chrome6+ 

###Present selection
```js
$("#someInput").MonthPicker({ hasPresent: true });
```
This will set an "Actual" button for "today" month wich will be year 9999.

###Manage From/To dates
```js
var $fromInput = $("#fromInput").MonthPicker();
var $toInput = $("#toInput").MonthPicker({ hasPresent: true });
$fromInput.MonthPicker('SetMonthPickerTo', $toInput);
$toInput.MonthPicker('SetMonthPickerFrom', $fromInput);
```
###Set Default Date
```js
$("#someInput").MonthPicker({ currentDate: new Date() });
```
###Only Year Picker
```js
$("#someInput").MonthPicker({ onlyYear: true });
```
###Set/ Get Date
```js
$("#someInput").MonthPicker('SetDate', new Date());
var selectedDate = $("#someInput").MonthPicker('GetDate');
```
###Other methods:
```js
$("#someInput").MonthPicker('SetMaxDate', [Date value]);
$("#someInput").MonthPicker('SetMinDate', [Date value]);
$("#someInput").MonthPicker('SetMonthPickerTo', [MonthPicker value]);
$("#someInput").MonthPicker('SetMonthPickerFrom', [MonthPicker value]);
```







