// API utility functions for making requests with proper error handling

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith("/") ? endpoint : `/${endpoint}`

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new ApiError(`API request failed: ${response.statusText}`, response.status)
    }

    const data = await response.json()

    if (!data.success) {
      throw new ApiError(data.message || "API request failed", response.status, data)
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    // Network or other errors
    throw new ApiError(error instanceof Error ? error.message : "Network error occurred", 0)
  }
}

// Specific API functions
export const healthApi = {
  getCurrent: () => apiRequest<any>("/api/health"),
  logData: (data: any) =>
    apiRequest<any>("/api/health", {
      method: "POST",
      body: JSON.stringify(data),
    }),
}

export const insightsApi = {
  get: () => apiRequest<any>("/api/insights"),
}

export const userApi = {
  get: () => apiRequest<any>("/api/user"),
  update: (data: any) =>
    apiRequest<any>("/api/user", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
}

export const appointmentsApi = {
  get: () => apiRequest<any>("/api/appointments"),
  create: (data: any) =>
    apiRequest<any>("/api/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data: any) =>
    apiRequest<any>("/api/appointments", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
}

export const wellnessApi = {
  getChallenges: () => apiRequest<any>("/api/wellness?type=challenges"),
  getMealPlans: () => apiRequest<any>("/api/wellness?type=meals"),
  logActivity: (data: any) =>
    apiRequest<any>("/api/wellness", {
      method: "POST",
      body: JSON.stringify(data),
    }),
}
