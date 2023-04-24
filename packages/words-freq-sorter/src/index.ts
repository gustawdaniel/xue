interface RangedWord {
  word: string;
  freq: number;
  range: number;
}

export class TreeNode {
  public freq: number;
  public count: number;
  public words: Set<string>;
  public left: null | TreeNode;
  public right: null | TreeNode;

  constructor(word: string) {
    this.freq = 0;
    this.count = 0;
    this.left = null;
    this.right = null;
    this.words = new Set<string>([word]);
  }

  static newNode(item: number, word: string) {
    const temp = new TreeNode(word);
    temp.freq = item;
    temp.left = temp.right = null;
    temp.count = 1;
    return temp;
  }

  static inorder(root: null | TreeNode, arr: RangedWord[]) {
    if (root != null) {
      TreeNode.inorder(root.left, arr);

      arr.push(
        ...[...root.words.values()].map((word, index) => ({
          word,
          freq: root.freq,
          range: arr.length + index + 1,
        }))
      );

      TreeNode.inorder(root.right, arr);
    }

    return arr;
  }

  static reverseOrder(root: null | TreeNode, arr: RangedWord[]) {
    if (root != null) {
      TreeNode.reverseOrder(root.right, arr);

      arr.push(
        ...[...root.words.values()].map((word, index) => ({
          word,
          freq: root.freq,
          range: arr.length + index + 1,
        }))
      );

      TreeNode.reverseOrder(root.left, arr);
    }

    return arr;
  }

  static insert(node: TreeNode | null, freq: number, word: string) {
    if (node == null) return TreeNode.newNode(freq, word);

    if (freq == node.freq) {
      node.count++;
      node.words.add(word);
      return node;
    }

    if (freq < node.freq) node.left = TreeNode.insert(node.left, freq, word);
    else node.right = TreeNode.insert(node.right, freq, word);

    return node;
  }
}

export function prepareWordsSetWithRanges(payload: string): Array<RangedWord> {
  let root: TreeNode | null = null;
  for (const line of payload.split("\n")) {
    const parts = line.split("\t");
    const [word, freq] = [parts[0], Number(parts[1])];
    if (!word.length || !Number.isFinite(freq)) continue;
    root = TreeNode.insert(root, freq, word);
  }

  return TreeNode.reverseOrder(root, []);
}
