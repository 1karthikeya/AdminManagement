package com.example.demo;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "attendance")
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String rollNumber;
    private LocalDate date;
    private String status;
    private int presentCount = 0; // Initialize with 0

    public Attendance() {}

    public Attendance(String rollNumber, LocalDate date, String status, int presentCount) {
        this.rollNumber = rollNumber;
        this.date = date;
        this.status = status;
        this.presentCount = presentCount;
    }

    // Getters and Setters
    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getPresentCount() { return presentCount; }
    public void setPresentCount(int presentCount) { this.presentCount = presentCount; }
}

