let root_url = "http://comp426.cs.unc.edu:3001/";

let this_departure = '';
let this_arrival = '';
//let this_time = '';
let this_flight = '';
let this_instance = '';
let this_seat = '';
let format_seat = ''
let dep_code = '';
let arr_code = '';
let dep_time = '';
let arr_time = '';
let date = '';
$(document).ready(() => {
    $('#login_btn').on('click', () => {

        let user = $('#user').val();
        let pass = $('#pass').val();

        console.log(user);
        console.log(pass);

        $.ajax(root_url + "sessions",
            {
                type: 'POST',
                xhrFields: {withCredentials: true},
                data: {
                    user: {
                        username: user,
                        password: pass
                    }
                },
                success: () => {
                    build_home();
                },
                error: (jqxhr, status, error) => {
                    alert(error);
                }
            });
    });



    $(document).on('click','#logout',function () {
        $.ajax(root_url+"sessions/", {
            type:'DELETE',
            success: () =>{
                location.reload();
            }
        })
    });
    $(document).on('click', '.delete', function(){
        let ticket_id  = $(this).attr('ticket_id');
        $.ajax(root_url+"tickets/"+ticket_id,{
            type: 'DELETE',
            xhrFields: {withCredentials: true},
            success: () =>{
                build_your_tickets();
            }
        })
    });
    $(document).on('click', '.book', function(){
        build_departure();
    });
    $(document).on('click', '.departure', function() {
        this_departure = $(this).attr('depart_id');
        dep_code = $(this).attr('dep_code');
        this_arrival = '';
        this_time = '';
        let button = $("#bookbutton");
        button.addClass("disabled");
        button.removeClass("active");
        $('.time-list').empty();
        $(".departure").removeClass('active');
        $(this).addClass('active');
        console.log(this_departure);
        build_arrival(this_departure);
    });

    $(document).on('click', '.arrival', function() {
        this_arrival = $(this).attr('arrive_id');
        this_time = '';
        arr_code = $(this).attr('arr_code');
        let button = $("#bookbutton");
        button.addClass("disabled");
        button.removeClass("active");
        $('.arrival').removeClass('active');
        $(this).addClass('active');
        console.log(this_arrival);
        build_time(this_departure, this_arrival);
    });

    $(document).on('click', '.time', function() {
        //this_time = $(this).attr();
        date = $(this).attr('date');
        dep_time = $(this).attr('deptime');
        arr_time = $(this).attr('arrtime');
        this_flight = $(this).attr('flight');
        this_instance = $(this).attr('instance');
        console.log("flight:");
        $(this).addClass('active');
        let button = $("#bookbutton");
        button.removeClass("disabled");
        button.addClass("active");
        //$('.book_button').append("<button type='button' class='button to_seat' flight ='"+flight+"'>Choose Seat</button>");
    });

    $(document).on('click', '.to_seat', function(){
        let flight = $(this).attr('flight');
        build_seat(flight);
    });
    //I CHANGED THIS!!
    $(document).on('click', '.seatchosen', function() {
        this_seat = $(this).attr('seat_id');
        console.log("seat"+this_seat);

        let button = $("#seatbutton");
        $('.seatchosen').removeClass('active');
        $(this).addClass('active');
        this_seat = $(this).attr('seat');
        button.removeClass("disabled");
        button.addClass("active");
        // $('.seated-button').empty();
        // $('.seated-button').append("<button class ='seated' seat_id ='" + seat+ "'>BOOK NOW</button>");
    });
    $(document).on('click','#seatbutton',function () {
        build_ticket_interface(this_seat);
    });

    // $(document).on('click', '.seated', function(){
    //     let seat = $(this).attr('seat_id');
    //     build_ticket_interface(seat);
    // });

    $(document).on('click', '.back_departure', function() {
        build_home();
    });
    $(document).on('click', '.back_arrival', function() {
        build_departure();
    });
    $(document).on('click', '.back_time', function() {
        let departure = $(this).attr('departure');
        build_arrival(departure);
    });
    $(document).on('click', '.back_seat', function() {
        let departure = $(this).attr('departure');
        let arrival = $(this).attr('arrival');
        build_time(departure, arrival);
    });
    $(document).on('click','#yourtix', function () {
        $('#yourtix').addClass('active');
        $('#gohome').removeClass('active');
        build_your_tickets();
    });
    $(document).on('click','#gohome',function () {
        $('#yourtix').removeClass('active');
        $('#gohome').addClass('active');
        build_home();
    });
    $(document).on('keyup','#dep_search',function () {
        let query = $(this).val().toUpperCase();
        let list = $(".departure");
        search_filter(list, query);
    });
    $(document).on('keyup','#arr_search',function () {
        let query = $(this).val().toUpperCase();
        let list = $(".arrival");
        search_filter(list, query);
    });
    $(document).on('click','#bookbutton',function () {
        build_seat();
    })

    $(document).on('click', '.cabinbox', function(){
        box = $(this).attr('box');
        if($(this).is(':checked')){
            checkbox_filter_show(box);
        }else{
            checkbox_filter_hide(box);
        }
    })
    $(document).on('click', '.seatbox', function(){
        box = $(this).attr('box');
        if($(this).is(':checked')){
            seat_filter_show(box);
        }else{
            seat_filter_hide(box);
        }
    })

});

