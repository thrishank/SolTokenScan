export async function price(network: string, address: string) {
  const coingeckoUrl = `https://api.coingecko.com/api/v3/coins/id/contract/${address}?x_cg_demo_api_key=CG-FQrb4ThLv32HZUqbvDHzqxHR`;
  const bubblemapsUrl = `https://api-legacy.bubblemaps.io/map-metadata?chain=${network}&token=${address}`;

  let coingeckoData: any = null;
  let score: number | null = null;

  try {
    const res = await fetch(coingeckoUrl, {
      method: "GET",
      headers: { accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Coingecko API error: ${res.status} ${res.statusText}`);
    }

    coingeckoData = await res.json();
  } catch (err) {
    console.error("Failed to fetch from Coingecko:", err);
  }

  try {
    const scoreRes = await fetch(bubblemapsUrl);
    if (!scoreRes.ok) {
      throw new Error(`Bubblemaps API error: ${scoreRes.status}`);
    }

    const scoreData = await scoreRes.json();
    score = scoreData?.decentralisation_score ?? null;
  } catch (err) {
    console.error("Failed to fetch from Bubblemaps:", err);
  }

  if (!coingeckoData) return null;

  const data = coingeckoData.market_data;

  const tokenData = {
    name: coingeckoData.name,
    symbol: coingeckoData.symbol,
    price: data?.current_price?.usd ?? null,
    market_cap: data?.market_cap?.usd ?? null,
    fully_diluted_valuation: data?.fully_diluted_valuation?.usd ?? null,
    total_volume: data?.total_volume?.usd ?? null,
    price_change_percentage_24h: data?.price_change_percentage_24h ?? null,
    price_change_percentage_7d: data?.price_change_percentage_7d ?? null,
    score,
    url: `https://app.bubblemaps.io/${network}/token/${address}`,
  };

  console.log(tokenData);
  return tokenData;
}
