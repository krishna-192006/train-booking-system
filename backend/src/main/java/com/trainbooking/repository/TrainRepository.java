package com.trainbooking.repository;

import com.trainbooking.entity.Train;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainRepository extends JpaRepository<Train, Long> {
    Optional<Train> findByTrainNumber(String trainNumber);
    Boolean existsByTrainNumber(String trainNumber);

    @Query("SELECT t FROM Train t WHERE LOWER(t.source) LIKE LOWER(CONCAT('%', :source, '%')) AND LOWER(t.destination) LIKE LOWER(CONCAT('%', :destination, '%'))")
    List<Train> searchTrains(@Param("source") String source, @Param("destination") String destination);
}
