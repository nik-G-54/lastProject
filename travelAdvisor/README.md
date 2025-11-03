# Travel Advisor (Vite + Tailwind)

A modern rebuild of the Travel Advisor experience using **Vite**, **React**, and **Tailwind CSS**. Explore nearby restaurants, hotels, and attractions on an interactive Google Map with live weather overlays and rich place details fetched from RapidAPI services.

## ✨ Features

- Google Maps with custom styling and responsive layout
- Autocomplete search for cities, addresses, and landmarks
- Filterable list of restaurants, hotels, and attractions
- Detailed place cards with cuisine tags, awards, contact info, and external links
- Weather overlay powered by Open Weather Map (via RapidAPI)
- Fully responsive UI built with Tailwind CSS components

## 🧱 Tech Stack

- [Vite](https://vitejs.dev/) + [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [@react-google-maps/api](https://github.com/JustFly1984/react-google-maps-api)
- [RapidAPI – Travel Advisor & Open Weather Map](https://rapidapi.com/)
- [Axios](https://axios-http.com/)

## ✅ Prerequisites

- Node.js **18+** (Node 20+ recommended)
- npm **9+**
- API keys for Google Maps and RapidAPI services

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create an environment file and add your API keys
cp .env.example .env

# 3. Start the development server
npm run dev

# 4. Open the app in your browser
# http://localhost:5173
```

> **Note:** The `.env.example` file could not be committed automatically in this environment. Create a `.env` file manually (see below) before running the app.

## 🔑 Environment Variables

Create a `.env` file at the project root and add the following keys:

```env
VITE_GOOGLE_MAP_API_KEY=your_google_maps_api_key
VITE_RAPID_API_TRAVEL_API_KEY=your_rapidapi_travel_advisor_key
VITE_RAPID_API_WEATHER_API_KEY=your_rapidapi_open_weather_key
```

- **Google Maps JavaScript API**: enable the Maps JavaScript API in the Google Cloud Console and create a browser key.
- **RapidAPI Travel Advisor**: subscribe to [`travel-advisor` API](https://rapidapi.com/apidojo/api/travel-advisor/).
- **RapidAPI Open Weather Map**: subscribe to [`community-open-weather-map` API](https://rapidapi.com/community/api/open-weather-map/).

Restart the dev server after updating environment variables.

## 📁 Project Structure

```
travelAdvisor/
├── public/
├── src/
│   ├── api/
│   │   └── travelAdvisor.js
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── List.jsx
│   │   ├── Loader.jsx
│   │   ├── Map.jsx
│   │   ├── PlaceCard.jsx
│   │   └── RatingStars.jsx
│   ├── constants/
│   │   └── mapStyles.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── vite.config.js
```

## 📜 Available Scripts

- `npm run dev` – start the Vite dev server
- `npm run build` – generate a production build
- `npm run preview` – preview the production build locally
- `npm run lint` – run ESLint

## 🧪 Testing the Experience

1. Start the dev server: `npm run dev`
2. Open `http://localhost:5173`
3. Allow location access or search for a city via the top-right search bar
4. Use the filters in the left panel to refine results by type and rating
5. Click items in the list or markers on the map to highlight places

## 🛟 Troubleshooting

| Issue | Fix |
| --- | --- |
| Map isn’t loading / search disabled | Ensure `VITE_GOOGLE_MAP_API_KEY` is set and restart the server |
| No places returned | Move the map to a different area or reduce filters |
| Weather icons missing | Confirm the RapidAPI weather key is valid |
| npm errors about dependencies | Run `npm install` again or delete `node_modules` and reinstall |

## 📄 License

This project is provided as a learning resource. Check individual API terms (Google Maps & RapidAPI) before commercial use.

