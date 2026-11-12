
import { useMemo, useState } from "react";
import {
  LayoutDashboard, MessageCircleQuestion, Flame, BarChart3,
  FileText, Settings, Search, Bell, Plus, ArrowUp,
  CheckCircle2, Users, TrendingUp, ChevronDown,
  Send, X, Sparkles, CircleHelp, MoreHorizontal,
  Download, EyeOff
} from "lucide-react";
import "./App.css";

const initialQuestions = [
  {
    id: 1,
    topic: "Recursion",
    text: "Can someone explain why the base case prevents infinite recursion?",
    votes: 18,
    time: "2 min ago",
    status: "Open"
  },
  {
    id: 2,
    topic: "Time Complexity",
    text: "Why does this nested loop become O(n log n) instead of O(n²)?",
    votes: 14,
    time: "4 min ago",
    status: "Answered"
  },
  {
    id: 3,
    topic: "Binary Search",
    text: "How do we know which half to eliminate when the array is rotated?",
    votes: 11,
    time: "6 min ago",
    status: "Open"
  },
  {
    id: 4,
    topic: "Recursion",
    text: "What exactly is stored on the call stack during recursive calls?",
    votes: 9,
    time: "8 min ago",
    status: "Open"
  },
  {
    id: 5,
    topic: "Dynamic Programming",
    text: "How do I identify overlapping subproblems in a new problem?",
    votes: 7,
    time: "10 min ago",
    status: "Answered"
  }
];

const topics = [
  { name: "Recursion", score: 82, questions: 18 },
  { name: "Time Complexity", score: 68, questions: 14 },
  { name: "Binary Search", score: 54, questions: 11 },
  { name: "Dynamic Programming", score: 43, questions: 9 },
  { name: "Trees", score: 27, questions: 6 },
  { name: "Arrays", score: 18, questions: 4 }
];

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Live Q&A", icon: MessageCircleQuestion },
  { label: "Confusion Heatmap", icon: Flame },
  { label: "Lecture Insights", icon: BarChart3 },
  { label: "Reports", icon: FileText }
];

