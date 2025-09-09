package com.myapp.billiards.common.response;

import com.myapp.billiards.common.exception.ErrorCode;
import org.springframework.http.HttpStatus;

public record ApiResponse<T>(
        boolean success,
        String code,
        String message,
        //@JsonUnwrapped
        T data
) {

    private static final String DEFAULT_SUCCESS_MESSAGE = "요청에 성공하였습니다.";

    public static <T> ApiResponse<T> createApiResponse(T body) {
        return new ApiResponse<>(true, String.valueOf(HttpStatus.OK.value()), DEFAULT_SUCCESS_MESSAGE, body);
    }

    public static <T> ApiResponse<T> createEmptyApiResponse() {
        return new ApiResponse<>(true, String.valueOf(HttpStatus.OK.value()), DEFAULT_SUCCESS_MESSAGE, null);
    }

    public static <T> ApiResponse<T> createApiResponseWithMessage(String message) {
        return new ApiResponse<>(true, String.valueOf(HttpStatus.OK.value()), message, null);
    }

    public static ApiResponse<Void> createApiResponseWithError(ErrorCode ErrorCode) {
        return new ApiResponse<>(false, ErrorCode.getCode(), ErrorCode.getMessage(), null);
    }

    public static ApiResponse<Void> createApiResponseWithError(ErrorCode ErrorCode, String message) {
        return new ApiResponse<>(false, ErrorCode.getCode(), message, null);
    }
}
