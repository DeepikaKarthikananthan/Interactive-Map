// API key for OpenCage Geocoding API (replace with your own key)
const apiKey = 'YOUR_OPENCAGE_API_KEY'; // Replace with your OpenCage API key

// Initialize the map and set the view to a general location
const map = L.map('map').setView([20.0, 0.0], 2); // Centered at [20.0, 0.0] to view the whole world

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Variable to store the marker
let currentMarker = null;

// Function to handle map clicks
map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    // If a marker already exists, remove it
    if (currentMarker) {
        map.removeLayer(currentMarker);
    }

    // Add a new marker at the clicked position
    currentMarker = L.marker([lat, lng]).addTo(map);

    // Update the info section with the clicked location details
    document.getElementById('marker-title').textContent = `Location: (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
    document.getElementById('marker-description').textContent = `You clicked at Latitude: ${lat.toFixed(2)} and Longitude: ${lng.toFixed(2)}`;

    // Fetch city details based on latitude and longitude
    fetchCityDetails(lat, lng);
});

// Function to fetch city details using OpenCage Geocoding API
function fetchCityDetails(lat, lng) {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const cityInfo = data.results[0];

            if (cityInfo) {
                const cityName = cityInfo.components.city || cityInfo.components.village || cityInfo.components.town || 'Unknown City';
                const countryName = cityInfo.components.country || 'Unknown Country';
                const countryCode = cityInfo.components.country_code || '';

                const cityDetails = `
                    <h3>City: ${cityName}, ${countryName}</h3>
                    <p>Country Code: ${countryCode}</p>
                    <p>Coordinates: (${lat.toFixed(2)}, ${lng.toFixed(2)})</p>
                    <p>Famous Things: You can visit landmarks and experience culture here!</p>
                    <p>Suggested Activities: Explore the city, visit local museums, try local food!</p>
                `;

                // Display city details
                document.getElementById('city-details').innerHTML = cityDetails;
                document.getElementById('city-details').style.display = 'block'; // Show city details
            } else {
                document.getElementById('city-details').innerHTML = '<p></p>';
                document.getElementById('city-details').style.display = 'block'; // Show no details message
            }
        })
        .catch(error => {
            console.error('Error fetching city details:', error);
            document.getElementById('city-details').innerHTML = '<p>Error fetching city details. Please try again later.</p>';
            document.getElementById('city-details').style.display = 'block';
        });
}
