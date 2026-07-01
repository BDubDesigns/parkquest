"use client";

import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Link from "next/link";
import type { ParkInfo } from "@/lib/parks";

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
}

export default function ParkMap({ parks, stampedParkSlugs }: Props) {
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
        className="h-[600px] w-full rounded-lg"
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        {parks.map((park) => {
          const isStamped = stampedSet?.has(park.slug) ?? false;
          const signedIn = stampedParkSlugs !== null;

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
                    className="font-semibold text-slate-900 underline underline-offset-2 hover:text-slate-600"
                  >
                    {park.name}
                  </Link>
                  <p className="mt-0.5 text-slate-500">{park.regionName}</p>
                  <p className="text-slate-400">
                    {park.amenities.length}{" "}
                    {park.amenities.length === 1 ? "amenity" : "amenities"}
                  </p>
                  {signedIn && (
                    <p
                      className={
                        isStamped
                          ? "mt-1 font-medium text-green-600"
                          : "mt-1 text-slate-400"
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
