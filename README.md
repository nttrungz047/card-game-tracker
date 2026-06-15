# Card Game Tracker

A simple browser-based score tracker for card game rounds.

## Features

- Add and manage players
- Enter round scores for each player
- View totals, averages, and cumulative score charts
- Edit or delete past rounds
- Persist data in browser localStorage
- Reset all data

## Usage

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the local URL shown by Vite.
4. Add players in the "Người chơi" section.
5. Click **Bắt đầu / Cập nhật danh sách**.
6. Enter the number of cards for each player in the "Vòng mới" section.
7. Click **Lưu vòng này**.
8. Review totals and chart data in the "Dashboard".
9. Edit or delete rounds from the "Lịch sử các vòng" section.

## Build and deploy

- Build the app:
  ```bash
  npm run build
  ```
- Preview the production build:
  ```bash
  npm run preview
  ```
- Deploy to GitHub Pages:
  ```bash
  npm run deploy
  ```

## Notes

- Data is saved locally in your browser.
- Reloading the page restores the current game state.
- Resetting clears all players and rounds.
