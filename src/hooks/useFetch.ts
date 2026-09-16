import { useEffect, useState } from "react";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): UseFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(url)
        .then(res => {
            if (!res.ok){
                throw new Error("Something went wrong!");
            }
            return res.json();
        })
        .then((data: T) => {
            setData(data);
            setLoading(false);
        })
        .catch((err: unknown) => {
            setError(err instanceof Error ? err.message : "Something went wrong!");
            setLoading(false);
        })
    },[url]);

    return {data, loading, error};
}

export default useFetch;