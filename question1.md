# State of JavaScript Features with TypeScript

## はじめに

ある穏やかな日のこと、社内でも指折りの敏腕フロントエンジニアであるあなたは、今日のランチに何を食べようかと思いを巡らせていました。そこへボスから突然リモートミーティングの Call が。コイツがいきなり Call してきて良い話をしたためしがありません。あなたは居留守を使いたい気持ちを懸命にこらえつつ、ボスとのミーティングを開始しました。

**ボス: 「なんかさー、最近の JavaScript API がどれくらい利用されてるかについて、レポート書いてくれって言われちゃったんだよー」**

**ボス: 「調査データは何とかなりそうなんだけど、レポートに貼り付けるグラフを作らなきゃいけなくって。そういうの得意でしょ？チャチャっとやっちゃってくんない？」**

**ボス: 「細かい要件は後でチャットするから。大丈夫大丈夫、俺が集計用のスクリプトほとんど書いておいたから、あと残りちょっと書き足すだけだし！」**

こういう場合に限って、「残りちょっと」であったことは無いのですが、ボスに歯向かっても仕方ありませんね。

**ボス: 「あ、良い忘れてた。30 分で終わらせてね。すぐ使いたいから」**

それだけ言うと、一方的にボスは通話を切ってしまいました。

無茶振りもいいところですが、幸いにも別の案件で利用した TypeScript 製のグラフライブラリが利用できそうです。これを使って、このタスクをとっとと終わらせて美味しいランチに向かうことにしましょう。

さぁ今すぐに JSON に色をつける仕事に取り掛かるんだ！

---

## やりたいこと

ボスがミーティング中に表示していた「こんなのが欲しいんだよねー」という雑なイメージです。

![](question1.md)

---

## Step 1

まずは[ボスの書きかけたスクリプトの書き残し部分](https://tsplay.dev/wOaarm)を完成させてください（リンクをクリックすると TypeScript Playground上で下記のコードが開きます）。

コンソールに次のように出力されるよう、コードを修正しましょう。

```json
["Proxies", "Custom Elements"]
```

**注意! ボスの書いたスクリプトはどうやらエラーがあるようで、実行してもちゃんと動きません！** こういうときこそ「急がば回れ」です。まずはこのコードを TypeScript 化して型をつけて、エラーがこれ以上発生しないようにしましょう。

```js
const exampleDataSet = [
  {
    id: "proxies",
    name: "Proxies",
    experience: {
      latestYearData: {
        total: 23765,
        completion: {
          count: 22279,
          percentage: 93.7
        },
        buckets: [
          {
            count: 8701,
            percentage: 39.1
          },
          {
            count: 8604,
            percentage: 38.6
          },
          {
            count: 4974,
            percentage: 22.3
          }
        ]
      }
    }
  },
  {
    id: "fetch",
    name: "Fetch",
    experience: {
      latestYearData: {
        total: 23765,
        completion: {
          count: 21957,
          percentage: 92.4
        },
        buckets: [
          {
            count: 19121,
            percentage: 87.1
          },
          {
            count: 1853,
            percentage: 8.4
          },
          {
            count: 983,
            percentage: 4.5
          }
        ]
      }
    }
  },
  {
    id: "custom_elements",
    name: "Custom Elements",
    experience: {
      latestYearData: {
        total: 23765,
        completion: {
          count: 21952,
          percentage: 92.4
        },
        buckets: [
          {
            count: 7728,
            percentage: 35.2
          },
          {
            count: 7342,
            percentage: 33.4
          },
          {
            count: 6882,
            percentage: 31.4
          }
        ]
      }
    }
  }
]; // 後で本物のデータに差し替える

function filterDataset(dataSet) {
  // bucketsの要素は、その技術要素を「使ったことがある, 使ったことは無いが何かは知っている, 何のことか知らない」と回答した人の人数と割合を表している
  // ここでは「何のことかしらない」と回答した人の比率が15% 以上のデータに絞り込む
  const filtered = dataSet.filter(data => {
    return data.experience.latestYearData.bucket[2].percentage >= 15;
  });

  // TODO 後でソートする!!
  return filtered;
}

function main() {
  console.log(filterDataset(exampleDataSet).map(item => item.name));
}

main();
```

---

## Step 2

集計したデータを、グラフライブラリで描画できるようにしましょう。

- 実際のライブラリの代わりに、以下のコードを書き足してください
- `renderBarGraph` 関数の中身を気にする必要は**ありません**。型定義だけを読みましょう
- `(dataSet: DataItem) => GraphItem[]` となるような関数 `mapToGraphItem` を作成してください
- 色は CSS で利用可能な文字列（e.g. `red`, `#ee0000` ）が代入できます。好きな色を指定してください

```ts
/**
 *
 * 棒グラフ1つ分の情報を格納します
 *
 */
type GraphItem = {
  id: string;
  label: string;
  counts: {
    color: string;
    count: number;
  }[];
};

/**
 *
 * 与えられたデータを元に割合を棒グラフとして描画します。
 *
 * @param data: @see GraphItem 型の配列。この配列の要素の個数分の棒グラフを描画します。
 * @returns グラフが描画されたSVG要素のHTML文字列
 *
 **/
function renderBarGraph(data: GraphItem[]) {
  const renderItems = data.map(d => {
    const allCounts = d.counts.reduce((s, r) => s + r.count, 0);
    if (allCounts === 0) throw new Error(`invalid data: ${d.label}`);
    return {
      ...d,
      rates: d.counts.map(r => ({ ...r, rate: r.count / allCounts }))
    };
  });
  const groups = renderItems
    .map((item, i) => {
      const rects = item.rates.reduce(
        ([svg, w], { rate, color }) =>
          [
            `${svg}<rect x="${w}" y="${i * 40}" height="25" width="${
              rate * 100
            }" fill="${color}" />`,
            w + rate * 100
          ] as [string, number],
        ["", 0] as [string, number]
      );
      return `
        <g>
          <g transform="scale(3.0,1.0)">
            ${rects}
          </g>
          <text x="340" y="${i * 40 + 18}" fill="currentColor">${
        item.label
      }</text>
        </g>
      `;
    })
    .join("");
  return `<svg height="${
    renderItems.length * 40
  }" width="100%">${groups}</svg>`;
}
```

---

## Step 3

`exampleDataSet` の代わりに、本物のデータを利用するようにしましょう。

`fetch` API を使って、以下の URL から JSON データを取得するように変更してください。

- JSON データの格納先: https://raw.githubusercontent.com/Quramy/state-of-ts-example/main/data/features-data.json

JSON データを取得できるようになったら、 取得したデータに `filterDataset` 関数, `mapToGraphItem` を作用させてグラフ（SVG 文字列）を取得し、その結果を `console.log` で確認してみましょう。

```ts
const filtered = filterDataset(dataSet);
const graph = renderBarGraph(mapToGraphItem(filtered));
console.log(graph);
```

---

無事グラフが描画されましたか？ 最後に Playground の URL をボスに送りつけてやりましょう。お疲れさまでした！
