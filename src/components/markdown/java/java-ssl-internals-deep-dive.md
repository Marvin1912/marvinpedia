---
id: 6
name: Java SSL Internals
topic: java_se
fileName: java/java-ssl-keystore-truststore-guide-internals
---

# Java SSL Internals

### Trustmaterial

Internally within the Java classes, the selection of the default trust store is based on a call to a page protected by
SSL. An example of this is the call via a Spring RestTemplate.

```java
restTemplate.getForObject("https://google.com", String.class);
```

Ultimately, the call ends up within the class `sun.security.ssl.TrustStoreManager`, where the truststore is loaded
within the `createInstance()` method via the respective properties. In Java, the truststore
can be set via the `javax.net.ssl.trustStore` property. The value `<JAVA_HOME>/lib/security/jssecacerts` is set here
by default, but the value of the static variable `defaultStore` is also added, which is provided by
`FilePaths.cacerts();` and contains the value `<JAVA_HOME>/lib/security/cacerts`. Since the former file
is not available in the standard, `cacerts` is used as the default truststore.

However, you can also create a truststore yourself and use it for SSL-secured requests. All you need is a certificate.

```bash
keytool -import -file trusted.cert -alias trustedCert -keystore myTrustStore
```

This can then be used as follows for the RestTemplate used as an example above. Please note that the second parameter
within the `loadTrustMaterial` method must return false, as otherwise the TrustManager will be told to trust the server
blindly. This can be seen in the implemented method `checkServerTrusted` of `javax.net.ssl.X509TrustManager`. For this
example, the implementation `TrustManagerDelegate` from `org.apache.hc.core5.ssl` is used.

```java
final RestTemplate restTemplate = new RestTemplate();

try {
    final KeyStore keyStore = KeyStore.getInstance("PKCS12");
    keyStore.load(new FileInputStream("<path_to_trust_store>"), <password>);

    SSLContext sslContext = new SSLContextBuilder()
            .loadTrustMaterial(keyStore, (chain, authType) -> false)
            .build();
    SSLConnectionSocketFactory sslConnectionSocketFactory = new SSLConnectionSocketFactoryBuilder()
            .setSslContext(sslContext)
            .setHostnameVerifier((hostname, session) -> true)
            .build();
    PoolingHttpClientConnectionManager connectionManager = PoolingHttpClientConnectionManagerBuilder
            .create()
            .setSSLSocketFactory(sslConnectionSocketFactory)
            .build();
    CloseableHttpClient httpClient = HttpClients.custom()
            .setConnectionManager(connectionManager)
            .build();
    HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory(httpClient);

    return new RestTemplate(factory);
} catch (Exception e) {
    // Not now!
}
```

It should also be noted that the self-created truststore completely replaces the `cacerts` used by default. In other
words, in the use case shown above, the server `https://google.com` is not trusted and the following exception is
thrown.

```java
Caused by: sun.security.validator.ValidatorException: PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target
	at java.base/sun.security.validator.PKIXValidator.doBuild(PKIXValidator.java:388) ~[na:na]
	at java.base/sun.security.validator.PKIXValidator.engineValidate(PKIXValidator.java:271) ~[na:na]
	at java.base/sun.security.validator.Validator.validate(Validator.java:256) ~[na:na]
	at java.base/sun.security.ssl.X509TrustManagerImpl.checkTrusted(X509TrustManagerImpl.java:241) ~[na:na]
	at java.base/sun.security.ssl.X509TrustManagerImpl.checkServerTrusted(X509TrustManagerImpl.java:113) ~[na:na]
	at org.apache.hc.core5.ssl.SSLContextBuilder$TrustManagerDelegate.checkServerTrusted(SSLContextBuilder.java:505) ~[httpcore5-5.2.5.jar:5.2.5]
	at java.base/sun.security.ssl.AbstractTrustManagerWrapper.checkServerTrusted(SSLContextImpl.java:1430) ~[na:na]
	at java.base/sun.security.ssl.CertificateMessage$T13CertificateConsumer.checkServerCerts(CertificateMessage.java:1302) ~[na:na]
	... 60 common frames omitted
```
