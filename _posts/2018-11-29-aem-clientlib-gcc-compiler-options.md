---
layout: post
title: Using Google Closure Compiler (GCC) Options with AEM Client Librariries
author: Sean
categories: AEM
tags:  aem clientlibs
---
While debugging why our AEM javascript client libarires weren't properly minifying on my current project, I learned a few new tricks.  Most of this is documented [here][1] but it was new to me, at least.

## Debugging GCC Client Library Minification

Our js client libraries were mysteriously not actually outputing as minified, instead just coming back as the full source versions.  This didn't cause any functional issues, but was an annoyance for a long time.  It was also hard to find the problem because the default error log doesn't actually print why the js failed to minify, just a generic statement about the number of errors.  The key to this was adding a logger on the google javascript compiler classes.  I ended up creating a custom logger configuration for 2 packages at the debug level: 

- com.adobe.granite.ui.clientlibs
- com.google.javascript.jscomp

This got me low enough level info on what errors were acutally occuring during compilation, so I knew what the problem was.  As it turns out, some our developers had been using the ES6 `let` keyword to declare variables, and the compiler was choking on this because the source mode defaults to ES5.

<!--more-->

```
30.11.2018 20:17:33.712 *ERROR* [10.0.2.2 [1543609053532] GET /etc.clientlibs/my-app/clientlibs/clientlib-mylib.min.js HTTP/1.1] com.google.javascript.jscomp /apps/wcax-app/clientlibs/clientlib-mylib.js:5568: ERROR - this language feature is only supported for ECMASCRIPT6 mode or better: let declaration. Use --language_in=ECMASCRIPT6 or ECMASCRIPT6_STRICT or higher to enable ES6 features.
        let somVar = undefined;
        ^
        ```

Once I knew that, the next step was figuring out how to fix it.

## Using GCC Options

By setting the `cssProcessor` and `jsProcessor` properties on the `cq:ClientLibraryFolder` folder node, you can change how a particularly client library is processed.  This is, I think, well known and understood.  For a good example of this, see how ACS Commons uses it [for gcc minification][2].

In addition to changing the processor from yui to gcc though, you can also pass additional options to GCC to tune the compilation process.  For example, if your js source uses ES6/ES2015 syntax, as ours was, you can pass the `languageIn` option to have it transpile your ES6 code to ES5.

```
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:ClientLibraryFolder"
    allowProxy="{Boolean}true"
    jsProcessor="[default:none,min:gcc;languageIn=ECMASCRIPT_2015]"
    categories="[my.client.lib.name]"/>
```

In addition to `languageIn`, you can also pass `compilationLevel`, `languageOut`, or `failOnWarning`.

To combine multiple options, you simply separate each one with a semi-colon as follows.

```
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:ClientLibraryFolder"
    allowProxy="{Boolean}true"
    jsProcessor="[default:none,min:gcc;languageIn=ECMASCRIPT_2015;compilationLevel=whitespace]"
    categories="[my.client.lib.name]"/>
```


Note that all of these options can also be set globally on the `jsProcessor` property of the `com.adobe.granite.ui.clientlibs.impl.HtmlLibraryManagerImpl` service configuration.


[1]: https://helpx.adobe.com/experience-manager/kb/how-to-change-the-minification-engine-for-client-libraries-in-AEM.html
[2]: https://github.com/Adobe-Consulting-Services/acs-aem-commons/blob/a4f1569c5e9aabc427b3993a1fa33b358157fa7a/content/src/main/content/jcr_root/apps/acs-commons/authoring/vendor/leaflet/.content.xml