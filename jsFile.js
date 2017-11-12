mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyeWFiYzQ5IiwiYSI6ImNqOXdoMjZxMzd0YzMzM3M0dWx4bTc3YnIifQ.Jbm1O-jhdifdOac6oNtfjA';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-72.5665458, 42.2548586], // starting position
    zoom: 15 // starting zoom
});

var geojson = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "message": "Foo",
                "iconSize": [60, 60]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.5665458,
                    -42.2548586
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "message": "Bar",
                "iconSize": [50, 50]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -61.2158203125,
                    -15.97189158092897
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "message": "Baz",
                "iconSize": [40, 40]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -63.29223632812499,
                    -18.28151823530889
                ]
            }
        }
    ]
};

map.on('load', function() {
    map.loadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/400px-Cat_silhouette.svg.png', function(error, image) {
        if (error) throw error;
        map.addImage('cat', image);
        map.addLayer({
            "id": "points",
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [-72.5665458, -42.2548586]
                        }
                    }]
                }
            },
            "layout": {
                "icon-image": "cat",
                "icon-size": 0.25
            }
        });
    });
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
