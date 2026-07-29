export const workerSchemas = {
  "ac-cleaner": [
    { name: "acType", label: "Type of AC", type: "select", options: ["Split AC", "Window AC", "Cassette AC"] },
    { name: "numberOfUnits", label: "Number of Units", type: "number", min: 1 },
    { name: "serviceLevel", label: "Service Level", type: "select", options: ["Standard Water Wash", "Deep Foam/Jet Cleaning", "Anti-Bacterial Cleaning"] }
  ],
  "ac-technician": [
    { name: "acType", label: "Type of AC", type: "select", options: ["Split AC", "Window AC", "Cassette AC", "Centralised/HVAC"] },
    { name: "issueCategory", label: "Issue Category", type: "select", options: ["Installation", "Uninstallation", "Not Cooling / Less Cooling", "Water Leakage", "Strange Noise", "Gas Refill"] },
    { name: "outdoorUnitAccessibility", label: "Outdoor Unit Accessibility", type: "select", options: ["Easily Accessible (Balcony/Terrace)", "Requires Ladder (Ground Floor)", "Hanging / High-Rise Wall (Requires Harness)"] }
  ],
  "cctv-technician": [
    { name: "serviceType", label: "Service Type", type: "select", options: ["New Installation", "Repair/Troubleshooting", "Maintenance/Cleaning", "Uninstallation"] },
    { name: "cameraSystem", label: "Camera System Type", type: "select", options: ["Analog / DVR", "IP / NVR", "Wi-Fi / Wireless"] },
    { name: "numberOfCameras", label: "Number of Cameras", type: "number", min: 1 },
    { name: "wiringRequired", label: "Is new wire laying/cabling required?", type: "boolean" }
  ],
  "electrician": [
    { name: "serviceType", label: "Service Type", type: "select", options: ["Fault Finding & Repair", "Switchboard / Socket Wiring", "Appliance / Fan Installation", "Inverter / Battery Setup", "MCB / Fuse Issue", "Chandelier / Heavy Light Fitting"] },
    { name: "phaseType", label: "Electricity Connection", type: "select", options: ["Single Phase", "Three Phase", "Not Sure"] },
    { name: "scopeEstimate", label: "Approximate Scope", type: "select", options: ["Minor (1-2 points)", "Medium (3-5 points)", "Major Work (Half day+)", "Full House Rewiring"] }
  ],
  "furniture-mover": [
    { name: "itemCategory", label: "Furniture Type", type: "select", options: ["Bed/Mattress", "Wardrobe/Almirah", "Sofa/Seating", "Dining Table", "Mixed/Multiple Items"] },
    { name: "requiresAssembly", label: "Requires Dismantling & Assembly?", type: "boolean" },
    { name: "pickupFloor", label: "Pickup Floor", type: "select", options: ["Ground Floor", "1st to 3rd Floor", "4th to 10th Floor", "Above 10th Floor"] },
    { name: "dropFloor", label: "Drop-off Floor", type: "select", options: ["Ground Floor", "1st to 3rd Floor", "4th to 10th Floor", "Above 10th Floor"] },
    { name: "serviceLiftAvailable", label: "Is a service lift available at both locations?", type: "boolean" }
  ],
  "housekeeper": [
    { name: "propertyType", label: "Property Type", type: "select", options: ["Apartment / Flat", "Independent House / Villa", "Commercial Office"] },
    { name: "propertySize", label: "Property Size", type: "select", options: ["1 BHK", "2 BHK", "3 BHK", "4+ BHK", "Custom (Per Sq Ft)"] },
    { name: "cleaningType", label: "Type of Cleaning", type: "select", options: ["Standard Sweeping/Mopping", "Deep Cleaning (Machine Scrubbing)", "Move-in / Move-out", "Bathroom Only", "Kitchen Only"] },
    { name: "petsAtHome", label: "Are there pets in the property?", type: "boolean" }
  ],
  "loader-unloader": [
    { name: "materialType", label: "Material Type", type: "select", options: ["Cartons / Boxes", "Fragile Items", "Heavy Machinery / Steel", "Furniture", "Construction Material (Cement/Bricks)"] },
    { name: "totalWeightEstimate", label: "Approximate Total Weight", type: "select", options: ["Under 100 kg", "100 - 500 kg", "500 kg - 1 Ton", "More than 1 Ton"] },
    { name: "numberOfWorkers", label: "Number of Workers Needed", type: "number", min: 1 },
    { name: "pickupFloor", label: "Pickup Floor", type: "number", min: 0 },
    { name: "dropFloor", label: "Drop-off Floor", type: "number", min: 0 },
    { name: "serviceLiftAvailable", label: "Service Lift Available?", type: "boolean" }
  ],
  "painter": [
    { name: "serviceScope", label: "Scope of Work", type: "select", options: ["Touch-up / Patchwork", "Single Room", "Full Interior", "Exterior Painting", "Wood / Metal Polishing"] },
    { name: "wallCondition", label: "Current Wall Condition", type: "select", options: ["Fresh Wall (Needs Putty + Primer)", "Repainting (Good Condition)", "Damaged (Seepage, Cracks, Peeling)"] },
    { name: "propertyOccupancy", label: "Property Status", type: "select", options: ["Empty / Unfurnished", "Furnished (Requires masking and moving furniture)"] }
  ],
  "picker-packer": [
    { name: "goodsCategory", label: "Category of Goods", type: "select", options: ["E-commerce / Retail", "FMCG / Groceries", "Electronics", "Apparel / Textiles", "Fragile / Glassware"] },
    { name: "packagingMaterialProvided", label: "Will you provide packaging materials (tape, boxes, bubble wrap)?", type: "boolean" },
    { name: "workEnvironment", label: "Work Location Type", type: "select", options: ["Warehouse / Godown", "Retail Store / Dark Store", "Residential"] },
    { name: "shiftDuration", label: "Requirement Duration", type: "select", options: ["Half Day (4 hrs)", "Full Day (8 hrs)", "Night Shift", "Per Piece / Volume Basis"] }
  ],
  "plumber": [
    { name: "issueCategory", label: "Issue Category", type: "select", options: ["Leakage / Seepage", "Blockage / Choke-up", "Installation / Replacement", "Water Tank Cleaning", "Motor / Pump Issue"] },
    { name: "fixtureType", label: "Fixture / Area", type: "select", options: ["Tap / Mixer / Shower", "Washbasin / Sink", "Toilet / Flush Tank", "Water Heater / Geyser", "Concealed Pipeline"] },
    { name: "sparePartsProvided", label: "Do you have the replacement parts ready?", type: "boolean" }
  ],
  "security-guard": [
    { name: "guardType", label: "Type of Guard", type: "select", options: ["Unarmed Guard", "Armed Guard (Gunman)", "Bouncer / VIP Protection"] },
    { name: "dutyType", label: "Duty Location / Type", type: "select", options: ["Residential Society / Building", "Commercial Office / Retail", "Event / Party / Exhibition", "Personal Escort / Transit"] },
    { name: "shiftRequirement", label: "Shift Requirement", type: "select", options: ["Day Shift (8-12 hrs)", "Night Shift (8-12 hrs)", "24x7 Coverage (Split Shifts)"] },
    { name: "numberOfGuards", label: "Number of Guards Needed", type: "number", min: 1 }
  ],
  "sweeper": [
    { name: "environmentType", label: "Cleaning Environment", type: "select", options: ["Street / Outdoor Area", "Construction Site Debris", "Event / Party Aftermath", "Large Godown / Warehouse"] },
    { name: "areaEstimate", label: "Approximate Area (Sq Ft)", type: "select", options: ["Under 1,000", "1,000 - 5,000", "5,000 - 10,000", "Above 10,000"] },
    { name: "equipmentProvided", label: "Will you provide brooms, bags, and cleaning supplies?", type: "boolean" },
    { name: "wasteDisposalRequired", label: "Requires taking collected waste to the local dump yard?", type: "boolean" }
  ]
};
