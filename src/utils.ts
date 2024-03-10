import { PublicClientApplication, LogLevel, AuthenticationResult } from '@azure/msal-browser'
import { Client, AuthProvider, Options } from '@microsoft/microsoft-graph-client'

const redirectUri = typeof chrome !== "undefined" && chrome.identity ?
  chrome.identity.getRedirectURL() :
  `${window.location.origin}/index.html`;
console.log(redirectUri)

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
  if (response) {
    const authProvider: AuthProvider = (done) => {
      done(null, response.accessToken);
    }
    let options: Options = {
      authProvider,
    };
    const client = Client.init(options);

    // 分类列表
    let lists = await client.api('/me/todo/lists')
      .get();
    console.log('lists:');
    console.log(lists);

    const listId = "AQMkADAwATM0MDAAMS05YTM5LTQzYTAtMDACLTAwCgAuAAADlSg4WnrcPkKp7MIsw_4IbQEAtIszuMABwU611qxgvvwrKQAAAgESAAAA"

    // task 列表
    let taskList = await client.api(`/me/todo/lists/${listId}/tasks`).get();

    console.log(taskList)

    // 新增
    // let result = await client.api(`/me/todo/lists/${listId}/tasks`).post(
    //   {
    //     title: 'A new task from api',
    //     body: {
    //       "content": "<a href='http://cnryb.com'> cnryb </a>",
    //       "contentType": "html"
    //     }
    //   }
    // );
    // console.log(result)

    // // 详情
    // const taskId = "AQMkADAwATM0MDAAMS05YTM5LTQzYTAtMDACLTAwCgBGAAADlSg4WnrcPkKp7MIsw_4IbQcAtIszuMABwU611qxgvvwrKQAAAgESAAAAtIszuMABwU611qxgvvwrKQAG-4XLVAAAAA=="
    // let todoTask = await client.api(`/me/todo/lists/${listId}/tasks/${taskId}`)
    //   .get();
    // console.log(todoTask)



    // list

    // task

    // check list
  }

}


class TaskList {
  private client: Client;

  constructor(client: Client) {
    this.client = client
  }

  async list() {

  }

  async create() {

  }

  async update() {

  }

  async delete() {

  }

}

class Task {
  private client: Client;

  constructor(client: Client) {
    this.client = client
  }

  async list() {

  }

  async detail() {

  }

  async create() {

  }

  async update() {

  }

  async delete() {

  }

}

class CheckList {
  private client: Client;

  constructor(client: Client) {
    this.client = client
  }

  async list() {

  }

  async create() {

  }

  async update() {

  }

  async delete() {

  }

}

