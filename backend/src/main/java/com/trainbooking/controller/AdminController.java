package com.trainbooking.controller;

import com.trainbooking.dto.TrainRequest;
import com.trainbooking.dto.TrainSearchResponse;
import com.trainbooking.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/trains")
    public ResponseEntity<List<TrainSearchResponse>> getAllTrains() {
        return ResponseEntity.ok(adminService.getAllTrains());
    }

    @PostMapping("/trains")
    public ResponseEntity<TrainSearchResponse> createTrain(@Valid @RequestBody TrainRequest request) {
        return ResponseEntity.ok(adminService.createTrain(request));
    }

    @PutMapping("/trains/{id}")
    public ResponseEntity<TrainSearchResponse> updateTrain(
            @PathVariable Long id,
            @Valid @RequestBody TrainRequest request) {
        return ResponseEntity.ok(adminService.updateTrain(id, request));
    }

    @DeleteMapping("/trains/{id}")
    public ResponseEntity<Map<String, String>> deleteTrain(@PathVariable Long id) {
        adminService.deleteTrain(id);
        return ResponseEntity.ok(Map.of("message", "Train deleted successfully"));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }
}
