package com.example.communityaidapp;

import android.content.Intent;
import android.database.Cursor;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

public class MainActivity extends AppCompatActivity implements AidRequestAdapter.OnItemClickListener {
    
    private RecyclerView recyclerView;
    private AidRequestAdapter adapter;
    private DatabaseHelper databaseHelper;
    private static final int REQUEST_ADD_AID = 1;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        // Initialize database helper
        databaseHelper = new DatabaseHelper(this);
        
        // Initialize RecyclerView
        recyclerView = findViewById(R.id.recycler_view);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        
        // Load data and set adapter
        loadAidRequests();
        
        // Set up FloatingActionButton
        FloatingActionButton fab = findViewById(R.id.fab_add);
        fab.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this, AddAidRequestActivity.class);
            startActivityForResult(intent, REQUEST_ADD_AID);
        });
    }
    
    private void loadAidRequests() {
        Cursor cursor = databaseHelper.getAllAidRequests();
        adapter = new AidRequestAdapter(cursor, this);
        recyclerView.setAdapter(adapter);
    }
    
    @Override
    public void onItemClick(AidRequest aidRequest) {
        // Handle item click - could show details or edit
        Toast.makeText(this, 
            "Selected: " + aidRequest.getName() + " - " + aidRequest.getAidType(), 
            Toast.LENGTH_SHORT).show();
    }
    
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        
        if (requestCode == REQUEST_ADD_AID && resultCode == RESULT_OK) {
            // Refresh the list after adding a new aid request
            loadAidRequests();
            Toast.makeText(this, "Aid request added successfully!", Toast.LENGTH_SHORT).show();
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