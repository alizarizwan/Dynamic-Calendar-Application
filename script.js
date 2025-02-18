let selectedDate = null;
let bookings = JSON.parse(localStorage.getItem("bookings")) || {};

//Function to move to previous month
function prevMonth() {
  currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
  currentYear = (currentMonth === 11) ? currentYear - 1 : currentYear;
  renderCalendar(currentMonth, currentYear);
}

//Function to move to next month
function nextMonth() {
  currentMonth = (currentMonth === 11) ? 0 : currentMonth + 1;
  currentYear = (currentMonth === 0) ? currentYear + 1 : currentYear;
  renderCalendar(currentMonth, currentYear);
}

// Function to generate time slots for the dropdown
function generateTimeSlots() {
    const timeSlotSelect = document.getElementById("time-slot");
    timeSlotSelect.innerHTML = ''; //Clearing any existing options

    // Generating time slots from 00:00 to 23:00
    for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0'); // Formating hours to two digits
        const option = document.createElement('option');
        option.value = `${hour}:00`; // Option value as the time slot
        option.textContent = `${hour}:00`; // Option text as the time slot
        timeSlotSelect.appendChild(option);
    }
}

//Function to close the booking form 
function closeForm() {
  document.getElementById("booking-form").style.display = "none";
}

// Function to open booking form when a date is clicked
function openBookingForm(date) {
    if (date < new Date().setHours(0, 0, 0, 0)) {
        alert("You cannot book past dates.");
        return;
    }

    selectedDate = date;
    document.getElementById("selected-date").textContent = `Booking for: ${date.toDateString()}`;
    document.getElementById("booking-form").style.display = "block";

    generateTimeSlots(); //Populating the time slots each time the form opens

    // Pre-filling the calendar with existing bookings
    const booking = bookings[selectedDate.toDateString()];
    document.getElementById("reason").value = booking ? booking.reason : "";
    document.getElementById("time-slot").value = booking ? booking.time : "";
}

//Function to confirm booking
function confirmBooking() {
    const reason = document.getElementById("reason").value;
    const time = document.getElementById("time-slot").value;

    if (!reason || !time) {
        alert("Please provide a reason and select a time slot.");
        return;
    }

    const bookingKey = selectedDate.toDateString();
    const existingBooking = bookings[bookingKey];

    if (existingBooking) {
        alert(`Booking updated: ${reason} at ${time}`);
    } else {
        alert(`New booking confirmed: ${reason} at ${time}`);
    }

    bookings[bookingKey] = { reason, time };
    localStorage.setItem("bookings", JSON.stringify(bookings));

    document.getElementById("booking-form").style.display = "none";
    renderCalendar(currentMonth, currentYear);
}

// Function to remove a booking
function removeBooking() {
    const bookingKey = selectedDate.toDateString();

    if (bookings[bookingKey]) {
        const { reason, time } = bookings[bookingKey];
        alert(`Booking deleted for: ${reason} at ${time}`);
        delete bookings[bookingKey];
        localStorage.setItem("bookings", JSON.stringify(bookings));
        renderCalendar(currentMonth, currentYear);
    } else {
        alert("No booking found to remove.");
    }

    document.getElementById("booking-form").style.display = "none";
}

// Function to render the calendar
function renderCalendar(month, year) {
    const firstDay = new Date(year, month).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthYearDisplay = document.getElementById("month-year");
    monthYearDisplay.textContent = `${new Date(year, month).toLocaleString("default", { month: "long" })} ${year}`;

    const calendarBody = document.getElementById("calendar-body");
    calendarBody.innerHTML = ""; //Clearing previous cells

    let date = 1;
    for (let i = 0; i < 6; i++) { // 6 rows (weeks)
        const row = document.createElement("tr");

        for (let j = 0; j < 7; j++) {
            const cell = document.createElement("td");

            if (i === 0 && j < firstDay) {
                //Empty cells for days before the start of the month
                cell.classList.add("empty");
            } 
            else if (date > daysInMonth) {
                break;
            } 
            else {
                cell.classList.add("date-cell");
                const cellDate = new Date(year, month, date);
                const dateText = document.createElement("span");
                dateText.classList.add("date");
                dateText.textContent = date;
                cell.appendChild(dateText);

                const bookingKey = cellDate.toDateString();
                if (bookings[bookingKey]) {
                    cell.classList.add("booked");
                    const booking = bookings[bookingKey];
                    
                    // Create and display the booking reason and time in the cell
                    const bookingReason = document.createElement("div");
                    bookingReason.classList.add("booking-reason");
                    bookingReason.textContent = `${booking.reason} (${booking.time})`;  //Displaying reason and time for booking together
                    cell.appendChild(bookingReason);

                    if (new Date(bookingKey) < new Date().setHours(0, 0, 0, 0)) {
                        //If the booking is in the past, applying a strikethorugh
                        bookingReason.style.textDecoration = "line-through";
                    }
                }

                cell.onclick = () => openBookingForm(cellDate);

                date++;
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    currentMonth = new Date().getMonth();
    currentYear = new Date().getFullYear();
    renderCalendar(currentMonth, currentYear);
});
