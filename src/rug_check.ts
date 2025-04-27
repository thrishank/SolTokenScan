interface TokenCheck {
  tokenProgram: string;
  tokenType: string;
  risks: Array<{
    name: string;
    level: string;
    description: string;
    score: number;
    value: string | number;
  }>;
  score: number;
}
const BASE_URL = "https://api.rugcheck.xyz/v1";
export async function rug_check(mint: string): Promise<TokenCheck | null> {
  try {
    const response = await fetch(`${BASE_URL}/tokens/${mint}/report/summary`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error: any) {
    console.error(
      `Error fetching report summary for token ${mint}:`,
      error.message,
    );
    return {
      tokenProgram: "",
      tokenType: "",
      risks: [],
      score: 10000,
    };
  }
}
