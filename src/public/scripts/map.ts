declare const mapToken: any;
declare const coordinates: any ;
declare const stay_title: string ;
declare const stay_location: string ;

let staysData: any;

const getStaysData = async () =>{
    try {
      let response = await fetch(`/stays/data`);
      staysData = await response.json();
    } catch(e:any){
      console.log(e.message)
    }
  }

mapboxgl.accessToken = mapToken;
const nav = new mapboxgl.NavigationControl();

if(typeof coordinates !== 'undefined') {
    let lnglat = coordinates.split(',')
    const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', 
    center: new mapboxgl.LngLat(lnglat[0],lnglat[1]), 
    zoom: 10 
    });

    
    map.addControl(nav, 'top-right');

    // create the popup
    const popup = new mapboxgl.Popup({ offset: 30 })
    .setHTML(`<h1>${stay_title}</h1><p>${stay_location}</p>`);

    // Create a default Marker and add it to the map.
    const marker1 = new mapboxgl.Marker()
    .setLngLat(new mapboxgl.LngLat(lnglat[0],lnglat[1]))
    .setPopup(popup) // sets a popup on this marker
    .addTo(map);
}

else {
    const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', 
    center: [-103.5917, 40.6699], 
    zoom: 3
    });

    map.addControl(nav, 'bottom-left');

    getStaysData();

    const source = map.getSource('stays') as mapboxgl.GeoJSONSource;

    map.on('load', () => {
        // Add a new source from our GeoJSON data and
        // set the 'cluster' option to true. GL-JS will
        // add the point_count property to your source data.
        map.addSource('stays', {
        type: 'geojson',
        // Point to GeoJSON data. This example visualizes all M1.0+ stays
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: staysData,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        });
         
        map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'stays',
        filter: ['has', 'point_count'],
        paint: {
        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        'circle-color': [
        'step',
        ['get', 'point_count'],
        '#FED2AA',
        5,
        '#FFBF86',
        10,
        '#FFE699'
        ],
        'circle-radius': [
        'step',
        ['get', 'point_count'],
        30,
        5,
        40,
        10,
        50
        ]
        }
        });
         
        map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'stays',
        filter: ['has', 'point_count'],
        layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
        }
        });
         
        map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'stays',
        filter: ['!', ['has', 'point_count']],
        paint: {
        'circle-color': '#ff8474',
        'circle-radius': 15,
        'circle-stroke-width': 3,
        'circle-stroke-color': '#FFE699'
        }
        });
         
        // inspect a cluster on click
        map.on('click', 'clusters', (e) => {
        const features:any = map.queryRenderedFeatures(e.point, {
        layers: ['clusters']
        });
        
        
        const clusterId = features[0].properties?.cluster_id;

        const geometry = features[0].geometry.coordinates;
        
        source.getClusterExpansionZoom(
        clusterId,
        (err:Error, zoom:number) => {
        if (err) return;
         
        map.easeTo({
        center: geometry,
        zoom: zoom
        });
        }
        );
        });
         
        // When a click event occurs on a feature in
        // the unclustered-point layer, open a popup at
        // the location of the feature, with
        // description HTML from its properties.
        map.on('click', 'unclustered-point', (e:any) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const {mapText} = e.features[0].properties;
         
        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
         
        new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(
        ` ${mapText}`
        )
        .addTo(map);
        });
         
        map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
        });
    });    
}