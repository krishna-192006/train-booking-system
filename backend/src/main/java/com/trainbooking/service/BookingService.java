package com.trainbooking.service;

import com.trainbooking.dto.BookingRequest;
import com.trainbooking.dto.BookingResponse;
import com.trainbooking.entity.*;
import com.trainbooking.exception.ResourceNotFoundException;
import com.trainbooking.exception.SeatUnavailableException;
import com.trainbooking.repository.BookingRepository;
import com.trainbooking.repository.TrainClassRepository;
import com.trainbooking.repository.TrainRepository;
import com.trainbooking.repository.UserRepository;
import com.trainbooking.util.SeatAllocationUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TrainRepository trainRepository;
    private final TrainClassRepository trainClassRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
                          TrainRepository trainRepository,
                          TrainClassRepository trainClassRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.trainRepository = trainRepository;
        this.trainClassRepository = trainClassRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public synchronized BookingResponse createBooking(BookingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        Train train = trainRepository.findById(request.getTrainId())
                .orElseThrow(() -> new ResourceNotFoundException("Train not found with id: " + request.getTrainId()));

        TrainClass trainClass = trainClassRepository.findByTrainIdAndClassCode(request.getTrainId(), request.getClassCode().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Class " + request.getClassCode() + " not configured for this train"));

        // Get currently booked seat numbers
        List<Integer> bookedSeatNumbers = bookingRepository.findBookedSeatNumbers(
                train.getId(), trainClass.getClassCode(), request.getJourneyDate()
        );

        Set<Integer> bookedSet = new HashSet<>(bookedSeatNumbers);
        List<Integer> availableSeats = new ArrayList<>();
        for (int i = 1; i <= trainClass.getTotalSeats(); i++) {
            if (!bookedSet.contains(i)) {
                availableSeats.add(i);
            }
        }

        if (availableSeats.isEmpty()) {
            throw new SeatUnavailableException("No seats available for class " + request.getClassCode() + " on " + request.getJourneyDate());
        }

        // Randomly choose an available seat
        Random random = new Random();
        int globalSeatNumber = availableSeats.get(random.nextInt(availableSeats.size()));

        // Determine coach and berth
        SeatAllocationUtil.CoachSeatInfo coachSeatInfo = SeatAllocationUtil.calculateCoachAndBerth(
                trainClass.getClassCode(), globalSeatNumber
        );

        Booking booking = new Booking();
        booking.setPnr(SeatAllocationUtil.generatePNR());
        booking.setUser(user);
        booking.setTrain(train);
        booking.setClassCode(trainClass.getClassCode());
        booking.setJourneyDate(request.getJourneyDate());
        booking.setCoach(coachSeatInfo.getCoach());
        booking.setSeatNumber(globalSeatNumber);
        booking.setBerthType(coachSeatInfo.getBerthType());
        booking.setFare(trainClass.getPrice());
        booking.setPaymentId(request.getPaymentId());
        booking.setOrderId(request.getOrderId());
        booking.setStatus(BookingStatus.CONFIRMED);

        Booking savedBooking = bookingRepository.save(booking);

        return mapToBookingResponse(savedBooking);
    }

    public List<BookingResponse> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse getBookingByPnr(String pnr) {
        Booking booking = bookingRepository.findByPnr(pnr)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with PNR: " + pnr));

        return mapToBookingResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        if (!booking.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("You do not have permission to cancel this booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalArgumentException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);

        return mapToBookingResponse(updatedBooking);
    }

    private BookingResponse mapToBookingResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setPnr(booking.getPnr());
        response.setUserId(booking.getUser().getId());
        response.setUserName(booking.getUser().getName());
        response.setUserEmail(booking.getUser().getEmail());

        Train train = booking.getTrain();
        response.setTrainId(train.getId());
        response.setTrainNumber(train.getTrainNumber());
        response.setTrainName(train.getName());
        response.setSource(train.getSource());
        response.setDestination(train.getDestination());
        response.setDepartureTime(train.getDepartureTime());
        response.setArrivalTime(train.getArrivalTime());

        response.setJourneyDate(booking.getJourneyDate());
        response.setClassCode(booking.getClassCode());
        response.setCoach(booking.getCoach());
        response.setSeatNumber(booking.getSeatNumber());
        response.setBerthType(booking.getBerthType());
        response.setFare(booking.getFare());
        response.setPaymentId(booking.getPaymentId());
        response.setOrderId(booking.getOrderId());
        response.setStatus(booking.getStatus());
        response.setCreatedAt(booking.getCreatedAt());

        return response;
    }
}