let checkbox_filter_show = function(box){
    $('.set').each(function(){
        if($(this).attr('class').includes(box)){
            $(this).show();
        }
    });
}
let checkbox_filter_hide = function(box){
    $('.set').each(function(){
        if($(this).attr('class').includes(box)){
            $(this).hide();
        }
    });
}

let seat_filter_show = function(box){
    $('.set').each(function(){
        if($(this).attr('class').includes(box)){
            $(this).removeClass('disabled');
        }
    });
}
let seat_filter_hide = function(box){
    $('.set').each(function(){
        if($(this).attr('class').includes(box)){
            $(this).addClass('disabled');
        }
    });
}




let search_filter = function(list, query){
    query = query.toUpperCase();
    if(query.length > 0){
        let matched = list.filter(function () {
            return $(this).text().toUpperCase().includes(query);
        }).show();

        let unmatched = list.filter(function () {
            return !$(this).text().toUpperCase().includes(query);
        }).hide();
        if (matched.length === 0){
            // $(".departure-list").append("<a class=\'noresults list-group-item list-group-item-action\'>No results</a>");
        }

    }else{
        list.each(function () {
            $(this).show();
        });
    };
};

let build_home = function(){
    this_departure = '';
    this_arrival = '';
    this_time = '';
    this_flight = '';
    this_instance = '';
    this_seat = '';
    let body = $('body');
    body.empty();
    body.css('background-image','url("backgrnd.jpg")');
    body.append("<nav class=\"navbar navbar-inverse\">\n" +
        "  <div class=\"container-fluid\">\n" +
        "    <div class=\"navbar-header\">\n" +
        "      <a class=\"navbar-brand\" href=\"#\">Furry Carnival</a>\n" +
        "    </div>\n" +
        "    <ul class=\"nav navbar-nav\" id='tabbar'>\n" +
        "      <li class=\"active\" id='gohome'><a href=\"#\">Home</a></li>\n" +
        "      <li id='yourtix'><a hfref='#'>Your Tickets</a></li>\n" +
        "    </ul>\n" +
        "    <ul class=\"nav navbar-nav navbar-right\">\n" +
        "      <li><a id='logout'><span class=\"glyphicon glyphicon-log-in\"></span> Logout</a></li>\n" +
        "    </ul>\n" +
        "  </div>\n" +
        "</nav>");
    body.append("<div id='pagebody'></div>");
    let pagebody = $('#pagebody');
    //pagebody.append("<button class='book'>Book Another Flight</button>");
    pagebody.append("<div class='blocksblock' ><div class='d-inline-block dep blk'><h2>where from</h2><!-- Search form -->\n" +
        "<input id='dep_search' class=\'form-control\' type=\'text\' placeholder=\'Search\' aria-label=\'Search\'>" +
        "<div class='searchlist dep-list'></div></div>" +

        "<div class=\'d-inline-block arr blk'><h2>where to</h2>" +
        "<!-- Search form --><input id='arr_search' class=\'form-control\' type=\'text\' placeholder=\'Search\' aria-label=\'Search\'>" +
        "<div class='searchlist arr-list'></div></div>"+

        "<div class='d-inline-block tim blk'><h2>when</h2>"+
        "<!-- Search form --><input id='time_search' class=\'form-control\' type=\'text\' placeholder=\'Search\' aria-label=\'Search\'>" +
        "<div class='searchlist time-list'></div>" +
        // "<div class='book_button'><<button type=\"button\" class=\"btn btn-lg btn-primary disabled" id='bookbutton'" +
        // " >Book Tickets Now</button></div></div>");>
        "<button type='button' class='btn btn-lg btn-primary disabled' id='bookbutton'>Book Tickets Now</button></div></div>");

    build_departure();

};

