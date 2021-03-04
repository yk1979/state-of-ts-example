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
          arrow_functions
          destructuring
          spread_operator
          nullish_coalescing
          optional_chaining
          private_fields
          proxies
          async_await
          promises
          decorators
          promise_all_settled
          dynamic_import
          maps
          sets
          typed_arrays
          array_prototype_flat
          big_int
          service_workers
          local_storage
          intl
          web_audio
          webgl
          web_animations
          webrtc
          web_speech
          webvr
          websocket
          fetch
          custom_elements
          shadow_dom
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
