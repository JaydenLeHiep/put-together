import { useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import { setApiFetch } from "../../hooks/useApi";

export function ApiInitializer() {
  const { apiFetch } = useApi();

  useEffect(() => {
    setApiFetch(apiFetch);
  }, [apiFetch]);

  return null;
}
