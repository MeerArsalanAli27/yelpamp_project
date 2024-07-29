mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center:campid.geometry.coordinates, // starting position [lng, lat]
 zoom: 9, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl()); 
new mapboxgl.Marker()
  .setLngLat(campid.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(
        `<h3>${campid.title}</h3><p>${campid.location}</p>`
    )
  
  )

  .addTo(map)