import type {Link} from '@unhead/vue';

export const SUPER_HAZARD_TYPES = {
  POD_NAME: 'Dose Response Summary Value',
  CUSTOM_POD_NAME: 'Custom Dose Response Summary Value',
  CONVERTED_POD_NAME: 'Converted Dose Response Summary Value',
  TOX_NAME: 'Toxicity Value',
  CUSTOM_TOX_NAME: 'Custom Toxicity Value',
  CONVERTED_TOX_NAME: 'Converted Toxicity Value',
};

export const SUPER_CATEGORY_ORDER = [
  'Custom Toxicity Value',
  'Custom Dose Response Summary Value',
  'Converted Toxicity Value',
  'Converted Media Exposure Guidelines',
  'Converted Acute Exposure Guidelines',
  'Converted Mortality Response Summary Value',
  'Converted Dose Response Summary Value',
  'Toxicity Value',
  'Media Exposure Guidelines',
  'Acute Exposure Guidelines',
  'Mortality Response Summary Value',
  'Dose Response Summary Value',
];

export const ALLOWED_SUPER_HAZARD_CONVERSIONS = [
  'Toxicity Value',
  'Media Exposure Guidelines',
  'Acute Exposure Guidelines',
  'Mortality Response Summary Value',
  'Dose Response Summary Value',
];

// Used to overwrite css CDN brought in by vuetify to add integrity attribute.
// Resolve SRI vulnerability https://jira.epa.gov/browse/RAPIDTOX-1771.
export const MATERIAL_DESIGN_ICONS_CDN_LINK: Link =
{
  key: 'mdi',
  rel: 'stylesheet',
  href: 'https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css',
  type: 'text/css',
  crossorigin: 'anonymous',
  integrity: 'sha384-kXCE8Tlo8eDlJdLjfNasjLDUTPO56LHJRXxPOIRAgeAjnT08vds9p4SF9Q4tuTD+',
};
