type Item = {
  id: string;
  name: string;
  experience: {
    latestYearData: {
      total: number;
      completion: {
        count: number;
        percentage: number;
      };
      buckets: { count: number; percentage: number }[];
    };
  };
};

async function fetchData() {
  const realData = require('./data/features-data.json') as Item[];
  return realData;
}

const exampleDataSet: Item[] = [
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
];

// bukectsの3番目の比率が、minより大きいデータを抽出する
function filterWithNeverHeardIt(dataset: Item[], min: number) {
  return dataset.filter(data => {
    return data.experience.latestYearData.buckets[2].percentage >= min;
  });
}

function compareItems(item1: Item, item2: Item) {
  return item2.experience.latestYearData.buckets[2].percentage - item1.experience.latestYearData.buckets[2].percentage;
}

type GraphItem = {
  label: string;
};

// console.log(filterWithNeverHeardIt(exampleDataSet, 3).map(item => item.name));
