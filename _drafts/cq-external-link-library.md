---
layout: post
title: Creating an External Link Library in CQ
author: Sean
categories: AEM
tags: content-management development sling link-rewriting
---
Adobe Experience Manager provides an easy to use WYSIWYG interface for content creators to manage website content.  Text, images, links & many other types of content can be easily created, modified & deployed.  But one of the few places this easy to use paradigm starts to break down is when it comes to linking to external websites.  Content authors must resort to finding the pages they want to link to, and then copying/pasting the web address into the editing dialog for the link they are trying to edit.  At initial link creation this isn't too bad, but when links need to change, this starts to break down, as there is no easy centralized way to update all the places in the content that link to given external site.  Search can be used to find these links, but it's still a manual & cumbersome effort to update the links to point to a new location.  One solution to this problem I've used on multiple projects is the External Link Library (ELL).

The ELL is nothing more than a set place within AEM where all links to external websites can be managed.  Each external link is represented by a page in the ELL, with those pages can be modeled into a structured hierarchy, orginized in whatever way makes sense for the audience that will be creating and using those links.  Generally, I place it at /content/external-links, but really it could go anywhere in the repository that pages can be created, including under /etc.
<!--more-->

The addition of the ELL does add slight overhead to creating external links, in that authors now must create an external link page first, but IMHO, the benefits of maintainability and flexibility outweigh this small cost.

Creating the ELL
----------------
From a development perspective, there are 2 required pieces for the ELL to function:

1. An external link template (and associated component) which allows content authors to create & update external links
2. A link rewriter, which handles outputting the correct external link when an ell page is linked to from any page in CQ

Left as an excercise for the reader is an optional step 3, modifying components to validate that external links are not entered mnaully, but rather point to the ELL.

The full code for this is [available on github][1], but I have placed a few key snippets below, where I thought additional explanation/justification made sense.

### External Link Template

The template we need to create is pretty simple.  Basically all we need to do is set the allowed paths to where we want our external links to be created.  Using the path I mentioned above, that would be look as follows in our template's .content.xml file.

{% highlight xml %}allowedPaths="[/content/external-links(/.*)?]"{% endhighlight %}

For the template rendering component, we will simply extend from the oob foundation page component (or a site specific base page component, if you prefer).  All we really need to do is slim down the dialog, to only include the fields we need, and provide a very simple rendering script, so if an author does open up the ELL page, (s)he can see where it links to without having to open the dialog.

Now that we have the template in place, content authors can manage and link to external pages just as easily as they do pages within their AEM managed websites.  However, when pages containing these external links are rendered, they will be relative links to pages with the ELL.  What we want is to do is rewrite those links to point to the actual external location as configured.  In order to accomplish that, we add a custom link rewriter which detects links to ell pages, and transforms them to the correct location.

### External Link Rewriter

[1]: https://github.com/shsteimer/aem-ell