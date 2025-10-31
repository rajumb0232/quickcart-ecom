package com.donkie.quickcart.shared.jpa;

import jakarta.persistence.metamodel.IdentifiableType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;
import java.util.Optional;

@NoRepositoryBean // prevents Spring from creating a bean for this interface
public interface CustomJpaRepository<T, ID> extends JpaRepository<T, ID>, JpaSpecificationExecutor<T> {

    // Get a single record only if active and not deleted
    default Optional<T> findActiveById(ID id) {
        return findOne((root, q, cb) -> {
            var identifiable = (IdentifiableType<T>) root.getModel();
            var idAttr = identifiable.getId(id.getClass());
            return cb.and(
                    cb.equal(root.get(idAttr.getName()), id),
                    cb.isTrue(root.get("lifecycleAudit").get("active")),
                    cb.isFalse(root.get("lifecycleAudit").get("deleted"))
            );
        });
    }

    // Get all active, non-deleted records
    default List<T> findAllActive() {
        return findAll((root, q, cb) -> cb.and(
                cb.isTrue(root.get("lifecycleAudit").get("isActive")),
                cb.isFalse(root.get("lifecycleAudit").get("isDeleted"))
        ));
    }
}
