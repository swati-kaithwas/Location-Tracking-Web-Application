// import React, { useState } from "react";

// const GetLocation = () => {
//   const [location, setLocation] = useState(null);
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [country, setCountry] = useState("");

//   const getLocation = () => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         function (position) {
//           const latitude = position.coords.latitude;
//           const longitude = position.coords.longitude;

//           // Reverse geocoding using the OpenCage Geocoding API
//           const apiKey = "783973cde701418cb9d1438598e9e132";
//           const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

//           fetch(apiUrl)
//             .then((response) => response.json())
//             .then((data) => {
//               if (data.results.length > 0) {
//                 const addressComponents = data.results[0].components;
//                 const city =
//                   addressComponents.city ||
//                   addressComponents.town ||
//                   addressComponents.village ||
//                   "";
//                 const state = addressComponents.state || "";
//                 const country = addressComponents.country || "";

//                 setCity(city);
//                 setState(state);
//                 setCountry(country);

//                 // Send location data to backend
//                 const user_id = localStorage.getItem("user_id");
//                 fetch("http://localhost:3000/users/getuserloacation", {
//                   method: "POST",
//                   headers: {
//                     "Content-Type": "application/json",
//                   },
//                   body: JSON.stringify({
//                     latitude,
//                     longitude,
//                     city,
//                     state,
//                     country,
//                     user_id,
//                   }),
//                 })
//                   .then((response) => response.json())
//                   .then((data) => {
//                     console.log("Location saved successfully:", data);
//                     socket.emit("Loaction", {
//                       user_id,
//                     });
//                   })
//                   .catch((error) => {
//                     console.error("Error saving location:", error);
//                   });
//               } else {
//                 console.error("Unable to retrieve address information.");
//               }
//             })
//             .catch((error) => {
//               console.error("Error retrieving address information:", error);
//             });

//           setLocation({ latitude, longitude });
//         },
//         function (error) {
//           console.error("Error getting current position:", error);
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   };

//   return (
//     <div>
//       <button onClick={getLocation}>Get Current Location</button>
//       {location && (
//         <div>
//           <p>City: {city}</p>
//           <p>State: {state}</p>
//           <p>Country: {country}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GetLocation;

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const socket = io("http://localhost:3000");

const GetLocation = () => {
  const [location, setLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([0, 0]);

  const handleMarkerDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setLocation({ latitude: lat, longitude: lng });
    setMapCenter([lat, lng]);

    const user_id = localStorage.getItem("user_id");
    const apiUrl = "http://localhost:3000/users/getuserloacation";
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude: lat,
        longitude: lng,
        user_id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Location saved successfully:", data);
        socket.emit("Loaction", { user_id });
      })
      .catch((error) => {
        console.error("Error saving location:", error);
      });
  };

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const user_id = localStorage.getItem("user_id");
          socket.emit("Loaction", { user_id });
          setLocation({ latitude, longitude });
          setMapCenter([latitude, longitude]);
        },
        function (error) {
          console.error("Error getting current position:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div>
      <button onClick={getLocation}>Get Current Location</button>
      {location && (
        <div>
          <MapContainer
            center={mapCenter}
            zoom={10}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker
              position={mapCenter}
              draggable={true}
              eventHandlers={{
                dragend: handleMarkerDragEnd,
              }}
            >
              <Popup>Your current location</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default GetLocation;
