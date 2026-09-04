export const projects = [
  {
    name: 'rust-compile-time-instrumentation',
    slug: 'rust-compile-time-instrumentation',
    description:
      "Zero-code compile-time OpenTelemetry instrumentation for Rust, reaching third-party dependencies, on stable Rust: no nightly, no compiler forks, no eBPF. Intercepts rustc via RUSTC_WRAPPER and splices native OTel API calls at the byte level, with an extern \"C\" trampoline so dependency crates get instrumented without dragging OTel into every upstream crate's dependency tree. Architecture is frozen behind six ADRs and a normative correctness spec; the cargo-instrument pipeline itself is in active development. My current biggest project.",
    languages: ['Rust'],
    href: 'https://github.com/darkraider01/rust-compile-time-instrumentation-',
    updatedAt: '2026-09-04T17:06:24Z',
    featured: true
  },
  {
    name: 'Capa',
    slug: 'capa',
    description:
      "A system that infers a software engineer's real technical ability from how they actually work, not from what's on their resume. Behavioral signal extraction and analysis, built in Rust for the performance and correctness guarantees that matter when you're modeling something this fuzzy with something this precise.",
    languages: ['Rust'],
    href: 'https://github.com/darkraider01/Capa',
    updatedAt: '2026-08-14T15:29:57Z',
    featured: true
  },
  {
    name: 'AI-Driven QoS Management for 5G Networks',
    slug: '5g-qos',
    description:
      'A research-grade 5G QoS engine that integrates real UERANSIM UE/gNB simulation with an Open5GS core, adaptive traffic classification, and congestion-aware bandwidth orchestration, backed by 3GPP TS 23.501-compliant 5QI/QFI mapping, with a live NOC-style dashboard on top.',
    languages: ['Python'],
    href: 'https://github.com/darkraider01/ai-driven-qos-management-system-for-5g-networks',
    updatedAt: '2026-07-24T23:22:56Z',
    featured: true
  },
  {
    name: 'mini-etcd',
    slug: 'mini-etcd',
    description:
      "A distributed key-value store with a Raft consensus implementation written from scratch — no consensus library, no shortcuts. Leader election, log replication, and membership changes built and reasoned about by hand, because building the \"rite of passage\" project is the only way to actually understand why etcd and friends are shaped the way they are.",
    languages: ['Go'],
    href: 'https://github.com/darkraider01/mini-etcd',
    updatedAt: '2026-01-29T19:21:53Z'
  },
  {
    name: 'SolarShield AI Inference',
    slug: 'solarshield',
    description:
      'A production-oriented CNN-LSTM inference engine for solar panel fault detection, with TensorFlow and ONNX/TensorRT export paths, served through FastAPI and deployable directly to NVIDIA Jetson hardware for on-device inference.',
    languages: ['Python'],
    href: 'https://github.com/darkraider01/solarshield-ai-inference',
    updatedAt: '2026-08-05T11:16:46Z'
  },
  {
    name: 'OSS-Maintainer-AI',
    slug: 'oss-maintainer-ai',
    description:
      'An autonomous, multi-platform co-maintainer agent that unifies GitHub, Slack, Discord, and email into a single triage and response pipeline for open-source maintainers — issue triage, repetitive-question handling, and onboarding friction pulled into one execution stream instead of five inboxes.',
    languages: ['TypeScript'],
    href: 'https://github.com/darkraider01/OSS-Maintainer-AI',
    updatedAt: '2026-08-13T12:13:21Z'
  },
  {
    name: 'blockchain-inventory-management',
    slug: 'inventory',
    description:
      'An inventory management system backed by a blockchain ledger — every stock movement is a recorded, ordered transaction instead of a row that silently gets overwritten. A practical look at what blockchain buys you (and what it costs you) outside of currency.',
    languages: ['Go'],
    href: 'https://github.com/darkraider01/blockchain-inventory-management',
    updatedAt: '2026-07-20T08:34:39Z'
  },
  {
    name: 'Video-Streamer',
    slug: 'video-streamer',
    description:
      'A Rust-based video streaming application for Linux, built to understand the mechanics of chunked delivery and playback from the server side rather than treating streaming as a solved problem you just configure.',
    languages: ['Rust'],
    href: 'https://github.com/darkraider01/Video-Streamer',
    updatedAt: '2025-09-13T09:39:55Z'
  },
  {
    name: 'Chat-app',
    slug: 'chat-app',
    description:
      'A retro-styled chat application written in Rust — TCP-level plumbing, message framing, and connection handling done directly instead of through a framework that hides all of it.',
    languages: ['Rust'],
    href: 'https://github.com/darkraider01/Chat-app',
    updatedAt: '2025-07-29T16:50:25Z'
  }
];
