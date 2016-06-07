function Calendar() {
    this.month = new Date().getMonth();
    this.year = new Date().getFullYear();
    this.startingDay = new Date(this.year, this.month, 1).getDay();
    this.today = new Date();

    this.minDate = 1900;
    this.maxDate = 2099;

    this.monthSelector = null;
    this.yearsSelector = null;

    this.dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    this.monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    this.numberDaysInWeek = this.dayNames.length;
    this.numberMonth = this.monthNames.length;

    if (typeof this.initCalendar === 'function' && this.initCalendar !== 'undefined') {
        this.initCalendar();
    }
}

Calendar.prototype = {

    initCalendar: function() {
        this.createCalendarTable();
        this.renderDate();
        this.addEventListeners();
    },

    createCalendarTable: function() {
        var body = document.querySelector('body');
        var table = document.createElement('table');
        table.appendChild(this.createCalendarTableHead());
        table.appendChild(this.createCalendarTableBody());
        body.appendChild(table);
    },

    createCalendarTableHead: function() {
        var thead = document.createElement('thead');
        var dateSelectContainer;
        var selectDate;
        var options;
        var th;
        var i;
        var j;
        var n;

        //create row with a current month
        dateSelectContainer = document.createElement('tr');
        thead.appendChild(dateSelectContainer);
        selectDate = dateSelectContainer.appendChild(document.createElement('th'));
        selectDate.colSpan = '7';
        selectDate.innerHTML = '<button class="prev"><</button>' + '<select class="months"></select>' + '<select class="years"></select>' + '<button class="next">></button>';

        // fill months
        this.monthSelector = selectDate.querySelector('select.months');
        for (n = 0; n < this.numberMonth; n++) {
            options = document.createElement('option');

            options.innerHTML = this.monthNames[n];

            this.monthSelector.appendChild(options);
        }

        // fill years
        this.yearsSelector = selectDate.querySelector('select.years');
        for (i = this.minDate; i < this.maxDate + 1; i++) {
            options = document.createElement('option');

            options.innerHTML = i;

            this.yearsSelector.appendChild(options);
        }

        //create row with days of the week
        thead.appendChild(document.createElement('tr'));
        for (j = 0; j < this.numberDaysInWeek; j++) {
            th = document.createElement('th');

            th.innerHTML = this.dayNames[j];

            thead.children[1].appendChild(th);
        }

        return thead;
    },

    createCalendarTableBody: function() {
        var tbody = document.createElement('tbody');
        var i;
        var j;
        var tr;
        var td;

        for (i = 0; i < 6; i++) {
            tr = document.createElement('tr');

            for (j = 0 ; j < this.numberDaysInWeek; j++) {
                td = document.createElement('td');

                tr.appendChild(td);
            }

            tbody.appendChild(tr);
        }

        return tbody;
    },

    renderDate: function(today) {
        this.monthSelector.selectedIndex = this.month;
        this.yearsSelector.selectedIndex = this.year - this.minDate;

        var tbody = document.querySelector('tbody');
        var totalDays = new Date(this.year, this.month + 1, 0).getDate();
        var dayCounter = 0;
        var dayOfMonth;
        var currentDate;
        var i;
        var j;
        var td;

        for (i = 0; i < tbody.rows.length; i++) {
            for (j = 0; j < tbody.rows[i].cells.length; j++) {
                td = tbody.rows[i].cells[j];
                dayOfMonth = dayCounter - this.startingDay;
                currentDate = new Date(this.year, this.month, dayOfMonth);

                if (dayOfMonth >= 0 && dayOfMonth < totalDays) {
                    td.innerHTML = dayOfMonth + 1;

                    td.classList.remove('empty');
                } else {
                    td.innerHTML = '';

                    td.classList.add('empty');
                }

                if (dayOfMonth >= 0 && dayOfMonth < totalDays && this.isDateEqualToDate(this.today, currentDate)) {
                    td.classList.add('active');
                } else {
                    td.classList.remove('active');
                }

                dayCounter++;
            }
        }
    },

    addEventListeners: function() {
        document.querySelector('select.months').addEventListener('change', this.changeMonth.bind(this));
        document.querySelector('select.years').addEventListener('change', this.changeYear.bind(this));
        document.querySelector('.prev').addEventListener('click', this.setPreviousMonthDate.bind(this));
        document.querySelector('.next').addEventListener('click', this.setNextMonthDate.bind(this));
    },

    changeMonth: function() {
        this.month = document.querySelector('select.months').selectedIndex;
        this.startingDay = new Date(this.year, this.month, 1).getDay();
        this.renderDate();
    },

    changeYear: function(e) {
        this.year = new Date(e.target.value).getFullYear();
        this.startingDay = new Date(this.year, this.month, 1).getDay();
        this.renderDate();
    },

    setPreviousMonthDate: function() {
        this.month -= 1;
        if (this.month < 0) {
            this.month = this.numberMonth - 1;
            this.year -= 1;
        }

        this.startingDay = new Date(this.year, this.month, 1).getDay();
        this.renderDate();
    },

    setNextMonthDate: function() {
        this.month += 1;
        if (this.month > this.numberMonth - 1) {
            this.month = 0;
            this.year += 1;
        }

        this.startingDay = new Date(this.year, this.month, 1).getDay();
        this.renderDate();
    },

    isDateEqualToDate: function(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
    },

    goToDate: function(dateString) {
        var parts = dateString.split('-');
        var day = +parts[0] - 1;
        this.month = +parts[1] - 1;
        this.year = +parts[2];
        this.today = new Date(this.year, this.month, day);

        this.startingDay = new Date(this.year, this.month, 1).getDay();
        this.renderDate();
    }

};

var calendar = new Calendar();
