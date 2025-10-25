---
id: 18
name: Spring OAuth Client Token Handling
topic: spring
fileName: spring/spring-oauth-client-token-requests
---

# Spring OAuth Client Credentials Flow

Spring Security provides comprehensive support for the OAuth2 client credentials grant type, which is designed for machine-to-machine communication where no user context is involved. This guide covers the client-side perspective of obtaining OAuth2 tokens using the client credentials method.

## Core Client Components

### Client Registration

The `ClientRegistration` class is the foundation of Spring's OAuth2 client support, representing a registered client with an OAuth2 provider.

**Key Components:**
- **Client ID**: Unique identifier for the client application
- **Client Secret**: Confidential credential for the client
- **Authentication Methods**: How the client authenticates with the token endpoint
- **Grant Type**: Specifically `CLIENT_CREDENTIALS` for this flow
- **Scopes**: Permissions requested by the client application
- **Provider Metadata**: Token endpoint URL and provider configuration

### OAuth2AuthorizedClientManager

This interface manages the lifecycle of authorized clients and handles token acquisition for the client credentials flow.

## Client Credentials Flow

### Overview

The client credentials flow is used when applications need to access resources on their own behalf rather than on behalf of a user. This is ideal for:
- Backend services and APIs
- Machine-to-machine communication
- Scheduled jobs and background processes
- Microservices architecture

### Flow Characteristics

- **No User Interaction**: The flow doesn't require user authentication or consent
- **Client Authentication**: Uses client_id and client_secret to authenticate
- **Token Represents Client**: The access token represents the client application, not a user
- **Short-lived Tokens**: Access tokens typically have shorter expiration times
- **No Refresh Tokens**: This flow doesn't support refresh tokens

### Spring Configuration

```java
@Configuration
public class OAuth2ClientConfig {

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

    @Bean
    public OAuth2AuthorizedClientManager authorizedClientManager(
            ClientRegistrationRepository clientRegistrationRepository,
            OAuth2AuthorizedClientRepository authorizedClientRepository) {

        OAuth2AuthorizedClientProvider authorizedClientProvider =
            OAuth2AuthorizedClientProviderBuilder.builder()
                .clientCredentials()
                .build();

        DefaultOAuth2AuthorizedClientManager authorizedClientManager =
            new DefaultOAuth2AuthorizedClientManager(
                clientRegistrationRepository, authorizedClientRepository);
        authorizedClientManager.setAuthorizedClientProvider(authorizedClientProvider);

        return authorizedClientManager;
    }
}
```

### Token Service Implementation with Caching

```java
@Service
public class KeycloakTokenService {

    private final OAuth2AuthorizedClientManager authorizedClientManager;
    private final Map<String, CachedToken> tokenCache = new ConcurrentHashMap<>();

    public KeycloakTokenService(OAuth2AuthorizedClientManager authorizedClientManager) {
        this.authorizedClientManager = authorizedClientManager;
    }

    public String obtainAccessToken(String clientId) {
        CachedToken cachedToken = tokenCache.get(clientId);

        // Check if we have a valid cached token
        if (cachedToken != null && !cachedToken.isExpired()) {
            return cachedToken.getTokenValue();
        }

        // Token is expired or not cached, request new one
        Authentication principal = new UsernamePasswordAuthenticationToken("client-app", null);

        OAuth2AuthorizeRequest authorizeRequest = OAuth2AuthorizeRequest
            .withClientRegistrationId(clientId)
            .principal(principal)
            .build();

        OAuth2AuthorizedClient authorizedClient =
            authorizedClientManager.authorize(authorizeRequest);

        String newToken = authorizedClient.getAccessToken().getTokenValue();
        OAuth2AccessToken accessToken = authorizedClient.getAccessToken();

        // Cache the new token
        tokenCache.put(clientId, new CachedToken(newToken, accessToken.getExpiresAt()));

        return newToken;
    }

    private static class CachedToken {
        private final String tokenValue;
        private final Instant expiresAt;

        public CachedToken(String tokenValue, Instant expiresAt) {
            this.tokenValue = tokenValue;
            this.expiresAt = expiresAt;
        }

        public String getTokenValue() {
            return tokenValue;
        }

        public boolean isExpired() {
            return Instant.now().isAfter(expiresAt.minusSeconds(60)); // 60-second buffer
        }
    }
}
```

## Principal Significance in Client Credentials Flow

In the client credentials flow, the principal parameter has limited significance:

- **Spring Security Internal Tracking**: Mainly used for Spring Security's internal request handling
- **Provider Ignores Principal**: OAuth2 providers like Keycloak typically ignore the principal value
- **Focus on Client Credentials**: The provider validates client_id + client_secret authentication
- **Placeholder Value**: The principal value (e.g., "client-app") is essentially a placeholder

**What OAuth2 Providers Actually Validate:**
1. Client authentication (client_id and client_secret)
2. Client configuration and registration status
3. Requested scopes are allowed for the client
4. Token endpoint is properly configured

## Keycloak Configuration Example

```java
@Bean
public ClientRegistration keycloakClientRegistration() {
    return ClientRegistration.withRegistrationId("keycloak")
        .clientId("your-client-id")
        .clientSecret("your-client-secret")
        .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
        .authorizationGrantType(AuthorizationGrantType.CLIENT_CREDENTIALS)
        .scope("api:read", "api:write", "admin")
        .tokenUri("http://localhost:8080/realms/your-realm/protocol/openid-connect/token")
        .build();
}
```

## Token Caching Benefits

The integrated in-memory caching in `KeycloakTokenService` provides:

- **Reduced Network Calls**: Avoids repeated token requests to OAuth2 provider
- **Improved Performance**: Faster token retrieval for subsequent requests
- **Simple Implementation**: No external dependencies required
- **Automatic Expiration**: Tokens naturally expire when no longer valid

### Considerations

- **Application Restart**: Cached tokens are lost on application restart
- **Memory Usage**: Cache size grows with the number of different clients
- **Distributed Applications**: Each instance maintains its own cache
- **Token Expiration**: 60-second buffer ensures tokens are refreshed before actual expiration

For distributed applications or scenarios requiring persistence across restarts, consider using Redis or database-based token caching instead of in-memory storage.

Spring Security's client credentials flow support provides a secure and straightforward way to implement machine-to-machine authentication while following OAuth2 standards and security best practices.