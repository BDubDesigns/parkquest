/**
 * Bellingham park amenity links
 *
 * Only amenities that can be verified from the City of Bellingham Parks Guide
 * (https://cob.org/services/recreation/parks-trails/parks-guide) or individual
 * park pages are included as `verified`.
 *
 * The COB Parks Guide tracks these categories:
 *   Trails, Play Equipment, Drinking Fountain, Water Access, Spray Park,
 *   Picnic Tables, Shelter / Pavilion, Shared Restrooms, Parking,
 *   Dog Exercise Area, Tennis Courts, Pickleball, Disc Golf,
 *   Basketball Court, Sports Fields
 *
 * Mapping to our amenity types:
 *   Play Equipment → playground
 *   Trails → trail
 *   Water Access → waterfront (approximate)
 *   Spray Park → spray-park
 *   Shared Restrooms → restroom
 *   Picnic Tables → picnic-table
 *   Sports Fields → sports-field
 *   Basketball Court → basketball-court
 *   Tennis Courts → tennis-court
 *   Pickleball → pickleball-court
 *   Dog Exercise Area → dog-park
 *
 * Amenity types not tracked by the COB guide (slides, swings, water-feature,
 * beach, viewpoint, garden) are NOT marked as verified in this pass.
 * They may be added in a future verification pass.
 *
 * Parks without amenity links listed need future verification.
 */

export interface ParkAmenityLink {
  parkSlug: string;
  verifiedAmenitySlugs: string[];
  sourceType: "official" | "osm" | "manual";
}

export const bellinghamParkAmenityLinks: ParkAmenityLink[] = [
  {
    parkSlug: "bloedel-donovan",
    sourceType: "official",
    verifiedAmenitySlugs: [
      "playground",
      "restroom",
      "picnic-table",
      "sports-field",
    ],
  },
  {
    parkSlug: "boulevard-park",
    sourceType: "official",
    verifiedAmenitySlugs: [
      "waterfront",
      "trail",
      "playground",
      "restroom",
      "picnic-table",
    ],
  },
  {
    parkSlug: "broadway-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["playground", "sports-field"],
  },
  {
    parkSlug: "civic-athletic-complex",
    sourceType: "official",
    verifiedAmenitySlugs: [
      "sports-field",
      "tennis-court",
      "basketball-court",
      "pickleball-court",
    ],
  },
  {
    parkSlug: "cordata-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["playground", "trail"],
  },
  {
    parkSlug: "cornwall-park",
    sourceType: "official",
    verifiedAmenitySlugs: [
      "playground",
      "trail",
      "restroom",
      "picnic-table",
      "sports-field",
      "tennis-court",
      "basketball-court",
    ],
  },
  {
    parkSlug: "elizabeth-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["playground", "restroom"],
  },
  {
    parkSlug: "fairhaven-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["playground", "trail", "restroom", "picnic-table"],
  },
  {
    parkSlug: "harriet-spanel-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["playground", "sports-field"],
  },
  {
    parkSlug: "lake-padden",
    sourceType: "official",
    verifiedAmenitySlugs: [
      "playground",
      "trail",
      "restroom",
      "picnic-table",
      "sports-field",
      "dog-park",
    ],
  },
  {
    parkSlug: "little-squalicum",
    sourceType: "official",
    verifiedAmenitySlugs: ["waterfront", "trail", "restroom", "picnic-table"],
  },
  {
    parkSlug: "maritime-heritage",
    sourceType: "official",
    verifiedAmenitySlugs: ["waterfront", "restroom", "picnic-table"],
  },
  {
    parkSlug: "memorial-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["playground", "sports-field"],
  },
  {
    parkSlug: "squalicum-creek-park",
    sourceType: "official",
    verifiedAmenitySlugs: [
      "playground",
      "trail",
      "spray-park",
      "restroom",
      "picnic-table",
      "sports-field",
    ],
  },
  {
    parkSlug: "sehome-hill-arboretum",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail"],
  },
  {
    parkSlug: "whatcom-falls-park",
    sourceType: "official",
    verifiedAmenitySlugs: [
      "waterfront",
      "trail",
      "playground",
      "restroom",
      "picnic-table",
    ],
  },
  {
    parkSlug: "waypoint-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["waterfront", "playground", "restroom"],
  },
  {
    parkSlug: "big-rock-garden",
    sourceType: "manual",
    verifiedAmenitySlugs: ["garden", "viewpoint"],
  },
  {
    parkSlug: "bloedel-donovan",
    sourceType: "manual",
    verifiedAmenitySlugs: ["beach"],
  },
  {
    parkSlug: "lake-padden",
    sourceType: "manual",
    verifiedAmenitySlugs: ["beach"],
  },
];
