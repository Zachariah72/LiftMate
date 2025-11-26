import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import { useEffect, useState } from 'react';
import ExploreIcon from '@mui/icons-material/Explore';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = ({ pickup, dropoff, routes, selectedRouteIndex, center, markers, onSpeakInstructions }) => {
  const defaultPosition = [-1.2921, 36.8219]; // Nairobi center
  const [eta, setEta] = useState(null);

  const Routing = () => {
    const map = useMap();

    useEffect(() => {
      if (!pickup || !dropoff) return;

      const routingControl = L.Routing.control({
        waypoints: [L.latLng(pickup[0], pickup[1]), L.latLng(dropoff[0], dropoff[1])],
        lineOptions: { styles: [{ color: 'blue', weight: 4 }] },
        routeWhileDragging: false,
        showAlternatives: true,
        altLineOptions: { styles: [{ color: 'green', weight: 3, opacity: 0.5 }] },
        createMarker: (i, wp) => L.marker(wp.latLng), // Default markers
        show: false, // Hide the instructions panel
      }).addTo(map);

      routingControl.on('routesfound', function(e) {
        if (e.routes && e.routes.length > 0) {
          const durationSec = e.routes[0].summary.totalTime; // seconds
          setEta(Math.ceil(durationSec / 60)); // in minutes

          // Speak instructions step by step
          const instructions = e.routes[0].instructions.map(inst => inst.text).join('. ');
          if (onSpeakInstructions) onSpeakInstructions(instructions);
        }
      });

      return () => {
        if (map && routingControl) {
          map.removeControl(routingControl);
        }
      };
    }, [map, pickup, dropoff]);

    return null;
  };

  // Custom icons
  const riderIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const driverIcon = new L.Icon({
    iconUrl: '/images/image-removebg-preview (3).png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
    shadowSize: [41, 41]
  });

  const rideIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const acceptedIcon = new L.Icon({
    iconUrl: '/images/pngtree-car-view-from-above-icon-object-web-design-above-vector-png-image_35563696.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
    shadowSize: [41, 41]
  });

  return (
    <div style={{ marginTop: '20px', position: 'relative' }}>
      <MapContainer
        center={center || pickup || defaultPosition}
        zoom={13}
        style={{ height: '450px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />
        {markers ? (
          markers.map((marker, index) => {
            let icon;
            if (marker.icon === 'rider') icon = riderIcon;
            else if (marker.icon === 'driver') icon = driverIcon;
            else if (marker.icon === 'ride') icon = rideIcon;
            else if (marker.icon === 'accepted') icon = acceptedIcon;
            else icon = L.icon(); // default

            return (
              <Marker
                key={index}
                position={marker.position}
                icon={icon}
                eventHandlers={marker.onClick ? { click: marker.onClick } : {}}
              >
                <Popup>{marker.title}</Popup>
              </Marker>
            );
          })
        ) : (
          <>
            {pickup && <Marker position={pickup}><Popup>Pickup</Popup></Marker>}
            {dropoff && <Marker position={dropoff}><Popup>Dropoff</Popup></Marker>}
            {pickup && dropoff && <Routing />}
          </>
        )}
      </MapContainer>
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000, backgroundColor: 'white', borderRadius: '50%', padding: '5px' }}>
        <ExploreIcon style={{ fontSize: '30px', color: '#333' }} />
      </div>
      {eta && <p>Estimated travel time: {eta} min</p>}
    </div>
  );
};

export default MapView;
