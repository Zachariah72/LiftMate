const Footer = ({ currentRide, todaysEarnings }) => {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        color: "white",
        padding: "60px 20px",
        marginTop: "80px",
        position: "relative",
        borderTop: "1px solid rgba(102, 126, 234, 0.1)"
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "50px",
        }}
      >
        {/* BRAND */}
        <div>
          <h2 style={{
            color: "white",
            marginBottom: "20px",
            fontSize: "2rem",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
          }}>
            <span style={{ color: "#ffd700" }}>Lift</span>
            <span style={{ color: "#667eea" }}>Mate</span>
          </h2>
          <p style={{
            color: "#ccc",
            lineHeight: "1.6",
            marginBottom: "20px",
            fontSize: "0.95rem"
          }}>
            Your smart ride-sharing and transportation management platform.
            Safe • Reliable • Fast
          </p>
          <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
            <a href="#" style={{ ...socialStyle, backgroundColor: "#667eea" }}>📘</a>
            <a href="#" style={{ ...socialStyle, backgroundColor: "#1da1f2" }}>🐦</a>
            <a href="#" style={{ ...socialStyle, backgroundColor: "#e4405f" }}>📷</a>
            <a href="#" style={{ ...socialStyle, backgroundColor: "#0077b5" }}>💼</a>
          </div>
        </div>

        {/* COMPANY */}
        <div>
          <h3 style={{ color: "white", marginBottom: "20px", fontSize: "1.2rem", fontWeight: "bold" }}>Company</h3>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "2" }}>
            <li><a href="#" style={linkStyle}>About us</a></li>
            <li><a href="#" style={linkStyle}>Our offerings</a></li>
            <li><a href="#" style={linkStyle}>Newsroom</a></li>
            <li><a href="#" style={linkStyle}>Investors</a></li>
            <li><a href="#" style={linkStyle}>Blog</a></li>
            <li><a href="#" style={linkStyle}>Careers</a></li>
          </ul>
        </div>

        {/* PRODUCTS */}
        <div>
          <h3 style={{ color: "white", marginBottom: "20px", fontSize: "1.2rem", fontWeight: "bold" }}>Products</h3>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "2" }}>
            <li><a href="#" style={linkStyle}>Ride</a></li>
            <li><a href="#" style={linkStyle}>Drive</a></li>
            <li><a href="#" style={linkStyle}>Deliver</a></li>
            <li><a href="#" style={linkStyle}>LiftMate for Business</a></li>
            <li><a href="#" style={linkStyle}>Gift cards</a></li>
          </ul>
        </div>

        {/* GLOBAL CITIZENSHIP */}
        <div>
          <h3 style={{ color: "white", marginBottom: "20px", fontSize: "1.2rem", fontWeight: "bold" }}>Global Citizenship</h3>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "2" }}>
            <li><a href="#" style={linkStyle}>Safety</a></li>
            <li><a href="#" style={linkStyle}>Sustainability</a></li>
            <li><a href="#" style={linkStyle}>Diversity</a></li>
          </ul>
        </div>

        {/* DRIVER STATUS */}
        {currentRide !== undefined && (
          <div>
            <h3 style={{ color: "white", marginBottom: "20px", fontSize: "1.2rem", fontWeight: "bold" }}>🚗 Driver Status</h3>
            <div style={{
              backgroundColor: "rgba(102, 126, 234, 0.1)",
              padding: "20px",
              borderRadius: "10px",
              border: "1px solid rgba(102, 126, 234, 0.2)"
            }}>
              <p style={{ marginBottom: "15px", color: "#fff", fontSize: "1rem", fontWeight: "bold" }}>
                📍 Active Ride: <span style={{ color: currentRide ? "#4caf50" : "#f44336" }}>
                  {currentRide ? 'In Progress' : 'None'}
                </span>
              </p>
              <p style={{ color: "#ffd700", fontSize: "1.1rem", fontWeight: "bold" }}>
                💰 Earnings Today: KES {todaysEarnings || 0}
              </p>
            </div>
          </div>
        )}

        {/* TRAVEL */}
        <div>
          <h3 style={{ color: "white", marginBottom: "20px", fontSize: "1.2rem", fontWeight: "bold" }}>✈️ Travel</h3>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "2" }}>
            <li><a href="#" style={linkStyle}>📅 Reserve</a></li>
            <li><a href="#" style={linkStyle}>🛫 Airports</a></li>
            <li><a href="#" style={linkStyle}>🏙️ Cities</a></li>
          </ul>
        </div>
      </div>

      <hr
        style={{
          border: "none",
          height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.3) 50%, transparent 100%)",
          margin: "50px 0",
        }}
      />

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px"
      }}>
        <div>
          <p style={{
            opacity: 0.8,
            color: "#ccc",
            fontSize: "0.95rem",
            margin: 0
          }}>
            © {new Date().getFullYear()} <span style={{ color: "#ffd700" }}>Lift</span><span style={{ color: "#667eea" }}>Mate</span> Technologies Inc.
          </p>
        </div>
        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
          <a href="#" style={linkStyle}>🔒 Privacy</a>
          <a href="#" style={linkStyle}>♿ Accessibility</a>
          <a href="#" style={linkStyle}>📋 Terms</a>
        </div>
      </div>
    </footer>
  );
};

const linkStyle = {
  color: "#ccc",
  textDecoration: "none",
  opacity: 0.8,
  fontSize: "15px",
  transition: "all 0.3s ease",
  "&:hover": {
    color: "#667eea",
    opacity: 1,
    transform: "translateX(5px)"
  }
};

const socialStyle = {
  display: "inline-block",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  color: "white",
  textDecoration: "none",
  fontSize: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
  }
};

export default Footer;
