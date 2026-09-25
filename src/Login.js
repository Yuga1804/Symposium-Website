import { useState } from "react";
import "./Login.css";
import "./studentDashboard.css";
import "./adminDashboard.css";
import "./registerPage.css";

export default function LoginPage() {
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    regNo: "",
    dob: "",
    username: "",
    password: ""
  });
  const [page, setPage] = useState("login"); // login | student | admin | register

  // Data States
  const [events, setEvents] = useState(["Paper Presentation", "Coding Contest" ,"Dancing","kill the error"]);
  const [coordinators, setCoordinators] = useState(["Yoga", "Yuga","Raji","Sulochana","Soniya"]);
  const [registrations, setRegistrations] = useState([]);

  const [selectedEvents, setSelectedEvents] = useState([]); // multiple selection

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (role === "student") {
      if (formData.regNo && formData.dob) {
        setPage("student");
      } else {
        alert("Please enter Register Number and Date of Birth");
      }
    } else if (role === "admin") {
      if (formData.username && formData.password) {
        setPage("admin");
      } else {
        alert("Please enter Username and Password");
      }
    }
  };

  // ================= Student Dashboard =================
  const StudentDashboard = () => {
    const handleRegisterClick = () => {
      if (selectedEvents.length > 0) {
        setPage("register"); // Navigate to Register Page
      } else {
        alert("Please select at least one event to register");
      }
    };

    const toggleEvent = (eventName) => {
      if (selectedEvents.includes(eventName)) {
        setSelectedEvents(selectedEvents.filter((e) => e !== eventName));
      } else {
        setSelectedEvents([...selectedEvents, eventName]);
      }
    };

    return (
      <div className="dashboard">
        <h2>Student Dashboard</h2>
        <div className="section">
          <h3>🎉 Events</h3>
          <ul>
            {events.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h3>👩‍🏫 Coordinators</h3>
          <ul>
            {coordinators.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h3>📝 Registration & Payment</h3>
          {events.map((e, i) => (
            <div key={i}>
              <input
                type="checkbox"
                id={`event-${i}`}
                value={e}
                checked={selectedEvents.includes(e)}
                onChange={() => toggleEvent(e)}
              />
              <label htmlFor={`event-${i}`}>{e}</label>
            </div>
          ))}
          <button className="btn success" onClick={handleRegisterClick}>
            Register & Pay
          </button>
        </div>

        <button className="btn danger" onClick={() => setPage("login")}>
          Logout
        </button>
      </div>
    );
  };

  // ================= Register Page =================
  const RegisterPage = () => {
    const [details, setDetails] = useState({
      name: "",
      department: "",
      year: "",
      paymentScreenshot: null
    });

    const handleChange = (e) => {
      const { name, value, files } = e.target;
      if (name === "paymentScreenshot") {
        setDetails({ ...details, paymentScreenshot: files[0] });
      } else {
        setDetails({ ...details, [name]: value });
      }
    };

    const handleSubmit = () => {
      if (!details.name || !details.department || !details.year) {
        alert("Please fill all fields");
        return;
      }

      const newReg = {
        ...details,
        regNo: formData.regNo,
        events: selectedEvents
      };

      setRegistrations([...registrations, newReg]);
      alert("Registration successful!");
      setPage("student");
    };

    return (
      <div className="register-page">
        <h2>Event Registration</h2>
        <p><b>Events:</b> {selectedEvents.join(", ")}</p>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={details.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={details.department}
          onChange={handleChange}
        />
        <input
          type="text"
          name="year"
          placeholder="Year"
          value={details.year}
          onChange={handleChange}
        />

        <div className="qr-section">
          <h4>Scan QR Code to Pay</h4>
          <img src="/qr.png" alt="QR Code" width="150" />
        </div>

        <label>Upload Payment Screenshot:</label>
        <input type="file" name="paymentScreenshot" onChange={handleChange} />

        <button className="btn success" onClick={handleSubmit}>
          Submit Registration
        </button>
        <button className="btn danger" onClick={() => setPage("student")}>
          Cancel
        </button>
      </div>
    );
  };

  // ================= Admin Dashboard =================
  const AdminDashboard = () => {
    const [newEvent, setNewEvent] = useState("");
    const [newCoordinator, setNewCoordinator] = useState("");

    const addEvent = () => {
      if (newEvent) {
        setEvents([...events, newEvent]);
        setNewEvent("");
      }
    };

    const removeEvent = (index) => {
      setEvents(events.filter((_, i) => i !== index));
    };

    const addCoordinator = () => {
      if (newCoordinator) {
        setCoordinators([...coordinators, newCoordinator]);
        setNewCoordinator("");
      }
    };

    const removeCoordinator = (index) => {
      setCoordinators(coordinators.filter((_, i) => i !== index));
    };

    const removeRegistration = (index) => {
      setRegistrations(registrations.filter((_, i) => i !== index));
    };

    return (
      <div className="dashboard">
        <h2>Admin Dashboard</h2>

        {/* Events */}
        <div className="section">
          <h3>🎉 Manage Events</h3>
          <ul>
            {events.map((e, i) => (
              <li key={i}>
                {e}
                <button className="btn danger small" onClick={() => removeEvent(i)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="form-row">
            <input
              type="text"
              placeholder="New Event"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
            />
            <button className="btn primary" onClick={addEvent}>Add</button>
          </div>
        </div>

        {/* Coordinators */}
        <div className="section">
          <h3>👩‍🏫 Manage Coordinators</h3>
          <ul>
            {coordinators.map((c, i) => (
              <li key={i}>
                {c}
                <button className="btn danger small" onClick={() => removeCoordinator(i)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="form-row">
            <input
              type="text"
              placeholder="New Coordinator"
              value={newCoordinator}
              onChange={(e) => setNewCoordinator(e.target.value)}
            />
            <button className="btn primary" onClick={addCoordinator}>Add</button>
          </div>
        </div>

        {/* Registrations */}
        <div className="section">
          <h3>📝 Participants</h3>
          {registrations.length === 0 ? (
            <p>No registrations yet.</p>
          ) : (
            <ul>
              {registrations.map((r, i) => (
                <li key={i}>
                  <b>{r.name}</b> ({r.regNo}) - {r.department}, Year {r.year} →{" "}
                  {Array.isArray(r.events) ? r.events.join(", ") : r.events}
                  <button className="btn danger small" onClick={() => removeRegistration(i)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="btn danger" onClick={() => setPage("login")}>
          Logout
        </button>
      </div>
    );
  };

  // ================= Routing =================
  if (page === "student") return <StudentDashboard />;
  if (page === "register") return <RegisterPage />;
  if (page === "admin") return <AdminDashboard />;

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Symposium Login</h2>

        {/* Role Switch */}
        <div className="role-switch">
          <button
            className={`role-btn ${role === "student" ? "active" : ""}`}
            onClick={() => setRole("student")}
          >
            Student
          </button>
          <button
            className={`role-btn ${role === "admin" ? "active" : ""}`}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {role === "student" ? (
            <>
              <input
                type="text"
                name="regNo"
                placeholder="Register Number"
                value={formData.regNo}
                onChange={handleChange}
                className="login-input"
              />
              <input
                type="date"
                name="dob"
                placeholder="Date of Birth"
                value={formData.dob}
                onChange={handleChange}
                className="login-input"
              />
            </>
          ) : (
            <>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="login-input"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="login-input"
              />
            </>
          )}

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
