---
layout: post
title: CQ Services Every Project Should Configure
author: Sean
categories: AEM
tags: osgi runmodes configuration
---
If you've spent any serious amount of time as a cq developer or administractor, you are probably aware of the ability to configure OSGI services both via the webconsole or via runmode scoped configuration folders in the crx repository. This post is an attempt to document (perhaps for myself more than for anyone else) the services that I configure for every single CQ project, and that I think every CQ project should configure to fit their needs.
<!--more-->

One note before I start; This post makes several references to configurations applying only to local/dev/qa/production instances. This is accomplished via a custom runmode for the instance level, another thing that I do for every project I work on.

Logging
-------

This one is pretty basic. Scanning the error log that comes out of the box will only get you so far, and you quickly find that custom logging is needed. I, at a minimum, always configure the following.

- &lt;project&gt;-error.log. This log is set at the top level package for all my project code, ie. com.&lt;projectname&gt;.wcm. I set this logger at a debug level in local and dev environments, and then at a warn level in QA and error level in production. This log isn't intended to be very chatty, in fact in prod it should ideally be empty. But it's also a nice fallback for seeing the full scope of project code in local and dev, and a great way to check for errors in your prod environments.
- &lt;project&gt;-components.log. This logs all component java code, as well as jsp's, so your log packages should look something like [com.&lt;project&gt;.wcm.components,apps.&lt;projectname&gt;]. I usually set this, as well as the next log, at an info level in production & qa, and a debug level in all lower environments.
- &lt;project&gt;-services.log. This logs all my custom osgi services code, so it's set at something like com.&lt;projectname&gt;.services. This gives me a nice way to trace service startup & shutdown, debug issues with service dependency wiring, as well as debug any issues with custom service layer code.

You can obviously add more log files if your project dictates it, but I use this as a minimum starting point. Also, you may also want to configure log writers for each of your log files, for example to roll the logs on a more frequent basis then the default settings.

HTML Library Manager
--------------------

It's OK to leave this one with the default settings for all author instances, but on your production and QA publish instances, you'll want to be sure to turn client library minification & gzip on, as well as set the max age header to some reasonable value such as 86400 (1 day). You will also want to disable debug and timing for security reasons (see next section).

Note that when minifying client libraries, you'll also want to be sure you clear the /var/clientlibs cache with every build on these publish instances. This can be handled via a simple curl script that runs as part of your CI build process (you do have CI builds, right?).

Debug Settings
--------------

As covereed in the [CQ Security Checklist][1], there are several services you will want to configure on all publish instances for security reasons. These are:

- Disable the WCM Debug Filter
- Disable the WCM Mode Filter
- Disable the JSP Script Handler Debug Info and Mapped Content

Mail Service
------------

Want your workflows to send emails, or really to send any emails from CQ?  You need to configure CQ to use your corporate SMTP server. Also, see [this post][2] for a good way to configure this to point to a gmail account, which is very handy for local testing.

Externalizer Service
------------------------

The externalizer service provides an easy way of genereting external links to CQ Pages and Assets, which can then be used outside of a standard link, such as in an email sent to an author or end user. It's little more than a set of name-value pairs, with some code and wiring in the background to generate the correct links based on what you give it. There are 2 predefined mapping for "author" and "publish" but the configuration allows you to define arbitrary mappings as well.

This is a service which will have a configuration for each cq environment you have (local, dev, qa, production) since they will all have unique URLs. You also will need to define a mapping for each website you intend to host on your CQ instance.

Then, at a code level you would use as follows to generate external URLs:

{% highlight java linenos %}
@Reference
private Externalizer ext; 
...
ext.externalLink(resourceResolver, "site1", "/path/to/my/page") + ".html";
{% endhighlight %}

See also the [javadocs for the externalizer service][4].

Sling Webconsole Security Provider
--------------------------------

This configuration allows you to specify an array of users and groups which can log-in to the felix webconsole. By default, only the admin user can access this, but for what should be obvious reasons, you don't want to share the admin login credentials with everyone who needs to get to the felix console. Instead, simple configure this service to allow a custom group to login, then just add your users who should have access to the console to this group.

Page Statistics Service
-------------

This service is used by stats.jsp, included in the head of the foundation page template to update the impressions count which is shown in the siteadmin interface on author. The default configuration goes to http://localhost:4502, which obviously doesn't work. 

Please note that you should seriously consider modifying your CQ basepage templates to not include stats.jsp on your publish instances (or just remove it all together, at which point this service configuration isn't required). In almost all cases, analytics should be driven from a full featured analytics package such as Site Catalyst of Google Analytics, and this little bit of data provides little to no value.

Configuration Package
---------------------

For examples of each of these configuration, please see the [attached package][3], which can be installed into CQ to create examples of each of the configurations I've discussed above. You will need to modify almost all of these configurations to fit your project needs, but the package should serve as a reasonable starting point.

[1]: http://dev.day.com/docs/en/cq/current/deploying/security_checklist.html#OSGI%20Settings
[2]: http://therealcq.blogspot.com/2013/01/setting-up-gmail-as-your-smtp-server-in.html
[3]: /downloads/2014/02/cq-service-configs.zip
[4]: http://dev.day.com/docs/en/cq/current/javadoc/com/day/cq/commons/Externalizer.html