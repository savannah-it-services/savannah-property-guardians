// Data-driven navigation menus for header mega menus and (future) mobile.
// Keys match the icons in src/_data/icons.js.
// This eliminates ~350+ lines of duplicated card + inline SVG markup that used to live in header.njk.

module.exports = {
  handyman: [
    { href: "/handyman-services/door-and-window-installation-and-repairs/", key: "door", title: "Door & Window Installation & Repairs" },
    { href: "/handyman-services/flooring-and-tile-installation-and-repairs/", key: "floor", title: "Flooring & Tile Installation & Repairs" },
    { href: "/handyman-services/gutter-installation-and-repair/", key: "gutter", title: "Gutter Installation & Repair" },
    { href: "/handyman-services/professional-painting-and-waterproofing/", key: "paint", title: "Professional Painting & Waterproofing" },
    { href: "/handyman-services/expert-fencing/", key: "fence", title: "Expert Fencing" },
    { href: "/handyman-services/drywall-repair-and-installation/", key: "drywall", title: "Drywall Repair & Installation" },
    { href: "/handyman-services/quality-carpentry-work/", key: "carpentry", title: "Quality Carpentry Work" },
    { href: "/handyman-services/lighting-and-electrical/", key: "lighting", title: "Lighting & Electrical" },
    { href: "/handyman-services/home-security/", key: "security", title: "Home Security" }
  ],
  warehouse: [
    { href: "/warehouse-services/exterior-warehouse-maintenance/", key: "exterior", title: "Exterior Warehouse Maintenance" },
    { href: "/warehouse-services/rack-and-shelving-installation/", key: "rack", title: "Rack & Shelving Installation" },
    { href: "/warehouse-services/industrial-lighting-and-electrical/", key: "lighting", title: "Industrial Lighting and Electrical" },
    { href: "/warehouse-services/floor-maintenance-and-repair/", key: "floorcoat", title: "Floor Maintenance and Repair" },
    { href: "/warehouse-services/hvac-and-climate-control/", key: "hvac", title: "HVAC and Climate Control" },
    { href: "/warehouse-services/warehouse-security/", key: "security2", title: "Warehouse Security" },
    { href: "/warehouse-services/interior-office-maintenance/", key: "interior", title: "Interior Office Maintenance" }
  ],
  propertyMaintenance: [
    { href: "/property-maintenance-services/preventive-maintenance-programs/", key: "preventive", title: "Preventive Maintenance Programs" },
    { href: "/property-maintenance-services/grounds-and-landscaping-maintenance/", key: "grounds", title: "Grounds and Landscaping Maintenance" },
    { href: "/property-maintenance-services/roof-and-gutter-maintenance/", key: "roof", title: "Roof and Gutter Maintenance" },
    { href: "/property-maintenance-services/exterior-building-maintenance/", key: "exterior", title: "Exterior Building Maintenance" },
    { href: "/property-maintenance-services/mechanical-systems-maintenance/", key: "mechanical", title: "Mechanical Systems Maintenance" },
    { href: "/property-maintenance-services/emergency-maintenance-response/", key: "emergency", title: "Emergency Maintenance Response" },
    { href: "/property-maintenance-services/residential-and-commercial-security/", key: "security2", title: "Residential & Commercial Security" }
  ],
  plumbing: [
    { href: "/plumbing-services/plumbing-emergencies/", key: "emergency", title: "Plumbing Emergencies" },
    { href: "/plumbing-services/leaks-and-drains/", key: "leak", title: "Leaks and Drains" },
    { href: "/plumbing-services/new-construction/", key: "newconst", title: "New Construction" },
    { href: "/plumbing-services/water-heaters/", key: "waterheater", title: "Water Heaters" },
    { href: "/plumbing-services/water-pressure/", key: "pressure", title: "Water Pressure" },
    { href: "/plumbing-services/waste-removal/", key: "waste", title: "Waste Removal" }
  ]
};
