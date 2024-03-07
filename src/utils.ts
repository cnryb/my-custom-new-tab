import { PublicClientApplication, LogLevel, AuthenticationResult } from '@azure/msal-browser'
const redirectUri = typeof chrome !== "undefined" && chrome.identity ?
  chrome.identity.getRedirectURL() :
  `${window.location.origin}/index.html`;

const msalInstance = new PublicClientApplication({
  auth: {
    authority: "https://login.microsoftonline.com/consumers",
    clientId: "8c96e6be-647a-4053-b35b-eddf3a392872",
    redirectUri,
    postLogoutRedirectUri: redirectUri
  },
  cache: {
    cacheLocation: "localStorage"
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      }
    }
  }
});


function getLoginUrl(): Promise<string> {
  return new Promise((resolve, reject) => {
    msalInstance.loginRedirect({
      scopes: ["user.read", "Tasks.ReadWrite"],
      onRedirectNavigate: (url: string) => {
        resolve(url);
        return false;
      }
    }).catch(reject);
  })
}

function launchWebAuthFlow(url: string): Promise<AuthenticationResult | null> {
  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow({
      interactive: true,
      url
    }, (responseUrl?: string) => {
      // Response urls includes a hash (login, acquire token calls)
      if (responseUrl && responseUrl.includes("#")) {
        msalInstance.handleRedirectPromise(`#${responseUrl.split("#")[1]}`)
          .then(resolve)
          .catch(reject)
      } else {
        // Logout calls
        resolve(null);
      }
    })
  })
}


export async function getUserInfo() {

  await msalInstance.initialize();
  const url = await getLoginUrl();
  const response = await launchWebAuthFlow(url);
  console.log(response);
  response?.accessToken && console.log("Access token: ", response.accessToken);
  response?.account && console.log("Account: ", response.account);

}