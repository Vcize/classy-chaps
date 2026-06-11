/* =============================================================
   CLASSY CHAPS SUMMIT CLUB — Expedition Data
   All trip content lives here. Edit freely; UI reads from TRIP.
   ============================================================= */
export const TRIP = {
  brand: {
    name: "Classy Chaps Summit Club",
    short: "Summit Club",
    est: "EST. 2026",
    tagline:
      "A 40th birthday weekend featuring waterfalls, 4,000 feet of regret, and plenty of snack breaks.",
    callToArms: "What's up gents — let's hike!",
    location: "Kings Canyon · Sequoia National Park",
    dates: "June 18–21, 2026",
    // ISO target for the countdown (check-in: Thu Jun 18, 2026, 12:00 PM PDT)
    targetISO: "2026-06-18T12:00:00-07:00",
  },

  // ---- PHOTOS — drop new images in public/assets/photos/ and point to them here ----
  // Set any value to null to show a labeled "add photo" slot instead.
  photos: {
    birthdayBoys: "/assets/photos/birthday-boys.png", // DiBlasi (left) & Brett
    crewGroup: null,        // optional: a full-crew group shot
    baseCamp: "/assets/photos/base-camp.png",         // the house / pool at Citrus Cove 1
  },

  mission: {
    eyebrow: "The Mission",
    title: "Seven chaps. Two birthdays. One absurd amount of vertical.",
    body:
      "We're flying into Fresno, basecamping in a citrus orchard, and pointing ourselves at two of the Sierra's finest trails. Friday is the chiller — a granite-and-waterfall warmup. Saturday is the 14-mile bad idea up to an 11,200 ft summit. In between: a pool, a BBQ, and an unreasonable number of snack breaks.",
    pillars: [
      { icon: "footprints", label: "Two hikes", value: "Mist Falls + Alta Peak" },
      { icon: "mountain", label: "Summit", value: "~11,200 ft" },
      { icon: "cake", label: "Birthdays", value: "Brett + DiBlasi turn 40" },
      { icon: "waves", label: "Recovery", value: "Pool + BBQ at base camp" },
    ],
  },

  crew: [
    { name: "Ryan", role: "Wheels Up First", note: "Lands Fresno 4:33 PM Thursday", tag: "SLC", birthday: false },
    { name: "Brett", role: "Birthday Boy", note: "Turning 40 on the mountain", tag: "40", birthday: true },
    { name: "DiBlasi", role: "Birthday Boy", note: "Red-eye warrior via Dallas", tag: "40", birthday: true },
    { name: "Christopher", role: "Classy Chap", note: "Travel details TBD", tag: "TBD", birthday: false },
    { name: "Thomas", role: "Classy Chap", note: "Travel details TBD", tag: "TBD", birthday: false },
    { name: "Hunter", role: "Stairmaster Champ", note: "\"Not many hills in New York\"", tag: "NY", birthday: false },
    { name: "Zaks", role: "Classy Chap", note: "Travel details TBD", tag: "TBD", birthday: false },
  ],

  flights: [
    {
      name: "Ryan",
      birthday: false,
      arrival: {
        status: "CONFIRMED",
        route: ["SLC", "FAT"],
        carrier: "Delta",
        flight: "DL3777",
        day: "Thu Jun 18",
        depart: "3:41 PM MDT",
        arrive: "4:33 PM PDT",
      },
      departure: {
        status: "CONFIRMED",
        route: ["FAT", "SLC"],
        carrier: "Delta",
        flight: "DL3768",
        day: "Sun Jun 21",
        depart: "12:29 PM PDT",
        arrive: "3:17 PM MDT",
      },
    },
    {
      name: "DiBlasi",
      birthday: true,
      arrival: {
        status: "CONFIRMED",
        route: ["RIC", "DFW", "FAT"],
        carrier: "American",
        flight: "RIC→DFW→FAT",
        day: "Thu Jun 18",
        depart: "3:02 PM",
        arrive: "9:52 PM PDT",
        legs: ["RIC 3:02 PM → DFW 5:24 PM", "DFW 8:24 PM → FAT 9:52 PM"],
      },
      departure: {
        status: "PARTIAL",
        route: ["FAT", "DFW", "RIC"],
        carrier: "American",
        flight: "FAT→DFW→RIC",
        day: "Sun Jun 21",
        depart: "11:12 AM PDT",
        arrive: "TBD",
        legs: ["FAT 11:12 AM → DFW 4:35 PM", "DFW → RIC — TBD"],
      },
    },
    { name: "Brett", birthday: true, arrival: { status: "TBD" }, departure: { status: "TBD" } },
    { name: "Christopher", birthday: false, arrival: { status: "TBD" }, departure: { status: "TBD" } },
    { name: "Thomas", birthday: false, arrival: { status: "TBD" }, departure: { status: "TBD" } },
    { name: "Hunter", birthday: false, arrival: { status: "TBD" }, departure: { status: "TBD" } },
    { name: "Zaks", birthday: false, arrival: { status: "TBD" }, departure: { status: "TBD" } },
  ],

  baseCamp: {
    name: "Citrus Cove 1",
    blurb: "Entire home in a citrus orchard outside Reedley — our launchpad for the whole mission.",
    address: "23530 East Kings Canyon Road, Reedley, California 93654",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=23530+East+Kings+Canyon+Road+Reedley+CA+93654",
    confirmation: "HMKDNZARSB",
    host: "Melonee",
    checkIn: "Thu, Jun 18 · 12:00 PM",
    checkOut: "Sun, Jun 21 · 10:00 AM",
    quickStats: [
      { icon: "bed-double", label: "Bedrooms", value: "4" },
      { icon: "users", label: "Sleeps", value: "Up to 14" },
      { icon: "layout-grid", label: "Beds", value: "10" },
      { icon: "bath", label: "Baths", value: "2.5+" },
      { icon: "waves", label: "Pool", value: "Yes (no fence)" },
      { icon: "trees", label: "Setting", value: "Citrus orchard" },
    ],
    access: [
      "Past the garage, through the gate",
      "First door on the right has a keypad",
      "Return key to the lockbox at checkout",
    ],
    provided: [
      "Bedding, towels, toilet paper, paper towels",
      "Trash bags, hand/dish soap, sponge, cleaner",
      "Pots, pans, dishes, utensils, cutlery, glassware",
      "Toaster, blender, coffee pot",
      "BBQ w/ propane + an extra tank",
    ],
    checkoutTasks: [
      "Used towels in the laundry hamper",
      "Trash thrown away",
      "Stove, oven & faucets off",
      "House locked, windows closed",
      "Key returned to the lockbox",
    ],
    warnings: [
      { icon: "video", text: "One camera faces the parking lot and stays on." },
      { icon: "siren", text: "Garage is off-limits — a separate apartment, not part of the rental." },
      { icon: "waves", text: "Pool has no fence and the deep end is very deep. Swim smart." },
    ],
  },

  itinerary: [
    {
      day: "Thursday",
      date: "Jun 18",
      title: "Travel Day & Touchdown",
      kind: "travel",
      icon: "plane-landing",
      tone: "The chaps converge on Fresno.",
      items: [
        "Ryan lands FAT at 4:33 PM",
        "DiBlasi lands FAT at 9:52 PM",
        "Check in at Citrus Cove 1 (12:00 PM)",
        "Grocery run · pool · casual hangout",
      ],
    },
    {
      day: "Friday",
      date: "Jun 19",
      title: "Mist Falls",
      kind: "hike",
      icon: "footprints",
      tone: "The chiller hike before the Saturday sufferfest.",
      items: [
        "Early-ish start, day packs only",
        "~8 mi round trip · 875 ft gain",
        "Kings River, canyon walls & the falls",
        "Post-hike pool recovery + BBQ",
      ],
      trail: "mistFalls",
    },
    {
      day: "Saturday",
      date: "Jun 20",
      title: "Alta Peak",
      kind: "summit",
      icon: "mountain",
      tone: "The 14-mile bad idea. 4,000 feet of regret.",
      items: [
        "Very early start — headlamps on",
        "~14 mi round trip · ~4,000 ft gain",
        "Summit ~11,200 ft via Panther Gap",
        "Bailout mindset: turn around if it gets sketchy",
      ],
      trail: "altaPeak",
    },
    {
      day: "Sunday",
      date: "Jun 21",
      title: "Checkout & Departures",
      kind: "travel",
      icon: "plane-takeoff",
      tone: "The California way — until next time.",
      items: [
        "Checkout by 10:00 AM (do the chores!)",
        "Ryan departs FAT 12:29 PM",
        "DiBlasi departs FAT 11:12 AM",
        "Wheels up, legs wrecked, worth it",
      ],
    },
  ],

  trails: {
    mistFalls: {
      key: "mistFalls",
      name: "Mist Falls",
      subtitle: "The granite-and-waterfall warmup",
      photo: "/assets/photos/mist-falls.png",
      difficulty: "Moderate",
      difficultyLevel: 2,
      tone: "\"Chiller hike\" — save the legs for Saturday.",
      stats: [
        { icon: "ruler", label: "Distance", value: "~8 mi", sub: "round trip" },
        { icon: "trending-up", label: "Elevation gain", value: "~875 ft" },
        { icon: "signpost", label: "Trailhead", value: "Roads End", sub: "Cedar Grove" },
        { icon: "clock", label: "Start", value: "Early-ish", sub: "beat the heat" },
      ],
      highlights: ["Kings River", "Canyon views", "The waterfall", "Big granite scenery"],
      // elevation profile: distance (mi) → elevation (ft)
      profile: [4500, 4540, 4600, 4680, 4720, 4900, 5100, 5280, 5380, 4720, 4540, 4500],
      profileLabels: { start: "Roads End", peak: "Mist Falls" },
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Mist+Falls+Trailhead+Roads+End+Kings+Canyon",
      bring: ["2L+ water", "Snacks & lunch", "Sun protection", "Day pack"],
    },
    altaPeak: {
      key: "altaPeak",
      name: "Alta Peak",
      subtitle: "Lakes → Panther Gap → Alta Trail",
      photo: "/assets/photos/alta-peak.png",
      difficulty: "Hard",
      difficultyLevel: 4,
      tone: "\"14 is no joke.\" The elevation is going to be a bitch.",
      stats: [
        { icon: "ruler", label: "Distance", value: "~14 mi", sub: "round trip" },
        { icon: "trending-up", label: "Elevation gain", value: "~4,000 ft" },
        { icon: "mountain-snow", label: "Summit", value: "~11,200 ft" },
        { icon: "signpost", label: "Trailhead", value: "Wolverton" },
      ],
      highlights: ["Panther Gap", "Ridgeline views", "Sierra summit", "Big payoff"],
      profile: [7300, 7600, 8000, 8500, 8900, 9100, 9400, 9900, 10300, 10700, 11050, 11200],
      profileLabels: { start: "Wolverton", peak: "Alta Peak" },
      conditions:
        "Recent reports suggest the snow is manageable — but check trail conditions before you commit.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Wolverton+Trailhead+Sequoia+National+Park",
      bring: ["3L water min.", "Electrolytes", "Lunch + layers", "Poles & headlamp", "Sunscreen"],
    },
  },

  stats: [
    { icon: "users", value: "7", label: "Classy chaps" },
    { icon: "cake", value: "2", label: "Birthdays" },
    { icon: "trees", value: "2", label: "National parks" },
    { icon: "footprints", value: "2", label: "Major hikes" },
    { icon: "route", value: "~22", label: "Total trail miles" },
    { icon: "trending-up", value: "~4,800+", label: "Total elevation gain (ft)" },
    { icon: "mountain-snow", value: "~11,200", label: "Highest point (ft)" },
    { icon: "cookie", value: "100%", label: "Snack breaks: mandatory" },
    { icon: "activity", value: "Rising", label: "Regret level: manageable" },
  ],

  packing: {
    Trail: {
      icon: "backpack",
      items: [
        "Day pack", "3L water capacity", "Electrolytes", "Lunch", "Snacks",
        "Trekking poles", "Sunscreen", "Sunglasses", "Hat", "Layers",
        "Rain / wind shell", "Headlamp", "First aid / blister kit",
        "Offline maps", "Battery pack",
      ],
    },
    House: {
      icon: "home",
      items: [
        "Swim trunks", "Sandals", "Casual clothes", "Coffee / breakfast stuff",
        "Cooler", "Groceries", "Beer / recovery drinks",
      ],
    },
    Safety: {
      icon: "shield-check",
      items: [
        "Check trail conditions", "Start early",
        "Turn around if weather / snow / pace gets sketchy",
        "Watch for rattlesnakes & wildlife", "No solo wandering on big hikes",
        "Respect pool rules",
      ],
    },
  },

  food: [
    {
      icon: "shopping-cart",
      title: "Groceries (Thursday)",
      tone: "Stock the orchard kitchen on the way in.",
      items: ["Breakfast: eggs, bacon, bagels, coffee", "Trail fuel: bars, jerky, trail mix, fruit", "Sandwich supplies for the summit lunch", "Electrolyte mix & a lot of water"],
    },
    {
      icon: "flame",
      title: "BBQ & Dinners",
      tone: "The BBQ + extra propane tank are already on site.",
      items: ["Burgers / steaks / dogs on the grill", "Pasta night for carb-loading pre-Alta", "Sides, snacks, and more snacks", "Birthday treat for the two 40-year-olds"],
    },
    {
      icon: "beer",
      title: "Recovery",
      tone: "Pool + cold drinks = the California way.",
      items: ["Beer & recovery drinks in the cooler", "Pool soak after every hike", "Hydrate before you celebrate", "Sunday: easy breakfast before wheels up"],
    },
  ],

  quotes: [
    { text: "What's up gents — let's hike!", author: "The group chat" },
    { text: "Save me a top bunk por favor.", author: "A classy chap" },
    { text: "I think the Alta Peak hike will be the longest hike I've ever done.", author: "Someone, nervously" },
    { text: "14 is no joke.", author: "Everyone" },
    { text: "Not many hills in New York, so I did the stair master.", author: "Hunter" },
    { text: "28?! That's a helluva stroll.", author: "Mishearing the mileage" },
    { text: "The elevation on the 14 miler is going to be a bitch.", author: "Realism" },
    { text: "Day packs only.", author: "The rule" },
    { text: "Hell yeah. I'm definitely in.", author: "All seven chaps" },
  ],
};
