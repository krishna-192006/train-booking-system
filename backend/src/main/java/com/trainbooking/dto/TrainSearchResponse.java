package com.trainbooking.dto;

import java.util.List;

public class TrainSearchResponse {
    private Long id;
    private String trainNumber;
    private String name;
    private String source;
    private String destination;
    private String departureTime;
    private String arrivalTime;
    private String duration;
    private List<TrainClassDto> classes;

    public TrainSearchResponse() {
    }

    public TrainSearchResponse(Long id, String trainNumber, String name, String source, String destination, String departureTime, String arrivalTime, String duration, List<TrainClassDto> classes) {
        this.id = id;
        this.trainNumber = trainNumber;
        this.name = name;
        this.source = source;
        this.destination = destination;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.duration = duration;
        this.classes = classes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public List<TrainClassDto> getClasses() {
        return classes;
    }

    public void setClasses(List<TrainClassDto> classes) {
        this.classes = classes;
    }
}
