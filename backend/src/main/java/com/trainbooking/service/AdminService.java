package com.trainbooking.service;

import com.trainbooking.dto.TrainRequest;
import com.trainbooking.dto.TrainSearchResponse;
import com.trainbooking.entity.Train;
import com.trainbooking.entity.TrainClass;
import com.trainbooking.exception.ResourceNotFoundException;
import com.trainbooking.repository.BookingRepository;
import com.trainbooking.repository.TrainClassRepository;
import com.trainbooking.repository.TrainRepository;
import com.trainbooking.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final TrainRepository trainRepository;
    private final TrainClassRepository trainClassRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final TrainService trainService;

    public AdminService(TrainRepository trainRepository,
                        TrainClassRepository trainClassRepository,
                        UserRepository userRepository,
                        BookingRepository bookingRepository,
                        TrainService trainService) {
        this.trainRepository = trainRepository;
        this.trainClassRepository = trainClassRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.trainService = trainService;
    }

    public List<TrainSearchResponse> getAllTrains() {
        return trainRepository.findAll().stream()
                .map(train -> trainService.getTrainById(train.getId(), LocalDate.now()))
                .collect(Collectors.toList());
    }

    @Transactional
    public TrainSearchResponse createTrain(TrainRequest request) {
        if (trainRepository.existsByTrainNumber(request.getTrainNumber())) {
            throw new IllegalArgumentException("Train number " + request.getTrainNumber() + " already exists");
        }

        Train train = new Train(
                request.getTrainNumber(),
                request.getName(),
                request.getSource(),
                request.getDestination(),
                request.getDepartureTime(),
                request.getArrivalTime(),
                request.getDuration()
        );

        if (request.getClasses() != null) {
            for (TrainRequest.ClassConfigDto classDto : request.getClasses()) {
                TrainClass tc = new TrainClass(classDto.getClassCode().toUpperCase(), classDto.getPrice(), classDto.getTotalSeats());
                train.addClass(tc);
            }
        }

        Train savedTrain = trainRepository.save(train);
        return trainService.getTrainById(savedTrain.getId(), LocalDate.now());
    }

    @Transactional
    public TrainSearchResponse updateTrain(Long id, TrainRequest request) {
        Train train = trainRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Train not found with id: " + id));

        train.setTrainNumber(request.getTrainNumber());
        train.setName(request.getName());
        train.setSource(request.getSource());
        train.setDestination(request.getDestination());
        train.setDepartureTime(request.getDepartureTime());
        train.setArrivalTime(request.getArrivalTime());
        train.setDuration(request.getDuration());

        if (request.getClasses() != null) {
            train.getClasses().clear();
            for (TrainRequest.ClassConfigDto classDto : request.getClasses()) {
                TrainClass tc = new TrainClass(classDto.getClassCode().toUpperCase(), classDto.getPrice(), classDto.getTotalSeats());
                train.addClass(tc);
            }
        }

        Train updatedTrain = trainRepository.save(train);
        return trainService.getTrainById(updatedTrain.getId(), LocalDate.now());
    }

    @Transactional
    public void deleteTrain(Long id) {
        if (!trainRepository.existsById(id)) {
            throw new ResourceNotFoundException("Train not found with id: " + id);
        }
        trainRepository.deleteById(id);
    }

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTrains", trainRepository.count());
        stats.put("totalUsers", userRepository.count());
        stats.put("totalBookings", bookingRepository.count());
        return stats;
    }
}
