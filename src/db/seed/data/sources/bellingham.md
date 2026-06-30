# Bellingham Park Seed Data Sources

## Source data extracted: June 30, 2026

### Primary Source: Official City of Bellingham Parks Guide

The authoritative park list comes from the City of Bellingham Parks & Recreation
Department's Parks Guide page:

- **URL:** https://cob.org/services/recreation/parks-trails/parks-guide
- **Access date:** 2026-06-30
- **Total parks listed:** 46

The Parks Guide table includes these amenity categories tracked by the city:
Trails, Play Equipment, Drinking Fountain, Water Access, Spray Park,
Picnic Tables, Shelter/Pavilion, Shared Restrooms, Parking, Dog Exercise Area,
Tennis Courts, Pickleball, Disc Golf, Basketball Court, Sports Fields.

**Only three official amenity icons from the table are mapped to ParkQuest
amenity types:**

- `Trails` → `trail`
- `Play Equipment` → `playground`
- `Picnic Tables` → `picnic-table`

The following official categories have no matching ParkQuest amenity type and
are intentionally not seeded: Drinking Fountain, Shelter / Pavilion, Parking,
Disc Golf.

The following official categories are not seeded in this pass (they may be
added in a future issue if a mapping is defined): Water Access, Spray Park,
Shared Restrooms, Dog Exercise Area, Tennis Courts, Pickleball, Basketball
Court, Sports Fields.

**No manual or observational data** (satellite imagery, general knowledge, OSM
tags, etc.) is used as authority for verified amenity links.

### Coordinate Source

Park coordinates are approximate values derived from OpenStreetMap data and
general knowledge of Bellingham geography. Coordinates are ±100m and should
be refined for production use if precise location is required.

### Attribution

- **OpenStreetMap data:** © OpenStreetMap contributors
  (https://www.openstreetmap.org/copyright). Used under the ODbL license for
  coordinate discovery and cross-checking only. Coordinates are approximate.
- **City of Bellingham:** Official park listing and amenity categories from
  the Parks & Recreation Department (https://cob.org).

### Parks Without Verified Amenity Links

The following parks are seeded with basic info but have no amenity links
because the official COB table exposes no icon that maps to a ParkQuest
amenity type:

- Chuckanut Bay Shorelands
- Depot Market Square
- Fairhaven Village Green

These parks may be revisited in a future issue if additional official pages or
new amenity mappings become available.
