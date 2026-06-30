"use client";

import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Link from "next/link";
import type { ParkInfo } from "@/lib/parks";

L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const BELLINGHAM_CENTER: [number, number] = [48.75, -122.48];
const DEFAULT_ZOOM = 13;

export default function ParkMap({ parks }: { parks: ParkInfo[] }) {
  return (
    <MapContainer
      center={BELLINGHAM_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom={false}
      className="h-[600px] w-full rounded-lg"
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      {parks.map((park) => (
        <Marker key={park.slug} position={[park.latitude, park.longitude]}>
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
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
