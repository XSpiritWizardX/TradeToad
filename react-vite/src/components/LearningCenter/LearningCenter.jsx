


import { NavLink } from "react-router-dom";
import "./LearningCenter.css";

const tracks = [
  {
    title: "Foundations",
    level: "Beginner",
    duration: "45 min",
    highlights: ["Market basics", "Order types", "Risk rules"],
    badge: "Start here",
  },
  {
    title: "Chart Reading",
    level: "Intermediate",
    duration: "60 min",
    highlights: ["Candles + volume", "Support & resistance", "Momentum signals"],
    badge: "Popular",
  },
  {
    title: "Strategy Lab",
    level: "Advanced",
    duration: "75 min",
    highlights: ["Backtesting", "Position sizing", "Playbook building"],
    badge: "Deep dive",
  },
];

const lessons = [
  {
    title: "How to read a candlestick",
    type: "Article",
    time: "6 min",
    payoff: "Spot real momentum vs noise.",
  },
  {
    title: "Risk per trade calculator",
    type: "Tool",
    time: "Interactive",
    payoff: "Keep losses contained automatically.",
  },
  {
    title: "Pre-market routine",
    type: "Checklist",
    time: "10 steps",
    payoff: "Enter sessions with a plan, not a guess.",
  },
  {
    title: "Crypto vs. equities",
    type: "Guide",
    time: "8 min",
    payoff: "Pick the right venue for your edge.",
  },
];

const drills = [
  "Mark two support and resistance zones on any chart.",
  "Journal one trade idea with entry, stop, target, and conviction.",
  "Simulate a buy + sell on the dashboard using virtual cash.",
  "Translate a headline into a bullish/bearish thesis in 60 seconds.",
];

function LearningCenter() {
  return (
    <div className="learning-center">
      <section className="lc-hero">
        <div className="lc-eyebrow">Learning Center · Live curriculum</div>
        <h1 className="lc-title">Learn faster. Trade smarter.</h1>
        <p className="lc-subtitle">
          Bite-sized lessons, trading drills, and tools built for new and
          returning traders. Stay in control with structure, not guesswork.
        </p>
        <div className="lc-cta-row">
          <NavLink to="/dashboard" className="lc-btn primary">
            Jump to dashboard
          </NavLink>
          <NavLink to="/" className="lc-btn ghost">
            Back to home
          </NavLink>
        </div>
        <div className="lc-meta-strip">
          <span>• Updated weekly</span>
          <span>• Mobile-friendly</span>
          <span>• Beginner to advanced</span>
        </div>
      </section>

      <section className="lc-grid">
        {tracks.map((track) => (
          <div className="lc-card" key={track.title}>
            <div className="lc-card-top">
              <span className="lc-pill">{track.badge}</span>
              <span className="lc-level">{track.level}</span>
            </div>
            <h2 className="lc-card-title">{track.title}</h2>
            <p className="lc-duration">{track.duration} · Guided</p>
            <ul className="lc-list">
              {track.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button className="lc-btn outline">Start track</button>
          </div>
        ))}
      </section>

      <section className="lc-panel">
        <div className="lc-panel-header">
          <div>
            <p className="lc-eyebrow">Featured this week</p>
            <h2>Lessons worth 15 minutes</h2>
          </div>
          <button className="lc-btn outline">See all modules</button>
        </div>
        <div className="lc-lessons">
          {lessons.map((lesson) => (
            <div className="lc-lesson-card" key={lesson.title}>
              <div className="lc-lesson-meta">
                <span className="lc-chip">{lesson.type}</span>
                <span className="lc-time">{lesson.time}</span>
              </div>
              <h3>{lesson.title}</h3>
              <p>{lesson.payoff}</p>
              <button className="lc-btn text">Open lesson →</button>
            </div>
          ))}
        </div>
      </section>

      <section className="lc-split">
        <div className="lc-panel small">
          <p className="lc-eyebrow">Daily drills</p>
          <h2>10-minute practice stack</h2>
          <ul className="lc-list dense">
            {drills.map((drill) => (
              <li key={drill}>{drill}</li>
            ))}
          </ul>
          <div className="lc-cta-row">
            <button className="lc-btn primary">Start a drill</button>
            <button className="lc-btn ghost">Save for later</button>
          </div>
        </div>
        <div className="lc-panel small">
          <p className="lc-eyebrow">Resource shelf</p>
          <h2>Tools that speed you up</h2>
          <div className="lc-resource-list">
            <div className="lc-resource">
              <div className="lc-dot green" />
              <div>
                <p className="lc-resource-title">Glossary in plain English</p>
                <span>Decode jargon fast.</span>
              </div>
            </div>
            <div className="lc-resource">
              <div className="lc-dot yellow" />
              <div>
                <p className="lc-resource-title">Template: trade journal</p>
                <span>Copy, paste, and track your edge.</span>
              </div>
            </div>
            <div className="lc-resource">
              <div className="lc-dot blue" />
              <div>
                <p className="lc-resource-title">Alerts & news flow</p>
                <span>Pair headlines with price action.</span>
              </div>
            </div>
            <div className="lc-resource">
              <div className="lc-dot gray" />
              <div>
                <p className="lc-resource-title">Office hours</p>
                <span>Drop questions—humans answer.</span>
              </div>
            </div>
          </div>
          <div className="lc-cta-row">
            <button className="lc-btn outline">Download toolkit</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LearningCenter;
