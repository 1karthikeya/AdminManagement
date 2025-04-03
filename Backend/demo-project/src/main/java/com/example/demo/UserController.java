package com.example.demo;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")  // ✅ Correct way
@RequestMapping("/api")
public class UserController {
	
	@Autowired
	  private FeeRepository feeService;
	
    @Autowired
    private AttendanceRepo attendanceService; // ✅ Changed from attendanceService

    @Autowired
    private UserService userService;

    @Autowired
    private JavaMailSender mailSender;

    public void UserController(FeeRepository feeService) {
        this.feeService = feeService;
    }


    @PostMapping("check")
    public ResponseEntity<String> createUser(@RequestBody AdminTable admin) {
        if (userService.userExists(admin.getEmail(), admin.getMobile())) {
            return new ResponseEntity<>("User with this email or mobile already exists!", HttpStatus.BAD_REQUEST);
        }
        userService.saveUser(admin);
        return new ResponseEntity<>("User created successfully", HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminTable> getUser(@PathVariable Long id) {
        AdminTable admin = userService.getUser(id);
        return admin != null ? ResponseEntity.ok(admin) : ResponseEntity.notFound().build();
    }

    @PostMapping("/test-email")
    public void testEmail() {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo("rajeshmodela@gmail.com");
        mailMessage.setSubject("Welcome!!!");
        mailMessage.setText("This is a test email.");
        mailSender.send(mailMessage);
        System.out.println("Test email sent successfully.");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        if (userService.validateLogin(email, password)) {
            return ResponseEntity.ok("Login successful!");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
        }
    }

    @PostMapping("/save")
    public ResponseEntity<String> saveUser(@RequestBody UserTable user) {
        try {
            userService.saveUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to register user");
        }
    }
    
    //reset-password
    @PostMapping("/admin/reset-password")
    public String resetAdminPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");

        return userService.resetAdminPassword(email, newPassword);
    }
    
    
    

    @GetMapping("/all")
    public List<UserTable> getAllUsers() {
        return userService.getAllUsers();
    }

    // ✅ FIXED: Email Decoding to handle %40 issue
    @GetMapping("/user")
    public ResponseEntity<UserTable> getUserByEmail(@RequestParam String email) {
        String decodedEmail = URLDecoder.decode(email, StandardCharsets.UTF_8);
        System.out.println("Fetching user for email: " + decodedEmail);

        UserTable user = userService.findByEmail(decodedEmail);

        if (user != null) {
            System.out.println("User found: " + user.getEmail());
            return ResponseEntity.ok(user);
        } else {
            System.out.println("User not found for email: " + decodedEmail);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateUser(@RequestBody UserTable updatedUser) {
        Optional<UserTable> updated = userService.updateUser(updatedUser);
        return updated.isPresent() 
            ? ResponseEntity.ok("User updated successfully!") 
            : ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found!");
    }

   
    public void AttendanceController(AttendanceRepo attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/saveAttendance")
    public ResponseEntity<String> saveAttendance(@RequestBody List<Attendance> attendanceList) {
        if (attendanceList == null || attendanceList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing attendance data");
        }

        for (Attendance attendance : attendanceList) {
            if (attendance.getRollNumber() == null || attendance.getDate() == null || attendance.getStatus() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid attendance entry");
            }
            userService.saveAttendance(attendance);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body("Attendance records updated successfully");
    }
    
    
    
    @GetMapping("/monthlyAttendance")
    public ResponseEntity<?> getMonthlyAttendance() {
        try {
            LocalDate now = LocalDate.now();
            YearMonth currentMonth = YearMonth.from(now);

            // ✅ Ensure attendanceList is never null
            List<Attendance> attendanceList = attendanceService.findByDateBetween(
                currentMonth.atDay(1), 
                currentMonth.atEndOfMonth()
            );

            if (attendanceList == null || attendanceList.isEmpty()) {
                return ResponseEntity.ok(Collections.emptyMap()); // ✅ Return empty map instead of null
            }

            Map<String, Long> presentCount = attendanceList.stream()
                .filter(a -> "Present".equalsIgnoreCase(a.getStatus()))
                .collect(Collectors.groupingBy(Attendance::getRollNumber, Collectors.counting()));

            Map<String, Integer> attendancePercentage = new HashMap<>();
            for (String rollNumber : presentCount.keySet()) {
                int totalDays = now.getDayOfMonth();  // ✅ Number of days in the month
                int presentDays = presentCount.get(rollNumber).intValue();
                int percentage = (int) ((presentDays / (double) totalDays) * 100);
                attendancePercentage.put(rollNumber, percentage);
            }

            return ResponseEntity.ok(attendancePercentage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching monthly attendance: " + e.getMessage());
        }
    }




    
    @GetMapping("/attendance")
    public ResponseEntity<List<Attendance>> getAttendanceByDate(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Attendance> attendanceList = attendanceService.getAttendanceByDate(date);
        return attendanceList.isEmpty() 
            ? ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList())
            : ResponseEntity.ok(attendanceList);
    }
    
    
    
    @GetMapping("/yattendance")
    public ResponseEntity<Map<String, String>> getAttendanceByRollNumber(@RequestParam("rollNumber") String rollNumber) {
        LocalDate today = LocalDate.now(); // Current date

        int presentDays = userService.getPresentCountForMonth(rollNumber); // ✅ Fetch present count for the entire month
        int totalDays = YearMonth.from(today).lengthOfMonth(); // ✅ Get total days in the current month

        String attendance = presentDays + "/" + totalDays; // ✅ Correct format

        Map<String, String> response = new HashMap<>();
        response.put("attendance", attendance);

        return ResponseEntity.ok(response);
    }
    
    
    
    @GetMapping
    public ResponseEntity<Object> getAllFees() {
        return ResponseEntity.ok(feeService.getAllFees());
    }

    @GetMapping("/fees/{rollNumber}")  
    public ResponseEntity<?> getFeeByRollNumber(@PathVariable String rollNumber) {
        Optional<FeeEntity> optionalFee = feeService.findByRollNumber(rollNumber);

        if (optionalFee.isPresent()) {
            return ResponseEntity.ok(optionalFee.get());  // ✅ Return the fee if found
        } else {
            return ResponseEntity.ok(new FeeEntity(rollNumber, 0.0));  // ✅ Return rollNumber with null amount
        }
    }


    // ✅ Add or Update Fee
    @PostMapping("/add")
    public ResponseEntity<String> addOrUpdateFee(@RequestBody FeeEntity fee) {
        System.out.println("Received Fee Data: Roll Number = " + fee.getRollNumber() + ", Amount = " + fee.getAmount());

        if (fee.getRollNumber() == null || fee.getAmount() == null) {
            return ResponseEntity.badRequest().body("Roll number and amount are required.");
        }

        // ✅ Correct: Call the method on the injected instance, NOT statically
        String message = userService.addOrUpdateFee(fee);
        return ResponseEntity.ok(message);
    }

}
