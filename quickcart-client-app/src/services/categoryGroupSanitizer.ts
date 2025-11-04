import type { Category, categoryGroup } from "../types/productTypes";

/**
 * Resolve preSelected names into Category objects (level1/level2/level3)
 * Follows rules:
 * 1) If any preSelected string matches a level1 -> pick that L1 (first match).
 *    Then if preSelected contains an L2 that is a child of chosen L1, pick it.
 *    Then if preSelected contains an L3 that is a child of chosen L2, pick it.
 * 2) Else if no L1 found, and exactly one unique L2 is present in preSelected -> pick that L2 and its parent L1.
 *    If preSelected also contains an L3 that is child of that L2, pick it too.
 * 3) Else if multiple L2 present, but exactly one unique L3 present -> pick that L3 and its parents.
 * 4) Otherwise return nulls.
 */
export function sanitizeCategorySelection(
  categories: Category[],
  preSelected: string[]
): categoryGroup {
  const norm = (s?: string | null) => (s ?? "").trim().toLowerCase();

  // helpers
  const findByName = (list: Category[] | undefined | null, name: string): Category | null => {
    if (!list || !name) return null;
    const target = norm(name);
    return list.find((c) => norm(c.name) === target) ?? null;
  };

  const childrenOf = (node?: Category | null): Category[] =>
    (node?.child_category ?? []) as Category[];

  // split categories by level
  const level1Cats = categories.filter((c) => c.category_level === 1);
  const level2Cats = categories.filter((c) => c.category_level === 2);
  const level3Cats = categories.filter((c) => c.category_level === 3);

  // normalize preSelected to lowercase trimmed unique values
  const pre = Array.from(new Set((preSelected ?? []).map(norm).filter(Boolean)));

  // helper: find pre items that exist in a list (by name)
  const findMatchesIn = (list: Category[]) =>
    pre.filter((p) => list.some((c) => norm(c.name) === p));

  // 1) Look for level-1 matches
  const preLevel1 = findMatchesIn(level1Cats);
  if (preLevel1.length > 0) {
    const chosenL1Name = preLevel1[0];
    const selL1 = findByName(level1Cats, chosenL1Name);
    if (!selL1) return { level1: null, level2: null, level3: null };

    // check for level-2 in pre that belongs to selL1
    const l2Candidates = childrenOf(selL1);
    const preLevel2UnderL1 = pre.filter((p) => l2Candidates.some((c) => norm(c.name) === p));
    const selL2 = preLevel2UnderL1.length > 0 ? findByName(l2Candidates, preLevel2UnderL1[0]) : null;

    // if selL2 found, check for level-3 under it
    let selL3: Category | null = null;
    if (selL2) {
      const l3Candidates = childrenOf(selL2);
      const preLevel3UnderL2 = pre.filter((p) => l3Candidates.some((c) => norm(c.name) === p));
      if (preLevel3UnderL2.length > 0) {
        selL3 = findByName(l3Candidates, preLevel3UnderL2[0]);
      }
    }

    return { level1: selL1, level2: selL2, level3: selL3 };
  }

  // 2) No L1 found -> look for unique L2 match across tree
  const preLevel2 = findMatchesIn(level2Cats);
  if (preLevel2.length === 1) {
    const selL2 = findByName(level2Cats, preLevel2[0]);
    if (selL2) {
      // find its parent L1
      let parentL1: Category | null = null;
      for (const l1 of level1Cats) {
        if (childrenOf(l1).some((c) => c.category_id === selL2.category_id)) {
          parentL1 = l1;
          break;
        }
      }

      // check for L3 in pre that belongs to this L2
      let selL3: Category | null = null;
      const l3Candidates = childrenOf(selL2);
      const preLevel3UnderL2 = pre.filter((p) => l3Candidates.some((c) => norm(c.name) === p));
      if (preLevel3UnderL2.length > 0) {
        selL3 = findByName(l3Candidates, preLevel3UnderL2[0]);
      }

      return { level1: parentL1, level2: selL2, level3: selL3 };
    }
  }

  // 3) multiple L2 matches -> try unique L3
  const preLevel3 = findMatchesIn(level3Cats);
  if (preLevel3.length === 1) {
    const selL3 = findByName(level3Cats, preLevel3[0]);
    if (selL3) {
      // find its parent L2 and grandparent L1
      let parentL2: Category | null = null;
      let grandL1: Category | null = null;
      for (const l1 of level1Cats) {
        for (const l2 of childrenOf(l1)) {
          if (childrenOf(l2).some((c) => c.category_id === selL3.category_id)) {
            parentL2 = l2;
            grandL1 = l1;
            break;
          }
        }
        if (parentL2 && grandL1) break;
      }
      return { level1: grandL1, level2: parentL2, level3: selL3 };
    }
  }

  // fallback: nothing unique found
  return { level1: null, level2: null, level3: null };
}
