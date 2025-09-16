# Livestreaming App Blueprint

## Overview

This document outlines the development plan for a mobile-first livestreaming application with interactive live chat features, similar in spirit to platforms like TikTok. The goal is to create an engaging and modern user experience.

## Core Features

*   **Livestreaming:** The ability for users to watch livestreams.
    *   **Multi-guest Streaming:** Allow up to 10 guests to join a single stream.
    *   **Instrumental Uploads & Mixing:** Allow users to upload their own instrumentals and control the volume mix with their vocals.
*   **Live Chat:** Real-time chat functionality for viewers to interact with the streamer and each other.
*   **Mobile-First Design:** A responsive layout that prioritizes the mobile user experience.
*   **Modern UI/UX:** A visually appealing and intuitive interface with modern design elements.

## Technology Stack

*   **Frontend:** React (with Vite)
*   **Routing:** `react-router-dom`
*   **Styling:** Material-UI with a custom dark theme.
*   **Real-time Communication:** Firebase Realtime Database for the live chat.
*   **Video Streaming:** Agora for handling multi-guest video streaming.
*   **Audio Processing:** Web Audio API for mixing and processing audio.
*   **Testing:** Vitest and React Testing Library.

## Development Plan

*   **Project Setup & Cleanup:** Establish the initial project structure, remove boilerplate code, and set up basic configurations.
*   **Basic Layout & Routing:** Create the main application layout (header, content, footer) and implement routing for navigation between different pages.
*   **Home Page:** Develop the home page to display a list of available livestreams.
*   **Livestream Page:** Create the page for viewing a specific livestream, including a placeholder for the video and the chat interface.
*   **Chat Implementation:** Integrate Firebase to enable real-time chat functionality.
*   **Multi-guest Video:** Integrate a video streaming service to handle multi-guest streaming.
*   **Instrumental Feature:** Implement instrumental uploads and audio mixing.
*   **Styling and UI/UX:** Apply a modern design to the application, focusing on a mobile-first experience. This will include colors, typography, and interactive elements.
*   **Testing:** Write tests for the application's components and functionality.

## Implemented Changes

*   **Firebase Integration:**
    *   Added the `firebase` package to the project.
    *   Created a `src/firebase.js` file to initialize and configure Firebase. **(Note: Requires user to input their own Firebase project credentials).**
    *   Configured the necessary Firebase server settings in `.idx/mcp.json`.
*   **Chat Feature:**
    *   Created `src/components/Chat.jsx` for handling chat messages, including real-time listening and sending functionality using Firebase Realtime Database.
    *   Created `src/components/Chat.css` for styling the chat interface, ensuring a modern and responsive design.
    *   Integrated the `Chat` component into `src/pages/Livestream.jsx`, replacing the previous inline chat implementation.
    *   Added a "Request to Join" button to the chat, allowing viewers to request to join the livestream.
*   **Video Streaming:**
    *   Installed the `agora-rtc-react` and `agora-rtc-sdk-ng` packages.
    *   Created a reusable `AgoraVideoPlayer` component in `src/components/AgoraVideoPlayer.jsx`.
    *   Integrated the `AgoraVideoPlayer` into the `Livestream.jsx` page.
    *   Implemented multi-guest video streaming by dynamically adjusting the grid layout to accommodate multiple local and remote users, improving the visual presentation of participants during a livestream.
    *   **Agora project is now connected. The user has been guided on how to add their App ID and token.**
*   **Viewer Management:**
    *   Created a `ViewerList` component to display a real-time list of viewers in the livestream.
    *   Added a "Join Requests" section to the `Livestream` page where the host can accept or decline requests to join the stream.
*   **Instrumental Feature:**
    *   Implemented instrumental audio file uploads and integrated volume controls within the mixing console on the `Livestream` page.
    *   Utilized the Web Audio API for decoding and playing uploaded instrumentals and managing audio gain for both instrumental and vocal tracks.
*   **Code Quality & Cleanup:**
    *   Removed the unused `src/services/websocket.js` file.
    *   Fixed a missing dependency in a `useEffect` hook in `Livestream.jsx` and verified with the linter.
    *   Added an auto-scrolling feature to the chat window to keep the latest messages in view.
    *   Resolved linting errors in the `AgoraVideoPlayer` component.
*   **Modern UI/UX:**
    *   Added the 'Rubik' and 'Roboto' fonts from Google Fonts.
    *   Created a custom dark theme using Material-UI.
    *   Applied the new theme to the entire application.
    *   Redesigned the `Livestream` page with a more modern, immersive layout.
    *   Redesigned the `Home` page with a clean, card-based layout.
    *   Updated the `Header` to match the new dark theme.
*   **Testing Setup:**
    *   Installed `vitest`, `@testing-library/react`, and `@testing-library/jest-dom` as development dependencies.
    *   Configured `package.json` to include a `test` script that runs `vitest`.
    *   Updated `vite.config.js` to configure Vitest with `globals: true`, `environment: 'jsdom'`, and `setupFiles: './src/setupTests.js'`.
    *   Created `src/setupTests.js` to import `@testing-library/jest-dom` for extended Jest matchers.
