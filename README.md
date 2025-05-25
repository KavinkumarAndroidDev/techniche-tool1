# LinkedIn Post Generator

An AI-powered tool for generating professional LinkedIn posts using the Gemini API.

## Features

- Generate LinkedIn posts with AI assistance
- Customize post length, tone, and format
- Target specific audiences
- Include emojis and hashtags
- Character count tracking
- Google AdSense integration

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Building for Production

```bash
npm run build
```

## Google AdSense Integration

1. Sign up for Google AdSense
2. Get your AdSense client ID
3. Update the client ID in `index.html` and `AdComponent.tsx`
4. Create ad units in your AdSense account
5. Add the `AdComponent` to your layout or pages

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Google Gemini API
- Google AdSense

## License

MIT
