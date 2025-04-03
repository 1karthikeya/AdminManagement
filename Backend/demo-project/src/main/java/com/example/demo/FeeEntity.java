package com.example.demo;

import jakarta.persistence.*;

@Entity
@Table(name = "fees")
public class FeeEntity {
    @Id
    @Column(name = "roll_number", nullable = false, unique = true)
    private String rollNumber; // Ensure roll number is a String

    @Column(name = "amount", nullable = false)
    private Double amount;

    public FeeEntity() {}

    public FeeEntity(String rollNumber, Double amount) {
        this.rollNumber = rollNumber;
        this.amount = amount;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}
