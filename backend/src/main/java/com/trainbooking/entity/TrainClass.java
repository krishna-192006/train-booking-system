package com.trainbooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "train_classes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"train_id", "class_code"})
})
public class TrainClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "train_id", nullable = false)
    @JsonIgnore
    private Train train;

    @Column(name = "class_code", nullable = false)
    private String classCode; // 1A, 2A, 3A, SL

    @Column(nullable = false)
    private Double price;

    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;

    public TrainClass() {
    }

    public TrainClass(String classCode, Double price, Integer totalSeats) {
        this.classCode = classCode;
        this.price = price;
        this.totalSeats = totalSeats;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Train getTrain() {
        return train;
    }

    public void setTrain(Train train) {
        this.train = train;
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
