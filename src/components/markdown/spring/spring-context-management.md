---
id: 5
name: Spring and it's Contexts
topic: spring
fileName: spring/spring-context-management
---

# Spring and it's Contexts

### General

One of the core concepts of Spring is the management of application contexts,
which serve as the central configuration and management point for Spring bean objects. There are two main types of application
contexts commonly used in Spring applications: the global context (`applicationContext.xml`) and the specific
context (`spring-servlet.xml`).

The **global context**, defined in `applicationContext.xml`, is responsible for housing all overarching beans and services that
should be available project-wide. Typically loaded at application startup and remaining throughout the application’s lifecycle, it
includes the configuration of services like data sources, transaction managers, and other infrastructure components needed at a
higher level within the application.

The **servlet context**, configured in `spring-servlet.xml`, generally pertains to beans required specifically for certain parts
of an application, such as web applications. This context is often associated with a particular `DispatcherServlet` that acts as
the front controller, routing incoming requests to various handlers responsible for processing specific tasks. Here, the
configuration of specific controllers, view resolvers, and other web-specific beans is handled, allowing for finer granularity in
managing web components.

### Application Context

The global context is defined by the `applicationContext.xml` and has the following format. The corresponding beans and other
components of the application can then be defined here.

```
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                           http://www.springframework.org/schema/beans/spring-beans.xsd">
</beans>
```

In the classic application field of a web application implemented with Spring, the `applicationContext.xml` is defined within the
deployment descriptor (web.xml). This looks as follows.

```
<listener>
  <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
</listener>
```

Please note that the name `applicationContext.xml` is the default and therefore does not need to be specified specifically.
However, the name can be viewed under the class `org.springframework.web.context.support.XmlWebApplicationContext`
as `DEFAULT_CONFIG_LOCATION` and changed with the `context-param` `contextConfigLocation`.

With the introduction of Spring 2.5 and later versions, annotations can be used to configure the global context. This is often
used in conjunction with a configuration class annotated with `@Configuration`.

### Servlet Context

The servlet context is defined by the file `spring-servlet.xml` and has the same format as the applicationContext.xml.
The `spring-servlet.xml` is also defined by the deployment descriptor. Here, however, it is not defined by a listener, but by
the `DispatcherServlet`. This then looks as follows.

```
<servlet>
  <servlet-name>spring</servlet-name>
  <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
  <load-on-startup>1</load-on-startup>
</servlet>
```

The name of the file is also a default here and is made up of the name of the servlet and the suffix `-servlet`. The suffix itself
is defined within the class `org.springframework.web.servlet.FrameworkServlet` under `DEFAULT_NAMESPACE_SUFFIX`. A specific file
for the context can also be specified here by using a parameter. For the `DispatcherServlet` it is
the `init-param` `contextConfigLocation`.
