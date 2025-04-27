# Solana TokenScan Telegram Bot

A powerful Telegram bot that visualizes token distribution and provides in-depth analytics for any token. The bot is designed to be user-friendly and efficient, making it easy for users to access bubble maps without needing to visit the Bubblemaps website.

## Features

- Get a bubblemap screenshot generated from Bubblemaps
- Token Rug Check analysis
- Display's key token information- price, market cap, volume, and more
- Supports inline usage in group chats by tagging the bot

## Demo

Try it live on Telegram: [@SolTokenScan_bot](https://t.me/@SolTokenScan_bot)

<https://t.me/SolTokenScan_bot>

You can:

- DM the bot with a token address
- Add it to a group and tag it with a contract address

https://github.com/user-attachments/assets/a70d4658-1f84-4a54-96b3-1d52e2fd29b0

## Setup

1. clone the repo and install the dependencies

```bash
https://github.com/thrishank/SolTokenScan.git
cd SolTokenScan
pnpm install
```

2. create a env.ts file in src/

```typescript
export const bot_token = "";
export const location = ""; // Folder to store bubblemap screenshots
```

3. start the bot

```bash
pnpm build
pnpm start
```

## Tech Stack and Architecture

- Typescript
- Telegraf.js – Telegram bot framework
- selenium-webdriver – Headless browser-based image generation
- token meta data from solscan api
