const requestOptions = {
  headers: {
    method: "GET",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3MzM5MjYwODU1MTUsImVtYWlsIjoidGhyaXNoYW5ra2FsbHVydUBnbWFpbC5jb20iLCJhY3Rpb24iOiJ0b2tlbi1hcGkiLCJhcGlWZXJzaW9uIjoidjIiLCJpYXQiOjE3MzM5MjYwODV9.3NpAd_tGQ3LmRS3b7ZGQ5xnfNZXR3lSRUJqWhTWrsi8",
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
