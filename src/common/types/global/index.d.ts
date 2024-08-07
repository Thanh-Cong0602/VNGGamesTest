import { AxiosRequestConfig } from "axios";

declare global {
  interface DataRequest {
    path?: Record<string, string | number>;
    params?: Record<string, string | number>;
    body?: Record<string, unknown>;
  }
  interface ParamsNetwork<T extends DataRequest = DataRequest>
    extends AxiosRequestConfig {
    url: string;
    params?: T["params"];
    path?: T["path"];
    body?: T["body"];
  }
}
