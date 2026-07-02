"use client";

import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Link from "next/link";
import type { ParkInfo } from "@/lib/parks";
import { linkPrimary, mutedText } from "@/components/ui/styles";

const defaultIcon = new L.Icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const stampedIcon = new L.Icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "leaflet-marker-stamped",
});

const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const BELLINGHAM_CENTER: [number, number] = [48.75, -122.48];
const DEFAULT_ZOOM = 13;

interface Props {
  parks: ParkInfo[];
  stampedParkSlugs: string[] | null;
  parkNicknames: Record<string, string | null>;
}

export default function ParkMap({
  parks,
  stampedParkSlugs,
  parkNicknames,
}: Props) {
  const stampedSet = stampedParkSlugs ? new Set(stampedParkSlugs) : null;

  return (
    <>
      <style>{`
        img.leaflet-marker-icon.leaflet-marker-stamped {
          filter: hue-rotate(270deg) saturate(1.5);
        }
      `}</style>

      <MapContainer
        center={BELLINGHAM_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={false}
        className="h-[calc(100dvh-13rem)] min-h-88 max-h-[600px] w-full rounded-lg"
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        {parks.map((park) => {
          const isStamped = stampedSet?.has(park.slug) ?? false;
          const signedIn = stampedParkSlugs !== null;
          const nickname = parkNicknames[park.slug] ?? null;

          return (
            <Marker
              key={park.slug}
              position={[park.latitude, park.longitude]}
              icon={isStamped ? stampedIcon : defaultIcon}
            >
              <Popup>
                <div className="text-sm">
                  <Link
                    href={`/parks/${park.slug}`}
                    className={`font-semibold ${linkPrimary}`}
                  >
                    {nickname ?? park.name}
                  </Link>
                  {nickname ? (
                    <p className={`mt-0.5 ${mutedText}`}>
                      Official: {park.name} &middot; {park.regionName}
                    </p>
                  ) : (
                    <p className={`mt-0.5 ${mutedText}`}>{park.regionName}</p>
                  )}
                  <p className={mutedText}>
                    {park.amenities.length}{" "}
                    {park.amenities.length === 1 ? "amenity" : "amenities"}
                  </p>
                  {signedIn && (
                    <p
                      className={
                        isStamped
                          ? "mt-1 font-medium text-amber-300"
                          : "mt-1 text-stone-500/60"
                      }
                    >
                      {isStamped ? "Stamped" : "Not stamped yet"}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
}
