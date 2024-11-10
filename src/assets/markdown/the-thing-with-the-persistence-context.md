---
name: The Thing With The Persistence Context
topic: hibernate
---

# The Thing With The Persistence Context

The Hibernate Persistence Context is a central component of Hibernate and plays a crucial role in dealing
with
entity objects - the instances of classes that represent database tables in a Java application. The
Persistence Context serves as a kind of cache and management layer between the Java application and the
database. A key point of the Hibernate Persistence Context is its function as a cache for the entity
instances that are loaded or saved during a transaction. This cache reduces the number of database accesses
required by reusing already loaded entities instead of reloading them from the database each time they are
accessed. It also ensures that there is at most one entity instance for each database row within a session.
If an entity is loaded multiple times, Hibernate returns the same instance instead of creating a new one. In
combination with this, the Persistence Context is used to track changes to the managed entity instances.
When a transaction is committed, these changes are automatically transferred to the database (flush). This
makes it possible to collect changes to entities in a transaction and to persist them efficiently as a
unit.

Another key functionality that is closely linked to the concept of the Persistence Context is the dirty check
mechanism. It serves to increase efficiency when updating data in the database, but can also pose certain
challenges. First of all, the dirty check mechanism enables Hibernate to automatically recognize which
entities have been changed since the last read or save operation. This capability is central to the way the
Persistence Context works, as it eliminates the need to manually track changes to entities or write explicit
update statements for every small change. The focus is also on optimizing database operations. By
recognizing changed entities, Hibernate can specifically write only the data that has actually been changed
to the database. This minimizes the number of database operations and can improve performance by minimizing
I/O, especially in applications with a high number of entities and transactions.

An often underestimated problem in connection with dirty checks is the loss of performance. Tracking changes
and comparing states (to identify dirty entities) can itself consume resources. With a large number of
entities or complex entity structures, the overhead of the dirty check can have a negative impact on
application performance. Before solutions can be proposed, it is first necessary to understand when and
under what circumstances Hibernate performs dirty checks. There are several scenarios in which Hibernate
triggers a dirty check, but the most obvious and probably most common reason is
the [flush before the commit](https://vladmihalcea.com/the-anatomy-of-hibernate-dirty-checking/)
of a transaction. The influence that such a dirty check can have per existing entity is shown in the following graphic,
whereby a parent entity object with 250 child entity objects was created in each of the 150 runs, resulting in a total
of 37,500 objects within the database in the last run.

<p class="post-image-container">
    <img class="post-image" src="/src/assets/pc_entity_dirty_check.png" alt="Dirty checks of entities">
</p>

The data was created by the initial retrieval of a set of entities that were included in the persistence context through
this very process and thus became relevant for the dirty checks. The corresponding code is briefly presented in the
following form.

```
@Transactional(Transactional.TxType.REQUIRED)
public long fetchDataEntity() {
    return fetchDataEntity(childEntityRepository::findAll);
}

private <T> long fetchDataEntity(Supplier<List<T>> childrenSupplier) {

    childrenSupplier.get();

    final Instant start = Instant.now();
    final List<Integer> ids = parentEntityRepository.getAllIds();
    for (final Integer id : ids) {
        parentEntityRepository.existsById(id);
        parentEntityRepository.findById(id);
        parentEntityRepository.getReferenceById(id);
    }

    return Duration.between(start, Instant.now()).toMillis();
}
```

You can clearly see that no `flush()` is executed by Hibernate here. At least not by any obvious
operation on an object that can be seen here. This is due to the fact that it is specified within
the [Jakarta Persistence 3.0](https://jakarta.ee/specifications/persistence/3.0/jakarta-persistence-spec-3.0) that the
state of persistent entities is synchronized to the database at transaction
commit ([described here](https://jakarta.ee/specifications/persistence/3.0/jakarta-persistence-spec-3.0#a11797)). The
transaction commit takes place here at the end of the ```fetchDataEntity()``` method, recognizable by the
corresponding ```@Transactional``` annotation. The annotation (including ```TxType.REQUIRED```) indicates that the
method must be executed within a transaction context. If the method is called outside a transaction context, a new
transaction context must be started. If the method is called within a transaction context, the execution of the method
is simply continued in this context.

To clarify the temporal influence of the dirty checks, the call to query the children (`childrenSupplier.get();`)
was removed and thus a large part of the entities were removed from the process and thus also from the sphere of
influence of the Persistence Context and the dirty checks. The influence of the entities within the Persistence
Context is clearly shown in the following graphic.

<p class="post-image-container">
    <img class="post-image" src="/src/assets/pc_entity_dirty_check_clean.png" alt="Dirty checks of entities">
</p>

However, the following question remains: **If a ```flush()``` and thus a one-time dirty check is only executed at the
end of a transaction, i.e. in this case at the end of the method, why does the runtime increase so massively, if the
child entities are present in the persistence context?**
(F.e. an iteration over 125,500 objects takes 0.95ms on average only.)

The answer to this behavior [lies in the depths of the Hibernate code](/marvinpedia/wiki/hibernate/the-depths-of-the-hibernate-code)...
