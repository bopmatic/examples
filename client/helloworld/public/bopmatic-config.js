// Bopmatic runtime configuration is injected at deploy time by replacing ${BOPMATIC_<var>} values
// below with appropriate settings specific to an intrastructure deployment
var bopEnvVars = {
    "PACKAGE_ID" : "${BOPMATIC_PACKAGE_ID}", 
};

window['bopmatic_config'] = bopEnvVars
