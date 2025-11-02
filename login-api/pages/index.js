export default function Home() {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>🚀 Login API by YanzBRMods</h1>
      <p>POST ke <code>/api/login</code> dengan body JSON:</p>
      <pre>{`{ "username": "yanz", "password": "vip", "device_id": "1234" }`}</pre>
    </div>
  );
}
