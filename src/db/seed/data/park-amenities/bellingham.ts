/**
 * Bellingham park amenity links
 *
 * Only amenities verified from official City of Bellingham Parks Guide table
 * icons (https://cob.org/services/recreation/parks-trails/parks-guide).
 *
 * Official COB categories currently mapped into ParkQuest amenities:
 *   Trails -> trail
 *   Play Equipment -> playground
 *   Picnic Tables -> picnic-table
 *
 * Categories intentionally NOT mapped (no matching ParkQuest amenity type):
 *   Drinking Fountain, Shelter / Pavilion, Parking, Disc Golf
 *
 * Amenity types NOT marked as verified (no official COB category for them):
 *   slides, swings, water-feature, beach, spray-park, restroom, waterfront,
 *   dog-park, tennis-court, pickleball-court, basketball-court, sports-field
 *
 * Parks omitted below have no official COB table icon that maps to a
 * ParkQuest amenity type.
 */

export interface ParkAmenityLink {
  parkSlug: string;
  verifiedAmenitySlugs: string[];
  sourceType: "official";
}

export const bellinghamParkAmenityLinks: ParkAmenityLink[] = [
  {
    parkSlug: "arroyo-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail", "picnic-table"],
  },
  {
    parkSlug: "big-rock-garden",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail"],
  },
  {
    parkSlug: "birchwood-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail", "playground", "picnic-table"],
  },
  {
    parkSlug: "bloedel-donovan",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail", "playground", "picnic-table"],
  },
  {
    parkSlug: "boulevard-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail", "playground", "picnic-table"],
  },
  {
    parkSlug: "broadway-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["playground", "picnic-table"],
  },
  {
    parkSlug: "carl-lobe-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["playground"],
  },
  {
    parkSlug: "civic-athletic-complex",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail", "playground", "picnic-table"],
  },
  {
    parkSlug: "cordata-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail", "playground", "picnic-table"],
  },
  {
    parkSlug: "cornwall-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail", "playground", "picnic-table"],
  },
  {
    parkSlug: "cornwall-tot-lot",
    sourceType: "official",
    verifiedAmenitySlugs: ["playground"],
  },
  {
    parkSlug: "elizabeth-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail", "playground", "picnic-table"],
  },
  {
    parkSlug: "euclid-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail"],
  },
  {
    parkSlug: "fairhaven-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail", "playground", "picnic-table"],
  },
  {
    parkSlug: "forest-and-cedar-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["playground", "picnic-table"],
  },
  {
    parkSlug: "fouts-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["playground", "picnic-table"],
  },
  {
    parkSlug: "galbraith-mountain",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail"],
  },
  {
    parkSlug: "happy-valley-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail", "playground", "picnic-table"],
  },
  {
    parkSlug: "harriet-spanel-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["playground", "picnic-table"],
  },
  {
    parkSlug: "highland-heights-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["playground"],
  },
  {
    parkSlug: "julianna-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail", "picnic-table"],
  },
  {
    parkSlug: "lake-padden",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail", "playground", "picnic-table"],
  },
  {
    parkSlug: "laurel-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["playground", "picnic-table"],
  },
  {
    parkSlug: "lee-memorial-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["picnic-table"],
  },
  {
    parkSlug: "little-squalicum",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail"],
  },
  {
    parkSlug: "lorraine-ellis-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["playground"],
  },
  {
    parkSlug: "maritime-heritage",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail", "playground", "picnic-table"],
  },
  {
    parkSlug: "memorial-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail", "picnic-table"],
  },
  {
    parkSlug: "northridge-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail"],
  },
  {
    parkSlug: "ridgemont-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["playground", "picnic-table"],
  },
  {
    parkSlug: "rock-hill-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["playground"],
  },
  {
    parkSlug: "roosevelt-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail", "playground", "picnic-table"],
  },
  {
    parkSlug: "scramble-nature-playpark",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail", "playground", "picnic-table"],
  },
  {
    parkSlug: "sehome-hill-arboretum",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail"],
  },
  {
    parkSlug: "shuksan-meadows-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["playground"],
  },
  {
    parkSlug: "squalicum-creek-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail", "picnic-table"],
  },
  {
    parkSlug: "st-clair-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail", "playground", "picnic-table"],
  },
  {
    parkSlug: "sunnyland-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["playground", "picnic-table"],
  },
  {
    parkSlug: "sunset-pond",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail", "picnic-table"],
  },
  {
    parkSlug: "whatcom-falls-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail", "playground", "picnic-table"],
  },
  {
    parkSlug: "waypoint-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["playground", "picnic-table"],
  },
  {
    parkSlug: "woodstock-farm",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail"],
  },
  {
    parkSlug: "storybrook-park",
    sourceType: "official",
    verifiedAmenitySlugs: ["trail", "playground", "picnic-table"],
  },
];
