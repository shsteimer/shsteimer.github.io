---
layout: post
title: Avoid Paying the JQuery Tax in Adobe CQ
author: Sean
categories: AEM
tags: jquery javascript
---

<p class="text-muted"><strong>Note: I had originally written this post sometime last year on my old blog (at this same domain). I'm restoring it here, because I think it contains some useful information. The exact same content can aso be found on the <a href="http://www.crownpartners.com/blog/avoid-paying-jquery-tax-adobe-cq">Crown Blog</a>.</strong></p>

At this point, it's pretty much common wisdom that the loading of JavaScript libraries should be deferred to the footer of the page if at all possible. Sam Saffron has some [good suggestions][1] on why this is a good idea and also how you can go about implementing it while still making use of the jQuery $ variable in script fragments in your page's body to bind function calls to $.ready. But for the purposes of this post, I’m not really trying to convince you that this is a good idea, I’m just going to assume you’re already on board and are looking for ideas on how you might implement such a pattern in Adobe CQ.

Due to the nature of CQs component structure, if you have components that rely on JavaScript to load dynamic portions, it can very quickly become a bit of a mess trying to maintain that JS code with the components, without it being littered throughout your pages. The solution Sam suggests works great, and I’ve used it on projects in the past. But I was thinking about this as I started a recent project and thought I might be able to use CQs built in client libs functionality to come up with a better way.

The final solution is described in detail below. I would note that there are probably a few ways to accomplish this, but I like this method because it's simple and flexible while still getting the job done, and since we are using client libs, all of the js for a particular component is maintained with that component.
<!--more-->

OK, let’s start with our CQ page template as there are a few things we need to do here in order to make this work. First, in the head of your template (head.jsp, assuming you're following the standard model provided by the foundation page template component), add the following JavaScript snippet:

{% highlight html linenos %}
<script type="text/javascript">
  //an array of functions to init components, which we will execute after we load jquery at the end of the page
  window._q=[];
</script>
{% endhighlight %}

All we are doing here is creating an empty array that we will add component init functions to as our components are loaded. Next, we need to put in the js that will call all of these init functions after we've loaded the jquery library + our component library js code. That looks like this and goes at the bottom of the page's body. A note here on the javascript code, crown.$ is my reference to jQuery after calling jQuery.noConflict(), obviously use your own jQuery variable as the argument to the self-executing anonymous function.

{% highlight html linenos %}
<script type="text/javascript">
  !(function($) {
    $.each(window._q,function(index,f){
      f();
    });
  })(crown.$);
</script>
{% endhighlight %}

Again it's pretty straightforward, we take that array we created earlier and loop through any functions that have been put into the array and call them.

OK, so the last thing we need to do in the template is load jQuery and our client library containing the js for our custom components.

{% highlight jsp linenos %}
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
<cq:includeClientLib js="crown.components" />
{% endhighlight %}

This code should go in the footer of the page, but prior to the snippet we showed above that executes the function array. Obviously replace "crown.components" with the name of the client lib you are using for your components.

That's it for the template, now all we need to do is create a component that uses jQuery in the client lib. For this example, we are creating a dead-simple example component that uses jQuery. Another note about the javascript code, in the clientlib portion we are extending a js object created in the core JavaScript called "crown.components". This isn't strictly necessary, but it's a pattern I like to follow to keep all of my component scripts in their own namespaces. With no further ado, let's get to it. Here's what the component looks like in the CRX.

![CRXDE Screen-shot of the example component.](/static/img/crxde-js.png)

Here is the example.js, which is loaded into our client library.

{% highlight javascript linenos %}
!(function($) {
  $.extend(crown.components,{
    example: {
      init: function(greeting){
        $( ".fillMeIn" ).html(greeting);
      }
    }
  });
})(crown.$);
{% endhighlight %}

And here is the component rendering script, jQueryExample.jsp.

{% highlight jsp linenos %}
<%--
 
jQueryExample component.
 
An example component for showing using client libs to defer loading jQuery to the page footer
 
--%><%
%><%@include file="/libs/foundation/global.jsp"%><%
%><%@page session="false" %><%
%>
<h3>This is my example Component</h3>
<span class="fillMeIn"></span>
 
<script type="text/javascript">
  window._q.push(function(){
    crown.components.example.init("helloWorld");
  });
</script>
{% endhighlight %}

So what exactly is going on here? Glad you asked! In the client library js we create an init function for this component which uses jQuery. That code will be loaded into our client library JavaScript which is included in every page. But we don't want to be executing arbitrary JavaScript for components that aren't on the page, that won't scale as our number of components grows. So in the rendering script for the component, we push a function into our array, \_q, that will call the init function we just created.

Taking a step back, here is the entire process in short:

- In the head of the page, create an array of component init functions
- As the page loads, individual components can add their own init functions to this array
- At the bottom of the page, we load jQuery and our custom client lib js code which relies on jQuery
- Finally, Loop through the array and execute all the to initialize individual components

That's pretty much all there is to it. By putting all of the component specific js into a client library that gets loaded at the end of the page, after jQuery and any other third party libraries it relies on are loaded, and then only calling the functions we need for components that are included in the page, we can get the maximum benefit of deferring script execution ‘til the end of the page, while still having a maintainable set of a JavaScript code.

[1]: http://samsaffron.com/archive/2012/02/17/stop-paying-your-jquery-tax