package com.myapp.billiards.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum HttpErrorCode implements ErrorCode {
    // HTTP 오류
    NOT_MODIFIED(HttpStatus.OK, "E304", HttpStatus.NOT_MODIFIED.getReasonPhrase()),
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "E400", HttpStatus.BAD_REQUEST.getReasonPhrase()),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "E401", HttpStatus.UNAUTHORIZED.getReasonPhrase()),
    FORBIDDEN(HttpStatus.FORBIDDEN, "E403", HttpStatus.FORBIDDEN.getReasonPhrase()),
    NOT_FOUND(HttpStatus.NOT_FOUND, "E404", HttpStatus.NOT_FOUND.getReasonPhrase()),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "E405", HttpStatus.METHOD_NOT_ALLOWED.getReasonPhrase()),
    NOT_ACCEPTABLE(HttpStatus.NOT_ACCEPTABLE, "E406", HttpStatus.NOT_ACCEPTABLE.getReasonPhrase()),
    CONFLICT(HttpStatus.CONFLICT, "E409", HttpStatus.CONFLICT.getReasonPhrase()),
    UNSUPPORTED_MEDIA_TYPE(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "E415", HttpStatus.UNSUPPORTED_MEDIA_TYPE.getReasonPhrase()),
    SERVICE_UNAVAILABLE(HttpStatus.SERVICE_UNAVAILABLE, "E503", HttpStatus.SERVICE_UNAVAILABLE.getReasonPhrase()),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "E500", HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}