let build_your_tickets = function () {
    let pagebody = $('#pagebody');
    pagebody.empty();
    pagebody.append("<div class='d-inline-block tixbloc blk'><h2>Your Tickets</h2></div>");
    let ticket_list = $("<ul class='list-group-item' id='ticket_list'></ul>");
    $('.tixbloc').append(ticket_list);
    $.ajax(root_url + "tickets",
        {
            type: 'GET',
            xhrFields: {withCredentials: true},
            success: (tickets) => {
                for (let i=0; i<tickets.length; i++) {
                    ticket_list.append("<a class='list-group-item'>" + tickets[i].info+"<button " +
                        "class='btn btn-primary pull-right delete' ticket_id='"+tickets[i].id+"'>Cancel Ticket</button></a>");
                }
            }
        });

};

let build_departure = function(){
    let body =$('.dep-list');
    body.empty();
    // body.append("<h1>Depart From?</h1>")
    // body.append("<button class='back_departure'><-back</button>")
    let departure_list = $("<ul class='list-group' id='departure_list'></ul>");
    body.append(departure_list);


    $.ajax(root_url + "flights", {
        type: 'GET',
        xhrFields: {withCredentials: true},
        success: (flights) => {
            let departures = new Set();
            for (let i = 0; i < flights.length; i++) {
                if(!(departures.has(flights[i].departure_id))) {
                    departures.add(flights[i].departure_id);
                    $.ajax(root_url+"airports/"+ flights[i].departure_id,{
                        type: 'GET',
                        xhrFields: {withCredentials: true},
                        success: (airports) => {
                            departure_list.append("<a class='departure list-group-item list-group-item-action' " +
                                "\depart_id='" + airports.id + "'dep_code='" +airports.code +
                                "' ><span class=\"glyphicon glyphicon-plane\"></span>" + airports.name + "</a>");
                            departure_list.append()
                        }
                    })

                }
            }
        }
    });

};

let build_arrival = function(departure){
    let body = $('.arr-list');
    body.empty();
    //$(".book_button").empty();
    //body.append("<h1>Arrive?</h1>");
    //body.append("<button class='back_arrival'><-back</button>")
    let arrival_list = $("<ul class='list-group' id='arrival_list'></ul>");
    body.append(arrival_list);

    $.ajax(root_url +"flights?filter[departure_id]="+departure,{
        type:'GET',
        xhrFields: {withCredentials: true},
        success: (flights) => {
            let arrivals = new Set();
            for (let i=0; i<flights.length; i++) {
                if(!(arrivals.has(flights[i].arrival_id))){
                    arrivals.add(flights[i].arrival_id);
                    $.ajax(root_url+'airports/'+flights[i].arrival_id,{
                        type:'GET',
                        xhrFields: {withCredentials: true},
                        success: (airports) => {
                            arrival_list.append("<a href='#' class='arrival list-group-item list-group-item-action' " +
                                "depart_id='"+departure+"'arrive_id='" + airports.id + "' arr_code='"+airports.code+"' >" +
                                "<span class=\"glyphicon " +
                                "glyphicon-plane\"></span>" + airports.name + "</a>");

                        }
                    })
                }

            }

        }
    })
};


