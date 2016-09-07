/**
 * imaAdTagManipulate.js plugin
 * 
 * (C) 2016 Brightcove Inc. 

 * Author: Dave Bornstein
 * Note: IMA3 plugin must be loaded first
 */


(function(window, document, vjs, undefined) {
    imaAdTagManipulate = function(options) {

        var player = this;
        var originalMacroFunction = player.ima3.adMacroReplacement;

        var defaults = {
            debug: false
        }

        debug = function(msg) {
            if (options.debug) {
                videojs.log(msg);
            }
        };

        debug('imaAdTagManipulate - v1.01:')
        debug(options)

        player.ima3.adMacroReplacement = function(url) {

            debug('imaAdTagManipulate[' + player.mediainfo.id + ']: Initial URL -> ' + url)

            if (options.queryStringVariables) {
                url = subQueryVariables(url, options.queryStringVariables)
                debug('imaAdTagManipulate: POST QueryReplace -> ' + url)
            }

            if (options.pageVariables) {
                url = subPageVariables(url, options.pageVariables)
                debug('imaAdTagManipulate: POST PageReplace -> ' + url)
            }

            if (options.customReplaceFunction) {
                var cmd = "url = " + options.customReplaceFunction.functionName + "(player, debug, url)"
                debug('imaAdTagManipulate: executing custom function: ' + cmd)
                try {
                    eval(cmd)
                } catch (err) {
                    console.log('imaAdTagManipulate: ERROR in custom function ' + err.message + ', skipping')
                }
            }

            url = originalMacroFunction(url)
            debug("imaAdTagManipulate: Post Standard Replace " + url)

            if (options.setPageVariable) {
                document.getElementById(options.setPageVariable).innerHTML = url;
            }

            return url
        };


        function subQueryVariables(url, queryVars) {

            for (var qvar in queryVars) {
                key = queryVars[qvar]
                if (queryVars.hasOwnProperty(qvar)) {
                    var qval = getParameterByName(key)
                    if (!qval) {
                        debug("imaAdTagManipulate Warning: " + key + " not found in query string, relacing with blank")
                        qval = '';
                    } 
                    debug(key + " -> " + qvar + " -> " + qval);
                    if (url.search(qvar)) {
                        debug("imaAdTagManipulate: replacing queryString " + qvar + " with " + qval)
                        url = url.replace(qvar, encodeURIComponent(qval));
                    }
                }
            }
            return url
        }


        function subPageVariables(url, pageVars) {

            for (var pvar in pageVars) {
                key = pageVars[pvar]
                if (pageVars.hasOwnProperty(pvar)) {

                    if (url.search(pvar)) {

                        try {
                            var pval = eval(key)
                            if (pval == null) {
                                pval = ''
                            }
                            debug('imaAdTagManipulate: page variable ' + pvar + ' -> ' + key + ' -> ' + pval)
                        } catch (err) {
                            debug("imaAdTagManipulate: WARNING: page variable " + err.message + ", setting to empty string")
                            pval = ''
                        }

                        // Replace 
                        url = url.replace(pvar, encodeURIComponent(pval));
                    }
                }
            }
            return url
        }

        function getParameterByName(name) {
            var href = window.location.href.search;

            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexString = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexString);
            var found = regex.exec(window.location.search);
            if (found == null) {
                return "";
            } else
                var val = decodeURIComponent(found[1].replace(/\+/g, " "));

            return val
        }
    };

    // register the plugin with the player
    videojs.plugin("imaAdTagManipulate", imaAdTagManipulate);
})(window, document, videojs);