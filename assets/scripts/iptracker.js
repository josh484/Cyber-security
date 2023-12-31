var terms = false
$(function () {
    getTerms();
    /* On Click Save Terms */
    $('#saveTerms').on('click', function(event) {
        event.preventDefault();
        terms = true;
        localStorage.setItem("terms", JSON.stringify(terms));
        $('#terms').modal('hide');
    });
    /* On Submit Ip Address */
    $('#search-button').on('click', function (event) {
        event.preventDefault();
        $(".map-container").empty();
        if (terms == false) {
            $('#terms').modal('show');
        } else {
            var ip = $('#search-input').val();
            var ipv4 = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
            var iPv6 =  /^((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*::((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*|((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4})){7}$/;

            if (ipv4.test(ip) || iPv6.test(ip)) {
                $('#trueValue').text('');
                getIP(ip);
                ipDetails(ip);
            }
            else {
                $('#trueValue').text('Not a real IP address');
            }
        }
    });
    /* Details Modal Show */
    $('#modalB').on('click', function(event) {
        $('#details').modal('show');
    });
    /* Details Modal Close */
    $('.closeMod').on('click', function(event) {
        $('#details').modal('hide');
    });
    /* Terms Modal Close */
    $('#cMode').on('click', function(event) {
        $('#terms').modal('hide');
    });

});

/* Get detailed information about IP address */
function getIP(ip) {
    const settings = {
        async: true,
        crossDomain: true,
        url: 'https://netdetective.p.rapidapi.com/query?ipaddress=' + ip,
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'e836cf5203msh52715a7d81a978ap1eb4a7jsne7d2dd82308e',
            'X-RapidAPI-Host': 'netdetective.p.rapidapi.com'
        }
    };
    
    $.ajax(settings).done(function (response) {
        $("#info").empty(); 
        /* Loop through response result */
        jQuery.each(response.result, function (title, value) {
            var tr =  $('<tr>');
            var td1 = $('<th>').text(title.substring(2) + ": ");
            var td2 = $('<td>');
            if (value == true) {
                var icon = $('<i>').attr('class', 'fa-solid fa-check');
            } else if (value == false){
                var icon = $('<i>').attr('class', 'fa-solid fa-x');
            } else{
                td1 = $('<th>').text(title);
                td2 = $('<td>').text(value);
            }
            tr.attr('id', 'ipTable');
            td1.attr('id', 'ipTitle');
            td2.attr('id', 'ipValue');
            $(td2).append(icon)
            $(tr).append(td1);
            $(tr).append(td2);
            $("#info").append(tr); 
            return
        });


    });


}


function getTerms() {
    var getTerms = JSON.parse(localStorage.getItem("terms"));
    if (getTerms !== null) {
        terms = getTerms;
    }
}


/* Get Basic details about IP address */
function ipDetails(ip){
    
    const settings = {
        async: true,
        crossDomain: true,
        url: 'https://ip-geolocation-find-ip-location-and-ip-info.p.rapidapi.com/backend/ipinfo/?ip=' + ip,
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'e836cf5203msh52715a7d81a978ap1eb4a7jsne7d2dd82308e',
            'X-RapidAPI-Host': 'ip-geolocation-find-ip-location-and-ip-info.p.rapidapi.com'
        }
    };
    
    $.ajax(settings).done(function (response) {
        /* Get details from response and output to page */
        $('#isp').text(response.org);
        $('#country').text(response.country_name);
        $('#region').text(response.region);
        $('#regCode').text(response.postal);
        $('#host').text(response.hostname);
        $('#city').text(response.city);
        
        /* Get Longitude and Latitude from Response */
        var lan = response.latitude;
        var lon = response.longitude;
        /* Output as Google map */
        var map = "https://maps.googleapis.com/maps/api/staticmap?center="+ lan +","+ lon +"&zoom=12&size=300x300&key=AIzaSyCOQkNEyO14HP3c0qqf-C8_SI8pIX3nNN8"
    
        var mapImg = $("<img>").attr('src', map)
        mapImg.attr('id', 'gmap')
        $(".map-container").append(mapImg);  
    });
    
}

