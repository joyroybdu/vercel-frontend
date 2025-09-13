import React from "react";
import "../css/About.css";
import { FaTasks, FaHeartbeat, FaRobot, FaFilePdf } from "react-icons/fa";

export default function About() {
  return (
    <div className="about-container">
      <h1>About Us</h1>
      <p className="intro">
        Welcome to <strong>Smart Productivity Hub</strong> – your all-in-one platform for boosting productivity, managing health, and leveraging AI insights!
      </p>

      <section className="feature-section">
        <div className="icon"><FaTasks /></div>
        <h2>Daily Productivity Tools</h2>
        <p>
          Stay organized with our <strong>Pomodoro Timer</strong>, <strong>Task Manager</strong>, and <strong>Notes</strong>. Track habits, focus on tasks, and achieve more every day!
        </p>
      </section>

      <section className="feature-section">
        <div className="icon"><FaHeartbeat /></div>
        <h2>Health & Wellness Tools</h2>
        <p>
          Track your <strong>BMR</strong>, <strong>BMI</strong>, and <strong>Calories</strong> to maintain a balanced lifestyle. Our tools help you monitor and improve your wellbeing effortlessly.
        </p>
      </section>

      <section className="feature-section">
        <div className="icon"><FaRobot /></div>
        <h2>AI & Machine Learning</h2>
        <p>
          Leverage <strong>AI & Machine Learning</strong> to get personalized recommendations, analyze productivity patterns, and receive smart insights to optimize your daily routines.
        </p>
      </section>

      <section className="feature-section">
        <div className="icon"><FaFilePdf /></div>
        <h2>File & Document Tools</h2>
        <p>
          Convert and manage your files easily with <strong>Text to PDF</strong>, <strong>Word to PDF</strong>, <strong>Text to Word</strong>, and <strong>Image Converter</strong>. Simple, fast, and efficient!
        </p>
      </section>

      <section className="closing">
        <p>
          Our mission is to provide a seamless, intelligent, and holistic platform where productivity meets wellness and innovation. Join us and take control of your time, health, and growth!
        </p>
      </section>
    </div>
  );
}
