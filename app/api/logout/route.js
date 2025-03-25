export async function POST() {
  // Clear cookies/server session if any
  return new Response(JSON.stringify({ message: "Logged out" }), {
    status: 200,
  });
}
