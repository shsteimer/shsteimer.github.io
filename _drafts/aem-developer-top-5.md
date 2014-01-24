---
layout: post
title: The Top 5 Things Every AEM Developer Should Know
author: Sean
categories: AEM
tags: sling jcr rest http cq-design development selectors
---
As a senior AEM architect, I spend a not insignificant amount of time interviewing potential candidates for CQ<sup>\[[1](#note-1)\]</sup> developer positions.  As a result of that, I often find myself thinking about the things I want to all CQ developers to know.  In some sense this is a wish list, a list of things I'm looking for but don't often see.  It is by no means a comprehensive list of everything you should know, and it skips some rather large topics, but these are things that in my mind seperate the wheat from the chaff.  Some of these really apply to anyone doing general web programming, not just AEM, and some are very CQ specific.  

I should note that these are in no particular order, other than the order that they come to my head.  Number 1 isn't necessarily more important than number 5, or vice-versa.
<!--more-->
1\. An understanding of HTTP and REST
-------------------------------------

I consider these core technologies to the solutions we develop, and so I'm looking for an understanding of them so that they can be used effectively.  Just one example;  I've seen more than one junior developer not quite get that the http response is the entire page being rendered, so you can't make a single component dynamic on every request and still cache the page at dispatcher; at least not without introducing something like AJAX or SSI.  

I'm not looking for a full understanding of the 7 layer network protocol, or someone who has read and can recite Roy T. Fielding's doctoral dissertation.  But I want someone who has understanding of what HTTP is and how it works.  I'm looking for someone who understands the HTTP request-response cycle, why using HTTP Session is bad, has an opinion on if using cookies is a violation of REST.  I need someone who knows the HTTP methods; not just GET and POST, but also PUT and DELETE, what they imply about the request and it's subsequent response, and when it would make sense to use each one.  

2\. The Power of Design and Design Dialogs
----------------------------------------------

Most people who have spent anytime with CQ know that the design is where you configure which components are available in the sidekick for a given template or content area.  But many don't understand that there is no magic there beyond the design dialog of the parsys component, and that this same wiring can be used to create custom design dialogs.  This can be very powerful, allowing you to create more flexibile components which present themselves slightly differently on different templates or sites.  

Just one example that I've used frequently in the past.  Suppose you have a component where the author needs to select a value from a drop down list, but the options available need to vary slighty across templates and sites.  Simply create a design dialog with a multifield, allowing someone with permissions to edit the deisgn to specify the drop-down options.  Then create your selection control as you normally would in your authoring dialog, but populate the options dynamically from what is set in the design.

It's obviously not a be-all, end-all solution.  But it is one more tool in your toolbox, an allen wrench to complement your phillips head, if you will, which can be leveraged where and when it makes sense.

3\. The Difference Between Resources (Sling) and Nodes (JCR)
------------------------------------------------------------

4\. The Power of Selectors
--------------------------

5\. Just Enough Front-End Know-How to be Dangerous
-----------------------------------------
It's no longer good enough to be just a backend java programmer when it comes to AEM development.  Java is obviously at the core of what we create, but that's just table stakes as far as I'm concerned.  The Front-End development team is going to handle most of the front-end work, especially the html & css, so I'm not really looking for a "Full-Stack Developer"<sup>\[[2](#note-2)\]</sup>.

You must have an understanding of javascript and jQuery and be able to create components that utilize ajax.  You need to have an understanding of html & css, know how to use firebug or chrome dev tools, etc.  

<ol class="notes">
	<li id="note-1">I use the terms AEM &amp; CQ interchangeably.  I've finally stopped calling it Day CQ, 3 years the Adobe acquisition, so maybe in 2 more years I'll get used to saying AEM and not CQ.  One of these days I'm gonna write a jquery plugin that finds instances of "CQ" in my writing, strikes it thorugh, and replaces it with AEM.  Until then, just silently translate between the two in your head.</li>
	<li id="note-2">I hate that term, for reasons that are too long and varied to get into here, but it seems to be getting more traction, so I use it here, begrudgingly.</li>
</ol> 