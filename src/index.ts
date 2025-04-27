import { Context, Markup, Telegraf } from "telegraf";
import * as fs from "fs";
import { format_token_data_html, isSolanaPublicKey } from "./utils";
import { bot_token, location } from "./env";
import { screenshot } from "./ss";
import { price } from "./price";
import { token_meta, trending_tokens } from "./solscan";
import { rug_check } from "./rug_check";

const bot = new Telegraf(bot_token);

const commands = [
  { command: "help", description: "information about the bot" },
  { command: "token", description: "Get solana token bubblemap and info" },
  {
    command: "rug_check",
    description: "Get token detailed rug check analysis",
  },
  { command: "bubblemap", description: "Get token bubblemap" },
  { command: "trending_tokens", description: "Get Trending Tokens on Solana" },
];

bot.telegram.setMyCommands(commands);

bot.use((ctx, next) => {
  console.log(ctx.message);
  next();
});

bot.start((ctx: Context) => {
  const bot_username = "Bubblemaps123_bot";
  return ctx.reply(
    escapeMarkdownV2(
      "👋 Hello! I can help you check token information and generate bubble maps.\n\n" +
        "🔹 Send me a *token address*.\n" +
        "🔹 Or use the commands below!",
    ),
    {
      parse_mode: "MarkdownV2",
      ...Markup.keyboard([
        ["/trending_tokens", "/rug_check"],
        ["/token", "/bubblemap"],
        ["➕ Add to Group"],
      ])
        .resize()
        .oneTime(), // optional: keyboard disappears after selection
    },
  );
});

bot.command("help", (ctx) => {
  ctx.reply(
    "Welcome to the bubblemaps bot. Enter any solana address to get the bubblemap and view rug_check score and other token information. In groups enter the address and tag the bot",
  );
});

let state = "none";
bot.command("rug_check", (ctx) => {
  state = "rug_check";
  ctx.reply(escapeMarkdownV2("📌 Enter the token address:"), {
    parse_mode: "MarkdownV2",
  });
});

bot.command("bubblemap", (ctx) => {
  state = "bubblemap";
  ctx.reply(escapeMarkdownV2("📌 Enter the token address:"), {
    parse_mode: "MarkdownV2",
  });
});

bot.command("token", (ctx) => {
  state = "token";
  ctx.reply(escapeMarkdownV2("📌 Enter the token address:"), {
    parse_mode: "MarkdownV2",
  });
});

bot.command("trending_tokens", async (ctx) => {
  const res = await trending_tokens();
  let message = "<b>Trending Token List</b>\n\n";

  res.data.forEach((token: any, index: number) => {
    message += `<a href="https://raydium.io/swap/?inputMint=sol&outputMint=${token.address}">${index + 1}. ${token.name}</a> - <code>${token.address}</code>\n`;
  });

  return ctx.replyWithHTML(message);
});

const userMessages = new Map();
bot.on("text", async (ctx) => {
  const userId = ctx.from.id;
  const isGroupChat = ctx.chat.type.includes("group");
  const botUsername = (await bot.telegram.getMe()).username;
  const messageText = ctx.message.text.trim();

  // If it's a group chat, ensure the bot is tagged
  if (isGroupChat && !messageText.includes(`@${botUsername}`)) {
    return;
  }

  // Extract address from the message
  const address = messageText.replace(`@${botUsername}`, "").trim();

  userMessages.set(userId, { contractAddress: address });

  if (!isSolanaPublicKey(address)) {
    return ctx.reply(
      escapeMarkdownV2(
        "❌  Invalid address. Please enter a valid contract address.\n\nExample:\n- Solana: `HvhG...w2FQ` \n- Ethereum: `0x1234...abcd`",
      ),
      { parse_mode: "MarkdownV2" },
    );
  }

  if (isSolanaPublicKey(address)) {
    if (state === "rug_check") {
      state = "none";

      const data = await rug_check(address);
      const rug_score = data?.score;
      const rugScoreDot = rug_score && rug_score > 300 ? "🔴" : "🟢";

      return ctx.reply(
        escapeMarkdownV2(
          `🔍 Rug Check Result

Overall Score: ${rugScoreDot} ${data!.score}

⚠️ Risks Identified:
${
  data!.risks.length > 0
    ? data!.risks
        .map(
          (risk, index) =>
            `${index + 1}. ${risk.name}
  • Level: ${risk.level === "warn" ? "⚠️ Warning" : risk.level}
  • Value: ${risk.value || "N/A"}
  • Description: ${risk.description}`,
        )
        .join("\n\n")
    : "✅ No major risks detected!"
}`,
        ),
        { parse_mode: "MarkdownV2" },
      );
    }

    if (state === "bubblemap") {
      const message = await ctx.reply(
        "⏳ Generating the bubblemap, please wait...",
      );
      const photoSource = `${location}/${address}_sol.png`;
      if (!fs.existsSync(photoSource)) {
        try {
          await screenshot("sol", address);
        } catch {
          return ctx.reply(
            "❌ Error generating the bubblemap. Please ensure it's a valid mint address and try again.",
          );
        }
      }

      await ctx.deleteMessage(message.message_id);
      return ctx.replyWithPhoto({ source: photoSource });
    }

    if (state === "token" || state === "none") {
      const message = await ctx.reply(
        "⏳ Generating the bubblemap, please wait...",
      );

      const token_data = await price("sol", address);
      const holders = await token_meta(address);
      const rug_score = await rug_check(address);
      const photoSource = `${location}/${address}_sol.png`;
      if (!fs.existsSync(photoSource)) {
        try {
          await screenshot("sol", address);
        } catch {
          return ctx.reply(
            "❌ Error generating the bubblemap. Please ensure it's a valid mint address and try again.",
          );
        }
      }

      await ctx.deleteMessage(message.message_id);

      if (!token_data) {
        return ctx.replyWithPhoto({ source: photoSource });
      }

      return await ctx.replyWithPhoto(
        {
          source: photoSource,
        },
        {
          caption: format_token_data_html(
            token_data,
            holders,
            rug_score?.score,
          ),
          parse_mode: "HTML",
        },
      );
    }
  }
});

function escapeMarkdownV2(text: string) {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

bot.launch().then(() => console.log("Bot is running!"));
