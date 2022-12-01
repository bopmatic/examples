// Bopmatic runtime configuration is injected at deploy time by replacing ${BOPMATIC_<var>} values
// below with appropriate settings specific to an intrastructure deployment
var bopEnvVars = {
    "PACKAGE_ID" : "${BOPMATIC_PACKAGE_ID}",
    "WEBSITE_ENDPOINT" : "${BOPMATIC_WEBSITE_ENDPOINT}",
    "WEBSITE_ALIAS_ENDPOINT" : "${BOPMATIC_WEBSITE_ALIAS_ENDPOINT}",
    "MYORDERSERVICE_GETORDER_API_ENDPOINT": "${BOPMATIC_MYORDERSERVICE_GETORDER_API_ENDPOINT}",
    "MYORDERSERVICE_PLACEORDER_API_ENDPOINT": "${BOPMATIC_MYORDERSERVICE_PLACEORDER_API_ENDPOINT}"
};

window['bopmatic_config'] = bopEnvVars
