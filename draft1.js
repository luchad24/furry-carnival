
let root_url = "http://comp426.cs.unc.edu:3001/";

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
    let this_departure = '';
    let this_arrival = '';
    let this_time = '';

    $(document).on('click', '.delete', function(){
        let ticket_id  = $(this).attr('ticket_id');
        $.ajax(root_url+"tickets/"+ticket_id,{
            type: 'DELETE',
            xhrFields: {withCredentials: true},
            success: () =>{
                build_home();
            }
        })
    });
    $(document).on('click', '.book', function(){
        build_departure();
    });
    $(document).on('click', '.departure', function() {
        this_departure = $(this).attr('depart_id');
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

        let button = $("#bookbutton");
        button.addClass("disabled");
        button.removeClass("active");
        $('.arrival').removeClass('active');
        $(this).addClass('active');
        console.log(this_arrival);
        build_time(this_departure, this_arrival);
    });

    $(document).on('click', '.time', function() {
        this_time = $(this).attr;
        let flight = $(this).attr('flight');
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
    $(document).on('click', '#seat', function() {
        let seat = $(this).attr('seat_id');
        console.log("seat"+seat);
        $('.seated-button').empty();
        $('.seated-button').append("<button class ='seated' seat_id ='" + seat+ "'>BOOK NOW</button>");
    });

    $(document).on('click', '.seated', function(){
        let seat = $(this).attr('seat_id');
        build_ticket_interface(seat);
    });

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
    // Search stuff
    // $(document).on('keyup','#dep_search', function () {
    //     $(".noresults").remove();
    //     let departures = $('.departure');
    //     let query = $(this).val().toUpperCase();
    //     if(query.length > 0){
    //         let matched = departures.filter(function () {
    //             return $(this).text().toUpperCase().includes(query);
    //         }).show();
    //         let unmatched = departures.filter(function () {
    //             return !$(this).text().toUpperCase().includes(query);
    //         }).hide();
    //         if (matched.length === 0){
    //            // $(".departure-list").append("<a class=\'noresults list-group-item list-group-item-action\'>No results</a>");
    //         }
    //
    //     }else{
    //         departures.each().show();
    //     }
    // });
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

});

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
        "      <li><a href=\"#\"><span class=\"glyphicon glyphicon-log-in\"></span> Logout</a></li>\n" +
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
    pagebody.append("<h2>Tickets Already Booked</h2>");
    let ticket_list = $("<ul id='ticket_list'></ul>");
    pagebody.append(ticket_list);
    $.ajax(root_url + "tickets",
        {
            type: 'GET',
            xhrFields: {withCredentials: true},
            success: (tickets) => {
                for (let i=0; i<tickets.length; i++) {
                    ticket_list.append("<li>" + tickets[i].first_name +" " +tickets[i].last_name+"</li><button " +
                        "class='delete' id='"+tickets[i].id+"'>Cancel Ticket</button>");
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
                                "\depart_id='" + airports.id + "' ><span class=\"glyphicon glyphicon-plane\"></span>" + airports.name + "</a>");
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
                                "depart_id='"+departure+"'arrive_id='" + airports.id + "' ><span class=\"glyphicon " +
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
                let raw_depart = flights[i].departs_at;
                // let dep_date = raw_depart.split("T")[0];
                // let dep_year = dep_date.split('-')[0]
                // let dep_day = dep_date.split("-")[1];
                // let dep_month = dep_date.split("-")[2];

                let dep_time = raw_depart.split("T")[1];

                time_list.append("<a class='time list-group-item list-group-item-action' flight ='"+flights[i].id+"'" +
                    "><span class=\"glyphicon glyphicon-calendar\"></span>" +
                    "Departs at: " + dep_time + " Arrives at: "+ flights[i].arrives_at+
                    "</a>")
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
    body.append("<h1>Pick A Seat</h1>");
    body.append("<div id='pagebody'></div>");
    let pagebody = $('#pagebody');
    pagebody.append("<div class='d-inline-block seats blk'><h2>Available Seats</h2>" +
        // "<!-- Search form -->\n" +
        // "<input id='dep_search' class=\'form-control\' type=\'text\' placeholder=\'Search\' aria-label=\'Search\'>" +
        "<div class='searchlist seats-list'></div></div>" +

        "<div class='seated-button'></div>");

    let seat_list= $(".seats-list");
    let seatlist= $("<ul id='search_list'></ul>");


    $.ajax(root_url+'seats?filter[plane_id]='+14373, {
        type: 'GET',
        xhrFields: {withCredentials: true},
        success: (seats) => {
            for (let i = 0; i < seats.length; i++) {
                let this_seat= $("<a href='#'class= 'time list-group-item list-group-item-action "+seats[i].cabin+"' id='seat' seat_id='"
                    + seats[i].id + "' class=''>Seat:" + seats[i].row + seats[i].number +"</a>");
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
    let body = $('body');

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
    body.append("<h2>Book Your Ticket</h2>")


    let ticket_add_div = $("<div>First Name: <input id='new_ticket_firstname' type='text'><br></div>" +
        "<div> Middle Name: <input id='new_ticket_middlename' type='text'><br></div>"+
        "<div> Last Name: <input id='new_ticket_lastname' type='text'><br></div>"+
        "<div> Age: <input id='new_ticket_age' type='number'><br></div>"+
        "<div> Gender: <input id='new_ticket_gender' type='text'><br></div>"+
        "<button id='make_ticket'>Create</button>");

    body.append(ticket_add_div);

    $('#make_ticket').on('click', () => {
        let ticket_firstname = $('#new_ticket_firstname').val();
        let ticket_lastname = $('#new_ticket_lastname').val();
        let ticket_middlename = $('#new_ticket_middlename').val();
        let ticket_age = $('#new_ticket_age').val();
        let ticket_gender = $('#new_ticket_gender').val();

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
                    "instance_id": 8,
                    "seat_id": seat
                }
            },
            xhrFields: {withCredentials: true},
            success: () => {
                build_home();
            }
        })
    });

}


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