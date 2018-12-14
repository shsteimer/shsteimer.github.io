---
layout: post
title: AEM Editable Template Folders Missing
author: Sean
categories: AEM
tags:  aem editable-template indexing
---
A quick hint, mostly as a reminder for myself for the next time it happens.  When trying to access editable templates at `<instance url>/libs/wcm/core/content/sites/templates.html/conf` I've found that not all of my template folders are displayed.  After deugging, I ultimately found that this runs the following query:

{% highlight sql %}
SELECT * FROM [cq:Page] AS p WHERE p.[jcr:path] LIKE '/conf/%/settings/wcm/templates' ORDER BY [jcr:path]
{% endhighlight %}

That should use the cqPageLucene index, and simply running a re-index will fix the issue.
