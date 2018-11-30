---
layout: post
title: OSGI Factory Configuration Services in CQ
author: Sean
categories: AEM
tags:  osgi development
---
One of the most powerful parts of AEM is OSGI and the ability that gives you configure servies and modify those confiugration on the fly if needed.  By creating custom services and providing appopriate configuration properties, your services become more flexible.  If we extend that a bit furthur, and use [runmode scoped configurations in the repository][1] we can now dynamically modify how our services behave based on the environment they are running in.  But for me personally, the one piece that was always missing was how to create a factory configuration service.  That is, how can I create single service, but apply multiple configuration to it and then consume those configurations from another class, similar to how the loggers are configured.  What follows are the steps needed to create such a configuration; it actually turns out to be pretty simple.
<!--more-->

First, we create a service class to hold our configuration values.  More or less, this is exactly the same as any other service, except that the @Component annotations declares itself as a configurationFactory with a configuration policy of required.

{% gist 8591063 MyFactoryConfigServiceClass.java %}

Next, we need a way to read our configuration values.  For that, we will take advantage of osgi dynamic binding.  From another service where you need to read your configurations, add the following.

{% gist 8591063 MyFactoryConsumer.java %}

More or less, that's all there is to it.  You now have a list of all the available configuration, which you can loop through and/or use as needed.  


[1]: http://helpx.adobe.com/experience-manager/kb/RunModeDependentConfigAndInstall.html  