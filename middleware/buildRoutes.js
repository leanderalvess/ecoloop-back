module.exports = function buildRoutes (app, currentRoutes) {
    const endpointsFiles = [];
    for (let routeVersion of currentRoutes) {
        try {
            let currentRoute = require(`../routes/${routeVersion}`);
            currentRoute(app);
            endpointsFiles.push(`./routes/${routeVersion}`);
            console.log('OK', routeVersion)
        } catch (e) {
            console.error('ERROR LOADING', routeVersion, ' error: ', e);
        }
    }

    return endpointsFiles;
}