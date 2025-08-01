package com.example.communityaidapp;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class AddAidRequestActivity extends AppCompatActivity {
    
    private EditText nameEditText;
    private EditText amountEditText;
    private RadioGroup aidTypeRadioGroup;
    private RadioButton medicalRadioButton;
    private RadioButton debtRadioButton;
    private Button submitButton;
    private Button cancelButton;
    private DatabaseHelper databaseHelper;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_aid_request);
        
        // Initialize database helper
        databaseHelper = new DatabaseHelper(this);
        
        // Initialize views
        nameEditText = findViewById(R.id.edit_text_name);
        amountEditText = findViewById(R.id.edit_text_amount);
        aidTypeRadioGroup = findViewById(R.id.radio_group_aid_type);
        medicalRadioButton = findViewById(R.id.radio_medical);
        debtRadioButton = findViewById(R.id.radio_debt);
        submitButton = findViewById(R.id.button_submit);
        cancelButton = findViewById(R.id.button_cancel);
        
        // Set default selection
        medicalRadioButton.setChecked(true);
        
        // Set up button listeners
        submitButton.setOnClickListener(v -> submitAidRequest());
        cancelButton.setOnClickListener(v -> finish());
    }
    
    private void submitAidRequest() {
        String name = nameEditText.getText().toString().trim();
        String amountStr = amountEditText.getText().toString().trim();
        
        // Validate input
        if (TextUtils.isEmpty(name)) {
            nameEditText.setError("Name is required");
            return;
        }
        
        if (TextUtils.isEmpty(amountStr)) {
            amountEditText.setError("Amount is required");
            return;
        }
        
        double amount;
        try {
            amount = Double.parseDouble(amountStr);
            if (amount <= 0) {
                amountEditText.setError("Amount must be greater than 0");
                return;
            }
        } catch (NumberFormatException e) {
            amountEditText.setError("Please enter a valid amount");
            return;
        }
        
        // Get selected aid type
        String aidType = medicalRadioButton.isChecked() ? "Medical" : "Debt";
        
        // Insert into database
        long result = databaseHelper.insertAidRequest(name, aidType, amount);
        
        if (result != -1) {
            // Success
            Intent resultIntent = new Intent();
            setResult(RESULT_OK, resultIntent);
            finish();
        } else {
            // Error
            Toast.makeText(this, "Failed to add aid request", Toast.LENGTH_SHORT).show();
        }
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (databaseHelper != null) {
            databaseHelper.close();
        }
    }
}