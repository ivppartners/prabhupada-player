# Business Requirements Document: Prabhupada Player

## 1. Project Overview
The Prabhupada Player is a web-based audio application designed to provide a premium interface for browsing, playing, and downloading audio files (specifically MP3s) served via a Node.js API.

## 2. Functional Requirements

### 2.1 File Management & Browsing
- **Metadata Retrieval**: Upon launch, the app must fetch a list of audio files and their associated metadata from the backend API.
- **File List Display**: A clean, responsive list view showing all available MP3 files.
- **Sorting**: Users must be able to sort the file list by:
  - Name
  - Size
  - Upload Date
  - Record Date
  - Description
- **Search/Filter**: (Optional but recommended) Ability to filter files by metadata fields.

### 2.2 Audio Player Features
- **Player Interface**: A designated "nice window" or overlay for active playback featuring:
  - **Album/Picture Art**: Displaying relevant imagery for the track.
  - **Metadata Display**: Showing title, description, and other relevant tags.
- **Playback Controls**:
  - Play / Pause
  - Skip Forward / Backward (e.g., 10-30 seconds)
  - Next / Previous Track
  - Volume / Loudness Control
  - Progress bar with seeking capability.

### 2.3 Download Functionality
- **Single Download**: Ability to download an individual MP3 file.
- **Bulk Download**: Ability to select multiple files and trigger a download.
- **Integration**: Downloads should use the provided API endpoint with the respective file IDs.

### 2.4 API Integration
- **Streaming**: Audio tracks must be streamed directly from the Node.js API using file IDs.
- **Endpoints**: (To be provided by user)
  - Metadata fetch endpoint.
  - Streaming/File delivery endpoint.
  - Download endpoint.

## 3. Technical Requirements
- **Framework**: React.js (Vite preferred).
- **Styling**: Tailwind CSS or Bootstrap (Tailwind preferred for rich aesthetics).
- **Icons**: FontAwesome.
- **Environment**: Modern web browsers.

## 4. UI/UX Requirements
- **Premium Design**: Vibrant colors, modern typography (e.g., Google Fonts), and smooth transitions.
- **Responsiveness**: Fully functional on desktop and mobile browsers.
- **Interactivity**: Hover effects, micro-animations, and a dynamic feel.
