"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import type { BusinessWithProducts } from "@/lib/types";

type BusinessMapProps = {
  businesses: BusinessWithProducts[];
};

export function BusinessMap({ businesses }: BusinessMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    mapboxgl.accessToken = token;
    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [3.3792, 6.5244],
      zoom: 10.5
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const markers = businesses.map((business) => {
      const popup = new mapboxgl.Popup({ offset: 20 }).setHTML(
        `<strong>${business.name}</strong><br/>${business.market ?? business.street ?? business.city}<br/>${business.products.length} products`
      );

      return new mapboxgl.Marker({ color: business.verified ? "#146c43" : "#b75d32" })
        .setLngLat([business.longitude, business.latitude])
        .setPopup(popup)
        .addTo(map);
    });

    if (businesses.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      businesses.forEach((business) => bounds.extend([business.longitude, business.latitude]));
      map.fitBounds(bounds, { padding: 60, maxZoom: 13 });
    }

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [businesses]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded border border-dashed border-stone-300 bg-white p-6 text-center text-sm text-stone-600">
        Add NEXT_PUBLIC_MAPBOX_TOKEN to enable the store map.
      </div>
    );
  }

  return <div ref={containerRef} className="min-h-[420px] overflow-hidden rounded border border-stone-200" />;
}
