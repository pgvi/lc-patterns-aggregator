package main

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	exitOnError(err)

	leetCodeProblemsPath := os.Getenv("LEETCODE_PROBLEMS_PATH")
	sourcesDirPath := os.Getenv("SOURCES_DIR_PATH")

	problems, err := loadProblems(leetCodeProblemsPath)
	exitOnError(err)

	fullSources, err := loadLists(sourcesDirPath)
	exitOnError(err)

	aggregate, err := AggregateProblemsAndSources(problems, fullSources)
	exitOnError(err)

	companiesDirPath := os.Getenv("COMPANIES_DIR_PATH")
	err = InsertCompaniesIntoAggregate(aggregate, companiesDirPath)
	exitOnError(err)

	problemsOutputPath := os.Getenv("PROBLEMS_OUTPUT_PATH")
	err = saveAggregate(*aggregate, problemsOutputPath)
	exitOnError(err)

	lastCompaniesUpdate := os.Getenv("LAST_COMPANIES_UPDATE_DATE")
	dateOutputPath := os.Getenv("DATE_OUTPUT_PATH")
	err = saveUpdateDates(lastCompaniesUpdate, dateOutputPath)
	exitOnError(err)
}

func exitOnError(err error) {
	if err != nil {
		fmt.Fprintf(os.Stderr, err.Error())
		os.Exit(1)
	}
}
