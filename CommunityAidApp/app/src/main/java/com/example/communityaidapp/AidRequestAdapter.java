package com.example.communityaidapp;

import android.database.Cursor;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

public class AidRequestAdapter extends RecyclerView.Adapter<AidRequestAdapter.ViewHolder> {
    
    private Cursor cursor;
    private OnItemClickListener listener;
    
    public interface OnItemClickListener {
        void onItemClick(AidRequest aidRequest);
    }
    
    public AidRequestAdapter(Cursor cursor, OnItemClickListener listener) {
        this.cursor = cursor;
        this.listener = listener;
    }
    
    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_aid_request, parent, false);
        return new ViewHolder(view);
    }
    
    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        if (cursor != null && cursor.moveToPosition(position)) {
            AidRequest aidRequest = getAidRequestFromCursor(cursor);
            holder.bind(aidRequest);
        }
    }
    
    @Override
    public int getItemCount() {
        return cursor != null ? cursor.getCount() : 0;
    }
    
    public void updateCursor(Cursor newCursor) {
        if (cursor != null) {
            cursor.close();
        }
        cursor = newCursor;
        notifyDataSetChanged();
    }
    
    private AidRequest getAidRequestFromCursor(Cursor cursor) {
        long id = cursor.getLong(cursor.getColumnIndexOrThrow(DatabaseHelper.COLUMN_ID));
        String name = cursor.getString(cursor.getColumnIndexOrThrow(DatabaseHelper.COLUMN_NAME));
        String aidType = cursor.getString(cursor.getColumnIndexOrThrow(DatabaseHelper.COLUMN_AID_TYPE));
        double amount = cursor.getDouble(cursor.getColumnIndexOrThrow(DatabaseHelper.COLUMN_AMOUNT));
        String dateCreated = cursor.getString(cursor.getColumnIndexOrThrow(DatabaseHelper.COLUMN_DATE_CREATED));
        
        return new AidRequest(id, name, aidType, amount, dateCreated);
    }
    
    class ViewHolder extends RecyclerView.ViewHolder {
        private TextView nameTextView;
        private TextView aidTypeTextView;
        private TextView amountTextView;
        
        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            nameTextView = itemView.findViewById(R.id.text_name);
            aidTypeTextView = itemView.findViewById(R.id.text_aid_type);
            amountTextView = itemView.findViewById(R.id.text_amount);
            
            itemView.setOnClickListener(v -> {
                int position = getAdapterPosition();
                if (position != RecyclerView.NO_POSITION && cursor != null && cursor.moveToPosition(position)) {
                    AidRequest aidRequest = getAidRequestFromCursor(cursor);
                    if (listener != null) {
                        listener.onItemClick(aidRequest);
                    }
                }
            });
        }
        
        public void bind(AidRequest aidRequest) {
            nameTextView.setText(aidRequest.getName());
            aidTypeTextView.setText(aidRequest.getAidType());
            amountTextView.setText(String.format("$%.2f", aidRequest.getAmount()));
            
            // Set different colors for different aid types
            if ("Medical".equals(aidRequest.getAidType())) {
                aidTypeTextView.setBackgroundResource(R.drawable.bg_medical);
            } else {
                aidTypeTextView.setBackgroundResource(R.drawable.bg_debt);
            }
        }
    }
}