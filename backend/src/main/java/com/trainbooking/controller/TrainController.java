package com.trainbooking.controller;

import com.trainbooking.dto.TrainSearchResponse;
import com.trainbooking.service.TrainService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/trains")
public class TrainController {

    private final TrainService trainService;

    public TrainController(TrainService trainService) {
        this.trainService = trainService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<TrainSearchResponse>> searchTrains(
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        LocalDate journeyDate = (date != null) ? date : LocalDate.now();
        return ResponseEntity.ok(trainService.searchTrains(source, destination, journeyDate));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainSearchResponse> getTrainById(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        LocalDate journeyDate = (date != null) ? date : LocalDate.now();
        return ResponseEntity.ok(trainService.getTrainById(id, journeyDate));
    }
}
