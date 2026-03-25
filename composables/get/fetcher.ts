import type { QueryFunctionContext } from '@tanstack/vue-query';

import { axiosInstance, commonHeaders } from '../../utils/axios';

export interface Meta {
  accessToken: string;
}

export async function fetcher<T>({
  queryKey,
  meta,
}: Omit<QueryFunctionContext, 'signal'>): Promise<T> {
  const [fullURL, params] = queryKey;
  const { accessToken } = meta as unknown as Meta;

  try {
    return axiosInstance
      .get<T>(`${fullURL}`, {
        params: { ...(params as object) },
        headers: { ...commonHeaders, Authorization: accessToken ? `Bearer ${accessToken}` : undefined },
      })
      .then(res => res.data);
  }
  catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
