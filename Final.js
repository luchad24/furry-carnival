
var root_url = "http://comp426.cs.unc.edu:3001/";

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
    $(document).on('click', '.departure', function() {
        let departure = $(this).attr('depart_id');
        console.log(departure)
        build_arrival(departure);
    })

    $(document).on('click', '.arrival', function() {
        let arrival = $(this).attr('arrive_id');
        let departure = $(this).attr('depart_id');
        console.log(arrival)
        build_time(departure, arrival);
    })

    $(document).on('click', '.time', function() {
        let flight = $(this).attr('flight');
        console.log(flight)
        build_ticket_interface(flight);
    })
    $(document).on('click', '.back_arrival', function() {
        build_home();
    })
    $(document).on('click', '.back_time', function() {
        let departure = $(this).attr('departure');
        build_arrival(departure);
    })
});

var build_home = function(){
    let body =$('body');
    body.empty();
    body.append("<h1>Depart From?</h1>")
    let departure_list = $("<div id='departure_list'></div>");
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
                            departure_list.append("<button class='departure' depart_id='" + airports.id + "' >" + airports.name + "</button>");

                        }
                    })

                }
            }
        }
    });

}

var build_arrival = function(departure){
    let body = $('body');
    body.empty();
    body.append("<h1>Arrive?</h1>");
    body.append("<button class='back_arrival'><-back</button>")
    let arrival_list = $("<div id='arrival_list'></div>");
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
                            arrival_list.append("<button class='arrival' depart_id='"+departure+"'arrive_id='" + airports.id + "' >" + airports.name + "</button>");

                        }
                    })
                }

            }

        }
    })
}


var build_time = function(departure, arrival) {
    let body = $('body');
    body.empty();
    body.append("<h1>TIME?</h1>");
    body.append("<button class='back_time' departure='"+departure+"'><-back</button>")
    let time_list = $("<div id='time_list'></div>");
    body.append(time_list);

    $.ajax(root_url +"flights?filter[departure_id]="+departure+"&filter[arrival_id]="+arrival, {
        type: 'GET',
        xhrFields: {withCredentials: true},
        success: (flights) => {
            for (let i = 0; i < flights.length; i++) {
                time_list.append("Departs at: " + flights[i].departs_at + " Arrives at: "+ flights[i].arrives_at+
                    "<button class = 'time'  flight ='"+flights[i].id+"'>BOOK NOW</button>")
            }
        }
    })
}

var build_ticket_interface = function(flight) {
    let body = $('body');

    body.empty();

    body.append("<div id='nav'><p id='airlines'>Airlines</p></div>")

    body.append("<h2>Tickets</h2>")

    let ticket_list = $("<ul id='ticket_list'></ul>");
    body.append(ticket_list);


    let ticket_add_div = $("<div>First Name: <input id='new_ticket_firstname' type='text'><br></div>" +
        "<div> Middle Name: <input id='new_ticket_middlename' type='text'><br></div>"+
        "<div> Last Name: <input id='new_ticket_lastname' type='text'><br></div>"+
        "<div> Age: <input id='new_ticket_age' type='number'><br></div>"+
        "<div> Gender: <input id='new_ticket_gender' type='text'><br></div>"+
        "<button id='make_ticket'>Create</button>");

    body.append(ticket_add_div);

    $.ajax(root_url + "tickets",
        {
            type: 'GET',
            xhrFields: {withCredentials: true},
            success: (tickets) => {
                for (let i=0; i<tickets.length; i++) {
                    ticket_list.append("<li>" + tickets[i].first_name +" " +tickets[i].last_name+"</li>");
                }
            }
        });


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
                    "seat_id": 21
                }
            },
            xhrFields: {withCredentials: true},
            success: (tickets) => {
                ticket_list.append("<li>" + tickets.first_name+" "+ tickets.last_name + "</li>");
            }
        })
    });

    $('#airlines').on('click', () =>{
        build_airlines_interface();
    })
}


var build_airlines_interface = function() {
    let body = $('body');

    body.empty();

    body.append("<h2>Airlines</h2>");

    let airline_list = $("<ul id='airlines_list'></ul>");
    body.append(airline_list);

    let airline_add_div = $("<div>Name: <input id='new_airline_name' type='text'><br>" +
        "<button id='make_airline'>Create</button></div>");

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


