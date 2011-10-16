
(function ($) {

    var methods = {
        init: function (options) {
            return this.each(function () {
                var $this = $(this);

                var dtX = $.datepicker.parseDate('dd/mm/yy', '01/01/1973');
                myParams = jQuery.extend({
                    minDate: dtX,
                    maxDate: new Date(),
                    currentDate: new Date(),
                    monthPickerFrom: null,
                    monthPickerTo: null,
                    hasPresent: false,
                    onlyYear: false,
                    hasPageDirty: false
                }, options);

                $this.data('mp-data-currentDate', myParams.currentDate);
                $this.data('mp-data-minDate', myParams.minDate);
                $this.data('mp-data-maxDate', myParams.maxDate);
                $this.data('mp-data-monthPickerFrom', myParams.monthPickerFrom);
                $this.data('mp-data-monthPickerTo', myParams.monthPickerTo);
                $this.data('mp-data-hasPresent', myParams.hasPresent);
                $this.data('mp-data-onlyYear', myParams.onlyYear);
                $this.data('mp-data-hasPageDirty', myParams.hasPageDirty);

                $this.attr('readOnly', true);
                $this.bind('keydown', function (e) {
                    e.stopPropagation();
                    if (e.preventDefault) {
                        e.preventDefault();
                    } else {
                        e.returnValue = false;
                    };
                });

                $this.focus(function () {
                    var $container = $('#mp-' + $this.attr('id'));

                    var tCurrYear = $this.data('mp-data-currentDate').getFullYear();
                    if (tCurrYear == 9999)
                        tCurrYear = (new Date()).getFullYear();

                    $this.data('mp-data-currentYear', tCurrYear);
                    $this.data('mp-data-currentMonth', $this.data('mp-data-currentDate').getMonth());

                    if ($container.length == 0) {
                        BuildHtml();
                        $container = $('#mp-' + $this.attr('id'));
                    }

                    var $mpContentListY = $('ul.mp-contentYears', $container);
                    $('.mp-maincontainer').hide();
                    $container.show();
                });

                function GetYears($mpContentListY, $container, cYear) {
                    var firstYear = cYear - 6;
                    var lastYear = cYear + 5;

                    $('div.mp-header span', $container).text(firstYear.toString() + ' - ' + lastYear.toString());

                    $mpContentListY.empty();
                    yearLI = "";
                    for (var i = firstYear; i <= lastYear; i++) {
                        if (i < $this.data('mp-data-minDate').getFullYear())
                            yearLI += '<li class="mp-yearDisabled">' + i.toString() + '</li>';
                        else if (i > $this.data('mp-data-maxDate').getFullYear())
                            yearLI += '<li class="mp-yearDisabled">' + i.toString() + '</li>';
                        else if ($this.data('mp-data-currentYear') == i)
                            yearLI += '<li class="mp-yearSelected">' + i.toString() + '</li>';
                        else yearLI += '<li>' + i.toString() + '</li>';
                    }

                    $mpContentListY.html(yearLI);
                    BindYearClick($mpContentListY);
                }

                function BindYearClick($mpContentListY) {
                    $('li', $mpContentListY).not('li.mp-yearDisabled').click(function () {
                        var $container = $('#mp-' + $this.attr('id'));
                        var year = $(this).text();
                        $this.data('mp-data-currentYear', parseInt(year));

                        if ($this.data('mp-data-onlyYear')) {
                            var dt = $.datepicker.parseDate('dd/mm/yy', '01/01/' + $this.data('mp-data-currentYear').toString());
                            SetDate(dt);
                            $container.hide();
                            UpdateRelatedPicker();
                        }
                        else {
                            $('div.mp-header span', $container).text(year);

                            $('div.mp-header span', $container).click(function () {
                                var $container = $('#mp-' + $this.attr('id'));
                                var $mpContentListY = $('ul.mp-contentYears', $container).show('slide', { direction: 'up' }, 'fast');

                                $('ul.mp-contentMonths', $container).hide();
                                GetYears($mpContentListY, $container, parseInt($(this).text()));
                                $(this).unbind('click').removeClass('mp-spanClickeable');
                            }).addClass('mp-spanClickeable');

                            var $mpContentListM = $('ul.mp-contentMonths', $container)
                            GetMonths($mpContentListM);
                            $('ul.mp-contentYears', $container).hide();
                            $mpContentListM.show('scale', { percent: 100 }, 'fast');
                        }
                    });
                }

                function GetMonths($mpContentListM) {
                    var currYear = $this.data('mp-data-currentYear');

                    var arrMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                    $mpContentListM.empty();
                    var monthsLI = "";
                    for (var i = 0; i < 12; i++) {
                        if (currYear == $this.data('mp-data-minDate').getFullYear()
                            && i < $this.data('mp-data-minDate').getMonth())
                            monthsLI += '<li class="mp-yearDisabled">' + arrMonths[i] + '</li>';
                        else if (currYear == $this.data('mp-data-maxDate').getFullYear()
                            && i > $this.data('mp-data-maxDate').getMonth())
                            monthsLI += '<li class="mp-yearDisabled">' + arrMonths[i] + '</li>';
                        else if ($this.data('mp-data-currentMonth') == i)
                            monthsLI += '<li class="mp-yearSelected">' + arrMonths[i] + '</li>';
                        else monthsLI += '<li>' + arrMonths[i] + '</li>';
                    }

                    $mpContentListM.html(monthsLI);

                    $('li', $mpContentListM).not('li.mp-yearDisabled').click(function () {
                        var $container = $('#mp-' + $this.attr('id'));

                        var month = $(this).index();
                        $container.hide();

                        var dt = $.datepicker.parseDate('dd/mm/yy', '01/01/' + $this.data('mp-data-currentYear').toString());
                        dt.setMonth(month);

                        SetDate(dt);

                        UpdateRelatedPicker();
                    });
                }

                function SetDate(dt) {
                    dt.setDate(1);
                    $this.data('mp-data-currentDate', dt);

                    var dateText = "";
                    if ($this.data('mp-data-onlyYear'))
                        dateText = dt.getFullYear().toString();
                    else if (dt.getFullYear() == 9999)
                        dateText = "Actual";
                    else dateText = $.datepicker.formatDate('mm/yy', dt);

                    if ($this.get(0).tagName.toLowerCase() == 'input')
                        $this.val(dateText);
                    else $this.text(dateText);

                    if ($this.data('mp-data-hasPageDirty')) {
                        pageDirty = true;
                        $('input[id$=hdn_txtLastDateCategory]').val(dateText);
                    }

                    $this.trigger('change');
                }

                function UpdateRelatedPicker() {
                    var $monthPickerFrom = $this.data('mp-data-monthPickerFrom');
                    var $monthPickerTo = $this.data('mp-data-monthPickerTo');

                    if ($monthPickerFrom != null) {
                        $this.data('mp-data-currentDate').setDate(20);
                        $monthPickerFrom.MonthPicker('SetMaxDate', $this.data('mp-data-currentDate'));
                    }
                    if ($monthPickerTo != null) {
                        $this.data('mp-data-currentDate').setDate(1);
                        $monthPickerTo.MonthPicker('SetMinDate', $this.data('mp-data-currentDate'));
                    }
                }

                function BuildArrows() {
                    var $container = $('#mp-' + $this.attr('id'));

                    $('a.mp-leftArrow', $container).click(function () {
                        var $container = $('#mp-' + $this.attr('id'));
                        var $span = $('div.mp-header span', $container);

                        var spanText = $span.text();
                        if (spanText.indexOf('-') != -1) {
                            var startYear = parseInt(spanText.split('-')[0]);
                            var $mpContentListY = $('ul.mp-contentYears', $container).show('slide', { direction: 'left' }, 'fast');
                            GetYears($mpContentListY, $container, startYear - 5);
                        } else {
                            var year = parseInt(spanText);
                            if (year > $this.data('mp-data-minDate').getFullYear()) {
                                var y = (year - 1).toString();
                                $span.text(y);
                                $this.data('mp-data-currentYear', y);
                            }
                        }
                    });

                    $('a.mp-rightArrow', $container).click(function () {
                        var $container = $('#mp-' + $this.attr('id'));
                        var $span = $('div.mp-header span', $container);

                        var spanText = $span.text();
                        if (spanText.indexOf('-') != -1) {
                            var endYear = parseInt(spanText.split('-')[1]);
                            var $mpContentListY = $('ul.mp-contentYears', $container).show('slide', { direction: 'right' }, 'fast');
                            GetYears($mpContentListY, $container, endYear + 6);
                        } else {
                            var year = parseInt(spanText);
                            if (year < $this.data('mp-data-maxDate').getFullYear()) {
                                var y = (year + 1).toString();
                                $span.text(y);
                                $this.data('mp-data-currentYear', y);
                            }
                        }
                    });
                }

                function BuildHtml() {
                    var idCt = 'mp-' + $this.attr('id');
                    var $dContainer = $('<div>').addClass('mp-maincontainer').attr('id', idCt).hide()
                    .css('width', 180).css('border', 'solid 1px silver').css('position', 'absolute').css('z-index', 10).css('background-color', 'white');
                    $('form').after($dContainer);

                    $dContainer.css('top', $this.offset().top + 20);
                    $dContainer.css('left', $this.offset().left);

                    $(document).click(function (event) {
                        if ($(event.target).closest('#' + $dContainer.attr('id')).get(0) == null
                            && $(event.target).closest('#' + $this.attr('id')).get(0) == null) {
                            $dContainer.hide();
                        }
                    });

                    var $mpHeader = $('<div>').addClass('mp-header')
                        .html('<a class="mp-leftArrow">&lt;</a><span></span><a class="mp-rightArrow">&gt;</a>');
                    $dContainer.html($mpHeader);

                    var $mpContentListY = $('<ul>').addClass('mp-contentList mp-contentYears');
                    GetYears($mpContentListY, $dContainer, $this.data('mp-data-currentYear'));

                    var $mpContentListM = $('<ul>').addClass('mp-contentList mp-contentMonths').hide();
                    GetMonths($mpContentListM);

                    $mpHeader.after($mpContentListY).after($mpContentListM);

                    if ($this.data('mp-data-hasPresent')) {
                        $dContainer.css('height', 160);
                        var $presentLink = $('<div>').addClass('mp-footer').html('Actualidad');
                        $mpContentListY.after($presentLink);

                        $presentLink.click(function () {
                            var $container = $('#mp-' + $this.attr('id'));

                            var dt = $.datepicker.parseDate('dd/mm/yy', '31/12/9999');
                            SetDate(dt);

                            $container.hide();
                        });
                    }

                    BuildArrows();
                };
            });
        },
        SetDate: function (date) {
            if (date != null) {
                date.setDate(1);
                $(this).data('mp-data-currentDate', date);

                var dateText = "";
                if ($(this).data('mp-data-onlyYear'))
                    dateText = dt.getFullYear().toString();
                else if (date.getFullYear() == 9999)
                    dateText = "Actual";
                else dateText = $.datepicker.formatDate('mm/yy', date);

                if ($(this).get(0).tagName.toLowerCase() == 'input')
                    $(this).val(dateText);
                else $(this).text(dateText);


                var $monthPickerFrom = $(this).data('mp-data-monthPickerFrom');
                var $monthPickerTo = $(this).data('mp-data-monthPickerTo');

                if ($monthPickerFrom != null) {
                    $(this).data('mp-data-currentDate').setDate(20);
                    $monthPickerFrom.MonthPicker('SetMaxDate', $(this).data('mp-data-currentDate'));
                }
                if ($monthPickerTo != null) {
                    $(this).data('mp-data-currentDate').setDate(1);
                    $monthPickerTo.MonthPicker('SetMinDate', $(this).data('mp-data-currentDate'));
                }
            }
        },
        GetDate: function () {
            return $(this).data('mp-data-currentDate');
        },
        SetMaxDate: function (maxDate) {
            $(this).data('mp-data-maxDate', maxDate);
        },
        SetMinDate: function (minDate) {
            $(this).data('mp-data-minDate', minDate);
        },
        SetMonthPickerTo: function (picker) {
            $(this).data('mp-data-monthPickerTo', picker);
        },
        SetMonthPickerFrom: function (picker) {
            $(this).data('mp-data-monthPickerFrom', picker);
        }
    };

    $.fn.MonthPicker = function (method) {

        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.MonthPicker');
        }

    };

})(jQuery);
