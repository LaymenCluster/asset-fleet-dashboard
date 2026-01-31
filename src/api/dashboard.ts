import apiClient from "./apiClient";
import axios from "axios";

export const fetchOverview = async () => {
  const res = await apiClient.get("/dashboard/overview");
  return res.data;
};

export const fetchDevices = async (
  health?: string,
  order?: string,
  cursor?: string | null,
) => {
  const params: Record<string, string> = {};
  if (health) params.health = health;
  if (order) params.order = order;
  if (cursor) params.cursor = cursor;

  const res = await apiClient.get("/dashboard/devices", { params });
  return res.data;
};

export const fetchDeviceSummary = async (id: string) => {
  const res = await apiClient.get(`/dashboard/devices/${id}/summary`);
  return res.data;
};

export const fetchDeviceAlerts = async (id: string) => {
  const res = await apiClient.get(`/dashboard/devices/${id}/alerts`);
  return res.data;
};

export const fetchDeviceHealthHistory = async (id: string) => {
  const res = await apiClient.get(`/dashboard/devices/${id}/health-history`);
  return res.data;
};

export async function decommissionDevice(id: string): Promise<void> {
  try {
    await apiClient.patch(`/devices/${id}/decommission`);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 409) {
      return;
    }
    throw err;
  }
}

export async function reactivateDevice(id: string): Promise<void> {
  try {
    await apiClient.patch(`/devices/${id}/reactivate`);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 409) {
      return;
    }
    throw err;
  }
}

export async function registerDevice(payload: {
  vendor_name: string;
  vendor_id: string;
  device_identifier: string;
  device_name: string;
  device_model: string;
}): Promise<void> {
  try {
    await apiClient.post("/devices/registration", payload);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 409) {
      throw new Error("Device already registered");
    }
    throw err;
  }
}
