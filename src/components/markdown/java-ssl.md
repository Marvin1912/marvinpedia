---
id: 3
name: Java SSL (Keystore and Truststore)
topic: java_se
fileName: java-ssl
---

# Java SSL - Keystore and Truststore

### General
A keystore is basically a database that contains keystore information. This keystore information can be used for 
various purposes, such as authentication and ensuring the integrity of data. The information within a keystore can 
either be entries of keys or trusted certificates. The composition of a key is the private key and the identity of the 
owning entity, the composition of the trusted certificate is the public key and the identity of the entity that can 
be trusted.[[1]](#1) The entity that is trusted is usually a CA (Certificate Authorities).[[2]](#2)

Keystore is more of a general term that can contain the aforementioned data. In addition to the term keystore, there 
are also truststores. Truststores are used to store only the trustworthy certificates. This has the advantage that 
separate keystores exist; one for private keys of the respective entity and one for trusted certificates that the 
entity trusts. The advantage here is, for example, the maintenance of different access authorizations between the 
keystore and the truststore.

Each user of a system can have their own keystore, which is usually stored under ```/home/username/``` (Linux-based systems).
In addition, there is a system-wide keystore that contains certificates from CAs that are trusted by default.
This is localized under ```<java-home>/lib/security/cacerts``` (also Linux-based systems) and has the name _cacerts_.[[2]](#2)

### Keytool
To manage keystores, Java offers an in-house tool within the JDK. The keystores can be easily managed with Keytool.
Some examples of how to use Keytool are shown below. If in doubt, help is offered by Keytools (```keytool -h```).
The system-wide keystore _cacerts_ is used here as a brief example.

The keystore entries can be called up via _list_. The _cacerts_ option indicates that the system-wide keystore should 
be used. For other keystores, the option _keystore \<keystore\>_ can be used.
> ```keytool -list -cacerts -storepass changeit```

The output looks as follows.

> Keystore type: JKS <br>
> Keystore provider: SUN
>
>Your keystore contains 140 entries
>
>aaacertificateservices, Oct 3, 2024, trustedCertEntry, <br>
> Certificate fingerprint (SHA-256): D7:A7:A0:FB:5D:7E:27:31:D7:71:E9:48:4E:BC:DE:F7:1D:5F:0C:3E:0A:29:48:78:2B:C8:3E:
> E0:EA:69:9E:F4 <br>
> accvraiz1, Oct 3, 2024, trustedCertEntry, <br>
> Certificate fingerprint (SHA-256): 9A:6E:C0:12:E1:A7:DA:9D:BE:34:19:4D:47:8A:D7:C0:DB:18:22:FB:07:1D:F1:29:81:49:6E:
> D1:04:38:41:13 <br>
> acraizfnmt-rcm, Oct 3, 2024, trustedCertEntry, <br>
> Certificate fingerprint (SHA-256): EB:C5:57:0C:29:01:8C:4D:67:B1:AA:12:7B:AF:12:F7:03:B4:61:1E:BC:17:B7:DA:B5:57:38:
> 94:17:9B:93:FA <br>
> acraizfnmt-rcmservidoresseguros, Oct 3, 2024, trustedCertEntry, <br>
> Certificate fingerprint (SHA-256): 55:41:53:B1:3D:2C:F9:DD:B7:53:BF:BE:1A:4E:0A:E0:8D:0A:A4:18:70:58:FE:60:A2:B8:62:
> B2:E4:B8:7B:CB <br>
> actalisauthenticationrootca, Oct 3, 2024, trustedCertEntry, <br>
> Certificate fingerprint (SHA-256): 55:92:60:84:EC:96:3A:64:B9:6E:2A:BE:01:CE:0B:A8:6A:64:FB:FE:BC:C7:AA:B5:AF:C1:55:
> B3:7F:D7:60:66 <br>
> [...]

As mentioned, all other commands can be output via the internal help.

### PKCS12
Since JDK 9, the PKCS12 keystore format has been used as the recommended keystore, replacing the previously used 
JKS format. This means that Java relies on a general format described by [RFC 7292](https://datatracker.ietf.org/doc/html/rfc7292)
instead of a proprietary solution. A PKCS12 file represents a separate keystore. The questions that arise are how to 
create such a PKCS12 keystore, what goes into it and how to make it available in the JVM.

Now, let's assume that a user has received a private key and a certificate (e.g. via a CSR) and now wants to use it for
his own authentication within his JVM. It is also assumed that the key and the certificate are in PEM format
([RFC 7468](https://datatracker.ietf.org/doc/html/rfc7468)) and are both part of the same file (concatenated).
A PKCS12 keystore can then be created using OpenSSL and the following command.[[3]](#3)

```openssl pkcs12 -export -in key_and_certificate.pem -out keystore.pkcs12 -name pkcs12Keystore```

The keystore can now be imported via Keytool. Please note that the PKCS12 file is already a separate keystore and
therefore a keystore must be imported into another keystore. The following command can be used for this.

```keytool -importkeystore -srckeystore keystore.pkcs12 -destkeystore dstKeyStore -srcstoretype pkcs12 -alias pkcs12Keystore ```

(For the sake of simplicity, the alias _pkcs12Keystore_ was used for both steps)

To check the process, the _list_ option of Keytool and the alias can be used to check whether the key is part of 
the target keystore.

***
<a id="1">[1]</a> https://docs.oracle.com/en/java/javase/21/security/terms-and-definitions.html <br>
<a id="2">[2]</a> https://docs.oracle.com/en/java/javase/21/security/java-cryptography-architecture-jca-reference-guide.html <br>
<a id="3">[3]</a> https://docs.oracle.com/cd/E19509-01/820-3503/ggfhb/index.html