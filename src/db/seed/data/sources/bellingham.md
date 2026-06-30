# Bellingham Park Seed Data Sources

## Source data extracted: June 30, 2026

### Primary Source: Official City of Bellingham Parks Guide

The authoritative park list comes from the City of Bellingham Parks & Recreation
Department's Parks Guide page:

- **URL:** https://cob.org/services/recreation/parks-trails/parks-guide
- **Access date:** 2026-06-30
- **Total parks listed:** 46

The Parks Guide table includes the following amenity categories tracked by the
city: Trails, Play Equipment, Drinking Fountain, Water Access, Spray Park,
Picnic Tables, Shelter/Pavilion, Shared Restrooms, Parking, Dog Exercise Area,
Tennis Courts, Pickleball, Disc Golf, Basketball Court, Sports Fields.

**Only these official amenity columns are used for verified amenity links.**
Amenities not listed in the guide (slides, swings, water-feature, beach,
viewpoint, garden) are not marked as verified in this seed pass, even where
they are commonly known to exist. Visual checkmarks from the Parks Guide table
were extracted via direct HTML parsing and verified against general knowledge
of park amenities.

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

### Parks Needing Further Verification

The following parks have been included in the seed with names, coordinates, and
source URLs, but **amenity links are omitted or incomplete** due to lack of
verifiable official data in this pass:

- Arroyo Park
- Birchwood Park
- Carl Lobe Park
- Chuckanut Bay Shorelands
- Cornwall Tot Lot
- Depot Market Square
- Euclid Park
- Fairhaven Village Green
- Forest & Cedar Park
- Fouts Park
- Galbraith Mountain
- Happy Valley Park
- Highland Heights Park
- Julianna Park
- Laurel Park
- Lee Memorial Park
- Lorraine Ellis Park
- Northridge Park
- Ridgemont Park
- Rock Hill Park
- Roosevelt Park
- Scramble Nature Playpark
- Shuksan Meadows Park
- St Clair Park
- Sunnyland Park
- Sunset Pond
- Woodstock Farm
- Storybrook Park

These parks may still be verified against individual park pages on the City of
Bellingham website or through on-site verification in a future issue.

Additionally, the following amenity types are NOT tracked by the COB Parks
Guide and may need individual park page research or field verification:

- Slides
- Swings
- Water Feature
- Beach (present at Lake Padden and Bloedel Donovan, noted manually)
- Viewpoint (present at Big Rock Garden, noted manually)
- Garden (present at Big Rock Garden, noted manually)
