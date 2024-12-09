const logRequest = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  const ipAddress = req.ip || req.connection.remoteAddress;
  const userAgent = req.get("User-Agent");

  console.log(`[${timestamp}] ${method} ${path}`);
  console.log(`IP: ${ipAddress}`);
  console.log(`User-Agent: ${userAgent}`);

  if (["POST", "PUT", "PATCH"].includes(method)) {
    console.log("Request Body:", JSON.stringify(req.body, null, 2));
  }

  // Tambahkan waktu proses request
  const startTime = Date.now();

  const originalEnd = res.end;
  res.end = function (chunk, encoding) {
    const duration = Date.now() - startTime;
    console.log(`Response Time: ${duration}ms`);
    console.log(`Status Code: ${res.statusCode}`);

    originalEnd.call(this, chunk, encoding);
  };

  next();
};

module.exports = logRequest;
