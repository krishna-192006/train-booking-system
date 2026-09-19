package com.trainbooking.repository;

import com.trainbooking.entity.Booking;
import com.trainbooking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByPnr(String pnr);
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.train.id = :trainId AND b.classCode = :classCode AND b.journeyDate = :journeyDate AND b.status = :status")
    long countBookedSeats(
            @Param("trainId") Long trainId,
            @Param("classCode") String classCode,
            @Param("journeyDate") LocalDate journeyDate,
            @Param("status") BookingStatus status
    );

    @Query("SELECT b.seatNumber FROM Booking b WHERE b.train.id = :trainId AND b.classCode = :classCode AND b.journeyDate = :journeyDate AND b.status = 'CONFIRMED'")
    List<Integer> findBookedSeatNumbers(
            @Param("trainId") Long trainId,
            @Param("classCode") String classCode,
            @Param("journeyDate") LocalDate journeyDate
    );
}
