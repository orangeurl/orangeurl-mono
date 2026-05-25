/**
 * API Client for authenticated requests to the backend
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.orangeurl.live';

export interface ApiError {
  error: string;
  message?: string;
}

export class ApiClient {
  private static async getAuthToken(): Promise<string | null> {
    // This will be called from client components
    // Clerk provides the token via useAuth hook
    return null;
  }

  static async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add existing headers
    if (options.headers) {
      const existingHeaders = new Headers(options.headers);
      existingHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: 'Request failed',
      }));
      throw new Error(errorData.error || errorData.message || 'Request failed');
    }

    return response.json();
  }

  static async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, token);
  }

  static async post<T>(
    endpoint: string,
    data: any,
    token?: string
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      token
    );
  }

  static async put<T>(
    endpoint: string,
    data: any,
    token?: string
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      token
    );
  }

  static async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, token);
  }
}

// Types for API responses
export interface DashboardStats {
  total_urls: number;
  total_clicks: number;
  urls_this_month: number;
  clicks_this_month: number;
  plan_name: string;
  url_limit: number;
  urls_remaining: number;
  // Subscription renewal info
  next_billing_date?: string;
  billing_interval?: 'monthly' | 'annual';
  subscription_status?: string;
  url_reset_date?: string;
  top_countries: Array<{ country: string; clicks: number }>;
  browser_stats: Array<{ browser: string; clicks: number }>;
  device_stats: Array<{ device_type: string; clicks: number }>;
  clicks_by_date: Array<{ date: string; clicks: number }>;
  recent_urls: Array<{
    id: string;
    short_id: string;
    original_url: string;
    clicks: number;
    created_at: string;
    is_active: boolean;
    is_locked?: boolean;
  }>;
  features: {
    advanced_analytics: boolean;
    custom_links: number;
    custom_qr_codes: number;
    bio_links: number;
    priority_support: boolean;
    ai_shortener: boolean;
    custom_expiry: boolean;
    link_locking: boolean;
    data_retention_days: number;
  };
}

export interface URLAnalytics {
  url: {
    short_id: string;
    original_url: string;
    created_at: string;
    is_active: boolean;
  };
  total_clicks: number;
  clicks_by_date: Array<{ date: string; clicks: number }>;
  browser_stats: Array<{ browser: string; clicks: number }>;
  device_stats: Array<{ device_type: string; clicks: number }>;
  recent_clicks: Array<{
    id: string;
    ip_address: string;
    user_agent: string;
    referer: string;
    country: string;
    city: string;
    device_type: string;
    browser: string;
    os: string;
    is_bot: boolean;
    clicked_at: string;
  }>;
}

export interface UserURLs {
  urls: Array<{
    id: string;
    short_id: string;
    original_url: string;
    expiry: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    click_count: number;
    is_locked?: boolean;
  }>;
  total: number;
}

// Password protection API methods
export const PasswordAPI = {
  async setPassword(urlId: string, password: string, token: string) {
    return ApiClient.post<{ message: string; url: any }>(
      `/api/urls/${urlId}/lock`,
      { password },
      token
    );
  },

  async removePassword(urlId: string, token: string) {
    return ApiClient.delete<{ message: string; url: any }>(
      `/api/urls/${urlId}/lock`,
      token
    );
  },

  async unlockURL(shortId: string, password: string) {
    return ApiClient.post<{ message: string; original_url: string; redirect_url: string }>(
      `/api/unlock/${shortId}`,
      { password }
    );
  },

  async getPasswordStats(shortId: string, token: string) {
    return ApiClient.get<{
      short_id: string;
      is_locked: boolean;
      password_attempts: number;
      last_password_attempt: string | null;
    }>(`/api/urls/${shortId}/password-stats`, token);
  },
};

