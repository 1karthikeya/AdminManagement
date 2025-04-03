package com.example.demo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepo extends JpaRepository<AdminTable, Long> {
    Optional<AdminTable> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByMobile(String mobile);
	void save(Optional<AdminTable> admin);
}