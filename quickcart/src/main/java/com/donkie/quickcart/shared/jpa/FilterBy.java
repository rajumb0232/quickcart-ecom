package com.donkie.quickcart.shared.jpa;

import org.springframework.data.jpa.domain.Specification;

public final class FilterBy {
    private FilterBy() {} // utility class

    public static <T> Specification<T> active() {
        return (root, query, cb) ->
                cb.and(
                        cb.isTrue(root.get("lifecycleAudit").get("isActive")),
                        cb.isFalse(root.get("lifecycleAudit").get("isDeleted"))
                );
    }

    public static <T> Specification<T> deleted() {
        return (root, query, cb) ->
                cb.isTrue(root.get("lifecycleAudit").get("isDeleted"));
    }

    public static <T> Specification<T> orphaned() {
        return (root, query, cb) ->
                cb.isTrue(root.get("lifecycleAudit").get("isOrphan"));
    }

    public static <T> Specification<T> createdBy(String username) {
        return (root, query, cb) ->
                cb.equal(root.get("lifecycleAudit").get("createdBy"), username);
    }
}
