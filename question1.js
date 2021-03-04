const exampleDataSet = [
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

console.log(filterDataset(exampleDataSet).map(item => item.name));
