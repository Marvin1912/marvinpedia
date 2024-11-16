---
id: 3
name: Java SSL (Keystore and Truststore)
topic: java_se
fileName: java-ssl
---

# Java SSL (Keystore and Truststore)

### Allgemeines
Ein Keystore ist grundlegend eine Datenbank die Keystoreinformationen enthält. Diese Keystoreinformationen
können für unterschiedliche Einsatzzwecke genutzt werden, wie bspw. Authentifizierung und die Sicherstellung
der Integrität von Daten. Die Informationen innerhalb eines Keystores können entweder Einträge von Keys
sein oder vertrauenswürdige Zertifikate. Die Zusammensetzung eines Keys ist dabei logischerweise
der private Key und die Identität der besitzenden Entity, die Zusammensetzung des vertrauenswürdigen Zertifikats
der öffentliche Key und die Identität der Entity, der vertraut werden kann.[[1]](#1) Die Entität,
der vertraut wird, ist üblicherweise eine CA (Certificate Authorities).[[2]](#2)

Keystore ist mehr ein genereller Begriff, der die zuvor genannten Daten enthalten kann. Neben
dem Begriff des Keystores gibt es zusätzlich die Truststores. Truststores dienen dazu, nur
die vertrauenswürdigen Zertifikate zu speichern. Das hat den Vorteil, dass separate Keystores
existieren; einer für private Schlüssel der jeweiligen Entity und einer für vertrauenswürdige Zertifikate,
denen die Entity vertraut. Vorteil ist hier bspw. die Pflege von unterschiedlichen Zugriffsberechtigungen
zwischen dem Keystore und dem Truststore.

Jeder Benutzer eines Systems kann einen eigenen Keystore haben, der üblicherweise unter ```/home/username/```
abgelegt wird (Linux-basierte Systeme). Zusätzlich dazu existiert ein systemweiter Keystore, der
Zertifikate von CAs enthält, denen defaultmäßig vertraut wird. Dieser ist unter ```<java-home>/lib/security/cacerts```
lokalisiert (ebenfalls Linux-basierte Systeme) und hat den Namen _cacerts_.[[2]](#2)

### Keytool
Um Keystores zu verwalten, bietet Java ein hauseigenes Tool innerhalb des JDKs an. Mit Keytool
lassen sich die Keystores problemlos verwalten. Im Folgenden werden einige Beispiele gezeigt,
wie man mit Keytool umgeht. Im Zweifel wird eine Hilfe von Keytools angeboten (```keytool -h```).
Als kurzes Beispiel soll hier der systemweite Keystore _cacerts_ herhalten.

Die Einträge des Keystores lassen sich über _list_ abrufen. Die Option _cacerts_ sagt aus,
dass der systemweite Keystore genutzt werden soll. Bei anderen Keystores kann die Option
_keystore \<keystore\>_ genutzt werden.
> ```keytool -list -cacerts -storepass changeit```

Die Ausgabe sieht folgendermaßen aus.

>Keystore type: JKS <br> 
>Keystore provider: SUN
>
>Your keystore contains 140 entries
>
>aaacertificateservices, Oct 3, 2024, trustedCertEntry, <br>
>Certificate fingerprint (SHA-256): D7:A7:A0:FB:5D:7E:27:31:D7:71:E9:48:4E:BC:DE:F7:1D:5F:0C:3E:0A:29:48:78:2B:C8:3E:E0:EA:69:9E:F4 <br>
>accvraiz1, Oct 3, 2024, trustedCertEntry, <br>
>Certificate fingerprint (SHA-256): 9A:6E:C0:12:E1:A7:DA:9D:BE:34:19:4D:47:8A:D7:C0:DB:18:22:FB:07:1D:F1:29:81:49:6E:D1:04:38:41:13 <br>
>acraizfnmt-rcm, Oct 3, 2024, trustedCertEntry, <br>
>Certificate fingerprint (SHA-256): EB:C5:57:0C:29:01:8C:4D:67:B1:AA:12:7B:AF:12:F7:03:B4:61:1E:BC:17:B7:DA:B5:57:38:94:17:9B:93:FA <br>
>acraizfnmt-rcmservidoresseguros, Oct 3, 2024, trustedCertEntry, <br>
>Certificate fingerprint (SHA-256): 55:41:53:B1:3D:2C:F9:DD:B7:53:BF:BE:1A:4E:0A:E0:8D:0A:A4:18:70:58:FE:60:A2:B8:62:B2:E4:B8:7B:CB <br>
>actalisauthenticationrootca, Oct 3, 2024, trustedCertEntry, <br>
>Certificate fingerprint (SHA-256): 55:92:60:84:EC:96:3A:64:B9:6E:2A:BE:01:CE:0B:A8:6A:64:FB:FE:BC:C7:AA:B5:AF:C1:55:B3:7F:D7:60:66 <br>
> [...]

Wie erwähnt, lassen sich sämtliche anderen Befehle über die interne Hilfe ausgeben.

### PKCS12
Seit dem JDK 9 wird das Keystoreformat PKCS12 als empfohlener Keystore eingesetzt, das das zuvor
genutzte JKS Format ablöst. Damit setzt Java anstatt auf eine proprietäre Lösung auf ein generelles
Format, das durch [RFC 7292](https://datatracker.ietf.org/doc/html/rfc7292) beschrieben wird.
Ein PKCS12-File stellt einen eigenen Keystore dar. Die Fragen, die sich stellen, sind, wie man
so einen PKCS12 Keystore erstellt, was dort rein kommt und wie man diesen in der JVM verfügbar macht.

Nun, gehen wir davon aus, dass ein Benutzer einen privaten Schlüssel sowie ein Zertifikat (bspw.
über einen CSR) erhalten hat und jenes nun für seine eigene Authentifizierung innerhalb
seiner JVM nutzen möchte. Weiterhin sei angenommen, dass der Schlüssel sowie das Zertifikat
im PEM-Format ([RFC 7468](https://datatracker.ietf.org/doc/html/rfc7468)) vorliegen und beide
Bestandteil desselben Files sind (konkateniert). Ein PKCS12 Keystore lässt sich dann
über OpenSSL und dem folgenden Befehl erstellen.[[3]](#3)

```openssl pkcs12 -export -in key_and_certificate.pem -out keystore.pkcs12 -name pkcs12Keystore```

Importieren lässt sich der Keystore nun über Keytool. Zu beachten gilt hier, dass das PKCS12-File
bereits ein eigener Keystore ist und deswegen ein Keystore in einen anderen Keystore importiert werden muss.
Dazu kann der folgende Befehl genutzt werden.

```keytool -importkeystore -srckeystore keystore.pkcs12 -destkeystore dstKeyStore -srcstoretype pkcs12 -alias pkcs12Keystore ```

(Der Einfachheit halber wurde bei beiden Schritten der Alias _pkcs12Keystore_ genutzt)

Um den Prozess zu überprüfen, kann mit der _list_ Option von Keytool sowie dem Alias geprüft
werden, ob der Key Bestandteil des Zielkeystores ist.



[//]: # (Wie läuft das ganze intern ab?)

***
<a id="1">[1]</a> https://docs.oracle.com/en/java/javase/21/security/terms-and-definitions.html <br>
<a id="2">[2]</a> https://docs.oracle.com/en/java/javase/21/security/java-cryptography-architecture-jca-reference-guide.html <br> 
<a id="3">[3]</a> https://docs.oracle.com/cd/E19509-01/820-3503/ggfhb/index.html