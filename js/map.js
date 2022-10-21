class LeafletMap
{
    constructor(lat, lng, zoom)
    {
        this.lat = lat
        this.lng = lng
        this.zoom = zoom
        this.map = L.map(document.getElementById('map'),
        {
            center: 
            {
                lat: this.lat,
                lng: this.lng
            },
                zoom: this.zoom,
        });       

        this.map.closePopupOnClick = false;
        this.isAppended = false;
    
        this.displayLayer();
        this.initMarkers();
    }

    displayLayer()
    {
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', 
        {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/light-v10',
            accessToken: 'pk.eyJ1IjoiaXNtYWVsamhyaSIsImEiOiJjazVjYjI0YzAxb3duM3BsajV5NXU4dzYzIn0.IuF8S-Apd2P7yFogtglrqA'
        }).addTo(this.map)
    }

    zoomToStation(e) { this.map.flyTo([e.latlng.lat, e.latlng.lng], 16, { animate: true, duration: 1 }) }

    markerIcon()
    {
        return L.icon({iconUrl: 'images/icons/marker-open-icon.svg', id:'markerIcon'})
    }

    initMarkers()
    {
        this.fetchData().then(data =>
        {
            for (let station of data)
            {
                let stations = [station.position.lat, station.position.lng];                
                let marker = L.marker(stations,{icon:this.markerIcon()}).addTo(this.map);

                marker.on('mouseover', () => 
                {
                    marker.bindTooltip(station.name.substr(7), 
                    {
                    direction: 'top',
                    }).openTooltip().addTo(this.map)
                })

                marker.on('click', (e) =>
                {
                    if (station.available_bikes != 0)
                    {
                        $('#infoForm').fadeIn();

                        $('#successMessage').remove();
                        $('#bookForm').remove();
                        this.zoomToStation(e); 
                        if (document.getElementById("user-info") === null) { booking.displayForm(); }

                        sessionStorage.setItem('station_name',station.name);
                        sessionStorage.setItem('latlng', stations);

                        $('#stationName').html("<h3>" + station.name.substr(7).toLowerCase() + "</h3>");
                        $('#stationAdress').html("<h4>" + station.address.substr(station.name.substr(7).length + 3) + "</h4>");
                        $('#stationPlaces').html("<p>"  + station.bike_stands + " places disponibles </p>");
                        $('#stationAvailability').html("<p>" + "   " + station.available_bikes + " vélos disponibles </p>");
                        $('#stationNumber').html("<strong>" + '<img src="images/icons/marker-open-icon.svg" alt="Marker icon"/>' + "</strong>");

                        marker.bindPopup(station.name.substr(7)).openPopup();
                        L.DomUtil.addClass(marker._icon, "blinking");
                    }
                    else
                    {
                        marker.bindPopup("Aucun vélo n'est disponible à la station " + station.name.substr(7)).openPopup();
                    }
                })
            }
        })
    }
    
    async fetchData()
    {
        try
        {
            let dataURL = 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=28b0fb05678c8dbbccf28ee6cd3b1771fc560c43';
            let response = await fetch(dataURL);

            if (response.ok) { return response.json() }
            else { console.error('Erreur du serveur : ', response.status) }
        }
        catch(e) { console.log(e) }
    }
}