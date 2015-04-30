---
layout: post
title: Low Level APIs Considered Harmful
author: Sean
categories: AEM
tags: development api code-review jcr sling abstraction
---
For my latest project, we've instituted a process where-by every single commit gets code reviewed by at least one other person, and usually by 2 or more people.  It's a process I really enjoy and think has led to exponential gains in code quality.  At some point I'll probably post more info on the tools we use to facilitate this process and how it works.  It's nothing groundbreaking or revolutionary, but it's interesting nonetheless.  That's a post for another day.  

However, in the course of doing said code reviews, I've found myself frequently commenting on my preference for higher level APIs over their lower level equivelents.  This has drawn some confusion at times, so I thought I would explain that stance, and why I believe it is, in general, the right approach.
<!--more-->

When developing for CQ, there is almost always more than one way to solve a given problem, and often times 3 or 4 ways.  Partly, this is due to the fact that the platform is built on top of a cascading series of frameworks, each with their own API operating at a given level of abstraction.  

Just as a quick example, If I need to maniupulate a page's content I could:
 * use the Page Manager to retrieve the Page, then get the content Resource from there
 * use the Sling Resource Resolver, to grab the content Resource I need directly
 * use a JCR Session to retrieve the Node I need to manipulate

Quite obviously, these layers of abstraction [leak][1] to some extent.  Even in the simple example above, the first case using the CQ Page Manager API directly involves the Sling Resource API to make any actual updates.  Given these leaks, you need to understand those abstractions, and what is happening at each layer of abstraction to effectively work within the platform, so why prefer the higher level approach?

To answer that question, let's compare 2 code snippets, which accomplish the relatively simple task described above. The first one, using the low lever JCR API and the second one using the higher level CQ and Sling APIs.

{% highlight java linenos %}
private void updatePageLastModified(String pagePath, Session jcrSession) {
    Node pageNode = jcrSession.getNode(pagePath);
    Node contentNode = pageNode.getNode("jcr:content");	

    if(!contentNode.hasProperty("customUpdateDate")) {
        contentNode.setProperty("customUpdateDate", java.util.Calendar.getInstance());
        jcrSession.save();
    } else {
        Property dateProp = contentNode.getProperty("customUpdateDate");
        java.util.Calendar curDate = dateProp.getDate();
        log.debug("update date already set to {}", curDate);
    }
}
{% endhighlight %}

{% highlight java linenos %}
private void updatePageLastModified(String pagePath, ResourceResolver resourceResolver) {
    PageManager pm = resourceResolver.adaptTo(PageManager.class);

    Page myPage = pm.getPage(pagePath);
    Resource cntRes = myPage.getContentResource();

    ModifiableValueMap mvm = cntRes.adaptTo(ModifiableValueMap.class);
    java.util.Calendar curDate = mvm.get("customUpdateDate", java.util.Calendar.class);
    if(curDate!=null) {
        mvm.put("customUpdateDate", java.util.Calendar.getInstance());	
        resourceResolver.commit();
    } else {
        log.debug("update date already set to {}", curDate);
    } 
}
{% endhighlight %}

Both sets of code are about the same length (in fact, in this instance the low level approach is slightly fewer lines of code, but that's due to having to initialzie the PageManager from the ResourceResolver).  But take a close look at how you check for the existence of the custom date property.  Using the Sling ValueMap API, just get the property and if it's not there, deal with the null case.  Using the JCR API, you need an explicit check for the property's existence before you can get it's value and use it.  If you call getProperty and the property wasn't there, an exception would be raised.  By using the higher level API, there is no need to worry about handling this exception case.  Basically, the abstraction makes it easier to accomplish the task at hand, which is the whole purpose of an abstraction in general.  You can focus on sturcuting the code in a way to make it easy to test, on making sure the algorithm does what it needs to do in a consistent way and handles any edge-cases.  Put another way, you can focus your time and effort on your job without worrying about the lowest level semantics of the repository persistence layer.

Additionally, compare lines 3 and 5, where you get the content node/resource from the page.  The difference here is small, but in my mind important.  By hard coding the "jcr:content" node name, the code is locked in to a given representation format for that data.  In this simple case, you could work around that by using a constant and move on with life.  But especially in more complex situations, having code tied to given storage representation makes the code less flexible.  It means that if the format ever changes, there will be a huge and expensive effort to refactor and make things with the new format.

Having just said all of that, there are obviously cases where using the low-level JCR API is appropriate.  It's important to have all the tools in your tool box, and know when and how to use each of them.  In general though, given the choice of 2 tools to accomplish the same task, I'm going to use the one that's easiest to use and creates the least amout of mess.

[1]: http://www.joelonsoftware.com/articles/LeakyAbstractions.html
