package com.trainbooking.dto;

public class TrainClassDto {
    private String classCode;
    private Double price;
    private Integer totalSeats;
    private Integer availableSeats;

    public TrainClassDto() {
    }

    public TrainClassDto(String classCode, Double price, Integer totalSeats, Integer availableSeats) {
        this.classCode = classCode;
        this.price = price;
        this.totalSeats = totalSeats;
        this.availableSeats = availableSeats;
    }

    public String getClassCode() {
        return classCode;
    }

    public void setClassCode(String classCode) {
        this.classCode = classCode;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }
}
