import { getNewsFromClaude } from "@/lib/news";

export async function GET() {
  const news = await getNewsFromClaude();
  return Response.json({ news });
}
