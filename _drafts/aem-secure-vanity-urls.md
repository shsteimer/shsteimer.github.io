---
layout: post
title: Securely Serving AEM Vanity URLs
author: Sean
categories: AEM
tags:  apache dispatcher mod_rewrite
---
CQ's (really Sling's) out of the box vanity url fatures provide a powerful mechanism for authors to set and modify vanity urls for a page at run time, without the need for IT or sys admin involvement.  One conflict I ran into for a long time with this was resolving the need to let authors create vanity urls, with the need to follow adobe security best practices of using a whitelist filter at dispatcher to not allow arbitrary request to be passed along to CQ publish instances.

As you can see, these 2 things conflict.  If we want to follow security best practices, we can't allow authors to specify arbitrary vanity urls.  Or can we?\
<!--more-->

By utilizing CQ's query builder json servlet and mod_rewrite RewriteMaps, we can crate an always up to date mapping from the authored vanity urls to the canonical content path they represent, and still maintain a whitelist filter in accordance with secutiry best practices. 

Full disclosure, the idea for this is not originally mine, it seems that most AEM Sys Admin's have developed a similar solution to this one.  But when trying to implement it myself, finding publicly available examples to guide me was difficult; hence this post.

There are basically just 2 pieces to the solution:

 *  a python script which uses CQ's QueryBuilder json servlet to retrieve a list of pages with a vanity path set, and writes the results to a text file
  *  mod_rewrite conf, which uses that text file to perform the mapping

See the [github repo][1] for the full details.

[1]: https://github.com/shsteimer/aem-vanity-mapper