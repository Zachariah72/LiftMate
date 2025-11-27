import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import { useEffect, useState } from 'react';
import { Button, Typography, Box, Chip } from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';

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

const MapView = ({ pickup, dropoff, routes, selectedRouteIndex, center, markers, onSpeakInstructions, fullScreen = false }) => {
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

  // Custom icons with modern design
  const riderIcon = new L.divIcon({
    html: '<div style="background-color: #2196F3; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"><span style="color: white; font-size: 16px;">👤</span></div>',
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  const driverIcon = new L.divIcon({
    html: '<div style="background-color: #4CAF50; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"><span style="color: white; font-size: 18px;">🚗</span></div>',
    className: 'custom-marker',
    iconSize: [35, 35],
    iconAnchor: [17, 17]
  });

  const rideIcon = new L.divIcon({
    html: '<div style="background-color: #FF5722; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"><span style="color: white; font-size: 16px;">📍</span></div>',
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  const acceptedIcon = new L.divIcon({
    html: '<div style="background-color: #FF9800; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"><span style="color: white; font-size: 16px;">✅</span></div>',
    className: 'custom-marker',
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });

  if (fullScreen) {
    return (
      <MapContainer
        center={center || pickup || defaultPosition}
        zoom={13}
        style={{ height: '100vh', width: '100vw' }}
        zoomControl={true}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.arcgis.com/">Esri</a>'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Terrain">
            <TileLayer
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {pickup && (
          <Marker position={pickup} icon={riderIcon}>
            <Popup>
              <Box sx={{ p: 1 }}>
                <Typography variant="h6">📍 Pickup Location</Typography>
                <Typography variant="body2">Passenger waiting here</Typography>
              </Box>
            </Popup>
          </Marker>
        )}
        {dropoff && (
          <Marker position={dropoff} icon={rideIcon}>
            <Popup>
              <Box sx={{ p: 1 }}>
                <Typography variant="h6">🎯 Dropoff Location</Typography>
                <Typography variant="body2">Destination</Typography>
              </Box>
            </Popup>
          </Marker>
        )}
        {pickup && dropoff && <Routing />}
      </MapContainer>
    );
  }

  return (
    <Box sx={{ mt: 3, position: 'relative', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
      <MapContainer
        center={center || pickup || defaultPosition}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
        zoomControl={true}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.arcgis.com/">Esri</a>'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Terrain">
            <TileLayer
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
            />
          </LayersControl.BaseLayer>
        </LayersControl>

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
                <Popup>
                  <Box sx={{ minWidth: 200, p: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                      {marker.icon === 'ride' ? '🚕 New Ride Request' :
                       marker.icon === 'accepted' ? '✅ Accepted Ride' :
                       marker.icon === 'rider' ? '👤 Rider' : '🚗 Driver'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {marker.title}
                    </Typography>
                    {marker.icon === 'ride' && marker.rideData && (
                      <Box sx={{ mt: 2 }}>
                        <Chip
                          label={`KES ${marker.rideData.fare}`}
                          color="primary"
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          📍 {marker.rideData.pickupLocation}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          🎯 {marker.rideData.dropoffLocation}
                        </Typography>
                        {marker.onAccept && (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => marker.onAccept(marker.rideData)}
                            sx={{ mr: 1 }}
                          >
                            Accept Ride
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {}}
                        >
                          View Details
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Popup>
              </Marker>
            );
          })
        ) : (
          <>
            {pickup && (
              <Marker position={pickup} icon={riderIcon}>
                <Popup>
                  <Box sx={{ p: 1 }}>
                    <Typography variant="h6">📍 Pickup Location</Typography>
                    <Typography variant="body2">Passenger waiting here</Typography>
                  </Box>
                </Popup>
              </Marker>
            )}
            {dropoff && (
              <Marker position={dropoff} icon={rideIcon}>
                <Popup>
                  <Box sx={{ p: 1 }}>
                    <Typography variant="h6">🎯 Dropoff Location</Typography>
                    <Typography variant="body2">Destination</Typography>
                  </Box>
                </Popup>
              </Marker>
            )}
            {pickup && dropoff && <Routing />}
          </>
        )}
      </MapContainer>

      {/* Modern control panel */}
      <Box sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        <Box sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 2,
          p: 1,
          boxShadow: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <LocationOnIcon sx={{ color: '#1976d2' }} />
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Live Map
          </Typography>
        </Box>

        {eta && (
          <Box sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
            p: 1,
            boxShadow: 2
          }}>
            <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
              ⏱️ ETA: {eta} min
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MapView;
