import { Rocket } from "lucide-react";

export default function DeliveryBanner() {
  return (
    <>
      <div
        role="region"
        aria-label="Express delivery arrives within three days"
        className="delivery-banner relative h-15 overflow-hidden border-b border-neutral-200 bg-white"
      >
        <div className="delivery-banner-item absolute left-0 top-0 flex h-full items-center gap-2">
          <Rocket className="size-5 text-red-600" strokeWidth={2} />

          <p className="whitespace-nowrap text-sm font-semibold  uppercase tracking-wider">
            <span className="text-red-600">Express delivery</span>
            <span className="text-black"> · Arrives within 3 days</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes delivery-banner-scroll {
          from { transform: translateX(100vw); }
          to   { transform: translateX(-100%); }
        }

        .delivery-banner-item {
          animation: delivery-banner-scroll 15s linear infinite;
          will-change: transform;
        }

        .delivery-banner:hover .delivery-banner-item {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
}
