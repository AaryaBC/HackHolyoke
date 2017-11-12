import React from 'react'
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'
import Tooltip from './components/tooltip'
import Parse from 'parse'

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
Parse.initialize("campus-safety", "2773625")
Parse.serverURL = "http://campus-safety.herokuapp.com/parse"
var latLonPoints = []

class Application extends React.Component {
  tooltipContainer;

  getData(){
    var Location = Parse.Object.extend("Location");
    var query = new Parse.Query(Location);
    query.find({
      success: function(results) {
        // Do something with the returned Parse.Object values
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          console.log(object.id)
          console.log(object.get('latitude'))
          console.log(object.get('longitude'))
          latLonPoints.push([parseFloat(object.get('longitude')), parseFloat(object.get('latitude'))])
        }
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  }
  
  setTooltip(features) {
    if (features.length) {
      ReactDOM.render(
        React.createElement(
          Tooltip, {
            features
          }
        ),
        this.tooltipContainer
      );
    } else {
      this.tooltipContainer.innerHTML = '';
    }
  }

  componentDidMount() {

    // Container to put React generated content in.
    this.tooltipContainer = document.createElement('div');
    this.getData();

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [-72.5665458, 42.2548586],
      zoom: 15
    });

    const tooltip = new mapboxgl.Marker(this.tooltipContainer, {
      offset: [-120, 0]
    }).setLngLat([0,0]).addTo(map);
    
    map.on('click', (e) => {
      const features = map.queryRenderedFeatures(e.point);
      tooltip.setLngLat(e.lngLat);
      map.getCanvas().style.cursor = features.length ? 'pointer' : '';
      this.setTooltip(features);

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
                            "coordinates": latLonPoints[0]
                        }
                    }]
                }
            },
            "layout": {
                "icon-image": "cat",
                "icon-size": 0.05
            }
        });
      });

    });
  }


  render() {
      return (
        <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
      );
    }
}

ReactDOM.render(<Application />, document.getElementById('app'));