export default function App() {
  const [page, setPage] = useState("Overview");
  const [questions, setQuestions] = useState(initialQuestions);
  const [upvoted, setUpvoted] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All questions");
  const [modal, setModal] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [topic, setTopic] = useState("Recursion");
  const [anonymous, setAnonymous] = useState(true);
  const [toast, setToast] = useState("");

  const notify = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch = `${q.topic} ${q.text}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All questions" || q.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [questions, search, filter]);

  const handleVote = (id) => {
    if (upvoted.includes(id)) return;

    setUpvoted((previous) => [...previous, id]);

    setQuestions((previous) =>
      previous.map((q) =>
        q.id === id ? { ...q, votes: q.votes + 1 } : q
      )
    );
  };

  const submitQuestion = () => {
    if (!questionText.trim()) return;

    const newQuestion = {
      id: Date.now(),
      topic,
      text: questionText.trim(),
      votes: 1,
      time: "Just now",
      status: "Open"
    };

    setQuestions((previous) => [newQuestion, ...previous]);
    setQuestionText("");
    setModal(false);
    setPage("Live Q&A");

    notify("Your question has been submitted anonymously.");
  };

  const exportReport = () => {
    const csv = [
      "Topic,Confusion Score,Questions",
      ...topics.map((t) => `${t.name},${t.score},${t.questions}`)
    ].join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "echoroom-confusion-report.csv";
    link.click();

    URL.revokeObjectURL(url);
    notify("Confusion report exported!");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <MessageCircleQuestion size={21} />
          </div>

          <div>
            <b>EchoRoom</b>
            <small>THE UNSPOKEN CLASSROOM</small>
          </div>
        </div>

        <div className="workspace">
          <div className="course-icon">CS</div>
          <div>
            <b>Data Structures</b>
            <small>CS · Semester 3</small>
          </div>
          <ChevronDown size={15} />
        </div>

        <div className="nav-label">WORKSPACE</div>

        {navigation.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={`nav-item ${page === label ? "active" : ""}`}
            onClick={() => setPage(label)}
          >
            <Icon size={18} />
            <span>{label}</span>

            {label === "Live Q&A" && (
              <span className="nav-count">{questions.length}</span>
            )}
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="live-status">
            <span className="pulse" />
            <div>
              <b>Lecture is live</b>
              <small>Week 06 · 32 students</small>
            </div>
          </div>

          <button className="nav-item">
            <Settings size={18} />
            <span>Settings</span>
          </button>

          <div className="profile">
            <div className="avatar">AK</div>
            <div>
              <b>Arjun Kapoor</b>
              <small>Instructor</small>
            </div>
            <MoreHorizontal size={18} />
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="breadcrumb">
            Data Structures <span>/</span> <b>{page}</b>
          </div>

          <div className="top-actions">
            <div className="lecture-pill">
              <span className="pulse" />
              Live lecture
            </div>

            <button
              className="icon-btn"
              onClick={() => notify("You’re all caught up!")}
            >
              <Bell size={18} />
            </button>

            <div className="avatar small">AK</div>
          </div>
        </header>

        <div className="content">
          <div className="welcome-row">
            <div>
              <div className="eyebrow">
                <Sparkles size={14} /> CLASSROOM PULSE
              </div>

              <h1>
                {page === "Overview"
                  ? "A clearer view of confusion."
                  : page}
              </h1>

              <p>
                {page === "Overview"
                  ? "Understand what students are thinking — even when they don’t raise their hands."
                  : "A safe space for questions, insights, and classroom understanding."}
              </p>
            </div>

            <button className="primary-btn" onClick={() => setModal(true)}>
              <Plus size={17} /> Ask a question
            </button>
          </div>

          {page === "Overview" && (
            <>
              <div className="stats-grid">
                <Stat
                  icon={Users}
                  label="Students in lecture"
                  value="32"
                  change="+4 joined"
                  color="violet"
                />

                <Stat
                  icon={MessageCircleQuestion}
                  label="Questions submitted"
                  value={questions.length + 19}
                  change="+8 this lecture"
                  color="blue"
                />

                <Stat
                  icon={Flame}
                  label="Confusion score"
                  value="68%"
                  change="↑ 12% from last week"
                  color="orange"
                />

                <Stat
                  icon={CheckCircle2}
                  label="Questions resolved"
                  value="18"
                  change="75% resolution rate"
                  color="green"
                />
              </div>

              <div className="two-col">
                <section className="panel">
                  <div className="panel-head">
                    <div>
                      <h3>Confusion by topic</h3>
                      <p>Where students need a little more clarity</p>
                    </div>

                    <button
                      className="text-btn"
                      onClick={() => setPage("Confusion Heatmap")}
                    >
                      View heatmap ↗
                    </button>
                  </div>

                  <div className="heatmap-list">
                    {topics.slice(0, 5).map((item, i) => (
                      <div className="heat-row" key={item.name}>
                        <div className="heat-label">
                          <span className={`heat-dot d${i}`} />
                          <b>{item.name}</b>
                        </div>

                        <div className="heat-track">
                          <div
                            className={`heat-fill f${i}`}
                            style={{ width: `${item.score}%` }}
                          />
                        </div>

                        <span className="heat-score">{item.score}%</span>

                        <span
                          className={`severity ${
                            item.score > 65
                              ? "high"
                              : item.score > 40
                              ? "medium"
                              : "low"
                          }`}
                        >
                          {item.score > 65
                            ? "High"
                            : item.score > 40
                            ? "Medium"
                            : "Low"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="panel-foot">
                    <span><span className="pulse" /> Updated just now</span>
                    <span>Based on simulated data</span>
                  </div>
                </section>

                <section className="panel">
                  <div className="panel-head">
                    <div>
                      <h3>Lecture understanding</h3>
                      <p>Student confidence throughout the lecture</p>
                    </div>

                    <span className="select-chip">
                      This lecture <ChevronDown size={13} />
                    </span>
                  </div>

                  <div className="chart-legend">
                    <span><i className="legend-purple" /> Understanding</span>
                    <span><i className="legend-orange" /> Confusion</span>
                  </div>

                  <div className="chart">
                    <div className="y-labels">
                      <span>100%</span>
                      <span>75%</span>
                      <span>50%</span>
                      <span>25%</span>
                      <span>0%</span>
                    </div>

                    <svg viewBox="0 0 500 180" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity=".25" />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      <path
                        d="M0 40 C35 48 50 22 80 36 S130 75 160 60 S210 20 240 48 S290 70 320 90 S370 80 400 110 S460 100 500 120 L500 180 L0 180Z"
                        fill="url(#area)"
                      />

                      <path
                        d="M0 40 C35 48 50 22 80 36 S130 75 160 60 S210 20 240 48 S290 70 320 90 S370 80 400 110 S460 100 500 120"
                        fill="none"
                        stroke="#a78bfa"
                        strokeWidth="3"
                      />

                      <path
                        d="M0 135 C40 125 55 145 80 128 S130 120 160 132 S210 110 240 125 S290 130 320 115 S370 125 400 105 S460 120 500 95"
                        fill="none"
                        stroke="#fb923c"
                        strokeWidth="2.5"
                        strokeDasharray="5 5"
                      />
                    </svg>

                    <div className="x-labels">
                      <span>10:00</span>
                      <span>10:15</span>
                      <span>10:30</span>
                      <span>10:45</span>
                      <span>11:00</span>
                    </div>
                  </div>

                  <div className="chart-insight">
                    <Sparkles size={15} />
                    <span>
                      <b>Insight:</b> Confusion spiked during Recursion.
                      Consider revisiting the base case.
                    </span>
                  </div>
                </section>
              </div>

              <section className="panel">
                <div className="panel-head">
                  <div>
                    <h3>Questions students are asking</h3>
                    <p>Live questions from your classroom</p>
                  </div>

                  <button className="text-btn" onClick={() => setPage("Live Q&A")}>
                    View all questions ↗
                  </button>
                </div>

                <QuestionList
                  questions={questions.slice(0, 3)}
                  upvoted={upvoted}
                  vote={handleVote}
                />
              </section>

              <div className="bottom-grid">
                <section className="panel">
                  <div className="panel-head">
                    <div>
                      <h3>Lecture checkpoints</h3>
                      <p>Concepts covered today</p>
                    </div>
                    <span className="select-chip">Week 06</span>
                  </div>

                  <Checkpoint
                    title="Asymptotic analysis"
                    subtitle="10:05 AM · Low confusion"
                    status="Clear"
                  />

                  <Checkpoint
                    title="Recursive functions"
                    subtitle="10:24 AM · 18 questions"
                    status="Needs review"
                  />

                  <Checkpoint
                    title="Binary search trees"
                    subtitle="10:42 AM · Low confusion"
                    status="Clear"
                  />
                </section>

                <section className="panel report-card">
                  <div className="report-icon"><FileText size={22} /></div>
                  <h3>Your post-lecture report</h3>
                  <p>
                    Get a concise summary of student questions, confusion
                    hotspots, and concepts to revisit.
                  </p>

                  <button className="secondary-btn" onClick={exportReport}>
                    <Download size={16} /> Export confusion report
                  </button>

                  <small>CSV · Ready to download</small>
                </section>
              </div>
            </>
          )}

          {page === "Live Q&A" && (
            <section className="panel">
              <div className="panel-head">
                <div>
                  <h3>Anonymous live questions</h3>
                  <p>Questions are visible to everyone in the classroom</p>
                </div>

                <button className="primary-btn small-btn" onClick={() => setModal(true)}>
                  <Plus size={16} /> Submit question
                </button>
              </div>

              <div className="toolbar">
                <div className="searchbox">
                  <Search size={16} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search questions or topics..."
                  />
                </div>

                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option>All questions</option>
                  <option>Open</option>
                  <option>Answered</option>
                </select>
              </div>

              <QuestionList
                questions={filteredQuestions}
                upvoted={upvoted}
                vote={handleVote}
              />
            </section>
          )}

          {page === "Confusion Heatmap" && (
            <section className="panel">
              <div className="panel-head">
                <div>
                  <h3>Topic-wise confusion heatmap</h3>
                  <p>Aggregated anonymous student questions and upvotes</p>
                </div>
                <span className="select-chip">Current lecture</span>
              </div>

              <div className="heatmap-cards">
                {topics.map((item, i) => (
                  <div className={`heat-card heat-bg${i}`} key={item.name}>
                    <div className="heat-card-top">
                      <span>{item.name}</span>
                      <span className={`severity ${item.score > 65 ? "high" : item.score > 40 ? "medium" : "low"}`}>
                        {item.score > 65 ? "High" : item.score > 40 ? "Medium" : "Low"} confusion
                      </span>
                    </div>

                    <strong>{item.score}<small>%</small></strong>

                    <div className="heat-track">
                      <div className={`heat-fill f${i}`} style={{ width: `${item.score}%` }} />
                    </div>

                    <p>{item.questions} questions · Topic confusion score</p>
                  </div>
                ))}
              </div>

              <div className="chart-insight">
                <Sparkles size={15} />
                <span>
                  <b>Instructor suggestion:</b> Recursion and Time Complexity
                  are the highest confusion areas. Revisit these before moving on.
                </span>
              </div>
            </section>
          )}

          {page === "Lecture Insights" && (
            <div className="insights-grid">
              <section className="panel">
                <div className="panel-head">
                  <div>
                    <h3>Concept difficulty ranking</h3>
                    <p>Most challenging concepts in this lecture</p>
                  </div>
                </div>

                {topics.slice(0, 5).map((item, i) => (
                  <div className="rank-row" key={item.name}>
                    <span className="rank-num">0{i + 1}</span>
                    <div className="rank-main">
                      <b>{item.name}</b>
                      <div className="heat-track">
                        <div className={`heat-fill f${i}`} style={{ width: `${item.score}%` }} />
                      </div>
                    </div>
                    <b>{item.score}%</b>
                  </div>
                ))}
              </section>

              <section className="panel">
                <div className="panel-head">
                  <div>
                    <h3>Instructor notes</h3>
                    <p>Suggested follow-up actions</p>
                  </div>
                </div>

                <Note title="Revisit recursion base cases">
                  Students asked several questions related to recursion.
                  Add a visual call-stack walkthrough.
                </Note>

                <Note title="Clarify complexity comparisons">
                  Students are unsure how nested loops and logarithmic
                  steps interact.
                </Note>

                <Note title="Start next lecture with a quick recap">
                  Use 3 short questions to check understanding before
                  introducing dynamic programming.
                </Note>
              </section>
            </div>
          )}

          {page === "Reports" && (
            <section className="panel report-page">
              <div className="report-big-icon"><FileText size={26} /></div>

              <h2>Post-lecture confusion report</h2>

              <p>
                Generate a snapshot of student questions, topic difficulty,
                and recommended areas to revisit.
              </p>

              <div className="report-summary">
                <div>
                  <small>Lecture</small>
                  <b>Data Structures · Week 06</b>
                </div>

                <div>
                  <small>Responses</small>
                  <b>{questions.length} questions · 32 students</b>
                </div>

                <div>
                  <small>Top confusion area</small>
                  <b>Recursion · 82% score</b>
                </div>
              </div>

              <button className="primary-btn" onClick={exportReport}>
                <Download size={17} /> Download report (CSV)
              </button>
            </section>
          )}
        </div>

        <footer>
          EchoRoom <span>·</span> Making every question count
          <span className="footer-right">Prototype with simulated classroom data</span>
        </footer>
      </main>

      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h2>Ask the classroom</h2>
                <p>No question is too small. Your identity stays private.</p>
              </div>

              <button className="icon-btn" onClick={() => setModal(false)}>
                <X size={18} />
              </button>
            </div>

            <label>Topic</label>
            <select value={topic} onChange={(e) => setTopic(e.target.value)}>
              {topics.map((item) => (
                <option key={item.name}>{item.name}</option>
              ))}
              <option>Other</option>
            </select>

            <label>Your question</label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="What are you unsure about? Share it with the class..."
              rows={4}
            />

            <div className="anonymous-toggle">
              <div className="anon-icon"><EyeOff size={17} /></div>

              <div>
                <b>Submit anonymously</b>
                <small>Your name won't be shown to classmates.</small>
              </div>

              <button
                className={`toggle ${anonymous ? "on" : ""}`}
                onClick={() => setAnonymous(!anonymous)}
              >
                <span />
              </button>
            </div>

            <button className="primary-btn submit-btn" onClick={submitQuestion}>
              <Send size={16} /> Submit question
            </button>

            <div className="privacy-note">
              <EyeOff size={13} /> Your question is safe here. Be curious, not worried.
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast">
          <CheckCircle2 size={17} /> {toast}
        </div>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value, change, color }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}><Icon size={19} /></div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-change"><TrendingUp size={13} />{change}</div>
    </div>
  );
}

function QuestionList({ questions, upvoted, vote }) {
  if (!questions.length) {
    return <div className="empty-state">No questions found. Try another search!</div>;
  }

  return (
    <div className="question-list">
      {questions.map((q) => (
        <div className="question-row" key={q.id}>
          <button
            className={`vote-btn ${upvoted.includes(q.id) ? "voted" : ""}`}
            onClick={() => vote(q.id)}
          >
            <ArrowUp size={17} />
            <b>{q.votes}</b>
          </button>

          <div className="question-body">
            <div className="question-meta">
              <span className="topic-pill">{q.topic}</span>
              <span>Anonymous student</span>
              <span>·</span>
              <span>{q.time}</span>

              {q.status === "Answered" && (
                <span className="answered">
                  <CheckCircle2 size={12} /> Answered
                </span>
              )}
            </div>

            <p>{q.text}</p>
          </div>

          <button className="icon-btn more">
            <MoreHorizontal size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}

function Checkpoint({ title, subtitle, status }) {
  const isClear = status === "Clear";

  return (
    <div className="checkpoint">
      <div className={`checkpoint-icon ${isClear ? "done" : "warn"}`}>
        {isClear ? <CheckCircle2 size={17} /> : <CircleHelp size={17} />}
      </div>

      <div>
        <b>{title}</b>
        <small>{subtitle}</small>
      </div>

      <span className={`tag ${isClear ? "green-tag" : "orange-tag"}`}>
        {status}
      </span>
    </div>
  );
}

function Note({ title, children }) {
  return (
    <div className="note">
      <Sparkles size={18} />
      <div>
        <b>{title}</b>
        <p>{children}</p>
      </div>
    </div>
  );
}
