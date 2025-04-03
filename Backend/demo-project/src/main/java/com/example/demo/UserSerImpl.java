package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import java.util.stream.Collectors;

@Service
public class UserSerImpl implements UserService {
	
	
	
	 private  FeeRepository feeRepository;

    @Autowired
    private AdminRepo adminRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AttendanceRepo attendanceRepository; 
    
    @Autowired
    private UserRepo userRepository;

    @Autowired
    private JavaMailSender mailSender;


    @Override
    public AdminTable saveUser(AdminTable admin) {
        // Generate a random password
        String randomPassword = UUID.randomUUID().toString().substring(0, 8);
        admin.setPassword(randomPassword);

        // Construct the email body
        String emailBody = String.format(
            "Hello %s,\n\n" +
            "Your account has been created successfully!\n" +
            "Here are your login credentials:\n\n" +
            "Email: %s\n" +
            "Password: %s\n\n" +
            "Please log in to the application using these credentials.\n\n" +
            "Regards,\n" +
            "Admin",
            admin.getName(), // Assuming 'getName()' returns the user's name
            admin.getEmail(),
            randomPassword
        );

        // Create and send the email
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(admin.getEmail());
        mailMessage.setSubject("Your Account Password");
        mailMessage.setText(emailBody);
        mailSender.send(mailMessage);

        // Save the admin to the repository
        return adminRepository.save(admin);
    }

    @Override
    public boolean userExists(String email, String mobile) {
        return adminRepository.existsByEmail(email) || adminRepository.existsByMobile(mobile);
    }

    @Override
    public AdminTable getUser(Long id) {
        return adminRepository.findById(id).orElse(null);
    }

    @Override
    public boolean validateLogin(String email, String rawPassword) {
        Optional<AdminTable> user = adminRepository.findByEmail(email);
        return user.isPresent() && user.get().getPassword().equals(rawPassword);
    }

    public UserTable saveUser(UserTable user) {
        return userRepository.save(user);
    }

    public List<UserTable> getAllUsers() {
        return userRepository.findAll();
    }

	@Override
	public UserTable getUserByRoll(Long rollNumber) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public UserTable findByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	 @Override
	 public Optional<UserTable> updateUser(UserTable updatedUser) {
		    Optional<UserTable> existingUser = Optional.ofNullable(userRepository.findByEmail(updatedUser.getEmail()));

		    if (existingUser.isPresent()) {
		        UserTable user = existingUser.get();

		        // ✅ Update fields
		        user.setFirstName(updatedUser.getFirstName());
		        user.setLastName(updatedUser.getLastName());
		        user.setMobileNumber(updatedUser.getMobileNumber());
		        user.setDob(updatedUser.getDob());
		        user.setEducationLevel(updatedUser.getEducationLevel());
		        user.setCourse(updatedUser.getCourse());
		        user.setCourseCode(updatedUser.getCourseCode());

		        // ✅ Ensure roll number is also updated
		        user.setRollNumber(updatedUser.getRollNumber());

		        userRepository.save(user);
		        return Optional.of(user);
		    } else {
		        return Optional.empty();
		    }
		}

	 @Override
	 public void AttendanceService(AttendanceRepo attendanceRepository) {
	        this.attendanceRepository = attendanceRepository;
	    }

	 @Override
	 public void saveAttendance(Attendance attendance) {
	     Optional<Attendance> lastAttendance = attendanceRepository.findLastAttendanceByRollNumber(attendance.getRollNumber());

	     int previousCount = lastAttendance.map(Attendance::getPresentCount).orElse(0);

	     Optional<Attendance> existingAttendance = attendanceRepository.findByRollNumberAndDate(attendance.getRollNumber(), attendance.getDate());

	     if (existingAttendance.isPresent()) {
	         // If attendance exists for today, update it
	         Attendance record = existingAttendance.get();
	         if ("Present".equalsIgnoreCase(attendance.getStatus())) {
	             record.setPresentCount(previousCount + 1);  // ✅ Increment count
	         }
	         attendanceRepository.save(record);
	     } else {
	         // If no record exists, create a new one
	         if ("Present".equalsIgnoreCase(attendance.getStatus())) {
	             attendance.setPresentCount(previousCount + 1); // ✅ Increment count from last record
	         } else {
	             attendance.setPresentCount(0); // If absent, keep count 0
	         }
	         attendanceRepository.save(attendance);
	     }
	 }
	  
