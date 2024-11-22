---
id: 4
name: Spring Web and the Deploymentdescriptor
topic: spring
fileName: spring-web
---

# Spring Web and the Deploymentdescriptor

### General

Spring Web is an integral part of the Spring Framework, tailored for developing web applications.

The web.xml file has historically been central in configuring Java web applications, specifying servlets, mappings, listeners, and
other environmental parameters. Located in the WEB-INF directory, it is parsed by servlet containers at application startup to
ensure proper initialization.

With the advent of Servlet 3.0, alternatives to web.xml have emerged, notably the WebApplicationInitializer interface, which
allows for entirely Java-based web application context configuration. This approach supports XML-free configuration and promotes a
programmable method considered more transparent and maintainable.

Implementing WebApplicationInitializer enables developers to register servlets, filters, and listeners without web.xml, providing
flexibility and control over application configuration. This technique is beneficial in environments that encourage rapid
development and application iteration, as code changes are reflected directly without cumbersome XML configurations.

### The web.xml

The web.xml deployment descriptor is a critical XML file used in Java web applications to define server-side components like
servlets, filters, listeners, and other configuration settings. Located in the WEB-INF directory of a web application, it serves
as the primary configuration source that instructs the servlet container how to deploy and manage the application. It includes
specifications for initialization parameters, environment entries, security settings, and session configuration, guiding the
behavior of the application at runtime. The definition of the schema is based on the Jakarta EE specification and can be found
under the Jakarta EE XML Schemas (web-app*.xsd).[[1]](#1)

Since this is about Spring, a short peculiarity of web.xml in connection with Spring should be emphasized. In Spring, it is
possible to apply filters to incoming web requests. These filters can be made known to the application within the web.xml. For
example, a simple filter can be created in Spring with the _GenericFilterBean_, which can filter and process requests.

The following must be entered in the web.xml.

```
<filter>
  <filter-name>requestFilterName</filter-name>
  <filter-class>org.example.RequestFilterClass</filter-class>
</filter>
<filter-mapping>
  <filter-name>requestFilterName</filter-name>
  <url-pattern>/*</url-pattern>
</filter-mapping>
```

It is important that a filter mapping is defined so that a distinction can be made between the requests.

In the code, the definition of the class would look like this.

```
package org.example;
public class RequestFilterClass extends GenericFilterBean {}
```

### Access the ApplicationContext

It may well be that beans registered in the respective application context are to be used within the filter. As a filter does not
usually have its own context, a utility must be used. In the case of a filter, the class _WebApplicationContextUtils_ can be used
here (see Javadoc of the class _GenericFilterBean_). For example, an instance variable of a bean can be set as follows.

```
private MyBean myBean;

@Override
protected void initFilterBean() {

  WebApplicationContext applicationContext = WebApplicationContextUtils
    .findWebApplicationContext(getFilterConfig().getServletContext());

  this.myBean = applicationContext.getBean("myBean", MyBean.class);
}
```

However, there is a small sticking point here. In order for the WebApplicationContext to be available at this point, it must also
be loaded accordingly when the application is started. And this is where the web.xml comes into play again. A listener must be
entered
within this, namely the _ContextLoaderListener_. This ensures that the WebApplicationContext is loaded and added to the
ServletContext.

```
<listener>
  <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
</listener>
```

It is important to note here that the _ContextLoaderListener_ attempts to load the application context defined via the respective
Spring XML. By default, the _/WEB-INF/applicationContext.xml_ file is searched for here. If this has been replaced by a different
one or simply has a different name, this must also be entered in web.xml. This can be done via a _context-param_.

```
<context-param>
  <param-name>contextConfigLocation</param-name>
  <param-value>/WEB-INF/spring-servlet.xml</param-value>
</context-param>
```

The _contextConfigLocation_ property must be used here, as this in turn is defined accordingly in the
_org.springframework.web.context.ContextLoader_ class and transfers the specified location to the WebApplicationContext.

(The definition of the default location for the Spring configuration XML can be found in the class
_org.springframework.web.context.support.XmlWebApplicationContext_ as _DEFAULT_CONFIG_LOCATION_)

***
<a id="1">[1]</a> https://jakarta.ee/xml/ns/jakartaee/ <br>
<a id="2">[2]</a> https://docs.spring.io/spring-framework/reference/web/webmvc/filters.html

