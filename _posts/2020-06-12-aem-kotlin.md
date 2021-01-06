---
layout: post
title: AEM and Kotlin
author: Sean
categories: AEM
tags:  code java kotlin development
---

I've recently been learning [kotlin][1] and have experimented with using it for development in AEM. What follow are a few observations from those experiments. To say the least, this is not inteded as an exhaustive exploration of all the pros or cons, not an attempt to draw any sweeping conclusions to questions like "should I write my aem project code in Kotlin?"

## Why Kotlin?

For the un-initiated, Kotlin in a language created and design by JetBrains, that among other things features a modern, concise syntax, and full interoperabily with Java. When compiled, it produces standard JVM bytecode. 

There are [many][2] [other][3] [posts][4] comparing the syntax of Java and Kotlin, or highlighting the language features and benefits of Kotlin, so I don't intend to duplicate those or produce a full analysis, but I do think it's worth highlighting a few things that I find particularly useful for AEM development.
<!--more-->

### Extensions

Extension functions and properties allow you to effectively extend the API of any object with custom functionality. At a bytecode level, these effectively become static methods with the object being extended as an implicit parameter. But because they are accessed as if they are part of the objects native api, your code is cleaner and easier to read as a result. 

Let's demonstrate this with an example. Suppose you need to use the JCR API for some bit of complex functionality[^n2]. The JCR Node API throws exceptions anytime you try to access a child node or property that doesn't exist, meaning you have to catch and handle these exceptions in your code, and/or call the `hasNode` or `hasProperty` functions before trying to access these values. With Kotlin, we can extend the node API to add safe equivalents.

{% highlight kotlin %}
fun Node.safeGetNode(relPath: String) : Node? {
    val node = if(hasNode(relPath)) {
        getNode(relPath)
    } else {
        null
    }

    return node
}

// Note: This function can likely be made generic to accept/return a defult value similar to a value map
// I'm just being lazy for now
fun Node.safeGetProperty(relPath: String): Property? {
    val prop = if(hasProperty(relPath)) {
        getProperty(relPath)
    } else {
        null
    }

    return prop
}
{% endhighlight %}

These methods can then be accessed directly on the node object within our code, e.g. `val content = pageNode.safeGetNode("jcr:content")` and we don't have to deal with or worry about a `PathNotFoundException`. 

### Null Safety

Kotlin guarantess null safety and avoids null pointer exceptions through Nullable object support at a type system level and compile time checks to guarantee null access is not possible[^n3]. Taking the code above, `safeGetNode` returns a nullable Node object, so when interacting with that object we need to ensure it isn't null before using it. This is most often by usng the safe access (`?.`) operator. For example:

