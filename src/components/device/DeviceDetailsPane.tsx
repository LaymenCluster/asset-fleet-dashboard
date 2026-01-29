import { useEffect, useState } from "react";
import {
  fetchDeviceSummary,
  fetchDeviceHealthHistory,
  fetchDeviceAlerts,
} from "../../api/dashboard";
import Tab from "./Tab";
import AlertsTab from "./AlertsTab";
import SummaryTab from "./SummaryTab";
import HealthTab from "./HealthTab";
import type { HealthHistoryItem } from "../../types/health";
import type { AlertItem } from "../../types/alert";

type Props = {
  deviceId: string;
};

export default function DeviceDetailsPane({ deviceId }: Props) {
  const [summary, setSummary] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "health" | "alerts">(
    "summary",
  );

  const [healthHistory, setHealthHistory] = useState<
    HealthHistoryItem[] | null
  >(null);
  const [alerts, setAlerts] = useState<AlertItem[] | null>(null);

  const [healthLoading, setHealthLoading] = useState(false);
  const [alertsLoading, setAlertsLoading] = useState(false);

  /* Always fetch summary */
  useEffect(() => {
    setSummary(null);
    setHealthHistory(null);
    setAlerts(null);
    setActiveTab("summary");

    fetchDeviceSummary(deviceId).then(setSummary);
  }, [deviceId]);

  /* Lazy load health */
  useEffect(() => {
    if (activeTab !== "health" || healthHistory !== null) return;

    setHealthLoading(true);
    fetchDeviceHealthHistory(deviceId)
      .then((res) => setHealthHistory(res.items))
      .finally(() => setHealthLoading(false));
  }, [activeTab, deviceId, healthHistory]);

  /* Lazy load alerts */
  useEffect(() => {
    if (activeTab !== "alerts" || alerts !== null) return;

    setAlertsLoading(true);
    fetchDeviceAlerts(deviceId)
      .then((res) => setAlerts(res.items))
      .finally(() => setAlertsLoading(false));
  }, [activeTab, deviceId, alerts]);

  if (!summary) {
    return <div className="p-4 text-gray-400">Loading device…</div>;
  }

  return (
    <div className="flex flex-col h-full bg-[#1f2937] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#374151]">
        <div className="font-semibold">{summary.name}</div>
        <div className="text-sm text-gray-400">{summary.model}</div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#374151]">
        <Tab
          label="Summary"
          active={activeTab === "summary"}
          onClick={() => setActiveTab("summary")}
        />
        <Tab
          label="Health"
          active={activeTab === "health"}
          onClick={() => setActiveTab("health")}
        />
        <Tab
          label="Alerts"
          active={activeTab === "alerts"}
          onClick={() => setActiveTab("alerts")}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === "summary" && <SummaryTab summary={summary} />}

        {activeTab === "health" && (
          <HealthTab loading={healthLoading} history={healthHistory} />
        )}

        {activeTab === "alerts" && (
          <AlertsTab loading={alertsLoading} alerts={alerts} />
        )}
      </div>
    </div>
  );
}
