/**
 * CUSTOMER-EDITABLE PRESENTATION CONTENT
 * --------------------------------------
 * This is the main file to edit for spelling changes, titles, descriptions,
 * navigation labels, cards, POC sites, and dashboard launcher wording.
 *
 * Keep commas, quotes and brackets intact. See /EDITING_GUIDE.md for examples.
 */
const CONTENT = {
  en: {
    // ===== NAVIGATION MENU — labels shown in the top navigation =====
    sections: [
      "Introduction",
      "Coverage",
      "Architecture",
      "Capabilities",
      "Why Private 5G",
      "POC",
      "Operational Dashboard"
    ],

    // ===== SLIDE 1 — Introduction =====
    landing: {
      "title": "Pulse 5G Network",
      "sub": "A secure, isolated and managed private fixed + private 5G architecture for mission-critical connectivity.",
      "type": "Private connectivity for critical operations.",
      "typing": [
        "Secure private connectivity for critical operations.",
        "Dedicated 4G / 5G core with mission-ready services.",
        "Nationwide private coverage with isolated transport."
      ],
      "aboutTitle": "About the Network",
      "overview": "Pulse 5G is a national infrastructure platform designed for secure high-speed connectivity, low latency and isolated operations.",
      "aboutParagraphs": [
        "Pulse 5G is a national infrastructure platform that enables high-speed data transfer with low latency to support faster field decisions.",
        "When integrated with a sovereign isolated private, air-gapped architecture, it provides an independent and secure communications environment for police, security and civil entities.",
        "The network uses advanced encryption and full logical isolation to strengthen confidentiality, reduce cyber risk and improve secure coordination across connected entities."
      ],
      "chips": ["Secure", "Isolated", "Low Latency", "Reliable", "Mission-Critical"],
      "mapGeo": {
        "view": {"center": [54.35, 24.45], "zoom": 6.15, "pitch": 42, "bearing": -11},
        "linkedEntities": [
          {"id": "mod", "name": "Ministry of Defence", "label": "MOD", "role": "Connected entity", "lng": 54.3700, "lat": 24.4350},
          {"id": "moi", "name": "Ministry of Interior", "label": "MOI", "role": "Connected entity", "lng": 54.3860, "lat": 24.4700}
        ],
        "controlCenters": [
          {"id": "cc-ad", "name": "Primary Control Center", "label": "CC-AD", "role": "Primary control center", "lng": 54.3773, "lat": 24.4539},
          {"id": "cc-dxb", "name": "Regional Control Center", "label": "CC-DXB", "role": "Regional control center", "lng": 55.2708, "lat": 25.2048},
          {"id": "cc-shj", "name": "Secondary Control Center", "label": "CC-SHJ", "role": "Secondary control center", "lng": 55.4033, "lat": 25.3463}
        ],
        "pops": [
          {"id": "pop-01", "name": "Abu Dhabi Central", "label": "POP 01", "lng": 54.38, "lat": 24.46},
          {"id": "pop-02", "name": "Khalifa City", "label": "POP 02", "lng": 54.61, "lat": 24.43},
          {"id": "pop-03", "name": "Yas / Raha", "label": "POP 03", "lng": 54.63, "lat": 24.47},
          {"id": "pop-04", "name": "Mussafah", "label": "POP 04", "lng": 54.48, "lat": 24.35},
          {"id": "pop-05", "name": "Al Ain", "label": "POP 05", "lng": 55.76, "lat": 24.19},
          {"id": "pop-06", "name": "Madinat Zayed", "label": "POP 06", "lng": 53.70, "lat": 23.65},
          {"id": "pop-07", "name": "Ruwais", "label": "POP 07", "lng": 52.73, "lat": 24.11},
          {"id": "pop-08", "name": "Dubai Central", "label": "POP 08", "lng": 55.27, "lat": 25.20},
          {"id": "pop-09", "name": "Jebel Ali", "label": "POP 09", "lng": 55.05, "lat": 24.99},
          {"id": "pop-10", "name": "Sharjah", "label": "POP 10", "lng": 55.40, "lat": 25.35},
          {"id": "pop-11", "name": "Ajman", "label": "POP 11", "lng": 55.51, "lat": 25.40},
          {"id": "pop-12", "name": "Ras Al Khaimah", "label": "POP 12", "lng": 55.94, "lat": 25.79},
          {"id": "pop-13", "name": "Fujairah", "label": "POP 13", "lng": 56.33, "lat": 25.13}
        ],
        "ilas": [
          {"id": "ila-01", "name": "Abu Dhabi Corniche", "label": "ILA 01", "lng": 54.34, "lat": 24.48},
          {"id": "ila-02", "name": "Saadiyat", "label": "ILA 02", "lng": 54.45, "lat": 24.54},
          {"id": "ila-03", "name": "Shahama", "label": "ILA 03", "lng": 54.74, "lat": 24.52},
          {"id": "ila-04", "name": "Al Wathba", "label": "ILA 04", "lng": 54.72, "lat": 24.28},
          {"id": "ila-05", "name": "Sweihan", "label": "ILA 05", "lng": 55.42, "lat": 24.40},
          {"id": "ila-06", "name": "Al Ain North", "label": "ILA 06", "lng": 55.73, "lat": 24.23},
          {"id": "ila-07", "name": "Al Ain South", "label": "ILA 07", "lng": 55.79, "lat": 24.13},
          {"id": "ila-08", "name": "Liwa", "label": "ILA 08", "lng": 53.77, "lat": 23.13},
          {"id": "ila-09", "name": "Ghayathi", "label": "ILA 09", "lng": 52.79, "lat": 23.89},
          {"id": "ila-10", "name": "Ruwais Port", "label": "ILA 10", "lng": 52.61, "lat": 24.10},
          {"id": "ila-11", "name": "Dubai North", "label": "ILA 11", "lng": 55.36, "lat": 25.28},
          {"id": "ila-12", "name": "Dubai South", "label": "ILA 12", "lng": 55.16, "lat": 24.87},
          {"id": "ila-13", "name": "Sharjah Airport", "label": "ILA 13", "lng": 55.52, "lat": 25.33},
          {"id": "ila-14", "name": "Ajman East", "label": "ILA 14", "lng": 55.57, "lat": 25.42},
          {"id": "ila-15", "name": "Umm Al Quwain", "label": "ILA 15", "lng": 55.56, "lat": 25.56},
          {"id": "ila-16", "name": "RAK South", "label": "ILA 16", "lng": 55.89, "lat": 25.66},
          {"id": "ila-17", "name": "Khor Fakkan", "label": "ILA 17", "lng": 56.35, "lat": 25.34},
          {"id": "ila-18", "name": "Fujairah Port", "label": "ILA 18", "lng": 56.36, "lat": 25.11}
        ],
        "coverageAreas": [
          {"name": "Abu Dhabi Coverage", "lng": 54.43, "lat": 24.42, "radiusKm": 42},
          {"name": "Al Ain Coverage", "lng": 55.76, "lat": 24.19, "radiusKm": 28},
          {"name": "Dubai Corridor", "lng": 55.31, "lat": 25.18, "radiusKm": 30},
          {"name": "Northern Emirates", "lng": 55.73, "lat": 25.52, "radiusKm": 34},
          {"name": "East Coast Coverage", "lng": 56.30, "lat": 25.21, "radiusKm": 22}
        ],
        "offshoreCoverage": [
          {"name": "Western Offshore Coverage", "center": [53.65, 24.60], "radiusKm": 28},
          {"name": "Eastern Offshore Coverage", "center": [56.72, 25.24], "radiusKm": 22}
        ]
      }
    },

    // ===== SLIDE 2 — Coverage =====
    coverage: {
      "title": "Coverage",
      "subtitle": "",
      "label5g": "5G Coverage",
      "label4g": "4G Coverage",
      "labelOffshore": "Offshore Coverage",
      "compare": "Compare",
      "focus5g": "Focus 5G",
      "focus4g": "Focus 4G",
      "focusOffshore": "Focus Offshore",
      "expand": "Expand",
      "hint": "Select any map to focus, or expand it for closer inspection.",
      "zoomIn": "Zoom in",
      "zoomOut": "Zoom out",
      "reset": "Reset",
      "close": "Close"
    },

    // ===== SLIDE 2 — Project Brief =====
    brief: {
      "title": "Project Brief",
      "desc": "A strategic private-network proposition combining fixed private connectivity and private 5G capabilities for resilient, secure and scalable operations.",
      "bullets": [
        "Dedicated fixed transport over private fiber / DWDM and IP network.",
        "Private 5G access for mobility, field devices, sensors, CCTV and operational teams.",
        "Dedicated PLMN ID, dedicated IMSI range and isolated service behavior.",
        "Dedicated 5G / 4G core and VoNR hosted in Pulse data centers."
      ],
      "facts": [
        [
          "10K",
          "Planned subscribers"
        ],
        [
          "20",
          "Dedicated RAN clusters"
        ],
        [
          "2",
          "Pulse DCs"
        ],
        [
          "1",
          "Private service model"
        ]
      ],
      "pillars": [
        [
          "Private Transport",
          "Private fiber, DWDM and IP backbone supporting resilient site-to-core connectivity.",
          "route"
        ],
        [
          "Private 5G Access",
          "Mobility, CCTV, IoT sensors and field devices enabled through isolated private access.",
          "signal"
        ],
        [
          "Isolated Identity",
          "Dedicated PLMN ID, dedicated IMSI range and controlled private service behavior.",
          "sitemap"
        ],
        [
          "Dedicated Core & Voice",
          "Dedicated 4G / 5G core and VoNR hosted securely in Pulse data centers.",
          "server"
        ]
      ]
    },

    // ===== SLIDE 3 — Key Capabilities =====
    keycaps: [
      [
        "Dedicated 4G and 5G Core (Data)",
        "Dedicated mobile core for secure data services with controlled traffic handling, service isolation and private policy enforcement.",
        "server",
        [
          "Control Plane",
          "Private Data Plane"
        ]
      ],
      [
        "VoNR (Voice)",
        "Native 5G voice capability supporting high-quality mission communications and integrated operational voice services.",
        "phone",
        [
          "Low latency",
          "Voice continuity"
        ]
      ],
      [
        "Base Station Subsystem (BSS)",
        "Radio access subsystem comprising base-station elements that provide and manage the air-interface connection between users/devices and the mobile core.",
        "tower",
        [
          "Radio Access",
          "Air Interface"
        ]
      ],
      [
        "Mission Critical Push-to-Talk (AGNET)",
        "Instant and secure group communications for operations and emergency-response teams.",
        "comments",
        [
          "اتصال جماعي حرج",
          "Group comms"
        ]
      ],
      [
        "20 × Dedicated RAN Cluster",
        "Dedicated radio access clusters designed for controlled private coverage and capacity.",
        "tower",
        [
          "Dedicated PLMN",
          "Controlled coverage"
        ]
      ],
      [
        "RAN Sharing Nation-Wide (5G only)",
        "Nationwide 5G RAN sharing to extend approved access beyond dedicated cluster boundaries.",
        "globe2",
        [
          "Extended reach",
          "5G shared RAN"
        ]
      ],
      [
        "No. of Subscribers: 10,000",
        "Designed capacity for scalable enterprise-grade private connectivity across approved entities and users.",
        "users",
        [
          "10K scale",
          "Future ready"
        ]
      ]
    ],

    // ===== SLIDE 5 — Capabilities =====
    caps: [
      [
        "Scalable Complete Service",
        "End-to-end private network service designed to scale with new sites, applications, devices and future growth.",
        "rocket"
      ],
      [
        "High Reliability & Service Continuity",
        "Resilient architecture with main and diverse paths to enhance service availability and continuity.",
        "shield"
      ],
      [
        "Fully Diversified Network",
        "Multiple diversified network routes and connectivity paths to improve resilience and failover readiness.",
        "route"
      ],
      [
        "Private 5G Enablement",
        "Secure private 5G access for mobile users, CCTV, sensors, IoT and field operations.",
        "wifi"
      ],
      [
        "Secure Access & Traffic Segmentation",
        "Controlled onboarding, authenticated access and segmented traffic flows to protect sensitive services.",
        "lock"
      ],
      [
        "Mission-Critical Connectivity",
        "High-capacity, resilient connectivity engineered for critical applications and operational systems.",
        "star"
      ]
    ],

    // ===== SLIDE 6 — Why Private 5G =====
    why: [
      [
        "Ultra-Low Latency",
        "Fast connectivity for real-time operational applications and field systems.",
        "tachometer"
      ],
      [
        "High Capacity",
        "Dedicated bandwidth for video, IoT, telemetry and mission-critical applications.",
        "line-chart"
      ],
      [
        "Secure & Isolated",
        "Private connectivity with controlled access and no direct Internet exposure.",
        "shield"
      ],
      [
        "Massive IoT Connectivity",
        "Support for sensors, CCTV, access control and industrial devices.",
        "cloud"
      ],
      [
        "Mobility + Fixed Connectivity",
        "Seamless combination of private fixed transport and secure wireless mobility.",
        "mobile"
      ],
      [
        "Resilience & Continuity",
        "Redundant paths and diversified connectivity help maintain operations during incidents.",
        "refresh"
      ],
      [
        "Network Slicing / Segmentation",
        "Separate traffic domains for different users, services and security needs.",
        "sitemap"
      ],
      [
        "Scalable Future-Ready Architecture",
        "Designed to expand with future sites, users, services and bandwidth demand.",
        "forward"
      ]
    ],

    // ===== SLIDE 7 — Network Flow =====
    flow: [
      [
        "Critical Sites",
        "Secure operational sites, command centers and approved entities.",
        "building"
      ],
      [
        "Dedicated Fiber / DWDM",
        "Private transport layer providing high-capacity resilient fixed connectivity.",
        "link"
      ],
      [
        "L2 Aggregation PoPs",
        "Access aggregation and structured routing towards the private core.",
        "network"
      ],
      [
        "Pulse Private Network",
        "Isolated private network for routing, policy enforcement and visibility.",
        "random"
      ],
      [
        "Core Services & Security",
        "4G/5G core, VoNR, AGNET plus security controls and firewalls.",
        "firewall"
      ],
      [
        "Private 5G Access",
        "Wireless access for mobility, field operations and connected assets.",
        "wifi"
      ],
      [
        "Users • IoT • CCTV",
        "Endpoints and services consuming the private network.",
        "users"
      ]
    ],

    // ===== SLIDE 8 — POC =====
    poc: {
      "title": "POC",
      "subtitle": "Interactive Abu Dhabi proof-of-concept footprint with animated transport links and mapped active / planned sites.",
      "summary": "The POC anchors on Apollo DC as the core node, with one additional active RAN site and two planned expansion sites across Abu Dhabi.",
      "stats": [
        [
          "1",
          "Core / DC Anchor"
        ],
        [
          "2",
          "Active RAN Roles"
        ],
        [
          "2",
          "Planned RAN Sites"
        ],
        [
          "4",
          "Mapped Locations"
        ]
      ],
      "sites": [
        {
          "name": "مركز بيانات أبولو",
          "type": "core",
          "role": "Core + Active RAN",
          "status": "Live anchor site",
          "desc": "DC core site and active RAN role at the same location.",
          "lat": 24.432961,
          "lng": 54.811256
        },
        {
          "name": "مركز بيانات الخزنة",
          "type": "active",
          "role": "Active RAN",
          "status": "Live site",
          "desc": "Additional active RAN site connected to the private backbone.",
          "lat": 24.419028,
          "lng": 54.622167
        },
        {
          "name": "مبادلة",
          "type": "planned",
          "role": "Planned RAN",
          "status": "Planned expansion",
          "desc": "Planned RAN site for controlled coverage extension.",
          "lat": 24.4600518,
          "lng": 54.3913928
        },
        {
          "name": "مقر وزارة الدفاع",
          "type": "planned",
          "role": "Planned RAN",
          "status": "Planned expansion",
          "desc": "Planned RAN site serving approved operational users.",
          "lat": 24.41585,
          "lng": 54.478955
        }
      ],
      "links": [
        {
          "from": "مركز بيانات أبولو",
          "to": "مركز بيانات الخزنة",
          "type": "active",
          "label": "Active service link"
        },
        {
          "from": "مركز بيانات أبولو",
          "to": "مبادلة",
          "type": "planned",
          "label": "Planned expansion link"
        },
        {
          "from": "مركز بيانات أبولو",
          "to": "مقر وزارة الدفاع",
          "type": "planned",
          "label": "Planned expansion link"
        }
      ]
    },

    // ===== SLIDE 9 — Operational Dashboard launcher / labels =====
    dashboard: {
      "title": "Operational Dashboard",
      "tabs": [
        "Network Status",
        "Radio Coverage",
        "Voice & Data",
        "Phase 1 Rollout",
        "Operations"
      ],
      "launcher": {
        "description": "Executive operations view for service assurance, radio performance, rollout readiness and incident response.",
        "eyebrow": "Executive Operations",
        "title": "Operational Command Dashboard",
        "body": "Unified monitoring of service availability, coverage, voice and data performance, rollout progress and operational events across the Pulse 5G environment.",
        "bullets": [
          "Service assurance",
          "Coverage & performance",
          "Rollout & incidents"
        ],
        "launchButton": "Launch Dashboard",
        "backButton": "Back to POC",
        "badge": "Executive View",
        "stats": [
          [
            "05",
            "Operational views"
          ],
          [
            "18",
            "Active sites monitored"
          ],
          [
            "99.98%",
            "Service availability"
          ]
        ],
        "portalEyebrow": "Pulse 5G Executive Operations View"
      }
    },

    // ===== Reserved / closing statements =====
    closing: [
      "Dedicated private transport and isolated service model",
      "Private 5G mobility for advanced operational use cases",
      "Dedicated 5G / 4G core and VoNR hosted in Pulse DCs",
      "Built to support 10,000 subscribers with nationwide 5G sharing"
    ],

  },
  ar: {
    // ===== NAVIGATION MENU — labels shown in the top navigation =====
    sections: [
      "الرئيسية",
      "التغطية",
      "عرض التصميم العام",
      "القدرات",
      "اهمية شبكة الجيل الخامس الخاصة",
      "المواقع التجريبية",
      "لوحة التحكم التشغيلية"
    ],

    // ===== SLIDE 1 — Introduction =====
    landing: {
      "title": "شبكة نبض الأمنية - الجيل الخامس",
      "sub": "منظومة اتصال خاصة وآمنة ومعزولة ومدارة، تجمع بين الاتصال الثابت الخاص وشبكة الجيل الخامس الخاصة لدعم اتصالات المهام الحرجة.",
      "type": "اتصالات خاصة وآمنة للعمليات الحرجة.",
      "typing": [
        "اتصالات خاصة وآمنة للعمليات الحرجة.",
        "زمن تأخير منخفض يدعم سرعة الاستجابة الميدانية.",
        "بنية معزولة تدعم الجهات الشرطية والأمنية والمدنية."
      ],
      "aboutTitle": "عن الشبكة",
      "overview": "شبكة نبض الأمنية - الجيل الخامس بنية تحتية وطنية قادرة على نقل بيانات عالية السرعة بزمن تأخير منخفض، بما يدعم اتخاذ قرارات ميدانية فورية.",
      "aboutParagraphs": [
        "شبكة نبض الأمنية- الجيل الخامس بنية تحتية وطنية قادرة على نقل بيانات عالية السرعة بزمن تأخير منخفض، مما يدعم اتخاذ قرارات ميدانية فورية.",
        "وعند دمجها مع بنية سيادية معزولة (Private, Air-Gapped)، توفر الشبكة بيئة اتصالات مستقلة وآمنة مخصصة للجهات الأمنية والعسكرية، بما يدعم العمليات الحساسة بكفاءة عالية.",
        "تتميز شبكة نبض الأمنية- الجيل الخامس بالعزل الكامل، وتستخدم تقنيات تشفير متقدمة لضمان السرية وتقليل المخاطر السيبرانية، كما تتيح سرعة استجابة عالية وجودة اتصال موثوقة لتحسين التنسيق بين الجهات بشكل آمن وسريع."
      ],
      "chips": [
        "معزولة",
        "استجابة عالية",
        "موثوقية عالية",
        "مهيأة للعمليات الحساسة",
        "آمنة"
      ],
      "mapGeo": {
        "view": {"center": [54.35, 24.45], "zoom": 6.15, "pitch": 42, "bearing": -11},
        "linkedEntities": [
          {"id": "mod", "name": "وزارة الدفاع", "label": "MOD", "role": "جهة مرتبطة بالشبكة", "lng": 54.3700, "lat": 24.4350},
          {"id": "moi", "name": "وزارة الداخلية", "label": "MOI", "role": "جهة مرتبطة بالشبكة", "lng": 54.3860, "lat": 24.4700}
        ],
        "controlCenters": [
          {"id": "cc-ad", "name": "مركز التحكم الرئيسي", "label": "CC-AD", "role": "المركز الرئيسي للتحكم والإدارة", "lng": 54.3773, "lat": 24.4539},
          {"id": "cc-dxb", "name": "مركز التحكم الإقليمي", "label": "CC-DXB", "role": "مركز تحكم إقليمي مساند", "lng": 55.2708, "lat": 25.2048},
          {"id": "cc-shj", "name": "مركز التحكم الثانوي", "label": "CC-SHJ", "role": "مركز تحكم ثانوي واستمرارية أعمال", "lng": 55.4033, "lat": 25.3463}
        ],
        "pops": [
          {"id": "pop-01", "name": "أبوظبي", "label": "POP 01", "lng": 54.38, "lat": 24.46},
          {"id": "pop-02", "name": "مدينة خليفة", "label": "POP 02", "lng": 54.61, "lat": 24.43},
          {"id": "pop-03", "name": "ياس / الراحة", "label": "POP 03", "lng": 54.63, "lat": 24.47},
          {"id": "pop-04", "name": "مصفح", "label": "POP 04", "lng": 54.48, "lat": 24.35},
          {"id": "pop-05", "name": "العين", "label": "POP 05", "lng": 55.76, "lat": 24.19},
          {"id": "pop-06", "name": "مدينة زايد", "label": "POP 06", "lng": 53.70, "lat": 23.65},
          {"id": "pop-07", "name": "الرويس", "label": "POP 07", "lng": 52.73, "lat": 24.11},
          {"id": "pop-08", "name": "دبي", "label": "POP 08", "lng": 55.27, "lat": 25.20},
          {"id": "pop-09", "name": "جبل علي", "label": "POP 09", "lng": 55.05, "lat": 24.99},
          {"id": "pop-10", "name": "الشارقة", "label": "POP 10", "lng": 55.40, "lat": 25.35},
          {"id": "pop-11", "name": "عجمان", "label": "POP 11", "lng": 55.51, "lat": 25.40},
          {"id": "pop-12", "name": "رأس الخيمة", "label": "POP 12", "lng": 55.94, "lat": 25.79},
          {"id": "pop-13", "name": "الفجيرة", "label": "POP 13", "lng": 56.33, "lat": 25.13}
        ],
        "ilas": [
          {"id": "ila-01", "name": "كورنيش أبوظبي", "label": "ILA 01", "lng": 54.34, "lat": 24.48},
          {"id": "ila-02", "name": "جزيرة السعديات", "label": "ILA 02", "lng": 54.45, "lat": 24.54},
          {"id": "ila-03", "name": "الشهامة", "label": "ILA 03", "lng": 54.74, "lat": 24.52},
          {"id": "ila-04", "name": "الوثبة", "label": "ILA 04", "lng": 54.72, "lat": 24.28},
          {"id": "ila-05", "name": "سويحان", "label": "ILA 05", "lng": 55.42, "lat": 24.40},
          {"id": "ila-06", "name": "العين الشمالية", "label": "ILA 06", "lng": 55.73, "lat": 24.23},
          {"id": "ila-07", "name": "العين الجنوبية", "label": "ILA 07", "lng": 55.79, "lat": 24.13},
          {"id": "ila-08", "name": "ليوا", "label": "ILA 08", "lng": 53.77, "lat": 23.13},
          {"id": "ila-09", "name": "غياثي", "label": "ILA 09", "lng": 52.79, "lat": 23.89},
          {"id": "ila-10", "name": "ميناء الرويس", "label": "ILA 10", "lng": 52.61, "lat": 24.10},
          {"id": "ila-11", "name": "دبي الشمالية", "label": "ILA 11", "lng": 55.36, "lat": 25.28},
          {"id": "ila-12", "name": "دبي الجنوبية", "label": "ILA 12", "lng": 55.16, "lat": 24.87},
          {"id": "ila-13", "name": "مطار الشارقة", "label": "ILA 13", "lng": 55.52, "lat": 25.33},
          {"id": "ila-14", "name": "شرق عجمان", "label": "ILA 14", "lng": 55.57, "lat": 25.42},
          {"id": "ila-15", "name": "أم القيوين", "label": "ILA 15", "lng": 55.56, "lat": 25.56},
          {"id": "ila-16", "name": "جنوب رأس الخيمة", "label": "ILA 16", "lng": 55.89, "lat": 25.66},
          {"id": "ila-17", "name": "خورفكان", "label": "ILA 17", "lng": 56.35, "lat": 25.34},
          {"id": "ila-18", "name": "ميناء الفجيرة", "label": "ILA 18", "lng": 56.36, "lat": 25.11}
        ],
        "coverageAreas": [
          {"name": "تغطية أبوظبي", "lng": 54.43, "lat": 24.42, "radiusKm": 42},
          {"name": "تغطية العين", "lng": 55.76, "lat": 24.19, "radiusKm": 28},
          {"name": "ممر دبي الحضري", "lng": 55.31, "lat": 25.18, "radiusKm": 30},
          {"name": "تغطية الإمارات الشمالية", "lng": 55.73, "lat": 25.52, "radiusKm": 34},
          {"name": "تغطية الساحل الشرقي", "lng": 56.30, "lat": 25.21, "radiusKm": 22}
        ],
        "offshoreCoverage": [
          {"name": "التغطية البحرية الغربية", "center": [53.65, 24.60], "radiusKm": 28},
          {"name": "التغطية البحرية الشرقية", "center": [56.72, 25.24], "radiusKm": 22}
        ]
      }
    },

    // ===== SLIDE 2 — Coverage =====
    coverage: {
      "title": "التغطية",
      "subtitle": "عرض تفاعلي لاختيار خرائط تغطية الجيل الخامس والجيل الرابع وتغطية الاتصال البحري.",
      "label5g": "تغطية الجيل الخامس",
      "label4g": "تغطية الجيل الرابع",
      "labelOffshore": "تغطية الاتصال البحري",
      "compare": "مقارنة",
      "focus5g": "عرض 5G",
      "focus4g": "عرض 4G",
      "focusOffshore": "عرض التغطية البحري",
      "expand": "تكبير",
      "hint": "اختر أي خريطة للتركيز عليها، أو قم بتكبيرها لعرض أوضح.",
      "zoomIn": "تكبير",
      "zoomOut": "تصغير",
      "reset": "إعادة الضبط",
      "close": "إغلاق"
    },

    // ===== SLIDE 2 — Project Brief =====
    brief: {
      "title": "نبذة عن المشروع",
      "desc": "طرح استراتيجي لشبكة خاصة يجمع بين الربط الثابت الخاص وإمكانات الجيل الخامس الخاص لتمكين عمليات مرنة وآمنة وقابلة للتوسع.",
      "bullets": [
        "نقل ثابت مخصص عبر الألياف الخاصة والنقل البصري عالي السعة وشبكة بيانات خاصة.",
        "وصول خاص عبر الجيل الخامس للتنقل والأجهزة الميدانية وأجهزة الاستشعار وأنظمة المراقبة والفرق التشغيلية.",
        "معرّف شبكة مخصص ونطاق هوية مشتركين مخصص وسلوك خدمة معزول.",
        "نواة مخصصة للجيلين الخامس والرابع وخدمة صوت عبر الجيل الخامس مستضافة في مراكز بيانات شبكة نبض الأمنية - الجيل الخامس."
      ],
      "facts": [
        [
          "10K",
          "المشتركون المخططون"
        ],
        [
          "20",
          "عقد النفاذ الراديوي المخصصة"
        ],
        [
          "2",
          "مراكز بيانات الشبكة"
        ],
        [
          "1",
          "نموذج الخدمة الخاصة"
        ]
      ],
      "pillars": [
        [
          "النقل الخاص",
          "ألياف خاصة ونقل بصري عالي السعة وشبكة بيانات تدعم ربطاً مرناً بين المواقع والنواة.",
          "route"
        ],
        [
          "الوصول الخاص عبر الجيل الخامس",
          "تمكين التنقل وكاميرات المراقبة وإنترنت الأشياء والأجهزة الميدانية عبر وصول خاص معزول.",
          "signal"
        ],
        [
          "هوية معزولة",
          "معرّف شبكة مخصص ونطاق هوية مشتركين مخصص وسلوك خدمة خاصة خاضع للتحكم.",
          "sitemap"
        ],
        [
          "النواة والصوت المخصصان",
          "نواة مخصصة للجيلين الرابع والخامس وخدمة صوت عبر الجيل الخامس مستضافة بأمان في مراكز بيانات الشبكة.",
          "server"
        ]
      ]
    },

    // ===== SLIDE 3 — Key Capabilities =====
    keycaps: [
      [
        "نواة بيانات مخصصة للجيلين الرابع والخامس",
        "نواة متنقلة مخصصة لخدمات البيانات الآمنة مع معالجة محكومة للحركة وعزل للخدمات وإنفاذ سياسات خاصة.",
        "server",
        [
          "مستوى التحكم",
          "مستوى بيانات خاص"
        ]
      ],
      [
        "الصوت عبر الجيل الخامس",
        "قدرة صوتية أصلية على الجيل الخامس لدعم الاتصالات عالية الجودة للمهام الحرجة.",
        "phone",
        [
          "زمن منخفض",
          "استمرارية الصوت"
        ]
      ],
      [
        "منظومة المحطة القاعدية",
        "منظومة وصول لاسلكي تضم عناصر المحطة القاعدية التي توفر وتدير الاتصال عبر الواجهة الهوائية بين المستخدمين والأجهزة ونواة الشبكة المتنقلة.",
        "tower",
        [
          "الوصول اللاسلكي",
          "الواجهة الهوائية"
        ]
      ],
      [
        "الاتصال الجماعي الحرج للمهام (أجنت)",
        "اتصالات جماعية فورية وآمنة لفرق العمليات والاستجابة للطوارئ.",
        "comments",
        [
          "اتصال جماعي حرج",
          "اتصال جماعي"
        ]
      ],
      [
        "20 عقدة نفاذ راديوي مخصصة",
        "عناقيد وصول لاسلكي مخصصة لتغطية وسعة خاصة ومحكومة.",
        "tower",
        [
          "معرّف شبكة مخصص",
          "تغطية محكومة"
        ]
      ],
      [
        "مشاركة النفاذ الراديوي على مستوى الدولة",
        "مشاركة النفاذ الراديوي على مستوى الدولة لتوسيع الوصول المعتمد خارج حدود العقد المخصصة.",
        "globe2",
        [
          "وصول موسع",
          "نفاذ راديوي تشاركي"
        ]
      ],
      [
        "عدد المشتركين: 10,000",
        "سعة مصممة لاتصال خاص قابل للتوسع على مستوى المؤسسات والجهات المعتمدة.",
        "users",
        [
          "سعة 10K",
          "جاهزة للمستقبل"
        ]
      ]
    ],

    // ===== SLIDE 5 — Capabilities =====
    caps: [
      [
        "خدمة متكاملة قابلة للتوسع",
        "خدمة شبكة خاصة متكاملة قابلة للتوسع مع المواقع الجديدة، والتطبيقات، والأجهزة، ومتطلبات النمو المستقبلي.",
        "rocket"
      ],
      [
        "موثوقية عالية واستمرارية الخدمة",
        "تصميم موثوق يعتمد على مسارات رئيسية وبديلة لتعزيز توافر الخدمة واستمراريتها.",
        "shield",
        [],
        "موثوقية عالية"
      ],
      [
        "شبكة بمسارات متعددة",
        "مسارات متعددة للاتصال ونقل البيانات، تعزز استمرارية الخدمة وتدعم التحول الاحتياطي عند الحاجة.",
        "route",
        [],
        "متعددة المسارات"
      ],
      [
        "تمكين الوصول الخاص عبر شبكة الجيل الخامس",
        "وصول خاص وآمن عبر شبكة الجيل الخامس للمستخدمين المتنقلين، وكاميرات المراقبة، والحساسات، والأجهزة الذكية، والعمليات الميدانية.",
        "wifi",
        [],
        "خاص"
      ],
      [
        "وصول آمن وتقسيم حركة البيانات",
        "إدارة محكمة لانضمام المستخدمين والأجهزة، مع وصول موثق وتقسيم حركة البيانات لحماية الخدمات الحساسة.",
        "lock",
        [],
        "آمن"
      ],
      [
        "اتصال مخصص للمهام الحرجة",
        "اتصال عالي السعة وموثوق، مصمم لدعم التطبيقات الحرجة والأنظمة التشغيلية.",
        "star",
        [],
        "مخصص للمهام الحرجة"
      ]
    ],

    // ===== SLIDE 6 — Why Private 5G =====
    why: [
      [
        "زمن تأخير منخفض جداً",
        "اتصال سريع للتطبيقات التشغيلية الفورية والأنظمة الميدانية.",
        "tachometer"
      ],
      [
        "سعة عالية",
        "نطاق ترددي مخصص للفيديو وإنترنت الأشياء والاتصالات الحرجة.",
        "line-chart"
      ],
      [
        "آمن ومعزول",
        "اتصال خاص مع وصول محكوم ودون تعرض مباشر للإنترنت.",
        "shield"
      ],
      [
        "اتصال ضخم لإنترنت الأشياء",
        "دعم لأجهزة الاستشعار وكاميرات المراقبة وأنظمة التحكم.",
        "cloud"
      ],
      [
        "تنقل + اتصال ثابت",
        "دمج سلس بين النقل الثابت الخاص والتنقل اللاسلكي الآمن.",
        "mobile"
      ],
      [
        "المرونة والاستمرارية",
        "المسارات الاحتياطية والربط المتنوع يساعدان في الحفاظ على العمليات.",
        "refresh"
      ],
      [
        "تجزئة / تقسيم الشبكة",
        "فصل المجالات المرورية لمستخدمين وخدمات ومتطلبات أمنية مختلفة.",
        "sitemap"
      ],
      [
        "معمارية قابلة للتوسع وجاهزة للمستقبل",
        "مصممة للتوسع مع المواقع والخدمات والمستخدمين والطلب على السعات.",
        "forward"
      ]
    ],

    // ===== SLIDE 7 — Network Flow =====
    flow: [
      [
        "المواقع الحرجة",
        "مواقع تشغيلية آمنة ومراكز قيادة وجهات معتمدة.",
        "building"
      ],
      [
        "الألياف المخصصة / النقل البصري عالي السعة",
        "طبقة نقل خاصة توفر اتصالاً ثابتاً عالي السعة ومرناً.",
        "link"
      ],
      [
        "نقاط تجميع L2",
        "تجميع الوصول والتوجيه المنظم نحو النواة الخاصة.",
        "network"
      ],
      [
        "شبكة نبض الأمنية - الجيل الخامس",
        "شبكة خاصة معزولة للتوجيه وإنفاذ السياسات والرؤية التشغيلية.",
        "random"
      ],
      [
        "خدمات النواة والأمان",
        "نواة للجيلين الرابع والخامس وخدمة الصوت عبر الجيل الخامس ومنصة أجنت مع الضوابط الأمنية والجدران النارية.",
        "firewall"
      ],
      [
        "الوصول الخاص عبر الجيل الخامس",
        "وصول لاسلكي للتنقل والعمليات الميدانية والأصول المتصلة.",
        "wifi"
      ],
      [
        "المستخدمون • إنترنت الأشياء • أنظمة المراقبة",
        "النقاط الطرفية والخدمات المستفيدة من الشبكة الخاصة.",
        "users"
      ]
    ],

    // ===== SLIDE 8 — POC =====
    poc: {
      "title": "المواقع التجريبية ",
      "subtitle": "عرض تفاعلي للمواقع التجريبية في امارة أبوظبي، يوضح مسارات النقل المتحركة والمواقع النشطة والمخططة على الخريطة.",
      "summary": "ترتكز منظومة التشغيل على مركز بيانات أبولو كنقطة رئيسية، مع موقع اتصال لاسلكي نشط إضافي وموقعين مخططين للتوسع في أبوظبي.",
      "stats": [
        [
          "1",
          " مركز البيانات الرئيسية"
        ],
        [
          "2",
          "أدوار الاتصال اللاسلكي النشطة"
        ],
        [
          "2",
          "مواقع الاتصال اللاسلكي المخططة"
        ],
        [
          "4",
          "المواقع المحددة على الخريطة"
        ]
      ],
      "sites": [
        {
          "name": "مركز بيانات أبولو",
          "type": "core",
          "role": "نقطة مركز البيانات الرئيسية",
          "status": "نقطة مركز البيانات الرئيسية",
          "desc": "مركز بيانات رئيسي مع دور الاتصال لاسلكي النشط في الموقع نفسه.",
          "lat": 24.432961,
          "lng": 54.811256
        },
        {
          "name": "مركز بيانات الخزنة",
          "type": "active",
          "role": "موقع اتصال لاسلكي نشط",
          "status": "موقع اتصال لاسلكي نشط",
          "desc": "موقع اتصال لاسلكي نشط إضافي متصل بالشبكة الخاصة الرئيسية.",
          "lat": 24.419028,
          "lng": 54.622167
        },
        {
          "name": "مبادلة",
          "type": "planned",
          "role": "موقع اتصال لاسلكي مخطط",
          "status": "توسيع مخطط",
          "desc": "موقع اتصال لاسلكي مخطط لتوسيع التغطية بشكل متحكم به.",
          "lat": 24.4600518,
          "lng": 54.3913928
        },
        {
          "name": "مقر وزارة الدفاع",
          "type": "planned",
          "role": "موقع اتصال لاسلكي مخطط",
          "status": "توسيع مخطط",
          "desc": "موقع اتصال لاسلكي مخطط لخدمة المستخدمين التشغيليين المعتمدين.",
          "lat": 24.41585,
          "lng": 54.478955
        }
      ],
      "links": [
        {
          "from": "مركز بيانات أبولو",
          "to": "مركز بيانات الخزنة",
          "type": "active",
          "label": "مسارات ربط نشطة"
        },
        {
          "from": "مركز بيانات أبولو",
          "to": "مبادلة",
          "type": "planned",
          "label": "توسيع مخطط"
        },
        {
          "from": "مركز بيانات أبولو",
          "to": "مقر وزارة الدفاع",
          "type": "planned",
          "label": "توسيع مخطط"
        }
      ]
    },

    // ===== SLIDE 9 — Operational Dashboard launcher / labels =====
    dashboard: {
      "title": "لوحة التحكم التشغيلية",
      "tabs": [
        "حالة الشبكة",
        "تغطية الراديو",
        "الصوت والبيانات",
        "طرح المرحلة الأولى",
        "العمليات"
      ],
      "launcher": {
        "description": "عرض تشغيلي تنفيذي لضمان الخدمة وأداء الراديو وجاهزية الطرح والاستجابة للحوادث.",
        "eyebrow": "العمليات التنفيذية",
        "title": "لوحة التحكم التشغيلية",
        "body": "مراقبة موحدة لتوافر الخدمة والتغطية وأداء الصوت والبيانات وتقدم الطرح والأحداث التشغيلية عبر بيئة شبكة نبض الأمنية - الجيل الخامس.",
        "bullets": [
          "ضمان الخدمة",
          "التغطية والأداء",
          "الطرح والحوادث"
        ],
        "launchButton": "فتح لوحة التحكم",
        "backButton": "العودة إلى  المواقع التجريبية",
        "badge": "عرض تنفيذي",
        "stats": [
          [
            "05",
            "شاشات تشغيلية"
          ],
          [
            "18",
            "موقعاً نشطاً تحت المراقبة"
          ],
          [
            "99.98%",
            "توافر الخدمة"
          ]
        ],
        "portalEyebrow": "المنظور التنفيذي لعمليات شبكة نبض الأمنية - الجيل الخامس"
      }
    },

    // ===== Reserved / closing statements =====
    closing: [
      "نقل خاص مخصص ونموذج خدمة معزول",
      "تنقل خاص عبر الجيل الخامس لحالات الاستخدام التشغيلية المتقدمة",
      "شبكة مركزية مخصصة للجيلين الخامس والرابع وخدمة الصوت عبر الجيل الخامس مستضافة في مراكز بيانات الشبكة",
      "مصممة لدعم 10,000 مشترك مع تغطية تشاركية على مستوى الدولة"
    ],

  },
};
