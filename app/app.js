// Convert degrees → radians (Math.sin/cos only accept radians)
function toRad(deg) {
  return deg * Math.PI / 180;
}

// Distance between 2 points on Earth, in metres (Haversine formula)
function distanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth's radius in metres

  const dLat = toRad(lat2 - lat1); // latitude difference
  const dLng = toRad(lng2 - lng1); // longitude difference

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // angle at Earth's centre

  return R * c; // angle × radius = arc distance
}

// Pick restaurants that are verified + within maxMeters, sorted nearest first
function findNearby(restaurants, myLat, myLng, maxMeters) {
  return restaurants
    .filter(r => r.halal_status === "verified")               // 1. verified only
    .map(r => ({                                              // 2. add a distance field
      ...r,
      distance: Math.round(distanceMeters(myLat, myLng, r.lat, r.lng))
    }))
    .filter(r => r.distance <= maxMeters)                     // 3. within 1 km only
    .sort((a, b) => a.distance - b.distance);                 // 4. nearest first
}

// ---- Test using node ----
const restaurants = require("./restaurants.json");
const ERICA = { lat: 37.2970, lng: 126.8355 };

console.log(findNearby(restaurants, ERICA.lat, ERICA.lng, 1000));