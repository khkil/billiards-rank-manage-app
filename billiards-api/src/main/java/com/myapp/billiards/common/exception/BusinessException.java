package com.myapp.billiards.common.exception;

import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {

    private final ErrorCode errorCode;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getCode());
        this.errorCode = errorCode;
    }

    // checkedException의 경우 stackTrace 값은 예외추적에 필요없음 > fillInStackTrace를 오버라이딩을 통해 가독성 향상 및 처리량 감소
    @Override
    public synchronized Throwable fillInStackTrace() {
        return this;
    }
}
