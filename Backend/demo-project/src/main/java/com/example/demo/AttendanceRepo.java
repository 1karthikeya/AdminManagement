package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface AttendanceRepo extends JpaRepository<Attendance, Long> {
	// Find attendance by date
    List<Attendance> findByDate(LocalDate date);

    // Find attendance by roll number
  

    @Query("SELECT new map(a.rollNumber as rollNumber, COUNT(a) as attendanceCount) FROM Attendance a GROUP BY a.rollNumber")
    List<Map<String, Object>> getMonthlyAttendance();

	List<Attendance> getAttendanceByDate(LocalDate date);

	Optional<Attendance> findByRollNumberAndDate(String rollNumber, LocalDate date);

	@Query("SELECT a FROM Attendance a WHERE a.rollNumber = :rollNumber ORDER BY a.date DESC LIMIT 1")
	Optional<Attendance> findLastAttendanceByRollNumber(@Param("rollNumber") String rollNumber);

	@Query("SELECT COUNT(DISTINCT a.date) FROM Attendance a WHERE a.rollNumber = :rollNumber AND MONTH(a.date) = :month AND YEAR(a.date) = :year")
	int countByRollNumberAndMonth(@Param("rollNumber") String rollNumber, @Param("month") int month, @Param("year") int year);

	@Query("SELECT COUNT(a) FROM Attendance a WHERE a.rollNumber = :rollNumber AND a.date BETWEEN :startDate AND :endDate")
	int countByRollNumberAndDateBetween1(
	    @Param("rollNumber") String rollNumber,
	    @Param("startDate") LocalDate startDate,
	    @Param("endDate") LocalDate endDate
	);


	int countByRollNumberAndDateBetween(String rollNumber, LocalDate firstDay, LocalDate lastDay);

	int countByDateBetween(LocalDate firstDay, LocalDate lastDay);
	
	@Query("SELECT a FROM Attendance a WHERE a.date BETWEEN :startDate AND :endDate")
    List<Attendance> findByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

	


	



	

	
}
