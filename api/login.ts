type DemoUser = {
  id: string;
  name: string;
  role: "student" | "teacher";
  department: string;
  section: string;
  email: string;
};

function buildUser(idInput: string, roleInput: string): DemoUser {
  const id = String(idInput || "").trim() || "guest";
  const role = String(roleInput || "student").trim().toLowerCase() === "teacher" ? "teacher" : "student";
  const normalizedId = id.toLowerCase();
  return {
    id,
    name: role === "teacher" ? "Faculty User" : `Student ${id.slice(-4) || "User"}`,
    role,
    department: "Computer Science & Engineering",
    section: role === "student" ? "II B.Tech II Sem CSE - A" : "Faculty",
    email: role === "student" ? `${normalizedId}@university.edu` : `${normalizedId}@college.edu`,
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const id = String(body.id ?? body.username ?? "").trim();
    const role = String(body.role ?? "student").trim();
    const password = String(body.password ?? "").trim();

    if (!id) {
      return res.status(400).json({ success: false, message: "Please enter ID" });
    }

    if (!password) {
      return res.status(400).json({ success: false, message: "Please enter password" });
    }

    const user = buildUser(id, role);
    return res.status(200).json({
      success: true,
      user,
      authMode: "serverless-safe-demo",
    });
  } catch (error: any) {
    const details = String(error?.message || "Unknown error");
    return res.status(500).json({
      success: false,
      message: "Login route failed to parse request.",
      details,
    });
  }
}
