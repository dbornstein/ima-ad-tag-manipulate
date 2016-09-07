# ima-ad-tag-manipulate
Brightcove player plugin to dynamically modify the IMA ad tag with custom page and video-cloud variables.


This Brightcove Player plugin extends the basic IMA3 plugin's macro functionality enabling the following features:

- populate the ad tag with variables passed from the calling web page (advanced in-page embeds)
- populate the ad tag with values passed from the player's query string (iframe embeds)
- execute a custom function to modify any aspect of the ad tag

The code is executed before each IMA ad server call in addition to the IMA3 plugin's standard macro replacement functionality described [here](http://docs.brightcove.com/en/video-cloud/brightcove-player/guides/ima-plugin.html#adMacros).

## Getting Started
* Configure the IMA plugin following the standard instructions [here](http://docs.brightcove.com/en/video-cloud/brightcove-player/guides/ima-plugin.html).
* Download the plugin and place on your server.
* Edit the player configuration in the [Players Module of Video Cloud Studio](https://studio.brightcove.com/products/videocloud/players).
* Under _Plugins>JavaScript_, add the URL to the plugin to the player configuration and click +.
* Under _Plugins>Name, enter `adTagManipulate` as the name. 
* Under _Plugins>Options (JSON)_, enter the configuration options described below and click `+`.


## Plugin Configuration
```json
{
    "debug" : true,
    "pageVariables": {
	      "{p1}": "p1VariableName",
	      "{p2}": "p2VariableName"
    },
    "queryStringVariables": {
		    "{q1}": "q1",
		    "{q2}": "q2"
	   },
     "customReplaceFunction": {
	      "functionName": "customJavascriptFunction"
     }
}
```

### Populating the ad tag with variables passed from the page

When embedding the Brightcove player using in-page embeds, the plugin can retrieve any variable available in the Javascript global scope. These variables will be dynamically inserted into the ad tag before the call is made to the ad server.

#### Example:
ad tag: _http://pubads.g.doubleclick.net/gampad/ads?env=vp...&level={p1}&type={p2}_

#### Plugin Configuration:
```json
{
    "pageVariables": {
	      "{p1}": "p1Variable",
	      "{p2}": "p2Variable"
    }
}
```

#### In-Page code
```javascript
<script>
     var p1variable = "MyLevel"
     var p2variable = "MyType"
</script>
```
The resulting ad tag: _http://pubads.g.doubleclick.net/gampad/ads?env=vp...&level=MyLevel&type=MyType_

### Populating the ad tag with variables passed from the player's query string (iframe embeds)

#### Example:
ad tag: _http://pubads.g.doubleclick.net/gampad/ads?env=vp...&level={q1}&type={q2}_

#### Plugin Configuration:
```json
{
    "queryStringVariables": {
	      "{q1}": "level",
	      "{p2}": "type"
    }
}
```
#### iFrame Player Embed
```html
<iframe src="//players.brightcove.net/12345678/default_default/index.html?level=MyLevel&type=MyType"></iframe>
```

In this example, {q1} in the ad tag is replaced with the value of the query string variable level who's value is MyLevel

### Custom Replace Function

The custom replace function can be used to perform any action on the ad tag. Examples include:
1. Modifying the domain name of the calling page before passing it into the ad tag
2. Removing undesired characters from page variables or Video Cloud metadata

```javascript
function customJavascriptFunction(player, debug, url) {
	// Do whatever you want to the URL, then return the new version
	
	return url
}
```

**NOTE:** The custom javascript function must be included in the adTagManipulate.js file or loaded before it.

### Other examples: 

#### Populate the value in an ad tag based on a video cloud custom field 'rating'

```json
{
   "pageVariables": {
   	"{p1}": "player.mediainfo.custom_fields['rating']"
}
```


