import { useEffect, useState, useCallback } from "react";
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
  const [healthHistory, setHealthHistory] = useState<
    HealthHistoryItem[] | null
  >(null);
  const [alerts, setAlerts] = useState<AlertItem[] | null>(null);

  const [activeTab, setActiveTab] = useState<"summary" | "health" | "alerts">(
    "summary",
  );

  const [summaryLoading, setSummaryLoading] = useState(false);
  const [healthLoading, setHealthLoading] = useState(false);
  const [alertsLoading, setAlertsLoading] = useState(false);

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const res = await fetchDeviceSummary(deviceId);
      setSummary(res);
    } finally {
      setSummaryLoading(false);
    }
  }, [deviceId]);

  const loadHealth = useCallback(async () => {
    setHealthLoading(true);
    try {
      const res = await fetchDeviceHealthHistory(deviceId);
      setHealthHistory(res.items);
    } finally {
      setHealthLoading(false);
    }
  }, [deviceId]);

  const loadAlerts = useCallback(async () => {
    setAlertsLoading(true);
    try {
      const res = await fetchDeviceAlerts(deviceId);
      setAlerts(res.items);
    } finally {
      setAlertsLoading(false);
    }
  }, [deviceId]);

  const loadAll = useCallback(() => {
    loadSummary();
    loadHealth();
    loadAlerts();
  }, [loadSummary, loadHealth, loadAlerts]);

  // initial load on deviceId change
  useEffect(() => {
    loadAll();
  }, [deviceId, loadAll]);

  if (summaryLoading || !summary) {
    return <div className="p-4 text-gray-400">Loading device…</div>;
  }

  return (
    <div className="flex flex-col h-full bg-[#1f2937] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#374151] flex justify-between items-center">
        <div>
          <div className="font-semibold">{summary.name}</div>
          <div className="text-sm text-gray-400">{summary.model}</div>
        </div>

        <button
          onClick={loadAll}
          className="px-3 py-1 rounded bg-blue-600 text-sm hover:bg-blue-700"
        >
          Reload
        </button>
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
