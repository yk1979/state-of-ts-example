/**
 *
 * 棒グラフ1つ分の情報を格納します
 *
 */
export type GraphItem = {
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
export function renderBarGraph(data: GraphItem[]) {
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