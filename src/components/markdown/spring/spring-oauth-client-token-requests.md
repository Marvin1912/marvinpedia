---
id: 18
name: Spring OAuth Client Token Handling
topic: spring
fileName: spring/spring-oauth-client-token-requests
---

# Spring OAuth Client Token Handling

Spring Security provides comprehensive support for OAuth2 client functionality, enabling applications to request access tokens from OAuth2/OIDC providers. This guide covers the client-side perspective of obtaining OAuth2 tokens.

## Core Client Components

### Client Registration

The `ClientRegistration` class is the foundation of Spring's OAuth2 client support, representing a registered client with an OAuth2 provider.

**Key Components:**
- **Client ID**: Unique identifier for the client application
- **Client Secret**: Confidential credential for the client
- **Authentication Methods**: How the client authenticates with the token endpoint
- **Grant Types**: Types of OAuth2 flows the client can use
- **Redirect URIs**: Where the provider redirects after authorization
- **Provider Metadata**: Endpoint URLs and provider configuration

### OAuth2AuthorizedClientManager

This interface manages the lifecycle of authorized clients and handles token acquisition, refresh, and storage.

## OAuth2 Grant Types from Client Perspective

### 1. Authorization Code Flow

The most common flow for web applications acting on behalf of a user.

**Process:**
1. User is redirected to authorization server
2. User grants consent
3. Authorization server redirects back with authorization code
4. Client exchanges code for access token

**Spring Configuration:**
```java
@Bean
public OAuth2AuthorizedClientManager authorizedClientManager(
        ClientRegistrationRepository clientRegistrationRepository,
        OAuth2AuthorizedClientRepository authorizedClientRepository) {

    OAuth2AuthorizedClientProvider authorizedClientProvider =
        OAuth2AuthorizedClientProviderBuilder.builder()
            .authorizationCode()
            .refreshToken()
            .build();

    DefaultOAuth2AuthorizedClientManager authorizedClientManager =
        new DefaultOAuth2AuthorizedClientManager(
            clientRegistrationRepository, authorizedClientRepository);
    authorizedClientManager.setAuthorizedClientProvider(authorizedClientProvider);

    return authorizedClientManager;
}
```

### 2. Client Credentials Flow

Used for machine-to-machine communication where no user context is involved.

**Key Characteristics:**
- Client authenticates using client_id and client_secret
- Token represents the client application, not a user
- Common for backend services and APIs

**Example Implementation:**
```java
@Service
public class KeycloakTokenService {

    private final OAuth2AuthorizedClientManager authorizedClientManager;

    public String obtainAccessToken(String clientId, Authentication principal) {
        OAuth2AuthorizeRequest authorizeRequest = OAuth2AuthorizeRequest
            .withClientRegistrationId(clientId)
            .principal(principal)
            .build();

        OAuth2AuthorizedClient authorizedClient =
            authorizedClientManager.authorize(authorizeRequest);

        return authorizedClient.getAccessToken().getTokenValue();
    }
}
```

### 3. Resource Owner Password Credentials

Flow where user credentials are exchanged directly for tokens (less common, recommended only for trusted applications).

## Principal Significance in Token Requests

The principal parameter in OAuth2 token requests serves different purposes depending on the flow:

### For Client Credentials Flow:
- **Mainly for Spring Security's internal tracking**
- **OAuth2 providers typically ignore the principal value**
- **Focus is on client authentication (client_id + client_secret)**
- Principal value is often a placeholder like "client-app"

### For Authorization Code Flow:
- **Represents the actual authenticated user**
- **Becomes the subject in the access token**
- **Essential for user-centric authorization decisions**

## Token Management Strategies

### Automatic Token Refresh

Spring Security can automatically refresh expired tokens:

```java
@Bean
public OAuth2AuthorizedClientProvider authorizedClientProvider() {
    return OAuth2AuthorizedClientProviderBuilder.builder()
        .authorizationCode()
        .clientCredentials()
        .refreshToken(configurer -> configurer.clockSkew(Duration.ofSeconds(60)))
        .build();
}
```

### Token Storage

Clients can store tokens in various ways:
- **In-memory**: For simple applications
- **Database**: For persistent storage across restarts
- **Redis**: For distributed applications

## Common Client Configurations

### Keycloak Configuration Example

```java
@Bean
public ClientRegistrationRepository clientRegistrations() {
    return new InMemoryClientRegistrationRepository(
        ClientRegistration.withRegistrationId("keycloak")
            .clientId("your-client-id")
            .clientSecret("your-client-secret")
            .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
            .authorizationGrantType(AuthorizationGrantType.CLIENT_CREDENTIALS)
            .scope("read", "write")
            .tokenUri("http://localhost:8080/realms/your-realm/protocol/openid-connect/token")
            .build()
    );
}
```


## Error Handling

Common OAuth2 client errors and their handling:

### Invalid Client Credentials
- **Cause**: Incorrect client_id or client_secret
- **Solution**: Verify client registration with OAuth2 provider

### Invalid Grant
- **Cause**: Authorization code expired or already used
- **Solution**: Restart the authorization flow

### Insufficient Scope
- **Cause**: Requested scopes not granted to client
- **Solution**: Update client registration or reduce scope requirements

## Best Practices

1. **Use HTTPS** for all OAuth2 communications
2. **Store client secrets securely** (environment variables, secret management)
3. **Implement proper error handling** for OAuth2 failures
4. **Use appropriate grant types** for your use case
5. **Validate tokens** when received from OAuth2 provider
6. **Handle token expiration** gracefully with refresh mechanisms
7. **Limit scope requests** to minimum necessary permissions

Spring Security's OAuth2 client support provides a robust foundation for integrating with OAuth2/OIDC providers while maintaining security best practices and handling the complexities of token management automatically.