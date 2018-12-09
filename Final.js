
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
                    build_ticket_interface();
                },
                error: (jqxhr, status, error) => {
                    alert(error);
                }
            });
    });
});

var build_ticket_interface = function() {
    let body = $('body');

    body.empty();

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