let build_time = function(departure, arrival) {
    let body = $('.time-list');
    body.empty();
    //$(".book_button").empty();
    // body.append("<h1>TIME?</h1>");
    // body.append("<button class='back_time' departure='"+departure+"'><-back</button>")
    let time_list = $("<ul class='list-group' id='time_list'></ul>");
    body.append(time_list);

    $.ajax(root_url +"flights?filter[departure_id]="+departure+"&filter[arrival_id]="+arrival, {
        type: 'GET',
        xhrFields: {withCredentials: true},
        success: (flights) => {
            for (let i = 0; i < flights.length; i++) {
                $.ajax(root_url + "instances?filter[flight_id]="+flights[i].id, {
                    dataType: "json",
                    type: "GET",
                    xhrFields: {withCredentials: true},
                    success: (instances) => {
                        for(let j = 0; j <instances.length; j++) {
                            let raw_date = instances[j].date;
                            let raw_depart = flights[i].departs_at;
                            let dep_time = raw_depart.split("T")[1];
                            let dep_hour = dep_time.split(":")[0];
                            let dep_minute = dep_time.split(":")[1];
                            let format_dep_time = dep_hour+":"+dep_minute;

                            let raw_arr = flights[i].arrives_at;
                            let arr_time = raw_arr.split("T")[1];
                            let arr_hour = arr_time.split(":")[0];
                            let arr_minute = arr_time.split(":")[1];
                            let format_arr_time = arr_hour+":"+arr_minute;
                            if(!instances[j].is_cancelled){ time_list.append("<a class='time list-group-item list-group-item-action' flight ='" + flights[i].id + "'" +
                                "instance='"+instances[j].id+"'date='"+raw_date+"'deptime='"+format_dep_time+"' arrtime='"+format_arr_time+"'>" +
                                "<span class=\"glyphicon glyphicon-calendar\"></span>" +
                                raw_date + "<br>Departs at: " + format_dep_time + " Arrives at: "+ format_arr_time+
                                "</a>")}

                        }
                    }
                }
            );


            }
        }
    })
};

