package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

public interface FeeRepository extends JpaRepository<FeeEntity, String> {
	Optional<FeeEntity> findByRollNumber(String rollNumber);

    @Query("SELECT f FROM FeeEntity f")
    List<FeeEntity> getAllFees();

    @Transactional
    @Modifying
    @Query("UPDATE FeeEntity f SET f.amount = :amount WHERE f.rollNumber = :rollNumber")
    void updateFeeAmount(@Param("rollNumber") String rollNumber, @Param("amount") Double amount);
	
	
	

	
}
