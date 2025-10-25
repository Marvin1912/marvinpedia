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

### Token Service Implementation

```java
@Service
public class KeycloakTokenService {

    private final OAuth2AuthorizedClientManager authorizedClientManager;

    public KeycloakTokenService(OAuth2AuthorizedClientManager authorizedClientManager) {
        this.authorizedClientManager = authorizedClientManager;
    }

    public String obtainAccessToken(String clientId) {
        // The principal is mainly for Spring Security's internal tracking
        // For client credentials flow, OAuth2 providers typically ignore it
        Authentication principal = new UsernamePasswordAuthenticationToken("client-app", null);

        OAuth2AuthorizeRequest authorizeRequest = OAuth2AuthorizeRequest
            .withClientRegistrationId(clientId)
            .principal(principal)
            .build();

        OAuth2AuthorizedClient authorizedClient =
            authorizedClientManager.authorize(authorizeRequest);

        return authorizedClient.getAccessToken().getTokenValue();
    }

    public OAuth2AccessToken getAccessToken(String clientId) {
        Authentication principal = new UsernamePasswordAuthenticationToken("client-app", null);

        OAuth2AuthorizeRequest authorizeRequest = OAuth2AuthorizeRequest
            .withClientRegistrationId(clientId)
            .principal(principal)
            .build();

        OAuth2AuthorizedClient authorizedClient =
            authorizedClientManager.authorize(authorizeRequest);

        return authorizedClient.getAccessToken();
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

## Token Storage for Client Credentials

Since client credentials flow doesn't support refresh tokens, token management is simpler:

- **In-memory**: For simple applications with short-lived tokens
- **Database**: For caching tokens to avoid repeated requests
- **Redis**: For distributed applications needing token sharing

## Error Handling

Common client credentials errors and their handling:

### Invalid Client Credentials
- **Cause**: Incorrect client_id or client_secret
- **Solution**: Verify client registration with OAuth2 provider
- **HTTP Status**: 401 Unauthorized

### Invalid Scope
- **Cause**: Requested scopes not granted to client
- **Solution**: Update client registration or reduce scope requirements
- **HTTP Status**: 400 Bad Request

### Client Authentication Failed
- **Cause**: Client authentication method not supported or invalid
- **Solution**: Check client authentication configuration
- **HTTP Status**: 401 Unauthorized

### Token Request Failed
- **Cause**: Token endpoint unreachable or misconfigured
- **Solution**: Verify token URI and network connectivity
- **HTTP Status**: Various network/server errors

## Best Practices for Client Credentials Flow

1. **Use HTTPS** for all OAuth2 communications
2. **Store client secrets securely** (environment variables, secret management systems)
3. **Implement proper error handling** for OAuth2 failures
4. **Request minimum necessary scopes** to follow principle of least privilege
5. **Cache tokens appropriately** to reduce unnecessary token requests
6. **Monitor token expiration** and handle re-authentication gracefully
7. **Use service-to-service authentication** patterns for microservices
8. **Validate token audience and scope** when receiving tokens from OAuth2 provider

## Common Use Cases

The client credentials flow is ideal for:

- **Backend API communication** between microservices
- **Scheduled tasks** that need to access APIs
- **Daemon processes** and background jobs
- **CI/CD pipelines** that need to authenticate with services
- **Infrastructure services** that communicate with each other

Spring Security's client credentials flow support provides a secure and straightforward way to implement machine-to-machine authentication while following OAuth2 standards and security best practices.