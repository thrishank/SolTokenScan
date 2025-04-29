const requestOptions = {
  headers: {
    method: "GET",
    token:
      "",
  },
};

export async function token_meta(address: string) {
  try {
    const res = await fetch(
      `https://pro-api.solscan.io/v2.0/token/meta?address=${address}`,
      requestOptions,
    );
    const data = await res.json();
    return data.data.holder;
  } catch (err) {
    console.error(err);
  }
}

export async function trending_tokens() {
  try {
    const res = await fetch(
      `https://pro-api.solscan.io/v2.0/token/trending?limit=5`,
      requestOptions,
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}
