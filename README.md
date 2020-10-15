# Blink Once

![Build and test](https://github.com/nurih/blink-once/workflows/Build%20and%20test/badge.svg)

## What is this?

`blink-once` is an Azure Functions based project that provides API to write some data and consume it once, then delete the stored data.

It allows you to self-host a service similar to other nonce / one-time transfer arrangements.

## API

There are 2 endpoints supported currently:

|Endpoint| HTTP Method |Description |
|--- |--- |--- |
|`/api/Memorize`|POST| Stores the full body of the post and returns an unique id.|
|`/api/Consume?id=ID`|GET| Retrieves a previously stored item given it's **ID**.|

The full URL to the API depends on your deployment of the Azure function. It will generally take the form:

`https://FUNCTION_APP_NAME.azurewebsites.net/api/`

where _FUNCTION_APP_NAME_ is the name you gave your function application.

For example, if your function app name is `myvlink123`, your endpoints will become:

1. `https://myblink123.azurewebsites.net/api/Memorize` 
1. `https://myblink123.azurewebsites.net/api/Consume` 


## Behavior

### Memorize

The Memorize endpoint stores the full body provided via the `POST` to the endpoint verbatim.
The endpoint returns an identifier for the newly saved value in the variable `id`

For example : 
```JSON
{ "id": "fa9ebd7ba3e9483d82ccfab6078b5bc31c2f4e9f83cb40339cbeb5a74d9fb8e4" }
```
API client must capture that identifier in order to later consume that payload.

If the body is empty or missing altogether, then a [400 HTTP error](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400) is returned. Client should take care to ensure the body has a value.

Any other exception raised by the Memorize should be considered a server side error, which may require troubleshooting by the function owner.

### Consume

The Consume endpoint reads and deletes payload for a given id value.

API client must capture the value returned, since any additional calls to the endpoint with the same id will result in an error.

The endpoint returns a [404 HTTP error](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404) if the id provided does not match any stored message.

The endpoint returns a [400 HTTP error](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400) if the client doesn't supply an `id` in the GET URL.

Example GET url to consume a previously stored payload: `https://myblink123.azurewebsites.net/api/Consume?id=fa9ebd7ba3e9483d82ccfab6078b5bc31c2f4e9f83cb40339cbeb5a74d9fb8e4`


## Configuration

The environment variable `AZURE_STORAGE_CONNECTION_STRING` must be set to a blob storage connection string.

A container named `blink-once` must be created in that storage account. All nonce values would be stored in that container.


## UI

WORK-IN-PROGRESS

A UI can present a form prompting user to either supply a new message to send, or accept an `id` to retrieve a previously saved message.

