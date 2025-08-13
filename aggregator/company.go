package main

import (
	"encoding/csv"
	"io"
	"os"
	"path/filepath"
	"slices"
	"strings"
)

type Company struct {
	Name      string      `json:"name"`
	Frequency []Frequency `json:"frequency"`
}

type Frequency string

const (
	Last30Days      Frequency = "last30Days"
	Last90Days      Frequency = "last90Days"
	Last180Days     Frequency = "last180Days"
	MoreThan180Days Frequency = "moreThan180days"
	All             Frequency = "all"
	csvURLIndex               = 4
)

var matchToFrequency = map[string]Frequency{
	"All":                  All,
	"Thirty Days":          Last30Days,
	"Three Months":         Last90Days,
	"Six Months":           Last180Days,
	"More Than Six Months": MoreThan180Days,
}

type CompanyAggregate struct {
	Name      string             `json:"name"`
	Frequency map[Frequency]bool `json:"frequency"`
}

type CompaniesAccumulator struct {
	aggregate            *LCAggregated
	companiesPresent     map[string]bool
	companiesCSVsDirPath string
	urlToProblem         map[string]*AggregatedProblem
	urlToCompany         map[string]map[string]CompanyAggregate
}

func InsertCompaniesIntoAggregate(aggregate *LCAggregated, companiesCSVsDirPath string) error {
	// TODO: Extract into mapping
	urlToProblem := map[string]*AggregatedProblem{}

	for _, p := range aggregate.Problems {
		urlKey := strings.Trim(p.URL, "/")
		urlToProblem[urlKey] = &p
	}

	acc := CompaniesAccumulator{
		aggregate,
		map[string]bool{},
		companiesCSVsDirPath,
		urlToProblem,
		map[string]map[string]CompanyAggregate{},
	}

	// TODO: Extract
	dirs, err := os.ReadDir(companiesCSVsDirPath)
	if err != nil {
		return err
	}

	currentCompany := ""
	for _, dirEntry := range dirs {
		currentCompany = dirEntry.Name()
		companyDir, err := os.ReadDir(filepath.Join(companiesCSVsDirPath, currentCompany))
		if err != nil {
			return err
		}
		for _, csvFile := range companyDir {
			freq := strings.Trim(strings.Split(csvFile.Name(), ".")[1], " ")
			problemURLs, err := extractURLProblems(filepath.Join(companiesCSVsDirPath, currentCompany, csvFile.Name()))
			if err != nil {
				return err
			}

			acc.processLines(problemURLs, currentCompany, matchToFrequency[freq])
		}
	}

	companies := []string{}
	for c := range acc.companiesPresent {
		companies = append(companies, c)
	}
	slices.Sort(companies)
	acc.aggregate.Companies = companies
	acc.aggregate.Problems = acc.parseCompaniesProblems()
	return nil
}

func (acc CompaniesAccumulator) parseCompaniesProblems() []AggregatedProblem {
	for url, company := range acc.urlToCompany {
		p := acc.urlToProblem[url]

		companies := []Company{}
		for _, a := range company {
			frequencies := []Frequency{}
			for f := range a.Frequency {
				frequencies = append(frequencies, f)
			}
			companies = append(companies, Company{a.Name, frequencies})
		}

		p.Companies = companies
	}

	problems := []AggregatedProblem{}
	for _, v := range acc.urlToProblem {
		problems = append(problems, *v)
	}
	return problems
}

func (acc *CompaniesAccumulator) processLines(
	problemURLs []string,
	currentCompany string,
	freq Frequency,
) {
	for _, url := range problemURLs {
		// NOTE: Check if problem is available from sources, otherwise ignore
		if _, present := acc.urlToProblem[url]; !present {
			continue
		}

		// NOTE: Check if problem has entry
		companies, present := acc.urlToCompany[url]
		if !present {
			acc.urlToCompany[url] = map[string]CompanyAggregate{}
			companies = acc.urlToCompany[url]
		}

		// NOTE: Update company frequency entry in this problem
		company, present := companies[currentCompany]
		if !present {
			companies[currentCompany] = CompanyAggregate{currentCompany, map[Frequency]bool{}}
			company = companies[currentCompany]
		}

		// TODO: Move companies present logic into parseCompaniesProblems
		acc.companiesPresent[currentCompany] = true
		company.Frequency[freq] = true
		company.Frequency[All] = true
		// TODO: Fill only urlToCompany
	}
}

func extractURLProblems(csvPath string) ([]string, error) {
	f, err := os.Open(csvPath)
	defer f.Close()
	if err != nil {
		return nil, err
	}

	reader := csv.NewReader(f)
	reader.FieldsPerRecord = -1

	urls := []string{}
	for {
		row, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}
		urls = append(urls, row[csvURLIndex])
	}
	return urls, nil
}
