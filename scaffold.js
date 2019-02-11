const SDK = require("@directus/sdk-js");
const sessionstorage = require("sessionstorage");
const fs = require("fs");
const sinon = require("sinon");
const AV = require("argument-validator");
const Collection = require("postman-collection").Collection;
const RequestAuth = require("postman-collection").RequestAuth;
const Item = require("postman-collection").Item;
const Variable = require("postman-collection").Variable;
const github = require("octonode");
const rp = require("request-promise-native");
const request = require("request");
const { StringStream } = require("scramjet");
const Stream = require("stream");
const readable = new Stream.Readable();
readable._read = () => {};

process.stdout.write("this is from process.stdout.write\n");

StringStream.from(readable)
  .setOptions({ maxParallel: 4 })
  .JSONParse(true)
  .map(x => rp(`${x.url}`))
  .toStringStream()
  .match(/\$app->([\s\w\d\$->\[\]]*);/gi)
  .toStringStream()
  .append("\n")
  .pipe(process.stdout);

(async () => {
  var ghclient = github.client();
  var ghrepo = await ghclient.repo("directus/api");

  ghrepo.contents("src/endpoints", "master", (unknown, files) => {
    const xx = files.forEach(file => {
      readable.push(
        JSON.stringify({ name: file.name, url: file.download_url }) + "\n"
      );
    });
  });
})();

// Create a collection having two requests
/*
myCollection = new Collection({
  info: {
    name: "Api Kitchen",
    description:
      "Your own API kitchen sink, where you can test all your setup endpoints and request parameters"
  },
  variable: [
    new Variable({
      id: "proto",
      name: "Protocol",
      value: "http://",
      type: "string"
    }),
    new Variable({
      id: "host",
      name: "Host",
      value: "localhost",
      type: "string"
    }),
    new Variable({
      id: "baseUrl",
      name: "Base Url",
      value: "{{proto}}{{host}}",
      type: "string"
    }),
    new Variable({
      id: "project",
      name: "Project",
      value: "_",
      type: "string"
    })
  ],
  item: [
    {
      id: "posts",
      name: "Posts",
      item: [] // blank array indicates this is a folder
    }
  ]
});

myCollection.items.one("posts").items.add(
  new Item({
    name: "READ post",
    id: "get-post",
    request: {
      url: "{{baseUrl}}/{{project}}/posts",
      method: "GET"
    }
  })
);

myCollection.items.one("posts").items.add(
  new Item({
    name: "READ posts",
    id: "get-posts",
    request: {
      url: "{{baseUrl}}/{{project}}/posts/:id",
      method: "GET"
    }
  })
);

// Add basic auth to the Collection, to be applied on all requests.
myCollection.auth = new RequestAuth({
  type: "basic",
  username: "postman",
  password: "password"
});

fs.writeFileSync(
  "myCollection.postman_collection",
  JSON.stringify(myCollection, null, 2)
);

const client = new SDK({
  url: "http://localhost:88",
  storage: sessionstorage
});

const main = async () => {
  try {
    const test = await client.login({
      email: "info@pixelwings.io",
      password: "1234abcd"
    });

    const response = await client.getCollections();

    const publicCollections = response.data.reduce((acc, entry) => {
      if (!entry.collection.startsWith("directus_")) {
        acc[entry.collection] = {
          fields: entry.fields
        };
        delete entry.collection;
      }
      return acc;
    }, {});

    console.log(publicCollections);

    /*
    await client.updateRole(1, {
      name: "Super Admin",
      description: ""
    });
    */

/*
    await client.updateUser(1, {
      first_name: "Super",
      last_name: "Admin"
    });
    
  } catch (error) {
    console.error("Error", error);
  }
};

main();
*/
