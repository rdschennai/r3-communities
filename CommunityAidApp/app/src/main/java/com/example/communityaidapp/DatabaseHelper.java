package com.example.communityaidapp;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class DatabaseHelper extends SQLiteOpenHelper {
    
    private static final String DATABASE_NAME = "CommunityAidDB";
    private static final int DATABASE_VERSION = 1;
    
    // Table name and columns
    public static final String TABLE_AID_REQUESTS = "aid_requests";
    public static final String COLUMN_ID = "_id";
    public static final String COLUMN_NAME = "name";
    public static final String COLUMN_AID_TYPE = "aid_type";
    public static final String COLUMN_AMOUNT = "amount";
    public static final String COLUMN_DATE_CREATED = "date_created";
    
    // Create table SQL statement
    private static final String CREATE_TABLE_AID_REQUESTS = 
        "CREATE TABLE " + TABLE_AID_REQUESTS + " (" +
        COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
        COLUMN_NAME + " TEXT NOT NULL, " +
        COLUMN_AID_TYPE + " TEXT NOT NULL, " +
        COLUMN_AMOUNT + " REAL NOT NULL, " +
        COLUMN_DATE_CREATED + " DATETIME DEFAULT CURRENT_TIMESTAMP" +
        ")";
    
    public DatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }
    
    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL(CREATE_TABLE_AID_REQUESTS);
        
        // Insert some sample data
        insertSampleData(db);
    }
    
    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_AID_REQUESTS);
        onCreate(db);
    }
    
    private void insertSampleData(SQLiteDatabase db) {
        ContentValues values = new ContentValues();
        
        // Sample data 1
        values.put(COLUMN_NAME, "John Smith");
        values.put(COLUMN_AID_TYPE, "Medical");
        values.put(COLUMN_AMOUNT, 2500.00);
        db.insert(TABLE_AID_REQUESTS, null, values);
        
        // Sample data 2
        values.clear();
        values.put(COLUMN_NAME, "Sarah Johnson");
        values.put(COLUMN_AID_TYPE, "Debt");
        values.put(COLUMN_AMOUNT, 1500.00);
        db.insert(TABLE_AID_REQUESTS, null, values);
        
        // Sample data 3
        values.clear();
        values.put(COLUMN_NAME, "Mike Davis");
        values.put(COLUMN_AID_TYPE, "Medical");
        values.put(COLUMN_AMOUNT, 3200.00);
        db.insert(TABLE_AID_REQUESTS, null, values);
    }
    
    public long insertAidRequest(String name, String aidType, double amount) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        
        values.put(COLUMN_NAME, name);
        values.put(COLUMN_AID_TYPE, aidType);
        values.put(COLUMN_AMOUNT, amount);
        
        return db.insert(TABLE_AID_REQUESTS, null, values);
    }
    
    public Cursor getAllAidRequests() {
        SQLiteDatabase db = this.getReadableDatabase();
        return db.query(
            TABLE_AID_REQUESTS,
            null,
            null,
            null,
            null,
            null,
            COLUMN_DATE_CREATED + " DESC"
        );
    }
}