	 public Map<String, Integer> getMonthlyAttendance() {
	        YearMonth currentMonth = YearMonth.now();

	        // ✅ Fetch all attendance records for the month
	        List<Attendance> attendanceList = attendanceRepository.findByDateBetween(
	            currentMonth.atDay(1), 
	            currentMonth.atEndOfMonth()
	        );

	        if (attendanceList.isEmpty()) {
	            return Collections.emptyMap();
	        }

	        // ✅ Count total working days in the month
	        long totalWorkingDays = attendanceList.stream()
	            .map(Attendance::getDate)
	            .distinct()
	            .count();

	        // ✅ Group attendance by roll number & calculate percentage
	        Map<String, Long> presentDays = attendanceList.stream()
	            .filter(att -> "Present".equals(att.getStatus())) // Count only "Present"
	            .collect(Collectors.groupingBy(Attendance::getRollNumber, Collectors.counting()));

	        // ✅ Compute attendance %
	        Map<String, Integer> attendancePercentage = new HashMap<>();
	        for (Map.Entry<String, Long> entry : presentDays.entrySet()) {
	            int percentage = (int) ((entry.getValue() * 100) / totalWorkingDays);
	            attendancePercentage.put(entry.getKey(), percentage);
	        }

	        return attendancePercentage;
	    }
	 
	 public int getPresentCountForMonth(String rollNumber) {
		    LocalDate firstDay = LocalDate.now().withDayOfMonth(1);
		    LocalDate lastDay = LocalDate.now().withDayOfMonth(YearMonth.now().lengthOfMonth());

		    // ✅ Fetch present days for the current month
		    int count = attendanceRepository.countByRollNumberAndDateBetween(rollNumber, firstDay, lastDay);
		    System.out.println("Present Count for " + rollNumber + ": " + count); // Debug log
		    return count;
		}

	 
	 public int getPresentCountForMonth1(String rollNumber) {
		    LocalDate firstDay = LocalDate.now().withDayOfMonth(1);
		    LocalDate lastDay = LocalDate.now().withDayOfMonth(YearMonth.now().lengthOfMonth());

		    int count = attendanceRepository.countByDateBetween(firstDay, lastDay);
		    System.out.println("Present Days Count: " + count); // ✅ Debug log
		    return count;
		}
	 
	   @Autowired
	    public void FeeService(FeeRepository feeRepository) {
	        this.feeRepository = feeRepository;
	    }
	 
	 
	 //fee serviceimpl
	 @Override
	    public Optional<FeeEntity> getFeeByRollNumber(String rollNumber) {
	        return feeRepository.findByRollNumber(rollNumber);
	    }

	 @Transactional
	    public String addOrUpdateFee(FeeEntity fee) {
	        Optional<FeeEntity> existingFee = feeRepository.findById(fee.getRollNumber());

	        double updatedAmount = fee.getAmount(); // New amount
	        if (existingFee.isPresent()) {
	            updatedAmount += existingFee.get().getAmount(); // Add to existing amount
	        }

	        // Save updated amount
	        FeeEntity updatedFee = new FeeEntity(fee.getRollNumber(), updatedAmount);
	        feeRepository.save(updatedFee);

	        return "Amount updated successfully. New total: " + updatedAmount;
	    }

	@Override
	public List<FeeEntity> getAllFees() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Optional<FeeEntity> findByRollNumber(String rollNumber) {
	     return feeRepository.findByRollNumber(rollNumber);
	    }
	
	@Override
	public String resetAdminPassword(String email, String newPassword) {
	    Optional<AdminTable> optionalAdmin = adminRepository.findByEmail(email);

	    if (!optionalAdmin.isPresent()) {
	        return "Admin not found!";
	    }

	    AdminTable admin = optionalAdmin.get();
	    admin.setPassword(newPassword); // Store as plain text
	    adminRepository.save(admin);

	    return "Password updated successfully!";
	}

	@Override
	public int getTotalDaysInMonth() {
		// TODO Auto-generated method stub
		return 0;
	}

}
