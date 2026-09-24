package com.trainbooking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class BookingRequest {

    @NotNull(message = "Train ID is required")
    private Long trainId;

    @NotBlank(message = "Class code is required")
    private String classCode;

    @NotNull(message = "Journey date is required")
    private LocalDate journeyDate;

    private String paymentId;
    private String orderId;

    public BookingRequest() {
    }

    public BookingRequest(Long trainId, String classCode, LocalDate journeyDate) {
        this.trainId = trainId;
        this.classCode = classCode;
        this.journeyDate = journeyDate;
    }

    public BookingRequest(Long trainId, String classCode, LocalDate journeyDate, String paymentId, String orderId) {
        this.trainId = trainId;
        this.classCode = classCode;
        this.journeyDate = journeyDate;
        this.paymentId = paymentId;
        this.orderId = orderId;
    }

    public Long getTrainId() {
        return trainId;
    }

    public void setTrainId(Long trainId) {
        this.trainId = trainId;
    }

    public String getClassCode() {
        return classCode;
    }

    public void setClassCode(String classCode) {
        this.classCode = classCode;
    }

    public LocalDate getJourneyDate() {
        return journeyDate;
    }

    public void setJourneyDate(LocalDate journeyDate) {
        this.journeyDate = journeyDate;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }
}
