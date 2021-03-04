import path from "path";
import fs from "fs/promises";
import { request, gql } from "graphql-request";
import { GetLocaleData } from "./__generated__/get-locale-data";

const ToolExperienceFragment = gql`
  fragment ToolExperienceFragment on ToolExperience {
    latestYearData: year(year: 2020) {
      total
      awarenessUsageInterestSatisfaction {
        awareness
        usage
        interest
        satisfaction
      }
      completion {
        count
        percentage
      }
    }
  }
`;

const FeatureExpeienceFragment = gql`
  fragment FeatureExpeienceFragment on FeatureExperience {
    latestYearData: year(year: 2020) {
      total
      completion {
        count
        percentage
      }
      buckets {
        count
        percentage
      }
    }
  }
`;

const query = gql`
  ${FeatureExpeienceFragment}
  ${ToolExperienceFragment}
  query GetLocaleData {
    survey(survey: state_of_js) {
      totals {
        year(year: 2020)
      }
      featuresData: features(
        ids: [
          destructuring
          spread_operator
          nullish_coalescing
          optional_chaining
          private_fields
          proxies
        ]
      ) {
        id
        name
        experience {
          ...FeatureExpeienceFragment
        }
      }
      toolsData: tools(ids: [typescript, elm, clojurescript, reason]) {
        id
        USA: experience(filters: { country: { in: [USA] } }) {
          ...ToolExperienceFragment
        }
        JPN: experience(filters: { country: { in: [JPN] } }) {
          ...ToolExperienceFragment
        }
        entity {
          name
          description
          homepage
          github {
            url
          }
        }
      }
    }
  }
`;

async function fetchData() {
  const data = await request<GetLocaleData>(
    "http://api.stateofjs.com/graphql",
    query
  );
  const featuresData = data?.survey?.featuresData;
  await fs.writeFile(
    path.resolve(__dirname, "../data/features-data.json"),
    JSON.stringify(featuresData, null, 2),
    "utf8"
  );
}

fetchData();
