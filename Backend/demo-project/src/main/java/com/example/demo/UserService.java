package com.example.demo;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service

public interface UserService {

	AdminTable saveUser(AdminTable admin);
	AdminTable getUser(Long id);
	boolean userExists(String email, String mobile);
	boolean validateLogin(String email, String rawPassword);
	String resetAdminPassword(String email, String newPassword);
	
	 UserTable saveUser(UserTable user);
	    List<UserTable> getAllUsers();
	    
		UserTable getUserByRoll(Long rollNumber);
		UserTable findByEmail(String email);
		Optional<UserTable> updateUser(UserTable updatedUser);
		
		void AttendanceService(AttendanceRepo attendanceRepository);
		void saveAttendance(Attendance attendance);
		Map<String, Integer> getMonthlyAttendance();
		int getPresentCountForMonth1(String rollNumber);
		
		
		//fee services
		 List<FeeEntity> getAllFees();
		 Optional<FeeEntity> getFeeByRollNumber(String rollNumber);
		 String addOrUpdateFee(FeeEntity fee);
		 Optional<FeeEntity> findByRollNumber(String rollNumber);
		int getTotalDaysInMonth();
		int getPresentCountForMonth(String rollNumber);
		
}