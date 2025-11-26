const Footer = () => {
  return (
    <footer
      style={{
        background: "#000",
        color: "white",
        padding: "50px 20px",
        marginTop: "50px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "40px",
        }}
      >
        {/* COMPANY */}
        <div>
          <h3 style={{ color: "white", marginBottom: "15px" }}>Company</h3>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
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
          <h3 style={{ color: "white", marginBottom: "15px" }}>Products</h3>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
            <li><a href="#" style={linkStyle}>Ride</a></li>
            <li><a href="#" style={linkStyle}>Drive</a></li>
            <li><a href="#" style={linkStyle}>Deliver</a></li>
            <li><a href="#" style={linkStyle}>LiftMate for Business</a></li>
            <li><a href="#" style={linkStyle}>Gift cards</a></li>
          </ul>
        </div>

        {/* GLOBAL CITIZENSHIP */}
        <div>
          <h3 style={{ color: "white", marginBottom: "15px" }}>Global citizenship</h3>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
            <li><a href="#" style={linkStyle}>Safety</a></li>
            <li><a href="#" style={linkStyle}>Sustainability</a></li>
            <li><a href="#" style={linkStyle}>Diversity</a></li>
          </ul>
        </div>

        {/* DRIVER STATUS */}
        <div>
          <h3 style={{ color: "white", marginBottom: "15px" }}>Driver Status</h3>
          <p style={{ marginBottom: "10px", color: "#ccc" }}>Active Ride: In Progress</p>
          <p style={{ color: "#ccc" }}>Earnings Today: KES 0</p>
        </div>

        {/* TRAVEL */}
        <div>
          <h3 style={{ color: "white", marginBottom: "15px" }}>Travel</h3>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
            <li><a href="#" style={linkStyle}>Reserve</a></li>
            <li><a href="#" style={linkStyle}>Airports</a></li>
            <li><a href="#" style={linkStyle}>Cities</a></li>
          </ul>
        </div>
      </div>

      <hr
        style={{
          border: "1px solid rgba(255,255,255,0.2)",
          margin: "40px 0",
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <p style={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} LiftMate Technologies Inc.
          </p>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <a href="#" style={linkStyle}>Privacy</a>
          <a href="#" style={linkStyle}>Accessibility</a>
          <a href="#" style={linkStyle}>Terms</a>
        </div>
      </div>
    </footer>
  );
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  opacity: 0.8,
  fontSize: "15px",
  transition: "0.2s",
};

export default Footer;
