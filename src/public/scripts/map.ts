let stay_title = document.querySelector('.stay-title')! as HTMLDivElement;
let id= stay_title?.dataset.id;

const setSearchPageMap = async () =>{
    try {
      let response = await fetch(`/stays/data`);
      let staysData = await response.json();
      mapboxgl.accessToken = staysData.mapToken;
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11', 
        center: [-103.5917, 40.6699], 
        zoom: 3
        });
    
        map.addControl(nav, 'bottom-left');
    
        map.on('load', () => {
            map.addSource('stays', {
            type: 'geojson',
            data: staysData,
            cluster: true,
            clusterMaxZoom: 14, 
            clusterRadius: 50 
            });
             
            map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'stays',
            filter: ['has', 'point_count'],
            paint: {
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
             
            map.on('click', 'clusters', (e) => {
            const features:any = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
            });
            
            
            const clusterId = features[0].properties?.cluster_id;            
    
            const geometry = features[0].geometry.coordinates;

            const source =  map.getSource('stays') as mapboxgl.GeoJSONSource;

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
             
            map.on('click', 'unclustered-point', (e:any) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const {mapText} = e.features[0].properties;

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
    } catch(e:any){
      console.log(e.message)
    }
}

const setShowPageMap = async () =>{
  try {
    let response = await fetch(`/stays/data/${id}`);
    let stay = await response.json();
    let coordinates = stay.features.geometry.coordinates;
    mapboxgl.accessToken = stay.mapToken;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11', 
      center: new mapboxgl.LngLat(coordinates[0],coordinates[1]), 
      zoom: 10 
      });
  
      
      map.addControl(nav, 'top-right');
  
      // create the popup
      const popup = new mapboxgl.Popup({ offset: 30 })
      .setHTML(`<h1>${stay.features.title}</h1><p>${stay.features.location}</p>`);
  
      // Create a default Marker and add it to the map.
      const marker1 = new mapboxgl.Marker()
      .setLngLat(new mapboxgl.LngLat(coordinates[0],coordinates[1]))
      .setPopup(popup) // sets a popup on this marker
      .addTo(map);
  } catch(e:any){
    console.log(e.message)
  }
}


const nav = new mapboxgl.NavigationControl();

if(typeof id !== 'undefined') {
  setShowPageMap()     
} else {
  setSearchPageMap()    
}