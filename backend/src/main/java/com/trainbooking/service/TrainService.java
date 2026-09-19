package com.trainbooking.service;

import com.trainbooking.dto.TrainClassDto;
import com.trainbooking.dto.TrainSearchResponse;
import com.trainbooking.entity.BookingStatus;
import com.trainbooking.entity.Train;
import com.trainbooking.entity.TrainClass;
import com.trainbooking.exception.ResourceNotFoundException;
import com.trainbooking.repository.BookingRepository;
import com.trainbooking.repository.TrainRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrainService {

    private final TrainRepository trainRepository;
    private final BookingRepository bookingRepository;

    public TrainService(TrainRepository trainRepository, BookingRepository bookingRepository) {
        this.trainRepository = trainRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<TrainSearchResponse> searchTrains(String source, String destination, LocalDate journeyDate) {
        List<Train> trains;
        if (source != null && !source.trim().isEmpty() && destination != null && !destination.trim().isEmpty()) {
            trains = trainRepository.searchTrains(source.trim(), destination.trim());
        } else {
            trains = trainRepository.findAll();
        }

        return trains.stream()
                .map(train -> mapToTrainSearchResponse(train, journeyDate))
                .collect(Collectors.toList());
    }

    public TrainSearchResponse getTrainById(Long id, LocalDate journeyDate) {
        Train train = trainRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Train not found with id: " + id));

        LocalDate date = (journeyDate != null) ? journeyDate : LocalDate.now();
        return mapToTrainSearchResponse(train, date);
    }

    private TrainSearchResponse mapToTrainSearchResponse(Train train, LocalDate date) {
        LocalDate searchDate = (date != null) ? date : LocalDate.now();

        List<TrainClassDto> classDtos = new ArrayList<>();
        for (TrainClass tc : train.getClasses()) {
            long bookedCount = bookingRepository.countBookedSeats(
                    train.getId(), tc.getClassCode(), searchDate, BookingStatus.CONFIRMED
            );
            int availableSeats = Math.max(0, tc.getTotalSeats() - (int) bookedCount);

            classDtos.add(new TrainClassDto(
                    tc.getClassCode(),
                    tc.getPrice(),
                    tc.getTotalSeats(),
                    availableSeats
            ));
        }

        return new TrainSearchResponse(
                train.getId(),
                train.getTrainNumber(),
                train.getName(),
                train.getSource(),
                train.getDestination(),
                train.getDepartureTime(),
                train.getArrivalTime(),
                train.getDuration(),
                classDtos
        );
    }
}
