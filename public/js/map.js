// map.js — Uses Leaflet.js (free, no API key required)
// listingLocation and listingTitle are passed from show.ejs

(async function initMap() {
    // Default center (India) — will be overridden by geocoding
    let lat = 20.5937;
    let lng = 78.9629;
    let zoom = 5;

    // Try to geocode the location using free Nominatim API
    try {
        const query = encodeURIComponent(listingLocation);
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
            { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        if (data && data.length > 0) {
            lat = parseFloat(data[0].lat);
            lng = parseFloat(data[0].lon);
            zoom = 12;
        }
    } catch (e) {
        // If geocoding fails, use the default center
        console.log("Geocoding failed, using default location.");
    }

    // Initialize Leaflet map
    const map = L.map("map").setView([lat, lng], zoom);

    // OpenStreetMap tile layer (completely free)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Custom marker icon
    const icon = L.divIcon({
        html: '<div style="background:#FF385C;width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>',
        className: "",
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
    });

    // Add marker with popup
    L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(
            `<strong style="font-family:inherit;font-size:0.9rem;">${listingTitle}</strong><br>
            <span style="font-size:0.8rem;color:#717171;">Exact location shared after booking</span>`,
            { maxWidth: 220 }
        )
        .openPopup();
})();