/* Plan content and progress logic. Loaded by the pages and by the service worker, so no DOM access here. */
(function (g) {
  "use strict";

  var SD = [
    "Client-server model and the request lifecycle","Latency, throughput and percentiles (p50, p99)","Back-of-envelope estimation","Availability, reliability, SLAs and SLOs","Horizontal vs vertical scaling",
    "Load balancing: algorithms, L4 vs L7","Stateless vs stateful services and sessions","REST API design and versioning","Pagination: cursor vs offset","Idempotency and idempotency keys",
    "Rate limiting: token bucket and sliding window","HTTP caching: Cache-Control and ETag","CDN and CloudFront cache behaviours","DNS and how a request finds your server","TLS, HTTPS and certificate pinning",
    "SQL vs NoSQL: how to choose","Indexing: B-trees and compound index order","MongoDB schema design: embed vs reference","Reading query plans with explain","Replication: leader and followers",
    "Replication lag and read-your-writes","Sharding strategies","Consistent hashing","CAP theorem","PACELC and consistency models",
    "ACID transactions and isolation levels","Caching patterns: cache-aside, write-through, write-back","Cache invalidation and cache stampede","Redis data structures and what each is for","Redis persistence and eviction policies",
    "Bloom filters","Object storage and S3 presigned URLs","Denormalisation and materialised views","Time-series data and append-only logs","Search basics: the inverted index",
    "Message queues vs publish/subscribe","Kafka: partitions and consumer groups","Delivery semantics: at-most, at-least, exactly once","Retries with backoff and dead-letter queues","The outbox pattern",
    "The saga pattern","Event sourcing and CQRS","Background jobs and worker design","WebSockets vs SSE vs long polling","Scaling WebSocket servers with Redis pub/sub",
    "Push notifications: how FCM and APNs work","Presence and typing indicators","Webhook design, signing and retries","Backpressure and load shedding","Circuit breakers and bulkheads",
    "Monolith vs microservices","API gateway and the backend-for-frontend pattern","Service discovery","GraphQL vs REST trade-offs","gRPC and protocol buffers",
    "Authentication: sessions vs JWT","OAuth 2.0 and OpenID Connect flow","Refresh tokens and rotation","Authorisation: RBAC vs ABAC","Secrets management",
    "Multi-region deployment and failover","Disaster recovery: RPO and RTO","Blue-green and canary deployments","Feature flags and kill switches","Observability: logs, metrics and traces",
    "Mobile architecture layers: MVVM and clean architecture","Offline-first apps and local databases","Sync and conflict resolution: last-write-wins vs CRDTs","Mobile networking: timeouts, retries, flaky connections","Image loading, caching and resizing",
    "List virtualisation and pagination in apps","App startup time and lazy loading","State management at scale: Redux normalisation","OTA updates and safe rollout","Mobile CI/CD and release trains",
    "Crash reporting and app health metrics","Secure storage on device: Keychain and Keystore","Deep links and universal links","Background execution limits on iOS and Android","VoIP: CallKit, PushKit, signalling and TURN",
    "Case study: design a URL shortener","Case study: design a chat app","Case study: design a news feed","Case study: design a notification system","Case study: design a matchmaking service",
    "Case study: design a video call service","Case study: design a file upload service","Case study: design a rate limiter service","Case study: design a payments flow with idempotency","Capstone: write the design of your own app's backend"
  ];
  var AI = [
    "What an LLM is: next-token prediction","Tokens and tokenisation","The context window and its limits","Temperature, top-p and sampling","Embeddings basics",
    "Prompt anatomy: system, user, assistant","Zero-shot vs few-shot prompting","Chain-of-thought and reasoning prompts","Structured output and JSON schemas","Hallucinations and why they happen",
    "Prompt caching","Streaming responses over SSE","Estimating cost and latency per request","Choosing between small and large models","Rate limits and retries for LLM APIs",
    "Attention, intuitively","Transformer architecture overview","Pretraining vs fine-tuning vs RLHF","Fine-tuning vs RAG vs prompting: when to use which","LoRA and parameter-efficient tuning",
    "Quantisation basics","Distillation","Scaling laws","The KV cache","Mixture of experts",
    "Multimodal models","Open-weight vs hosted models","Context engineering","Long context vs retrieval","Benchmarks and their limits",
    "RAG pipeline overview","Chunking strategies","Vector databases and ANN search (HNSW)","Similarity metrics: cosine vs dot product","Hybrid search: BM25 plus vectors",
    "Reranking","Query rewriting","Metadata filtering","Citations and grounding","RAG failure modes",
    "Evaluating retrieval: recall@k and MRR","Evaluating generation: faithfulness and relevance","Choosing an embedding model","Keeping a vector index fresh","RAG architecture for a mobile app and Node backend",
    "Tool and function calling","The ReAct loop","Agent architecture: planner, executor, memory","Short-term vs long-term memory","Model Context Protocol (MCP)",
    "Multi-agent patterns","Workflow vs agent: when to use which","Guardrails for tool use","Human-in-the-loop design","Agent failure modes: loops and drift",
    "Sandboxing code execution","Cost control for agents","Planning and task decomposition","Computer-use and browser agents","Evaluating agents: task success rate",
    "Why evals: measuring instead of guessing","Building a golden test set","LLM-as-judge and its biases","Regression testing for prompts","Prompt injection",
    "Data leakage and PII handling","Jailbreaks and content filters","Red teaming","Output validation and schema checks","Observability for LLM apps: tracing",
    "A/B testing AI features","Human feedback loops","Bias and responsible AI","Privacy: on-device vs cloud inference","Compliance basics: India's DPDP Act and GDPR",
    "On-device ML: Core ML and TensorFlow Lite","On-device LLMs and small models","Streaming UI patterns","Latency UX: skeletons and partial results","Voice: speech-to-text and text-to-speech",
    "Vision features: OCR and image understanding","Smart replies and summaries","Personalisation and recommender basics","Embedding-based search inside an app","Semantic caching",
    "Cost optimisation: routing, batching, caching","AI-assisted coding: strengths, limits and review discipline","Spec-driven development and reviewing AI-written code","Career map: AI engineer vs ML engineer","Capstone: write a one-page AI product proposal"
  ];
  var DSA = [
    [["Two Sum","E"],["Group Anagrams","M"]],[["Top K Frequent Elements","M"],["Product of Array Except Self","M"]],
    [["Contains Duplicate","E"],["Longest Consecutive Sequence","M"]],
    [["Valid Palindrome","E"],["3Sum","M"]],[["Two Sum II - Input Array Is Sorted","M"],["Valid Anagram","E"]],
    [["Container With Most Water","M"],["Longest Substring Without Repeating Characters","M"]],
    [["Best Time to Buy and Sell Stock","E"],["Permutation in String","M"]],[["Valid Parentheses","E"],["Daily Temperatures","M"]],
    [["Min Stack","M"],["Evaluate Reverse Polish Notation","M"]],[["Generate Parentheses","M"],["Car Fleet","M"]],
    [["Binary Search","E"],["Search in Rotated Sorted Array","M"]],[["Koko Eating Bananas","M"],["Find Minimum in Rotated Sorted Array","M"]],
    [["Search a 2D Matrix","M"],["Time Based Key-Value Store","M"]],
    [["Reverse Linked List","E"],["Merge Two Sorted Lists","E"]],[["Linked List Cycle","E"],["Remove Nth Node From End of List","M"]],
    [["LRU Cache","M"],["Add Two Numbers","M"]],[["Reorder List","M"],["Copy List with Random Pointer","M"]],
    [["Invert Binary Tree","E"],["Maximum Depth of Binary Tree","E"]],[["Same Tree","E"],["Diameter of Binary Tree","E"]],
    [["Validate Binary Search Tree","M"],["Binary Tree Level Order Traversal","M"]],[["Lowest Common Ancestor of a Binary Search Tree","M"],["Kth Smallest Element in a BST","M"]],
    [["Binary Tree Right Side View","M"],["Construct Binary Tree from Preorder and Inorder Traversal","M"]],
    [["Number of Islands","M"],["Clone Graph","M"]],[["Course Schedule","M"],["Rotting Oranges","M"]],
    [["Max Area of Island","M"],["Pacific Atlantic Water Flow","M"]],
    [["Climbing Stairs","E"],["House Robber","M"]],[["Coin Change","M"],["Longest Increasing Subsequence","M"]],
    [["Unique Paths","M"],["Longest Common Subsequence","M"]],
    [["Merge Intervals","M"],["Insert Interval","M"]],[["Meeting Rooms II","M"],["Non-overlapping Intervals","M"]],
    [["Kth Largest Element in an Array","M"],["Task Scheduler","M"]],[["Merge k Sorted Lists","H"],["Find Median from Data Stream","H"]],
    [["Subsets","M"],["Permutations","M"]],[["Combination Sum","M"],["Word Search","M"]],
    [["Word Break","M"],["Longest Palindromic Substring","M"]],[["Implement Trie (Prefix Tree)","M"],["Design Add and Search Words Data Structure","M"]]
  ];
  var SD_PH = [[1,15,"Foundations"],[16,35,"Data and storage"],[36,50,"Messaging and async"],[51,65,"Architecture and security"],[66,80,"Mobile systems"],[81,90,"Case studies"]];
  var AI_PH = [[1,15,"LLM basics"],[16,30,"Models and training"],[31,45,"Retrieval (RAG)"],[46,60,"Agents and tools"],[61,75,"Evals and safety"],[76,90,"AI in products"]];
  /* Saturdays and Sundays are off: the 90 plan days run Monday to Friday, 5 per week. */
  var DAYS = 90, PER_WEEK = 5, WEEKS = 18;
  var BIT = { office: 1, sd: 2, ai: 4, dsa: 8 };
  var DEFAULT_START = "2026-10-29";
  var OLD_DEFAULT_START = "2026-11-02";
  var KEY = "routine90";

  function phase(list, n) { for (var i = 0; i < list.length; i++) if (n >= list[i][0] && n <= list[i][1]) return list[i][2]; return ""; }
  function dsaIndex(d) { var r = (d - 1) % PER_WEEK; if (r !== 1 && r !== 4) return -1; return 2 * Math.floor((d - 1) / PER_WEEK) + (r === 4 ? 1 : 0); }
  function mask(d) { return dsaIndex(d) >= 0 ? 15 : 7; }
  function bits(n) { var c = 0; while (n) { c += n & 1; n >>= 1; } return c; }
  var TOTAL_TASKS = 0; for (var q = 1; q <= DAYS; q++) TOTAL_TASKS += bits(mask(q));

  function validDate(s) { return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s + "T00:00:00").getTime()); }
  function normalize(d) {
    var out = { start: DEFAULT_START, done: {} };
    if (d && validDate(d.start)) out.start = d.start;
    if (d && d.done && typeof d.done === "object") {
      for (var k in d.done) { var n = parseInt(k, 10), v = parseInt(d.done[k], 10); if (n >= 1 && n <= DAYS && v > 0) out.done[n] = v & mask(n); }
    }
    return out;
  }
  function same(a, b) { return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b)); }

  /* ---------- dates ---------- */
  function isOff(dt) { var w = dt.getDay(); return w === 0 || w === 6; }
  function addDays(dt, n) { return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + n); }
  function today() { return addDays(new Date(), 0); }
  function isOffToday() { return isOff(today()); }
  /* Day 1 is the first weekday on or after the start date. */
  function firstDay(s) { var p = s.start.split("-"), t = new Date(+p[0], +p[1] - 1, +p[2]); while (isOff(t)) t = addDays(t, 1); return t; }
  function dateOf(s, d) {
    var w = (d - 1) % PER_WEEK, t = addDays(firstDay(s), 7 * Math.floor((d - 1) / PER_WEEK));
    while (w > 0) { t = addDays(t, 1); if (!isOff(t)) w--; }
    return t;
  }
  /* Plan day for today. Below 1 means the plan has not started (1 - n calendar days to go). On a weekend this is the next working day. */
  function todayNum(s) {
    var t0 = today(), f = firstDay(s);
    if (t0 < f) return 1 - Math.round((f - t0) / 86400000);
    var weeks = Math.floor(Math.round((t0 - f) / 86400000) / 7), n = PER_WEEK * weeks;
    for (var t = addDays(f, 7 * weeks); t <= t0; t = addDays(t, 1)) if (!isOff(t)) n++;
    return isOff(t0) ? n + 1 : n;
  }

  /* ---------- progress ---------- */
  function stored(s, d) { return s.done[d] || 0; }
  function complete(s, d) { return (stored(s, d) & mask(d)) === mask(d); }
  function remaining(s, d) { return bits(mask(d)) - bits(stored(s, d) & mask(d)); }
  function toggle(s, d, key, on) {
    var v = stored(s, d), b = BIT[key];
    v = on ? (v | b) : (v & ~b);
    if (v) s.done[d] = v; else delete s.done[d];
  }
  function stats(s) {
    var days = 0, tasks = 0, streak = 0, tn = todayNum(s);
    for (var d = 1; d <= DAYS; d++) { if (complete(s, d)) days++; tasks += bits(stored(s, d) & mask(d)); }
    var last = Math.min(tn, DAYS); if (last >= 1 && !complete(s, last)) last--;
    for (var e = last; e >= 1 && complete(s, e); e--) streak++;
    return { days: days, tasks: tasks, streak: streak, tn: tn, rank: rank(days), pct: Math.round(tasks / TOTAL_TASKS * 100) };
  }
  /* Hunter rank climbs every 18 cleared days: E, D, C, B, A, then S on the last day. */
  function rank(days) { return "EDCBAS".charAt(Math.min(5, Math.floor(days / 18))); }

  /* ---------- storage (chrome.storage.sync follows the user's Chrome profile) ---------- */
  async function load() { var r = await chrome.storage.sync.get(KEY); return normalize(r[KEY]); }
  function save(s) { return chrome.storage.sync.set({ [KEY]: { start: s.start, done: s.done } }); }
  function onChange(fn) {
    chrome.storage.onChanged.addListener(function (changes, area) {
      if (area === "sync" && changes[KEY]) fn(normalize(changes[KEY].newValue));
    });
  }

  g.Routine = {
    SD: SD, AI: AI, DSA: DSA, SD_PH: SD_PH, AI_PH: AI_PH,
    DAYS: DAYS, PER_WEEK: PER_WEEK, WEEKS: WEEKS, BIT: BIT, TOTAL_TASKS: TOTAL_TASKS,
    DEFAULT_START: DEFAULT_START, OLD_DEFAULT_START: OLD_DEFAULT_START, rank: rank,
    phase: phase, dsaIndex: dsaIndex, mask: mask, validDate: validDate, normalize: normalize, same: same,
    dateOf: dateOf, todayNum: todayNum, isOffToday: isOffToday, stored: stored, complete: complete, remaining: remaining,
    toggle: toggle, stats: stats, load: load, save: save, onChange: onChange
  };
})(self);
