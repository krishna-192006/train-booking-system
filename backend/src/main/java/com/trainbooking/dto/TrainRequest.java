package com.trainbooking.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class TrainRequest {

    @NotBlank(message = "Train number is required")
    private String trainNumber;

    @NotBlank(message = "Train name is required")
    private String name;

    @NotBlank(message = "Source is required")
    private String source;

    @NotBlank(message = "Destination is required")
    private String destination;

    @NotBlank(message = "Departure time is required")
    private String departureTime;

    @NotBlank(message = "Arrival time is required")
    private String arrivalTime;

    @NotBlank(message = "Duration is required")
    private String duration;

    private List<ClassConfigDto> classes;

    public static class ClassConfigDto {
        private String classCode;
        private Double price;
        private Integer totalSeats;

        public ClassConfigDto() {
        }

        public ClassConfigDto(String classCode, Double price, Integer totalSeats) {
            this.classCode = classCode;
            this.price = price;
            this.totalSeats = totalSeats;
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
    }

    public TrainRequest() {
    }

    public String getTrainNumber() {
        return trainNumber;
    }

    public void setTrainNumber(String trainNumber) {
        this.trainNumber = trainNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public String getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public List<ClassConfigDto> getClasses() {
        return classes;
    }

    public void setClasses(List<ClassConfigDto> classes) {
        this.classes = classes;
    }
}
