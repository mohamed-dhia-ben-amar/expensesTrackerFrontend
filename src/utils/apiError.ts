import { Alert } from 'react-native';
import { AxiosError } from 'axios';
import { ApiError } from '@/types/api.types';

export type NormalizedApiError = ApiError & {
    status?: number;
    isNetworkError?: boolean;
    raw?: unknown;
};

const joinUnique = (arr: Array<string | number | undefined | null>) =>
    Array.from(new Set(arr.filter(Boolean) as string[]));

const extractFromData = (data: any): { message?: string; details?: Record<string, string[]> } => {
    if (!data) return {};

    // Common shapes: { message: string | string[] }, { error: string },
    // { errors: { field: string[] } }, { errors: [{ msg, param }] }, string
    if (typeof data === 'string') {
        return { message: data };
    }

    const details: Record<string, string[]> = {};

    // Object-map validation errors
    if (data.errors && !Array.isArray(data.errors) && typeof data.errors === 'object') {
        for (const key of Object.keys(data.errors)) {
            const val = data.errors[key];
            if (Array.isArray(val)) details[key] = val.map(String);
            else if (val != null) details[key] = [String(val)];
        }
    }

    // Array validation errors (e.g., express-validator)
    if (Array.isArray(data.errors)) {
        for (const e of data.errors) {
            const field = e?.param || e?.field || 'error';
            const msg = e?.msg || e?.message || e?.detail || String(e);
            details[field] = joinUnique([...(details[field] || []), String(msg)]);
        }
    }

    // Message can be string or array
    let message: string | undefined;
    if (Array.isArray(data.message)) {
        message = data.message.map((m: any) => String(m)).join('\n');
    } else if (data.message) {
        message = String(data.message);
    } else if (data.error) {
        message = String(data.error);
    }

    return { message, details: Object.keys(details).length ? details : undefined };
};

export const normalizeApiError = (err: unknown): NormalizedApiError => {
    // AxiosError branch
    const ax = err as AxiosError;
    if (ax && typeof ax === 'object' && 'isAxiosError' in ax) {
        const status = ax.response?.status;
        const { message: extracted, details } = extractFromData(ax.response?.data);

        let message = extracted;

        if (!message) {
            if (status) message = `Request failed with status ${status}`;
            else if (ax.code === 'ECONNABORTED') message = 'Request timeout. Please try again.';
            else if (ax.message?.toLowerCase().includes('network')) message = 'Network error. Check your connection.';
            else message = ax.message || 'Something went wrong.';
        }

        const isNetworkError = !ax.response;
        return { message, code: ax.code, details, status, isNetworkError, raw: err };
    }

    // Non-axios errors
    if (typeof err === 'string') return { message: err };
    if (err && typeof err === 'object') {
        const anyErr = err as any;
        const { message, details } = extractFromData(anyErr);
        return { message: message || anyErr?.message || 'Unexpected error occurred.', details, raw: err };
    }
    return { message: 'Unexpected error occurred.' };
};

const buildDetailsText = (details?: Record<string, string[]>) => {
    if (!details) return '';
    const lines: string[] = [];
    Object.entries(details).forEach(([field, msgs]) => {
        if (!msgs?.length) return;
        lines.push(`${field}: ${msgs.join(', ')}`);
    });
    return lines.length ? `\n\nDetails:\n- ${lines.join('\n- ')}` : '';
};

export const getErrorMessage = (err: unknown, fallback = 'Something went wrong.') => {
    const n = normalizeApiError(err);
    const text = n.message || fallback;
    return `${text}${buildDetailsText(n.details)}`;
};

export const showApiErrorAlert = (
    err: unknown,
    options?: { title?: string; fallbackMessage?: string }
) => {
    const title = options?.title || 'Error';
    const message = getErrorMessage(err, options?.fallbackMessage);
    Alert.alert(title, message);
};

export default showApiErrorAlert;
