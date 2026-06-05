var bearerToken = null;
var tokenExpiresAt = null;

function run() {
    if (bearerToken === null || isTokenExpired()) {
        let tokenRequest = createTokenRequest();
        let tokenData = fetchToken(tokenRequest);
        bearerToken = tokenData.token;
        tokenExpiresAt = tokenData.expiresAt;
    }

    updateRequestHeaders(bearerToken);
}

function createTokenRequest() {
    let username = vc.variables['testUsername'];
    let password = vc.variables['testPassword'];

    let tokenRequest = httpClient.createRequest(vc.variables['loginBaseUrl']);
    tokenRequest.addHeader("content-type", "application/json");
    tokenRequest.setBody("{\r\n  \"username\": \"" + username + "\",\r\n  \"password\": \"" + password + "\"\r\n}");
    tokenRequest.setMethod("POST");

    return tokenRequest;
}

function fetchToken(tokenRequest) {
    let response = tokenRequest.send();
    let message = response.asString();
    let parsedResponse = JSON.parse(message);
    let accessToken = parsedResponse.token;
    let expiresIn = parsedResponse.exp;

    //let expirationTime = new Date().getTime() + (expiresIn * 1000);
    let expirationTime = expiresIn * 1000;

    return {
        token: accessToken,
        expiresAt: expirationTime
    };
}

function isTokenExpired() {
    if (tokenExpiresAt === null) {
        return true;
    }

    let currentTime = new Date().getTime();
    let bufferTime = 30 * 1000; // Refresh 30 seconds before actual expiration

    return currentTime >= (tokenExpiresAt - bufferTime);
}

function updateRequestHeaders(token) {
    request.addHeader("authorization", "Bearer " + token);
}