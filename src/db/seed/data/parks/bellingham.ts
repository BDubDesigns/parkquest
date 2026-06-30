export interface ParkRecord {
  name: string;
  slug: string;
  officialUrl: string;
  description?: string;
  latitude: number;
  longitude: number;
  sourceUrl: string;
  sourceType: "official" | "osm" | "manual";
}

export const bellinghamParkRecords: ParkRecord[] = [
  {
    name: "Arroyo Park",
    slug: "arroyo-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/arroyo-park",
    description:
      "Wooded park with creek access and interurban trail connections.",
    latitude: 48.7102,
    longitude: -122.4741,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Big Rock Garden",
    slug: "big-rock-garden",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/big-rock",
    description: "Sculpture garden and park with international art displays.",
    latitude: 48.7532,
    longitude: -122.4724,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Birchwood Park",
    slug: "birchwood-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/birchwood-park",
    description: "Neighborhood park in the Birchwood area.",
    latitude: 48.7711,
    longitude: -122.4928,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Bloedel Donovan",
    slug: "bloedel-donovan",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/bloedel-donovan-park",
    description:
      "Lake Whatcom park with swimming beach, boat launch, playground, sports fields, and picnic areas.",
    latitude: 48.7558,
    longitude: -122.3969,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Boulevard Park",
    slug: "boulevard-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/boulevard-park",
    description:
      "Waterfront park on Bellingham Bay with a pier, trails, playground, and picnic areas.",
    latitude: 48.7363,
    longitude: -122.4853,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Broadway Park",
    slug: "broadway-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/broadway-park",
    description:
      "Community park with sports fields, playground, and open space.",
    latitude: 48.7541,
    longitude: -122.4629,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Carl Lobe Park",
    slug: "carl-lobe-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/carl-lobe-park",
    description: "Neighborhood park in the Lettered Streets area.",
    latitude: 48.7525,
    longitude: -122.4758,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Chuckanut Bay Shorelands",
    slug: "chuckanut-bay-shorelands",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/chuckanut-bay-shorelands",
    description:
      "Natural shoreline area along Chuckanut Bay with trail access.",
    latitude: 48.6812,
    longitude: -122.4819,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Civic Athletic Complex",
    slug: "civic-athletic-complex",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/civic-athletic-complex",
    description:
      "Sports complex with soccer and baseball fields, tennis courts, and pickleball courts.",
    latitude: 48.7589,
    longitude: -122.4622,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Cordata Park",
    slug: "cordata-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/cordata-park",
    description:
      "Neighborhood park in the Cordata area with playground and open space.",
    latitude: 48.7854,
    longitude: -122.4665,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Cornwall Park",
    slug: "cornwall-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/cornwall-park",
    description:
      "Large community park with playground, tennis courts, basketball courts, sports fields, trails, and picnic areas.",
    latitude: 48.7619,
    longitude: -122.4772,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Cornwall Tot Lot",
    slug: "cornwall-tot-lot",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/cornwall-tot-lot",
    description:
      "Small play area for young children adjacent to Cornwall Park.",
    latitude: 48.7615,
    longitude: -122.4785,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Depot Market Square",
    slug: "depot-market-square",
    officialUrl:
      "https://cob.org/services/recreation/rental-facilities/special-use-facilities/depot-market-square",
    description:
      "Historic market square in Fairhaven hosting the Bellingham Farmers Market.",
    latitude: 48.7185,
    longitude: -122.5048,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Elizabeth Park",
    slug: "elizabeth-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/elizabeth-park",
    description:
      "Waterfront neighborhood park on Bellingham Bay with playground and views.",
    latitude: 48.7521,
    longitude: -122.4909,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Euclid Park",
    slug: "euclid-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/euclid-park",
    description: "Neighborhood park in the Roosevelt area.",
    latitude: 48.7582,
    longitude: -122.4481,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Fairhaven Park",
    slug: "fairhaven-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/fairhaven-park",
    description:
      "Historic park in Fairhaven with playground, trails, and picnic areas.",
    latitude: 48.7189,
    longitude: -122.4985,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Fairhaven Village Green",
    slug: "fairhaven-village-green",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/fairhaven-village-green",
    description:
      "Village green park in the heart of Fairhaven with events and green space.",
    latitude: 48.7191,
    longitude: -122.5033,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Forest & Cedar Park",
    slug: "forest-and-cedar-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/forest-and-cedar-park",
    description: "Small neighborhood park at Forest and Cedar streets.",
    latitude: 48.7543,
    longitude: -122.4658,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Fouts Park",
    slug: "fouts-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/fouts-park",
    description: "Small neighborhood park in the Sunnyland area.",
    latitude: 48.7687,
    longitude: -122.4531,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Galbraith Mountain",
    slug: "galbraith-mountain",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/galbraith-mountain",
    description:
      "Mountain biking and hiking trail network on Galbraith Mountain.",
    latitude: 48.7722,
    longitude: -122.4144,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Happy Valley Park",
    slug: "happy-valley-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/happy-valley-park",
    description: "Neighborhood park in the Happy Valley area.",
    latitude: 48.7045,
    longitude: -122.4915,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Harriet Spanel Park",
    slug: "harriet-spanel-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/harriet-spanel-park",
    description:
      "Community park with playground, sports fields, and picnic areas.",
    latitude: 48.7905,
    longitude: -122.4627,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Highland Heights Park",
    slug: "highland-heights-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/highland-heights-park",
    description: "Neighborhood park in the Highland Heights area.",
    latitude: 48.7198,
    longitude: -122.4642,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Julianna Park",
    slug: "julianna-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/julianna-park",
    description:
      "Community park in the Barkley area with playground and trails.",
    latitude: 48.7692,
    longitude: -122.4425,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Lake Padden",
    slug: "lake-padden",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/lake-padden-park",
    description:
      "Large community park around Lake Padden with hiking trails, golf course, playground, beach, ball fields, and a dog park.",
    latitude: 48.7045,
    longitude: -122.4478,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Laurel Park",
    slug: "laurel-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/laurel-park",
    description: "Small neighborhood park in the Fairhaven area.",
    latitude: 48.7132,
    longitude: -122.5012,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Lee Memorial Park",
    slug: "lee-memorial-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/lee-memorial-park",
    description: "Park along Whatcom Creek with memorial and green space.",
    latitude: 48.7545,
    longitude: -122.4545,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Little Squalicum",
    slug: "little-squalicum",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/little-squalicum-park",
    description:
      "Waterfront park on Bellingham Bay with trails, viewpoints, and restored habitat.",
    latitude: 48.7712,
    longitude: -122.5015,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Lorraine Ellis Park",
    slug: "lorraine-ellis-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/lorraine-ellis-park",
    description: "Neighborhood park in the Puget neighborhood.",
    latitude: 48.7738,
    longitude: -122.4458,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Maritime Heritage",
    slug: "maritime-heritage",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/maritime-heritage-park",
    description:
      "Waterfront park at the mouth of Whatcom Creek with picnic areas and fishing access.",
    latitude: 48.7495,
    longitude: -122.4845,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Memorial Park",
    slug: "memorial-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/memorial-park",
    description:
      "Community park with playground, sports fields, and picnic areas near Bellingham High School.",
    latitude: 48.7365,
    longitude: -122.4755,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Northridge Park",
    slug: "northridge-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/northridge-park",
    description: "Neighborhood park in the Northridge area.",
    latitude: 48.7905,
    longitude: -122.4772,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Ridgemont Park",
    slug: "ridgemont-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/ridgemont-park",
    description: "Neighborhood park in the Puget area.",
    latitude: 48.7772,
    longitude: -122.4408,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Rock Hill Park",
    slug: "rock-hill-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/rock-hill-park-2",
    description: "Neighborhood park on Rock Hill with green space.",
    latitude: 48.7685,
    longitude: -122.4872,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Roosevelt Park",
    slug: "roosevelt-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/roosevelt-park",
    description: "Neighborhood park in the Roosevelt area with playground.",
    latitude: 48.7595,
    longitude: -122.4495,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Scramble Nature Playpark",
    slug: "scramble-nature-playpark",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/scramble-nature-playpark",
    description:
      "Nature-themed playground with natural play elements and climbing structures.",
    latitude: 48.7895,
    longitude: -122.4638,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Sehome Hill Arboretum",
    slug: "sehome-hill-arboretum",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/sehome-arboretum",
    description:
      "Large urban arboretum and trail network on Sehome Hill with viewpoints.",
    latitude: 48.7355,
    longitude: -122.4842,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Shuksan Meadows Park",
    slug: "shuksan-meadows-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/shuksan-meadows",
    description: "Neighborhood park in the Shuksan Meadows area.",
    latitude: 48.7908,
    longitude: -122.4485,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Squalicum Creek Park",
    slug: "squalicum-creek-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/squalicum-creek-park",
    description:
      "Community park with spray park, playground, trails, sports fields, and disc golf.",
    latitude: 48.7735,
    longitude: -122.4628,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "St Clair Park",
    slug: "st-clair-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/st-clair-park",
    description: "Neighborhood park in the Lettered Streets area.",
    latitude: 48.7555,
    longitude: -122.4722,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Sunnyland Park",
    slug: "sunnyland-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/sunnyland-park",
    description: "Neighborhood park in the Sunnyland area with playground.",
    latitude: 48.7688,
    longitude: -122.4558,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Sunset Pond",
    slug: "sunset-pond",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/sunset-pond",
    description: "Small neighborhood park with pond in the Sunset area.",
    latitude: 48.7272,
    longitude: -122.4698,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Whatcom Falls Park",
    slug: "whatcom-falls-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/whatcom-falls-park",
    description:
      "Large park featuring Whatcom Creek waterfalls, hiking trails, playground, picnic areas, and a trout hatchery.",
    latitude: 48.7519,
    longitude: -122.4342,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Waypoint Park",
    slug: "waypoint-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/waypoint-park",
    description:
      "Waterfront park on Bellingham Bay with play areas, water feature, pathways, and art installations.",
    latitude: 48.7415,
    longitude: -122.4825,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Woodstock Farm",
    slug: "woodstock-farm",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/woodstock-farm",
    description: "Historic farmstead and park in the Happy Valley area.",
    latitude: 48.7065,
    longitude: -122.4855,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
  {
    name: "Storybrook Park",
    slug: "storybrook-park",
    officialUrl:
      "https://cob.org/services/recreation/parks-trails/parks-guide/storybrook-park",
    description: "Neighborhood park in the King Mountain area.",
    latitude: 48.7955,
    longitude: -122.4558,
    sourceUrl: "https://cob.org/services/recreation/parks-trails/parks-guide",
    sourceType: "official",
  },
];
