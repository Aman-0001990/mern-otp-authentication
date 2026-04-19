import React from "react";
import "../styles/Instructor.css";
import instructorImage from "../assets/profile.jpeg";

const Instructor = () => {
  return (
    <div className="instructor-page">
      <div className="instructor-card">
        <div className="instructor-image">
          <img src={instructorImage} alt="Instructor" />
        </div>
        <div className="instructor-info">
 <h1>Aman Rohilla</h1>
<h4>Your Instructor</h4>
<p>
  Hello! I'm Aman Rohilla, a passionate MERN stack developer
  with a strong interest in building scalable and efficient web applications.
  I have hands-on experience in JavaScript, React, Node.js, Express, and
  MongoDB, and I am dedicated to helping developers learn and grow their
  skills. Join me in this journey to master authentication and the
  MERN stack!
</p>
          <div className="social-links">
            <a
              href="https://github.com/Aman-0001990"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/aman-rohilla-737520324?utm_source=share_via&utm_content=profile&utm_medium=member_android/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://leetcode.com/u/vAjRvzncRN/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Leetcode
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructor;
