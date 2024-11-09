---
name: The Depths Of The Hibernate Code
topic: hibernate
---

# The Depths Of The Hibernate Code

The first question that needs to be asked is what actually happens within Hibernate when, as shown in the previous
post, something like (`childrenSupplier.get();`) is called? Well, first of all, from an abstract point of view, an SQL
query is executed to the database. The interesting thing, however, is what happens afterward. All instances of the
entities are stored in the Persistence Context. This can be seen within the code as follows.

```
SessionImpl session = entityManager.unwrap(SessionImpl.class);
LOGGER.info("Before query: " + session.getPersistenceContext().getEntitiesByKey().size());

childrenSupplier.get();

LOGGER.info("After query: " + session.getPersistenceContext().getEntitiesByKey().size());
```

The unwrap method is used to convert an object of one type into another type, as long as the underlying implementation
supports it. In the context of JPA's EntityManager, it's used to expose the native or underlying class (in this case,
Hibernate's session) that the EntityManager instance is wrapping.
The [Session](https://github.com/hibernate/hibernate-orm/blob/6.3.1/hibernate-core/src/main/java/org/hibernate/Session.java)
is a Hibernate-specific interface that represents a single-threaded unit of work. It's similar to the EntityManager but
provides a richer set of functionalities.

Before (`childrenSupplier.get();`) is called, the size of the Persistence Context is 0; after the call, it contains a
certain number of entities. You can also see this clearly if you look at the code using the debugger.

<p class="post-image-container">
    <img class="post-image" src="/src/assets/comparison_pc.png" alt="Comparison of Persistence Context size">
</p>

But here again the question arises, if this list of objects is only run through once for a flush, it should not lead to
exorbitant runtimes even with significantly larger numbers of objects. So what happens in the background?


[//]: # (Dann muss gezeigt werden, was im Hintergrund passiert und wo die Laufzeit herkommt.)

[//]: # (Final müssen dann die Lösungen aufgezeigt werden.)

[//]: # (readOnly)

[//]: # (// TransactionAspectSupport:347)

[//]: # (SpringSessionSynchronization:93)

[//]: # (HibernateJpaDialect:204)