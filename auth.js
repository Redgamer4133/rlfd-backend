// admin/js/auth.js

// Save token to localStorage
function saveToken(token) {
  localStorage.setItem("adminToken", token);
}

// Get token from localStorage
function getToken() {
  return localStorage.getItem("adminToken");
}

// Remove token (logout)
function clearToken() {
  localStorage.removeItem("adminToken");
}

// Verify token with backend
async function verify() {
  const token = getToken();
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:3001/api/admin/verify", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      clearToken();
      window.location.href = "login.html";
    }
  } catch (err) {
    console.error("Verification failed:", err);
    clearToken();
    window.location.href = "login.html";
  }
}
