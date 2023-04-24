import { prepareWordsSetWithRanges, TreeNode } from "../src";

describe("prepareWordsSetWithRanges", () => {
  it("two with the same frequency", () => {
    expect(prepareWordsSetWithRanges(`hi\t1\nworld\t1`)).toEqual([
      { word: "hi", freq: 1, range: 1 },
      { word: "world", freq: 1, range: 2 },
    ]);
  });

  it("empty line is handled", () => {
    expect(prepareWordsSetWithRanges(`hi\t1\n`)).toEqual([
      { word: "hi", freq: 1, range: 1 },
    ]);
  });

  it("range reversed to freq", () => {
    expect(prepareWordsSetWithRanges(`a\t1\nb\t2\nc\t3`)).toEqual([
      { word: "c", freq: 3, range: 1 },
      { word: "b", freq: 2, range: 2 },
      { word: "a", freq: 1, range: 3 },
    ]);
  });

  it("inorder vs reverseOrder", () => {
    let root = null;
    root = TreeNode.insert(root, 1, "a");
    root = TreeNode.insert(root, 2, "b");

    expect(TreeNode.inorder(root, [])).toEqual([
      { word: "a", freq: 1, range: 1 },
      { word: "b", freq: 2, range: 2 },
    ]);

    expect(TreeNode.reverseOrder(root, [])).toEqual([
      { word: "b", freq: 2, range: 1 },
      { word: "a", freq: 1, range: 2 },
    ]);
  });
});
