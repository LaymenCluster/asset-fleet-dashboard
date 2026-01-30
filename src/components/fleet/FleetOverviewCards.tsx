import FleetStatCard from "./FleetStatCard";
import type { HealthFilter } from "../../pages/Dashboard";

type Overview = {
  total: number;
  active: number;
  watch: number;
  degraded: number;
  critical: number;
  unknown: number;
  decommissioned: number;
  registered: number;
};

type Props = {
  data: Overview;
  selected: HealthFilter;
  onSelect: (h: HealthFilter) => void;
  onReload?: () => void;
};

export default function FleetOverviewCards({
  data,
  selected,
  onSelect,
  onReload,
}: Props) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Fleet Overview</h2>

        {onReload && (
          <button
            onClick={onReload}
            className="text-sm px-3 py-1 rounded bg-[#374151] hover:bg-[#4b5563]"
          >
            Reload
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-4">
        <FleetStatCard
          label="Total"
          value={data.total}
          active={selected === null}
          onClick={() => onSelect(null)}
        />
        <FleetStatCard
          label="Active"
          value={data.active}
          accent="green"
          active={selected === "ACTIVE"}
          onClick={() => onSelect("ACTIVE")}
        />
        <FleetStatCard
          label="Watch"
          value={data.watch}
          accent="yellow"
          active={selected === "WATCH"}
          onClick={() => onSelect("WATCH")}
        />
        <FleetStatCard
          label="Degraded"
          value={data.degraded}
          accent="yellow"
          active={selected === "DEGRADED"}
          onClick={() => onSelect("DEGRADED")}
        />
        <FleetStatCard
          label="Critical"
          value={data.critical}
          accent="red"
          active={selected === "CRITICAL"}
          onClick={() => onSelect("CRITICAL")}
        />
        <FleetStatCard
          label="Unknown"
          value={data.unknown}
          accent="gray"
          active={selected === "UNKNOWN"}
          onClick={() => onSelect("UNKNOWN")}
        />
        <FleetStatCard
          label="Decommissioned"
          value={data.decommissioned}
          accent="gray"
          active={selected === "DECOMMISSIONED"}
          onClick={() => onSelect("DECOMMISSIONED")}
        />
        <FleetStatCard
          label="Registered"
          value={data.registered}
          accent="gray"
          active={selected === "REGISTERED"}
          onClick={() => onSelect("REGISTERED")}
        />
      </div>
    </section>
  );
}
