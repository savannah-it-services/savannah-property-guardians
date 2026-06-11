const IS_PRODUCTION = process.env.ELEVENTY_ENV !== "local"
const URL = IS_PRODUCTION ? 'https://www.savannahpropertyguardians.com' : 'http://localhost:8080'

module.exports = {
  isProduction: IS_PRODUCTION,
  name: "Savannah Property Guardians",
  url: URL,
  localBusinessId: URL + '/#business',
  description: "Expert handyman services, warehouse maintenance, property maintenance, and commercial plumbing in Savannah, Tybee Island, and Chatham County, GA. 100% veteran-owned property care professionals.",
  ogImage: "/assets/images/logo/og-default.webp",
  ogImageAlt: "Savannah Property Guardians - Professional property services in Savannah GA",
  email: "info@savannahpropertyguardians.com",
  phone: "(912) 376-9765",
  phoneHref: "+19123769765",
  business_address: {
    street1: "1016 US Highway 80",
    street2: "Ste B",
    city: "Tybee Island",
    state: "GA",
    zip: "31328"
  },
  geo: {
    latitude: 32.004,
    longitude: -80.843
  },
  service_areas: "Savannah, Tybee Island, Chatham County, and coastal Georgia",
  business_hours: "Monday – Friday: 7:00 AM – 6:00 PM, Saturday: 9:00 AM – 4:00 PM (Sunday Closed)",
  google_measurement_id: "G-T3V5MV72X8",
  google_tag_manager_id: "GTM-KJ83XNGM",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61590811495577",
    google_business: "https://www.google.com/search?q=Savannah+Property+Guardians+Tybee+Island+GA",
    instagram: "https://www.instagram.com/savannah.property.guardians",
    x: "https://x.com/sav_prop_guards"
  },
  hubspot_portal_id: "246386645",
  hubspot_quote_form_guid: "4f3637c7-416d-4700-89c0-7eaaf81ba71f",
  privacy_policy_last_updated: "June 1, 2026"
}
