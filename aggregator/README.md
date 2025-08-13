# LeetCode Patterns Aggregator Parser

Simple program to load and parse leetcode problems and aggregate sources of
problems (lists) and companies info, by [Leetcode Company wise Problems Lists](https://github.com/liquidslr/leetcode-company-wise-problems)

The program uses environment variables to search for files, check the `.env`
file.

The `LEETCODE_PROBLEMS_PATH` contains a json of all leetcode problems available.

<details>
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "title": {
      "type": "string"
    },
    "difficulty": {
      "type": "string"
    },
    "premium": {
      "type": "boolean"
    },
    "url": {
      "type": "string"
    },
    "topics": {
      "type": "array",
      "items": [
        {
          "type": "string"
        },
        {
          "type": "string"
        }
      ]
    }
  },
  "required": [
    "id",
    "title",
    "difficulty",
    "premium",
    "url",
    "topics"
  ]
}
</details>

The `SOURCES_DIR_PATH` contains lists of LeetCode problems.

The `COMPANIES_DIR_PATH` contains csv files from [Leetcode Company wise Problems Lists](https://github.com/liquidslr/leetcode-company-wise-problems), split by company and by frequency.

The `LAST_COMPANIES_UPDATE_DATE` has a `YYYY-MM-DD` date that represents the
last date that the companies csv info was updated.

The `PROBLEMS_OUTPUT_PATH ` will contain the main output file, problems from
the sources with companies that asked them in interviews.

The `DATE_OUTPUT_PATH` will contain the dates file, used by the [web app](https://github.com/pgvi/lc-patterns-aggregator/tree/master/web) to avoid unnecessary updates.