let build_seat = function(flight){
    console.log(flight);
    let body = $('body');
    body.empty();
    body.append("<nav class=\"navbar navbar-inverse\">\n" +
        "  <div class=\"container-fluid\">\n" +
        "    <div class=\"navbar-header\">\n" +
        "      <a class=\"navbar-brand\" href=\"#\">Furry Carnival</a>\n" +
        "    </div>\n" +
        "    <ul class=\"nav navbar-nav\" id='tabbar'>\n" +
        "      <li class=\"active\" id='gohome'><a href=\"#\">Home</a></li>\n" +
        "      <li id='yourtix'><a href='#'>Your Tickets</a></li>\n" +
        "    </ul>\n" +
        "    <ul class=\"nav navbar-nav navbar-right\">\n" +
        "      <li><a href=\"#\"><span class=\"glyphicon glyphicon-log-in\"></span> Logout</a></li>\n" +
        "    </ul>\n" +
        "  </div>\n" +
        "</nav>");
    //body.append("<h1>Pick A Seat</h1>");
    body.append("<div id='pagebody'></div>");
    let pagebody = $('#pagebody');
    pagebody.append("<div class='d-inline-block seatselect blk' id='seatselect'><h1>Pick A Seat</h1><br><div class='checkboxes'><h3>Search Seats</h3><div class='cabin_list'>" +
        "<div class='form-check form-check-inline'>" +
        "<input type='checkbox' box= 'Premium' class='form-check-input premium_check cabinbox' checked> " +
        "<label class=\"form-check-label\" for=\"inlineCheckbox1\">Premium</label></div>"+
        "<div class='form-check form-check-inline'>" +
        "<input type='checkbox' box='First' class='form-check-input cabinbox first_check' checked>" +
        "<label class=\"form-check-label\" for=\"inlineCheckbox2\">First Class</label></div>"+
        "<div class='form-check form-check-inline'>" +
        "<input type='checkbox' box='Business' class='form-check-input business_check cabinbox' checked> " +
        "<label class=\"form-check-label\" for=\"inlineCheckbox3\">Business Class</label></div>"+
        "<div class='form-check form-check-inline'>" +
        "<input type='checkbox' box='Economy' class='form-check-input cabinbox economy_check' checked>" +
        "<label class=\"form-check-label\" for=\"inlineCheckbox4\">Economy</label></div>"+
        //"<a href='https://www.youtube.com/watch?v=U4rwlvMEoj0&t=6s'>Three Deep in the Window</a><div class='form-check seat_attr'>" +
        "<div class='form-check form-check-inline'>" +
        "<input type='checkbox' box='window' class='form-check-input window_check seatbox' checked>" +
        "<label class=\"form-check-label\" for=\"inlineCheckbox5\">Window Seat</label></div>"+
        "<div class='form-check form-check-inline'>" +
        "<input type='checkbox' box='aisle' class='form-check-input aisle_check seatbox' checked>" +
        "<label class=\"form-check-label\" for=\"inlineCheckbox6\">Aisle Seat</label></div>"+
        "<div class='form-check form-check-inline'>" +
        "<input type='checkbox' box='exit' class='form-check-input exit_check seatbox' checked>" +
        "<label class=\"form-check-label\" for=\"inlineCheckbox7\">Exit Seat</label></div></div></div></div>"+
        "<div class='d-inline-block seatcontainer blk' id='seatdiv'><h2>Available Seats</h2>" +
        // "<!-- Search form -->\n" +
        // "<input id='dep_search' class=\'form-control\' type=\'text\' placeholder=\'Search\' aria-label=\'Search\'>" +
        "<div class='searchlist seats-list'></div><button type='button' class='btn btn-lg btn-primary disabled' id='seatbutton'>Confirm Tickets</button></div>"

        // "<div class='seated-button'></div>"
    );

    let seat_list= $(".seats-list");
    let seatlist= $("<ul class='list-group' id='seat_list'></ul>");


    $.ajax(root_url+'seats?filter[plane_id]='+18397, {
        type: 'GET',
        xhrFields: {withCredentials: true},
        success: (seats) => {
            for (let i = 0; i < seats.length; i++) {
                format_seat = seats[i].row + seats[i].number
                let this_seat= $("<a class= 'seatchosen set list-group-item list-group-item-action "+seats[i].cabin+"' id='seat' seat_id='"
                    + seats[i].id + " seat='"+format_seat+"'>Seat: " + format_seat+"</a>");
                if(seats[i].is_window){
                    this_seat.addClass("window");
                }
                if(seats[i].is_aisle ){
                    this_seat.addClass("aisle");
                }
                if(seats[i].is_exit){
                    this_seat.addClass("exit")
                }
                seatlist.append(this_seat);

            }
        }
    });
    seat_list.append(seatlist);
};