{% highlight kotlin %}
val content = pageNode?.safeGetNode("jcr:content")
val title = content?.safeGetProperty("jcr:title)?.string
{% endhighlight %}

Title would end up storing either the page's title, or null, but this code can never produce an NPE.

## Adding Kotlin Support to AEM

Because Kotlin compiles to standard JVM bytecode, adding Kotlin support to your AEM project is trivially easy. [This post][5] from a few years ago lays out the basic steps[^n1], but it effectively boils down to adding the kotlin-maven-plugin to your builds and then embedding the kotlin osgi library within your application package. There is one additional step, which is to add your kotlin source and test directories via the build helper plugin to your root pom. This ensures those sources are not only recognized by the kotlin plugin, but also by other plugins such as jacoco, which is important so that when your build is executed by Cloud Manager, kotlin tests are included in coverage metrics.

Overall, you'll end up with something like this in your root pom

{% highlight xml %}
...
<properties>
    ...
    <kotlin.version>1.3.72</kotlin.version>
    ...
</properties>
...
<build>
    <plugins>
    ...
        <!-- expose kotlin source dirs to other plugins -->
        <plugin>
            <groupId>org.codehaus.mojo</groupId>
            <artifactId>build-helper-maven-plugin</artifactId>
            <version>3.0.0</version>
            <executions>
                <execution>
                    <id>add-source</id>
                    <phase>generate-sources</phase>
                    <goals>
                        <goal>add-source</goal>
                    </goals>
                    <configuration>
                        <sources>
                            <source>${project.basedir}/src/main/kotlin</source>
                        </sources>
                    </configuration>
                </execution>
                <execution>
                    <id>add-test-source</id>
                    <phase>generate-sources</phase>
                    <goals><goal>add-test-source</goal></goals>
                    <configuration>
                        <sources>
                            <source>${project.basedir}/src/test/kotlin</source>
                        </sources>
                    </configuration>
                </execution>
            </executions>
        </plugin>
        <!--Kotlin compiler plugin-->
        <plugin>
            <artifactId>kotlin-maven-plugin</artifactId>
            <groupId>org.jetbrains.kotlin</groupId>
            <executions>
                <execution>
                    <id>compile</id>
                    <goals> <goal>compile</goal> </goals>
                </execution>
                <execution>
                    <id>test-compile</id>
                    <goals> <goal>test-compile</goal> </goals>
                </execution>
            </executions>
        </plugin>
        <!-- Maven Compiler Plugin -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
            </configuration>
            <executions>
                <!-- Replacing default-compile as it is treated specially by maven -->
                <execution>
                    <id>default-compile</id>
                    <phase>none</phase>
                </execution>
                <!-- Replacing default-testCompile as it is treated specially by maven -->
                <execution>
                    <id>default-testCompile</id>
                    <phase>none</phase>
                </execution>
                <execution>
                    <id>java-compile</id>
                    <phase>compile</phase>
                    <goals> <goal>compile</goal> </goals>
                </execution>
                <execution>
                    <id>java-test-compile</id>
                    <phase>test-compile</phase>
                    <goals> <goal>testCompile</goal> </goals>
                </execution>
            </executions>
        </plugin>
        ...
    </plugins>
    <pluginManagement>
    ...
        <!--Kotlin compiler plugin-->
        <plugin>
            <artifactId>kotlin-maven-plugin</artifactId>
            <groupId>org.jetbrains.kotlin</groupId>
            <version>${kotlin.version}</version>
        </plugin>
    ...
    </pluginManagement>
</build>
...
<dependencyManagement>
    <dependencies>
    ...
        <!-- Kotlin Deps -->
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-osgi-bundle</artifactId>
            <version>${kotlin.version}</version>
            <exclusions>
                <exclusion>
                    <groupId>org.jetbrains.kotlin</groupId>
                    <artifactId>*</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-stdlib-jdk8</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
    ...
    </dependencies>
</dependencyManagement>
{% endhighlight %}

## Potential Issues and Limitations

### Package Versioning

OSGI Package versioning relies on metadata applied at the package level, most commonly by creating package-info.java files and adding `@Version` annotations. Moreover, later versions of the AEM archetype will only export packages that contain a version, making this behavior even more important. There are of course other ways of doing this by changing the directives passed to the bnd plugin, but even if you chose to export packages in a different manner, versioning your packages properly is a best practice for many reasons.

Unfortunately there is no support in kotlin for package level metadata/annotations, meaning that in order to supply this you need to duplicate your package structure to `src/main/java` and add package-info.java files there[^n4].

## Summing It Up

Overall, Kotlin is a really clean, powerful language, with a lot of things to like about. It's interop with java is mostly seamless, making it a natural fit for AEM. I'll still probably shy away from using it in AEM as a source language, since it isn't officially supported. But for writings tests, POCs, and other limited scenarios, it's definitely something I'll go back to.

[^n1]: the `kotlin-stdlib-jre*` artifacts have been since replaced by `kotlin-stdlib-jdk*` artifacts, but otherwise you can follow those steps as is

[^n2]: [Avoid this if you can][6]

[^n3]: Technically NPE's are still possible when doing interop with Java, which is unavoidable in an AEM context, but at the least it makes them much less likely to occur, and removes a lot of explicit null checks from your code, which makes it cleaner and easier to read

[^n4]: I only spent a cursory amount of time researching this, so it's possible there is a better solution here.

[1]: https://kotlinlang.org
[2]: https://kotlinlang.org/docs/reference/comparison-to-java.html
[3]: https://www.javaworld.com/article/3396141/why-kotlin-eight-features-that-could-convince-java-developers-to-switch.html
[4]: https://lmgtfy.com/?q=kotlin+vs+java&s=d
[5]: https://andreishilov.github.io/blog/aem-and-kotlin/
[6]: http://www.shsteimer.com/2014/03/19/low-level-apis-considered-harmful/