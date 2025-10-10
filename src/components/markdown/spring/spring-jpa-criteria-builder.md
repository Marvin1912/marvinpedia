---
id: 9
name: Criteria Builder
topic: hibernate
fileName: spring/spring-jpa-criteria-builder
---

# Criteria Builder

`CriteriaBuilder` is a factory class used to construct criteria queries, compound selections, expressions, predicates, and more.
It's fundamental to creating typesafe queries in Hibernate.

### Role of CriteriaQuery

CriteriaQuery is an object that defines a specific database query in terms of the Criteria API.

- **Select Clause**: Specifies the query's return type, which could be an entity, multiple entities, or a combination of
  attributes.
- **From Clause**: Defines the query roots and potentially joins between entity tables.
- **Where Clause**: Contains predicates specifying the conditions for selecting records.

### The Root Interface

The Root interface represents a starting point of a query and is a type-safe bean. Root is used to define the FROM clause of the
query and access attributes of the entity. It also supports joining other entities, allowing for complex queries that involve
multiple tables.

### Expressions and Predicates

Expressions represent query expressions, which can be used to define the selection criteria, sorting, and other query operations.
Expressions can be created using the `CriteriaBuilder` methods such as `equal`, `notEqual`, `greaterThan`, `lessThan`, etc.

- **Equal**: `cb.equal(root.get("attribute"), "value")`
- **Not Equal**: `cb.notEqual(root.get("attribute"), "value")`
- **Greater Than**: `cb.greaterThan(root.get("attribute"), 10)`
- **Less Than**: `cb.lessThan(root.get("attribute"), 10)`

Predicates are logical conditions that are used to filter the results of the query. Predicates can be combined using logical
operators like `and`, `or`, and `not`. They are created using the `CriteriaBuilder` methods and can be applied to the query using
the `where` clause.

- **Single Predicate**: `cb.equal(root.get("attribute"), "value")`
- **Combining Predicates**:
    - **And**: `cb.and(cb.equal(root.get("attribute1"), "value1"), cb.equal(root.get("attribute2"), "value2"))`
    - **Or**: `cb.or(cb.equal(root.get("attribute1"), "value1"), cb.equal(root.get("attribute2"), "value2"))`
    - **Not**: `cb.not(cb.equal(root.get("attribute"), "value"))`

## Steps to Create a Query

### A Simple One

```
// Obtain the CriteriaBuilder instance from the EntityManager to construct the query
CriteriaBuilder criteriaBuilder = em.getCriteriaBuilder();

// Create a CriteriaQuery object specifying the result type as Order
CriteriaQuery<Order> orderQuery = criteriaBuilder.createQuery(Order.class);

// Define the root entity for the query, which is the Order entity in this case
Root<Order> orderRoot = orderQuery.from(Order.class);

// Build a predicate to filter the results where the id of the Order is equal to 1
Predicate idPredicate = criteriaBuilder.equal(orderRoot.get("id"), 1);

// Build the query by selecting the root entity and applying the filter predicate
orderQuery.select(orderRoot)
    .where(idPredicate);

// Execute the query using the EntityManager and obtain the result list
List<Order> resultList = em.createQuery(orderQuery).getResultList();
```

### A Grouping Query

```
// Define a record to hold the result of the query
record OrderSummaryDTO(Order order, Long count) { }

// Obtain the CriteriaBuilder from the EntityManager
CriteriaBuilder criteriaBuilder = em.getCriteriaBuilder();

// Create a CriteriaQuery for the OrderSummaryDTO class
CriteriaQuery<OrderSummaryDTO> orderQuery = criteriaBuilder.createQuery(OrderSummaryDTO.class);

// Specify the root of the query, which is the Order entity
Root<Order> orderRoot = orderQuery.from(Order.class);

// Define a predicate to filter orders
Predicate valuePredicate = criteriaBuilder.equal(orderRoot.get("value"), 100169);

// Set up the query to select the order and count of orders, group by the order value, and apply the filter
orderQuery.multiselect(orderRoot, criteriaBuilder.count(orderRoot))
        .groupBy(orderRoot.get("value"))
        .having(valuePredicate);

// Execute the query and obtain the result list
List<OrderSummaryDTO> resultList = em.createQuery(orderQuery).getResultList();
```
