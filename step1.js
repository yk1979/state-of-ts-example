const exampleDataSet = [
  {
    id: "destructuring",
    name: "Destructuring",
    experience: {
      latestYearData: {
        total: 23765,
        completion: {
          count: 22814,
          percentage: 96
        },
        buckets: [
          {
            count: 20332,
            percentage: 89.1
          },
          {
            count: 1426,
            percentage: 6.3
          },
          {
            count: 1056,
            percentage: 4.6
          }
        ]
      }
    }
  },
  {
    id: "spread_operator",
    name: "Spread Operator",
    experience: {
      latestYearData: {
        total: 23765,
        completion: {
          count: 22753,
          percentage: 95.7
        },
        buckets: [
          {
            count: 21107,
            percentage: 92.8
          },
          {
            count: 1147,
            percentage: 5
          },
          {
            count: 499,
            percentage: 2.2
          }
        ]
      }
    }
  }
]; // 後で本物のデータに差し替える

// bukectsの3番目の比率が、minより大きいデータを抽出する
function filterWithNeverHeardIt(dataset, min) {
  return dataset.filter(data => {
    return data.experience.latestYearData.bukets[2].percentage >= min;
  });
}

console.log(filterWithNeverHeardIt(exampleDataSet, 3).map(item => item.name));
