function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState,
  useRef,
  useEffect
} = React;
function Icon({
  type
}) {
  const paths = {
    Discover: React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), React.createElement("path", {
      d: "m16 8-3 5-5 3 3-5z"
    })),
    Home: React.createElement("path", {
      d: "m3 10 9-7 9 7v10h-6v-6H9v6H3z"
    }),
    Matches: React.createElement("path", {
      d: "M12 21 3.8 13C-2 6.6 6.5 0 12 7.1 17.5 0 26 6.6 20.2 13z"
    }),
    Pass: React.createElement("path", {
      d: "m6 6 12 12M18 6 6 18"
    }),
    Pin: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"
    }), React.createElement("circle", {
      cx: "12",
      cy: "10",
      r: "2"
    }))
  };
  return React.createElement("svg", {
    viewBox: "0 0 24 24",
    "aria-hidden": "true",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, paths[type]);
}
async function api(url, options) {
  const r = await fetch(url, options);
  if (!r.ok) {
    const e = new Error('Please try again.');
    e.status = r.status;
    throw e;
  }
  return r.json();
}
function opener(profile) {
  const prompts = {
    Bookstores: 'Which bookstore could you spend a whole afternoon in?',
    Pottery: 'What was the first thing you made from clay?',
    Chess: 'Who taught you your first chess move?',
    Gardening: 'What are you growing right now?',
    Guitar: 'Which song are you learning?',
    Surfing: 'What makes a good morning at the beach?',
    Comics: 'Which comic would you lend a friend?',
    Cycling: 'Which route would you ride again this weekend?'
  };
  return prompts[profile.interests[0]] || 'What got you into ' + profile.interests[0].toLowerCase() + '?';
}
function ProfileView({
  profile,
  mode,
  close
}) {
  const ref = useRef(null);
  const [index, change] = useState(0),
    [status, setStatus] = useState('');
  const key = 'coy.starters.' + profile.id;
  const [sent, setSent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  });
  const interests = profile.interests;
  const starters = [opener(profile), 'What would a perfect afternoon in ' + profile.city + ' look like?', 'What would you recommend to someone getting into ' + interests.at(-1).toLowerCase() + '?'];
  const [draft, setDraft] = useState(starters[0]);
  const starter = draft.trim();
  function nextStarter() {
    const next = (index + 1) % starters.length;
    change(next);
    setDraft(starters[next]);
    setStatus('');
  }
  useEffect(() => {
    const node = ref.current;
    node.showModal();
    return () => node.close();
  }, []);
  function send() {
    try {
      const next = [...new Set([...sent, starter])];
      localStorage.setItem(key, JSON.stringify(next));
      setSent(next);
      setStatus('Saved in your local demo conversation.');
    } catch {
      setStatus('Couldn’t save this starter. Please try again.');
    }
  }
  return React.createElement("dialog", {
    className: 'profile-view ' + mode,
    ref: ref,
    "aria-labelledby": "profile-name",
    onCancel: e => {
      e.preventDefault();
      close();
    },
    onClick: e => {
      if (e.target === e.currentTarget) close();
    }
  }, React.createElement("div", {
    className: "profile-sheet"
  }, React.createElement("button", {
    className: "profile-close",
    "aria-label": "Close profile",
    onClick: close
  }, "\u2715"), React.createElement("img", {
    className: "profile-photo",
    src: profile.photo,
    alt: 'Portrait of ' + profile.name
  }), React.createElement("div", {
    className: "profile-copy"
  }, React.createElement("div", {
    className: "location"
  }, React.createElement(Icon, {
    type: "Pin"
  }), profile.city), React.createElement("h2", {
    id: "profile-name"
  }, profile.name, ", ", profile.age), React.createElement("p", null, profile.bio), React.createElement("div", {
    className: "tags"
  }, interests.map(x => React.createElement("span", {
    key: x
  }, x))), mode === 'full' && React.createElement("section", {
    className: "starter",
    "aria-labelledby": "starter-title"
  }, React.createElement("h3", {
    id: "starter-title"
  }, React.createElement("label", {
    htmlFor: "starter-draft"
  }, "Conversation starter")), React.createElement("textarea", {
    id: "starter-draft",
    value: draft,
    rows: 3,
    maxLength: 500,
    onChange: e => {
      setDraft(e.target.value);
      setStatus('');
    }
  }), React.createElement("div", {
    className: "starter-actions"
  }, React.createElement("button", {
    type: "button",
    className: "shuffle",
    onClick: nextStarter
  }, React.createElement("span", {
    "aria-hidden": "true"
  }, "\u21BB"), " Try something new"), React.createElement("button", {
    type: "button",
    className: "send",
    disabled: !starter || sent.includes(starter),
    onClick: send
  }, sent.includes(starter) ? 'Sent ✓' : 'Send ↗')), React.createElement("small", {
    role: "status"
  }, status || 'Saved on this device when you send.')))));
}
function App() {
  const [tab, setTab] = useState('Discover'),
    [feed, setFeed] = useState(null),
    [matches, setMatches] = useState([]),
    [match, setMatch] = useState(null),
    [error, setError] = useState(''),
    [drag, setDrag] = useState(0),
    [exit, setExit] = useState('');
  const [view, setView] = useState(null);
  const hold = useRef(null),
    press = useRef(null);
  useEffect(() => () => clearTimeout(hold.current), [tab]);
  const [paused, setPaused] = useState(false);
  const [notice, setNotice] = useState('');
  const gestureSound = useRef(false),
    gestureId = useRef(null),
    actionFocus = useRef(null);
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const origin = useRef(null),
    busy = useRef(false),
    dialog = useRef(null),
    current = feed?.[0];
  async function load() {
    try {
      const [f, m] = await Promise.all([api('/feed'), api('/matches')]);
      setFeed(f);
      setMatches(m);
      setError('');
    } catch {
      setError('Couldn’t load your profiles.');
    }
  }
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    if (match) dialog.current.showModal();
  }, [match]);
  async function swipe(direction) {
    if (!current || busy.current) return;
    CoySound.unlock();
    busy.current = true;
    setExit(direction);
    setDrag(0);
    setError('');
    try {
      const [result] = await Promise.all([api('/swipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profileId: current.id,
          direction
        })
      }), new Promise(r => setTimeout(r, reduced() ? 0 : 220))]);
      CoySound.play(result.matched ? 'match' : direction);
      if (!reduced() && !document.hidden && typeof navigator.vibrate === 'function') {
        try {
          navigator.vibrate(result.matched ? [25, 35, 45] : 12);
        } catch {}
      }
      setNotice((direction === 'like' ? 'Liked ' : 'Passed on ') + current.name + '.');
      setFeed(f => f.filter(p => p.id !== current.id));
      if (result.matched) {
        setMatches(m => [...m, current]);
        setMatch(current);
      }
    } catch {
      await load();
      setError('Swipe interrupted. Check the current card before trying again.');
    } finally {
      busy.current = false;
      setExit('');
    }
  }
  function resetGesture() {
    origin.current = null;
    gestureId.current = null;
    gestureSound.current = false;
    setDrag(0);
  }
  function closeMatch(destination) {
    dialog.current?.close();
    setMatch(null);
    if (destination) setTab(destination);
    requestAnimationFrame(() => {
      (destination ? document.querySelector('nav [aria-current]') : actionFocus.current || document.querySelector('nav [aria-current]'))?.focus();
    });
  }
  function profileEvents(profile, canSwipe) {
    return {
      role: 'button',
      tabIndex: 0,
      'aria-label': 'Open ' + profile.name + '’s profile',
      onKeyDown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setView({
            profile,
            mode: 'full'
          });
        }
      },
      onClick(e) {
        if (e.detail === 0 && !busy.current) setView({
          profile,
          mode: 'full'
        });
      },
      onContextMenu(e) {
        e.preventDefault();
      },
      onPointerDown(e) {
        if (!e.isPrimary || e.button !== 0 || busy.current) return;
        CoySound.unlock();
        e.currentTarget.setPointerCapture(e.pointerId);
        press.current = {
          id: e.pointerId,
          x: e.clientX,
          y: e.clientY,
          moved: false,
          held: false
        };
        clearTimeout(hold.current);
        hold.current = setTimeout(() => {
          if (press.current) {
            press.current.held = true;
            setView({
              profile,
              mode: 'peek'
            });
          }
        }, 450);
      },
      onPointerMove(e) {
        const g = press.current;
        if (!g || g.id !== e.pointerId) return;
        const dx = e.clientX - g.x,
          dy = e.clientY - g.y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 9 && !g.moved) return;
        clearTimeout(hold.current);
        g.moved = true;
        if (canSwipe && Math.abs(dx) > Math.abs(dy)) {
          if (g.held) setView(null);
          setDrag(dx);
          if (Math.abs(dx) > 30 && !gestureSound.current) {
            gestureSound.current = true;
            CoySound.play('swipe');
          }
        }
      },
      onPointerUp(e) {
        const g = press.current;
        if (!g || g.id !== e.pointerId) return;
        clearTimeout(hold.current);
        press.current = null;
        const dx = e.clientX - g.x,
          dy = e.clientY - g.y;
        if (canSwipe && Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy)) {
          setView(null);
          swipe(dx > 0 ? 'like' : 'pass');
        } else if (!g.held && !g.moved) setView({
          profile,
          mode: 'full'
        });
        resetGesture();
      },
      onLostPointerCapture() {
        clearTimeout(hold.current);
        press.current = null;
        resetGesture();
      },
      onPointerCancel() {
        clearTimeout(hold.current);
        press.current = null;
        resetGesture();
      }
    };
  }
  return React.createElement(React.Fragment, null, React.createElement("header", null, React.createElement("div", {
    className: "brand",
    "aria-label": "Coy"
  }, "coy", React.createElement("span", null, "\u2733")), React.createElement("nav", {
    "aria-label": "Main navigation"
  }, ['Home', 'Discover', 'Matches'].map(t => React.createElement("button", {
    key: t,
    "aria-current": t === tab ? 'page' : undefined,
    onClick: () => setTab(t)
  }, React.createElement(Icon, {
    type: t
  }), t, t === 'Matches' && matches.length > 0 && React.createElement("small", null, matches.length))))), React.createElement("span", {
    role: "status",
    className: "sr-only"
  }, notice), React.createElement("main", {
    key: tab,
    className: "screen"
  }, tab !== 'Home' && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "heading"
  }, React.createElement("h1", null, tab, React.createElement("em", null, ".")), tab === 'Discover' && current && !paused && React.createElement("button", {
    className: "sound",
    onClick: () => setPaused(true)
  }, "Pause discovery")), error && React.createElement("p", {
    role: "alert"
  }, error, " ", React.createElement("button", {
    onClick: load
  }, "Refresh")), tab === 'Discover' && paused ? React.createElement("section", {
    className: "empty"
  }, React.createElement("h2", null, "Discovery paused."), React.createElement("p", null, "Your place is saved in this session."), React.createElement("button", {
    autoFocus: true,
    onClick: () => setPaused(false)
  }, "Resume discovery")) : tab === 'Discover' ? current ? React.createElement(React.Fragment, null, React.createElement("div", {
    className: "card-entry",
    key: current.id
  }, React.createElement("article", _extends({
    className: ['card', exit, drag ? 'dragging' : ''].join(' '),
    style: {
      '--drag': drag + 'px',
      '--tilt': Math.max(-8, Math.min(8, drag / 19)) + 'deg'
    }
  }, profileEvents(current, true)), (Math.abs(drag) > 8 || exit) && React.createElement("b", {
    "aria-hidden": "true",
    className: 'swipe-mark ' + ((exit ? exit === 'like' : drag > 0) ? 'like' : 'pass')
  }, (exit ? exit === 'like' : drag > 0) ? React.createElement(Icon, {
    type: "Matches"
  }) : '✕'), React.createElement("div", {
    className: "picture"
  }, React.createElement("img", {
    src: current.photo,
    alt: 'Illustrated portrait of ' + current.name,
    draggable: "false"
  })), React.createElement("div", {
    className: "details"
  }, React.createElement("div", {
    className: "location"
  }, React.createElement(Icon, {
    type: "Pin"
  }), current.city), React.createElement("h2", null, current.name, React.createElement("i", null, ", ", current.age)), React.createElement("p", null, current.bio), React.createElement("div", {
    className: "tags"
  }, current.interests.map(x => React.createElement("span", {
    key: x
  }, x)))))), React.createElement("div", {
    className: "actions"
  }, React.createElement("button", {
    "aria-disabled": !!exit,
    onClick: () => swipe('pass')
  }, React.createElement(Icon, {
    type: "Pass"
  }), "Pass"), React.createElement("button", {
    "aria-disabled": !!exit,
    ref: actionFocus,
    onClick: () => swipe('like')
  }, React.createElement(Icon, {
    type: "Matches"
  }), "Like"))) : React.createElement("section", {
    className: "empty"
  }, React.createElement("h2", null, feed ? 'You’re all caught up.' : error ? 'Profiles unavailable' : 'Finding profiles…'), feed && React.createElement("button", {
    onClick: () => setTab('Matches')
  }, "See your matches")) : matches.length ? React.createElement("div", {
    className: "grid"
  }, matches.map(p => React.createElement("article", _extends({
    key: p.id
  }, profileEvents(p, false)), React.createElement("img", {
    draggable: "false",
    src: p.photo,
    alt: ""
  }), React.createElement("h2", null, p.name, ", ", p.age), React.createElement("p", null, p.city)))) : React.createElement("section", {
    className: "empty"
  }, React.createElement(Icon, {
    type: "Matches"
  }), React.createElement("h2", null, "No matches yet."), React.createElement("p", null, "When you both like each other, you\u2019ll meet here."), React.createElement("button", {
    onClick: () => setTab('Discover')
  }, "Discover people")))), view && React.createElement(ProfileView, {
    key: view.profile.id + view.mode,
    profile: view.profile,
    mode: view.mode,
    close: () => setView(null)
  }), match && React.createElement("dialog", {
    ref: dialog,
    "aria-labelledby": "match-title",
    onCancel: e => {
      e.preventDefault();
      closeMatch();
    }
  }, React.createElement("img", {
    src: match.photo,
    alt: ""
  }), React.createElement("h2", {
    id: "match-title"
  }, "It\u2019s a match!"), React.createElement("p", null, "You and ", match.name, " liked each other."), React.createElement("button", {
    autoFocus: true,
    onClick: () => closeMatch()
  }, "Keep discovering"), React.createElement("button", {
    onClick: () => closeMatch('Matches')
  }, "View matches")));
}
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App, null));
