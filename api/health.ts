export default function handler(_req: any, res: any) {
  return res.status(200).json({
    success: true,
    status: "ok",
    mode: "serverless-safe",
    message: "Health route is running without shared backend bootstrap.",
  });
}
