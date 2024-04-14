// document.addEventListener("DOMContentLoaded", function() {
//   const getLocationBtn = document.getElementById("getLocationBtn");
//   const locationInfo = document.getElementById("locationInfo");

//   getLocationBtn.addEventListener("click", function() {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(function(position) {
//         const latitude = position.coords.latitude;
//         const longitude = position.coords.longitude;
//         const coordinates = `${latitude}, ${longitude}`;
//         locationInfo.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;

//         // Send coordinates to server using fetch or XMLHttpRequest
//         fetch('/installation', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ coordinates: coordinates })
//         })
//         .then(response => {
//           if (response.ok) {
//             // Redirect to the install page after successfully sending coordinates
//             window.location.href = '/install';
//           } else {
//             throw new Error('Network response was not ok.');
//           }
//         })
//         .catch(error => {
//           console.error('Error sending coordinates to server:', error.message);
//         });
        
//       }, function(error) {
//         console.error("Error getting location:", error.message);
//       });
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   });
// });
// document.addEventListener("DOMContentLoaded", function() {
//   const getLocationBtn = document.getElementById("getLocationBtn");
//   const locationInfo = document.getElementById("locationInfo");

//   getLocationBtn.addEventListener("click", function() {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(function(position) {
//         const latitude = position.coords.latitude;
//         const longitude = position.coords.longitude;
//         const coordinates = `${latitude}, ${longitude}`;
//         locationInfo.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
        
//         // Send coordinates to server using fetch or XMLHttpRequest
//         fetch('/installation', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ coordinates: coordinates })
//         })
//         .then(response => {
//           if (response.ok) {
//             return response.json();
//           }
//           throw new Error('Network response was not ok.');
//         })
//         .then(data => {
//           console.log('Server response:', data);

//         })
//         .catch(error => {
//           console.error('Error sending coordinates to server:', error.message);
//         });
        
//       }, function(error) {
//         console.error("Error getting location:", error.message);
//       });
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   });
// });
document.addEventListener("DOMContentLoaded", function() {
  const getLocationBtn = document.getElementById("getLocationBtn");
  const locationInfo = document.getElementById("locationInfo");

  getLocationBtn.addEventListener("click", function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const coordinates = `${latitude}, ${longitude}`;
        locationInfo.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
        
        // Send coordinates to server using fetch or XMLHttpRequest
        fetch('/installation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ coordinates: coordinates })
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Network response was not ok.');
        })
        .then(data => {
          console.log('Server response:', data);
          // Redirect to the install page
          window.location.href = '/install'; // Change the URL as needed
        })
        .catch(error => {
          console.error('Error sending coordinates to server:', error.message);
        });
        
      }, function(error) {
        console.error("Error getting location:", error.message);
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  });
});