let build_ticket_interface = function(seat) {
    let body = $('.body');

    body.empty();
    body.append("<nav class=\"navbar navbar-inverse\">\n" +
        "  <div class=\"container-fluid\">\n" +
        "    <div class=\"navbar-header\">\n" +
        "      <a class=\"navbar-brand\" href=\"#\">Furry Carnival</a>\n" +
        "    </div>\n" +
        "    <ul class=\"nav navbar-nav\" id='tabbar'>\n" +
        "      <li class=\"active\" id='gohome'><a href=\"#\">Home</a></li>\n" +
        "      <li id='yourtix'><a hfref='#'>Your Tickets</a></li>\n" +
        "    </ul>\n" +
        "    <ul class=\"nav navbar-nav navbar-right\">\n" +
        "      <li><a href=\"#\"><span class=\"glyphicon glyphicon-log-in\"></span> Logout</a></li>\n" +
        "    </ul>\n" +
        "  </div>\n" +
        "</nav>");
    body.append("<div id='pagebody'></div>");
    let pagebody = $('#pagebody');
    pagebody.empty()
    pagebody.append("<div class='d-inline-block ticketselect blk' id='ticketselect'><h2>Book Your Ticket</h2>" +
        "<form><div class='form-group'><label for=\"fname\">First Name</label><br><input id='new_ticket_firstname' type='text'><br></div>" +
        "<div class='form-group'><label for=\"mname\">Middle Name</label><br><input id='new_ticket_middlename' type='text'><br></div>"+
        "<div class='form-group'><label for=\"lname\">Last Name</label><br><input id='new_ticket_lastname' type='text'><br></div>"+
        "<div class='form-group'><label for=\"g\">Age</label><br><input id='new_ticket_age' type='number'><br></div>"+
        "<div class='form-group'><label for=\"genderisntreal\">Gender</label><br><input id='new_ticket_gender' type='text'><br></div></form>"+
        "<button class='btn btn-lg btn-primary' id='make_ticket'>Create</button></div>");

    // let ticket_add_div = $(
    //     "<form><div class='form-group'><label for=\"fname\">First Namel</label><input id='new_ticket_firstname' type='text'><br></div>" +
    //     "<div class='form-group'><label for=\"mname\">Middle Name</label><input id='new_ticket_middlename' type='text'><br></div>"+
    //     "<div> Last Name: <input id='new_ticket_lastname' type='text'><br></div>"+
    //     "<div> Age: <input id='new_ticket_age' type='number'><br></div>"+
    //     "<div> Gender: <input id='new_ticket_gender' type='text'></form><br></div>"+
    //     "<button id='make_ticket'>Create</button></div>");
    // // let ticket_add_div = $(
    // //     "<div>First Name: <input id='new_ticket_firstname' type='text'><br></div>" +
    // //     "<div> Middle Name: <input id='new_ticket_middlename' type='text'><br></div>"+
    // //     "<div> Last Name: <input id='new_ticket_lastname' type='text'><br></div>"+
    // //     "<div> Age: <input id='new_ticket_age' type='number'><br></div>"+
    // //     "<div> Gender: <input id='new_ticket_gender' type='text'><br></div>"+
    // //     "<button id='make_ticket'>Create</button></div>");
    //
    // body.append(ticket_add_div);

    $('#make_ticket').on('click', () => {
        let ticket_firstname = $('#new_ticket_firstname').val();
        let ticket_lastname = $('#new_ticket_lastname').val();
        let ticket_middlename = $('#new_ticket_middlename').val();
        let ticket_age = $('#new_ticket_age').val();
        let ticket_gender = $('#new_ticket_gender').val();
        let info_string = date + " " + dep_code+" "+dep_time+" "+arr_code+" "+arr_time+" "+format_seat;

        $.ajax(root_url + "tickets", {
            type: 'POST',
            data: {
                "ticket": {
                    "first_name": ticket_firstname,
                    "middle_name": ticket_middlename,
                    "last_name": ticket_lastname,
                    "age": ticket_age,
                    "gender": ticket_gender,
                    "is_purchased": true,
                    "price_paid": "290.11",
                    "instance_id": this_instance,
                    "seat_id": this_seat,
                    "info": info_string
                }
            },
            xhrFields: {withCredentials: true},
            success: () => {
                build_home();
            }
        })
    });

};


let build_airlines_interface = function() {
    let body = $('body');

    body.empty();

    body.append("<h2>Airlines</h2>");

    let airline_list = $("<ul id='airlines_list'></ul>");
    body.append(airline_list);

    let airline_add_div = $("<div>Name: <input id='new_airline_name' type='text'><br>" +
        "<button id='make_airline'>BOOK</button></div>");

    body.append(airline_add_div);

    $.ajax(root_url + "airlines",
        {
            type: 'GET',
            xhrFields: {withCredentials: true},
            success: (airlines) => {
                for (let i=0; i<airlines.length; i++) {
                    airline_list.append("<li>" + airlines[i].name + "</li>");
                }
            }
        });

    $('#make_airline').on('click', () => {
        let airline_name = $('#new_airline_name').val();

        $.ajax(root_url + "airlines",
            {
                type: 'POST',
                data: {
                    airline: {
                        name: airline_name
                    }
                },
                xhrFields: {withCredentials: true},
                success: (airline) => {
                    airline_list.append("<li>" + airline.name + "</li>");
                }
            });
    });

};