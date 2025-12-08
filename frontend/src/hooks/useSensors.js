import useSWR from 'swr';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const fetcher = (url) => axios.get(url).then((res) => res.data);

export function useSensors(deviceId = null, hours = 24) {
  const params = new URLSearchParams();
  if (deviceId) params.append('device_id', deviceId);
  params.append('hours', hours);
  
  const { data, error, isLoading, mutate } = useSWR(
    `${API_URL}/sensors/?${params}`,
    fetcher,
    { refreshInterval: 30000 } // Osvježi svake 30 sekundi
  );

  return {
    sensors: data?.data || [],
    count: data?.count || 0,
    isLoading,
    isError: error,
    mutate
  };
}

export function useLatestSensor(deviceId = null) {
  const params = deviceId ? `?device_id=${deviceId}` : '';
  
  const { data, error, isLoading, mutate } = useSWR(
    `${API_URL}/sensors/latest${params}`,
    fetcher,
    { refreshInterval: 10000 } // Osvježi svake 10 sekundi
  );

  return {
    sensor: data,
    isLoading,
    isError: error,
    mutate
  };
}

export function useSensorStats(deviceId = null, hours = 24) {
  const params = new URLSearchParams();
  if (deviceId) params.append('device_id', deviceId);
  params.append('hours', hours);
  
  const { data, error, isLoading, mutate } = useSWR(
    `${API_URL}/sensors/stats?${params}`,
    fetcher,
    { refreshInterval: 60000 } // Osvježi svaku minutu
  );

  return {
    stats: data,
    isLoading,
    isError: error,
    mutate
  };
}
