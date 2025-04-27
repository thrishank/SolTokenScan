/**
 * Checks if a string is a valid Solana public key
 * @param address The string to check
 * @returns boolean indicating whether the string is a valid Solana public key
 */
export function isSolanaPublicKey(address: string): boolean {
  // Solana public keys are base58-encoded and 44 characters long
  const solanaPublicKeyRegex = /^[1-9A-HJ-NP-Za-km-z]{43,44}$/;
  return solanaPublicKeyRegex.test(address);
}

export const format_number = (num: number) => {
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`; // Billion
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`; // Million
  } else {
    return `$${num.toFixed(2)}`; // Default formatting
  }
};

export const format_token_data_html = (
  token_data: any,
  holders?: number,
  rug_score?: number,
) => {
  const rugScoreDot = rug_score && rug_score > 300 ? "🔴" : "🟢";
  return `
    <b>${token_data.name} (${token_data.symbol.toUpperCase()})</b>
Price: ${format_number(token_data.price)} 
24hr Change: ${token_data.price_change_percentage_24h.toFixed(2)}%
7d Change: ${token_data.price_change_percentage_7d.toFixed(2)}%
Market Cap: ${format_number(token_data.market_cap)}
Volume: ${format_number(token_data.total_volume)} 
${holders ? "Holders: " + holders : ""}
${rug_score ? `Rug Check Score: ${rugScoreDot} ${rug_score}` : ""}
Decentralisation Score: ${token_data.score}\n
🚀 <a href="${token_data.url}">View on Bubblemaps</a>
  `;
};
