import { useState, useCallback } from "react";
import { message } from "antd";
import { api } from "../api";
export const useAPI = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const executeRequest = useCallback(
        async (
            apiCall,
            {
                showSuccessMessage = false,
                successMessage = "Operation completed successfully",
                showErrorMessage = true,
                onSuccess,
                onError,
            } = {}
        ) => {
            try {
                setLoading(true);
                setError(null);
                const result = await apiCall();
                if (showSuccessMessage) {
                    message.success(successMessage);
                }
                if (onSuccess) {
                    onSuccess(result);
                }
                return result;
            } catch (err) {
                const errorMessage =
                    err.response?.data?.message ||
                    err.message ||
                    "An error occurred";
                setError(errorMessage);
                if (showErrorMessage) {
                    message.error(errorMessage);
                }
                if (onError) {
                    onError(err);
                }
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );
    const get = useCallback(
        (endpoint, params, options = {}) => {
            return executeRequest(
                () => api.getRecords(endpoint, params),
                options
            );
        },
        [executeRequest]
    );
    const create = useCallback(
        (endpoint, data, options = {}) => {
            return executeRequest(() => api.createRecord(endpoint, data), {
                showSuccessMessage: true,
                successMessage: "Created successfully",
                ...options,
            });
        },
        [executeRequest]
    );
    const update = useCallback(
        (endpoint, id, data, options = {}) => {
            return executeRequest(() => api.updateRecord(endpoint, id, data), {
                showSuccessMessage: true,
                successMessage: "Updated successfully",
                ...options,
            });
        },
        [executeRequest]
    );
    const remove = useCallback(
        (endpoint, id, options = {}) => {
            return executeRequest(() => api.deleteRecord(endpoint, id), {
                showSuccessMessage: true,
                successMessage: "Deleted successfully",
                ...options,
            });
        },
        [executeRequest]
    );
    return {
        loading,
        error,
        get,
        create,
        update,
        remove,
        executeRequest,
    };
};
