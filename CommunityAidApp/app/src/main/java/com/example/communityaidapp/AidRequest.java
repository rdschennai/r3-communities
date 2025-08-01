package com.example.communityaidapp;

public class AidRequest {
    private long id;
    private String name;
    private String aidType;
    private double amount;
    private String dateCreated;
    
    public AidRequest() {
        // Default constructor
    }
    
    public AidRequest(String name, String aidType, double amount) {
        this.name = name;
        this.aidType = aidType;
        this.amount = amount;
    }
    
    public AidRequest(long id, String name, String aidType, double amount, String dateCreated) {
        this.id = id;
        this.name = name;
        this.aidType = aidType;
        this.amount = amount;
        this.dateCreated = dateCreated;
    }
    
    // Getters and Setters
    public long getId() {
        return id;
    }
    
    public void setId(long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getAidType() {
        return aidType;
    }
    
    public void setAidType(String aidType) {
        this.aidType = aidType;
    }
    
    public double getAmount() {
        return amount;
    }
    
    public void setAmount(double amount) {
        this.amount = amount;
    }
    
    public String getDateCreated() {
        return dateCreated;
    }
    
    public void setDateCreated(String dateCreated) {
        this.dateCreated = dateCreated;
    }
}