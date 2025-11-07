---
id: 18
name: Spring OAuth Client Token Handling
topic: spring
fileName: spring/spring-oauth-client-token-requests
---

# Spring OAuth Client Credentials Flow

Spring Security provides comprehensive support for the OAuth2 client credentials grant type, which is designed for machine-to-machine communication where no user context is involved. This guide covers the client-side perspective of obtaining OAuth2 tokens using the client credentials method.

## Core Client Components

### Spring Boot Auto-Configuration

Spring Boot automatically configures all OAuth2 client components when you provide the necessary properties. This eliminates the need for manual bean creation and follows Spring Boot's convention-over-configuration approach.

**Auto-Configured Components:**
- **ClientRegistrationRepository**: Automatically created from properties
- **OAuth2AuthorizedClientService**: Configured with appropriate storage implementation
- **AuthorizedClientServiceOAuth2AuthorizedClientManager**: Set up for background/scheduled operations
- **OAuth2AuthorizedClientProvider**: Configured for client credentials flow

**Property-Based Configuration Benefits:**
- **Zero Code Configuration**: No Java configuration classes needed
- **Environment-Specific Settings**: Easy to change configuration per environment
- **Security**: Secrets can be externalized and managed properly
- **Maintainability**: Configuration is centralized in properties files

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

### Spring Boot Configuration

With Spring Boot's auto-configuration, you can configure OAuth2 clients entirely through properties. No manual bean configuration is required.

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          keycloak:
            client-id: your-client-id
            client-secret: your-client-secret
            authorization-grant-type: client_credentials
            client-authentication-method: basic
            scope: read,write
        provider:
          keycloak:
            token-uri: http://localhost:8080/realms/your-realm/protocol/openid-connect/token
```

Spring Boot will automatically:
- Create the `ClientRegistrationRepository` bean
- Configure the `OAuth2AuthorizedClientService`
- Set up the `AuthorizedClientServiceOAuth2AuthorizedClientManager`
- Apply the client credentials provider

### Service Implementation

With Spring Boot's auto-configuration, you can directly inject the `OAuth2AuthorizedClientManager`:

```java
@Service
public class KeycloakTokenService {

    private final OAuth2AuthorizedClientManager authorizedClientManager;

    public KeycloakTokenService(OAuth2AuthorizedClientManager authorizedClientManager) {
        this.authorizedClientManager = authorizedClientManager;
    }

    public String obtainAccessToken() {
        Authentication principal = new UsernamePasswordAuthenticationToken("client-app", null);

        OAuth2AuthorizeRequest authorizeRequest = OAuth2AuthorizeRequest
            .withClientRegistrationId("keycloak")
            .principal(principal)
            .build();

        OAuth2AuthorizedClient authorizedClient =
            authorizedClientManager.authorize(authorizeRequest);

        return authorizedClient.getAccessToken().getTokenValue();
    }
}
```

**Note**: Spring Boot automatically creates the `OAuth2AuthorizedClientManager` bean when OAuth2 client properties are configured.

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

## Configuration Property Reference

### Client Registration Properties

For Keycloak configuration, use these properties in your `application.yml`:

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          keycloak:
            # Required: Client identifier from Keycloak
            client-id: ${KEYCLOAK_CLIENT_ID}
            # Required: Client secret from Keycloak
            client-secret: ${KEYCLOAK_CLIENT_SECRET}
            # Required: Use client credentials flow
            authorization-grant-type: client_credentials
            # Required: How to authenticate with token endpoint
            client-authentication-method: basic
            # Optional: Comma-separated list of scopes
            scope: api:read,api:write,admin
        provider:
          keycloak:
            # Required: Keycloak token endpoint URL
            token-uri: ${KEYCLOAK_TOKEN_URI:http://localhost:8080/realms/your-realm/protocol/openid-connect/token}
```

**Environment Variable Support:**
- `${KEYCLOAK_CLIENT_ID}`: Your Keycloak client ID
- `${KEYCLOAK_CLIENT_SECRET}`: Your Keycloak client secret
- `${KEYCLOAK_TOKEN_URI}`: Keycloak token endpoint URL

## Token Persistence and Caching

The `AuthorizedClientServiceOAuth2AuthorizedClientManager` automatically handles token persistence through the `OAuth2AuthorizedClientService`:

### Spring Boot Auto-Configuration Benefits

- **Automatic Token Management**: Tokens are automatically cached and reused until expiration
- **Zero Code Configuration**: No manual bean creation required
- **Environment Flexibility**: Easy to switch between different OAuth2 providers
- **Built-in Security**: Follows Spring Security best practices automatically
- **Production Ready**: Configured with appropriate defaults for client credentials flow

### Default Storage Implementation

Spring Boot automatically provides:

- **InMemoryOAuth2AuthorizedClientService**: Default storage for single-instance applications
- **Automatic Token Caching**: Tokens are cached until they expire
- **Smart Token Refresh**: Automatically requests new tokens when needed
- **Failure Handling**: Proper cleanup of invalid tokens

For distributed applications, you can easily override the storage implementation with JDBC or Redis-based solutions.

Spring Boot's auto-configuration approach provides a secure, maintainable, and production-ready way to implement OAuth2 client credentials flow while following industry best practices.