# 🚁 Drone Planner

An intelligent route planning system for agricultural drones using AI-powered optimization.

## Overview

Drone Planner is a web application that helps farmers and agricultural operators plan optimal flight paths for drone-based crop treatment. Using AI analysis, it generates detailed spraying plans customized to specific crop conditions, field geometry, and application needs.

## Features

- **Smart Route Planning** — AI generates optimal flight patterns (Z-pattern, L-shaped, etc.) based on field shape
- **Precise Calculations** — Estimates fertilizer/pesticide quantities, flight duration, and coverage area
- **Visual Field Grid** — Interactive visualization of the drone's flight path with start/end markers
- **Real-time Analysis** — Detailed recommendations including altitude, speed, and priority zones
- **Professional Design** — Modern green agricultural aesthetic with smooth animations

## Tech Stack

- **Frontend**: Vite + JavaScript Vanilla
- **AI Integration**: OpenRouter API (GPT-OSS 20B model)
- **Styling**: Custom CSS with agricultural green theme
- **Markdown Rendering**: Marked.js

## Installation

1. Clone the repository:
```bash
git clone https://github.com/EdgarCorzo777/drone-planner.git
cd drone-planner
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
VITE_OPENROUTER_API_KEY=your_api_key_here

Get your free API key from [OpenRouter](https://openrouter.ai)

4. Run the development server:
```bash
npm run dev
```

5. Open `http://localhost:5173` in your browser

## Usage

1. Enter your crop details:
   - Crop type (Corn, Coffee, Rice, etc.)
   - Field area in hectares
   - Field shape (rectangular, irregular, triangular, L-shaped)
   - Input to apply (water, fertilizer, pesticide, fungicide)
   - Current crop condition

2. Click "Generate route plan"

3. AI will analyze and generate:
   - Optimal flight pattern recommendation
   - Flight altitude and speed
   - Estimated chemical quantity needed
   - Number of flight strips
   - Priority zones
   - Total operation time
   - Crop-specific recommendations

4. Visual grid shows the flight path with start (S) and end (E) markers

## Build for Production

```bash
npm run build
```

This generates a `dist` folder with optimized static files ready for deployment.

## Deployment

### Netlify (Recommended)

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Set build command: `npm run build`
6. Set publish directory: `dist`
7. Add environment variable: `VITE_OPENROUTER_API_KEY`
8. Deploy

### Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Vercel auto-detects Vite
4. Add environment variable: `VITE_OPENROUTER_API_KEY`
5. Deploy

## Project Structure
drone-planner/
├── src/
│   ├── main.js          # App logic and AI integration
│   ├── style.css        # Styling
│   └── assets/          # Images and icons
├── index.html           # Entry point
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── .env                 # API keys (not committed)

## How It Works

1. **Data Collection**: User inputs field and crop information
2. **AI Analysis**: OpenRouter GPT-OSS model analyzes the data
3. **Plan Generation**: AI generates detailed spraying plan with:
   - Flight pattern optimization
   - Resource estimation
   - Time calculations
   - Risk assessment
4. **Visualization**: Field grid shows the planned route visually
5. **Actionable Output**: Farmer can implement the plan immediately

## Performance

- **Generation Time**: ~30 seconds (depends on API latency)
- **Field Visualization**: Real-time grid rendering
- **Responsive**: Works on desktop and tablet devices

## Future Enhancements

- Weather integration for optimal spraying conditions
- Multi-drone mission planning
- Historical data tracking and analytics
- Integration with popular drone autopilot software
- Soil analysis integration
- Pest detection via image upload

## License

No license - feel free to use this project for personal or commercial purposes.

## Author

Created as part of a precision agriculture automation project using AI-powered drone optimization.

## Support

For issues or suggestions, please open a GitHub issue.

---

**Note**: This project requires an active OpenRouter API key. Free tier includes generous rate limits suitable for development and testing.
