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

### AuthorizedClientServiceOAuth2AuthorizedClientManager

This implementation of `OAuth2AuthorizedClientManager` is specifically designed to operate outside of HTTP request contexts (e.g., in background threads, scheduled jobs, or service-tier components). It uses an `OAuth2AuthorizedClientService` to persist and retrieve authorized clients.

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
    public OAuth2AuthorizedClientService authorizedClientService(
            ClientRegistrationRepository clientRegistrationRepository) {
        return new InMemoryOAuth2AuthorizedClientService(clientRegistrationRepository);
    }

    @Bean
    public OAuth2AuthorizedClientManager authorizedClientManager(
            ClientRegistrationRepository clientRegistrationRepository,
            OAuth2AuthorizedClientService authorizedClientService) {

        OAuth2AuthorizedClientProvider authorizedClientProvider =
            OAuth2AuthorizedClientProviderBuilder.builder()
                .clientCredentials()
                .build();

        AuthorizedClientServiceOAuth2AuthorizedClientManager authorizedClientManager =
            new AuthorizedClientServiceOAuth2AuthorizedClientManager(
                clientRegistrationRepository, authorizedClientService);
        authorizedClientManager.setAuthorizedClientProvider(authorizedClientProvider);

        return authorizedClientManager;
    }
}
```

### Service Implementation

```java
@Service
public class KeycloakTokenService {

    private final OAuth2AuthorizedClientManager authorizedClientManager;

    public KeycloakTokenService(OAuth2AuthorizedClientManager authorizedClientManager) {
        this.authorizedClientManager = authorizedClientManager;
    }

    public String obtainAccessToken(String clientId) {
        Authentication principal = new UsernamePasswordAuthenticationToken("client-app", null);

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

## Token Persistence and Caching

The `AuthorizedClientServiceOAuth2AuthorizedClientManager` automatically handles token persistence through the `OAuth2AuthorizedClientService`:

### Built-in Persistence Benefits

- **Automatic Token Storage**: Tokens are automatically saved in the authorized client service
- **Token Reuse**: Valid tokens are retrieved from storage instead of requesting new ones
- **Spring Security Integration**: Follows Spring Security's standard patterns and lifecycle management
- **Automatic Cleanup**: Invalid tokens are automatically removed during authorization failures

### Default Behavior

- **Success Handler**: Automatically saves authorized clients in the `OAuth2AuthorizedClientService`
- **Failure Handler**: Removes invalid authorized clients (e.g., when refresh tokens expire)
- **Context Mapping**: Properly handles OAuth2 scopes and authorization context

### Service Implementation Options

- **InMemoryOAuth2AuthorizedClientService**: Simple in-memory storage (default)
- **JdbcOAuth2AuthorizedClientService**: Database persistence for distributed applications
- **Custom implementations**: Redis or other external storage solutions

Spring Security's client credentials flow provides a secure and straightforward way to implement machine-to-machine authentication while following OAuth2 standards and security best practices.