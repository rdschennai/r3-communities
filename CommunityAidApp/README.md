# Community Aid App

An Android application built in Java that allows users to view and submit community aid requests. The app uses SQLite database to store aid requests and displays them in a RecyclerView.

## Features

- **Main Activity**: Displays a list of community aid requests using RecyclerView
- **Database Integration**: SQLite database with sample data for aid requests
- **Add Request Form**: Form activity to submit new aid requests
- **Floating Action Button**: Quick access to add new requests
- **Material Design**: Modern UI with Material Design components

## Database Schema

The app uses a SQLite database with the following table structure:

```sql
CREATE TABLE aid_requests (
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    aid_type TEXT NOT NULL,
    amount REAL NOT NULL,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Aid Request Types

- **Medical**: For medical expenses and healthcare needs
- **Debt**: For debt relief and financial assistance

## Sample Data

The app comes with sample data:
- John Smith - Medical - $2,500.00
- Sarah Johnson - Debt - $1,500.00
- Mike Davis - Medical - $3,200.00

## Project Structure

```
CommunityAidApp/
├── app/
│   ├── src/main/
│   │   ├── java/com/example/communityaidapp/
│   │   │   ├── MainActivity.java
│   │   │   ├── AddAidRequestActivity.java
│   │   │   ├── DatabaseHelper.java
│   │   │   ├── AidRequest.java
│   │   │   └── AidRequestAdapter.java
│   │   ├── res/
│   │   │   ├── layout/
│   │   │   │   ├── activity_main.xml
│   │   │   │   ├── activity_add_aid_request.xml
│   │   │   │   └── item_aid_request.xml
│   │   │   ├── values/
│   │   │   │   ├── colors.xml
│   │   │   │   ├── strings.xml
│   │   │   │   └── styles.xml
│   │   │   └── drawable/
│   │   │       ├── bg_medical.xml
│   │   │       ├── bg_debt.xml
│   │   │       └── ic_add.xml
│   │   └── AndroidManifest.xml
│   └── build.gradle
├── build.gradle
├── settings.gradle
└── README.md
```

## Building and Running

1. **Prerequisites**:
   - Android Studio (latest version)
   - Android SDK (API level 21 or higher)
   - Java 8 or higher

2. **Open Project**:
   - Open Android Studio
   - Select "Open an existing Android Studio project"
   - Navigate to the `CommunityAidApp` folder and select it

3. **Build and Run**:
   - Connect an Android device or start an emulator
   - Click the "Run" button (green play icon) in Android Studio
   - The app will be installed and launched on your device/emulator

## Key Components

### MainActivity
- Displays the list of aid requests using RecyclerView
- Handles the FloatingActionButton to add new requests
- Manages database operations and cursor lifecycle

### AddAidRequestActivity
- Form for submitting new aid requests
- Input validation for name and amount
- Radio buttons for selecting aid type (Medical/Debt)

### DatabaseHelper
- SQLite database management
- CRUD operations for aid requests
- Sample data insertion

### AidRequestAdapter
- RecyclerView adapter for displaying aid requests
- Handles cursor data binding
- Different background colors for different aid types

## Dependencies

- `androidx.appcompat:appcompat:1.6.1`
- `com.google.android.material:material:1.9.0`
- `androidx.recyclerview:recyclerview:1.3.0`
- `androidx.cardview:cardview:1.0.0`
- `androidx.constraintlayout:constraintlayout:2.1.4`

## Screenshots

The app features:
- Clean, modern Material Design interface
- Card-based layout for aid requests
- Color-coded aid types (green for Medical, orange for Debt)
- Floating action button for easy access to add new requests
- Form validation and user feedback

## Future Enhancements

Potential improvements could include:
- Search and filter functionality
- Edit and delete existing requests
- User authentication
- Cloud database integration
- Push notifications for new requests
- Image upload for supporting documents