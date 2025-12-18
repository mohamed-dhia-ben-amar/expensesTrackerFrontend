export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface ApiError {
    message: string;
    code?: string;
    details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// Authentication Types
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: string;
    placeOfBirth: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

// User Model (matches backend schema)
export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    placeOfBirth: string;
    refreshToken?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

// Profile Updates
export type UpdateProfileRequest = Partial<Pick<User, 'firstName' | 'lastName' | 'dateOfBirth' | 'placeOfBirth'>>;